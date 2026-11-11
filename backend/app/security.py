import asyncio
import secrets
from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

from app.config import settings

_secret = settings.jwt_secret or secrets.token_urlsafe(48)
_ALGORITHM = "HS256"
_DUMMY_HASH = bcrypt.hashpw(b"setuai-dummy", bcrypt.gensalt()).decode()


async def hash_password(password: str) -> str:
    hashed = await asyncio.to_thread(bcrypt.hashpw, password.encode(), bcrypt.gensalt())
    return hashed.decode()


async def verify_password(password: str, hashed: str) -> bool:
    try:
        return await asyncio.to_thread(
            bcrypt.checkpw, password.encode(), hashed.encode()
        )
    except ValueError:
        return False


def create_token(user_id: str, role: str) -> str:
    expires = datetime.now(UTC) + timedelta(minutes=settings.jwt_expire_minutes)
    return jwt.encode(
        {"sub": user_id, "role": role, "exp": expires}, _secret, algorithm=_ALGORITHM
    )


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, _secret, algorithms=[_ALGORITHM])
    except jwt.PyJWTError:
        return None


async def burn_password_check(password: str) -> None:
    await verify_password(password, _DUMMY_HASH)
