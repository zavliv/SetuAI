from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, Request
from pymongo.asynchronous.database import AsyncDatabase

from app.config import settings
from app.db import get_db
from app.schemas import UserOut
from app.security import decode_token


def user_out(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        role=doc["role"],
        created_at=doc["created_at"],
    )


async def current_user(request: Request, db: AsyncDatabase = Depends(get_db)) -> dict:
    token = request.cookies.get(settings.cookie_name)
    if not token:
        header = request.headers.get("authorization", "")
        if header.lower().startswith("bearer "):
            token = header[7:]
    payload = decode_token(token) if token else None
    if not payload:
        raise HTTPException(401, "Not signed in.")
    try:
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    except (InvalidId, KeyError):
        raise HTTPException(401, "Not signed in.")
    if not user:
        raise HTTPException(401, "Not signed in.")
    return user


async def admin_user(user: dict = Depends(current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(403, "Admin access required.")
    return user
