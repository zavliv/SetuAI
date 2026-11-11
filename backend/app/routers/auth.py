from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.config import settings
from app.db import get_db
from app.deps import current_user, user_out
from app.ratelimit import limiter
from app.schemas import LoginRequest, SignupRequest, UserOut
from app.security import burn_password_check, create_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def set_session(response: Response, user: dict) -> None:
    response.set_cookie(
        settings.cookie_name,
        create_token(str(user["_id"]), user["role"]),
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
        path="/",
    )


@router.post("/signup", response_model=UserOut, status_code=201)
async def signup(payload: SignupRequest, response: Response, db: AsyncDatabase = Depends(get_db)):
    email = payload.email.lower()
    user = {
        "name": payload.name,
        "email": email,
        "password_hash": await hash_password(payload.password),
        "role": "user",
        "created_at": datetime.now(UTC),
    }
    try:
        result = await db.users.insert_one(user)
    except DuplicateKeyError:
        raise HTTPException(409, "An account with this email already exists.")
    user["_id"] = result.inserted_id
    set_session(response, user)
    return user_out(user)


def attempt_key(request: Request, scope: str, email: str) -> str:
    host = request.client.host if request.client else "unknown"
    return f"{scope}:{host}:{email.lower()}"


async def check_credentials(user: dict | None, password: str) -> bool:
    if not user:
        await burn_password_check(password)
        return False
    return await verify_password(password, user["password_hash"])


@router.post("/login", response_model=UserOut)
async def login(payload: LoginRequest, request: Request, response: Response, db: AsyncDatabase = Depends(get_db)):
    key = attempt_key(request, "user", payload.email)
    limiter.check(key)
    user = await db.users.find_one({"email": payload.email.lower()})
    if not await check_credentials(user, payload.password):
        limiter.fail(key)
        raise HTTPException(401, "Incorrect email or password.")
    limiter.reset(key)
    set_session(response, user)
    return user_out(user)


@router.post("/admin/login", response_model=UserOut)
async def admin_login(payload: LoginRequest, request: Request, response: Response, db: AsyncDatabase = Depends(get_db)):
    key = attempt_key(request, "admin", payload.email)
    limiter.check(key)
    user = await db.users.find_one({"email": payload.email.lower()})
    valid = await check_credentials(user, payload.password)
    if not valid or user["role"] != "admin":
        limiter.fail(key)
        raise HTTPException(401, "Incorrect email or password.")
    limiter.reset(key)
    set_session(response, user)
    return user_out(user)


@router.post("/logout", status_code=204)
async def logout(response: Response):
    response.delete_cookie(settings.cookie_name, path="/")


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(current_user)):
    return user_out(user)
