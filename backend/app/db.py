import logging

from fastapi import HTTPException
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from app.config import settings

log = logging.getLogger("setuai.db")

_client: AsyncMongoClient | None = None


async def connect() -> None:
    global _client
    if not settings.mongodb_url:
        log.warning("MONGODB_URL is not set. Auth and admin endpoints are disabled.")
        return
    _client = AsyncMongoClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
    try:
        db = _client[settings.mongodb_db]
        await db.users.create_index("email", unique=True)
        await db.services.create_index("slug", unique=True)
        await db.chats.create_index([("user_id", 1), ("updated_at", -1)])
    except Exception as exc:
        log.warning("Could not reach MongoDB at startup: %s", exc)


async def close() -> None:
    if _client is not None:
        await _client.close()


def get_db() -> AsyncDatabase:
    if _client is None:
        raise HTTPException(503, "Database is not configured. Set MONGODB_URL in backend/.env.")
    return _client[settings.mongodb_db]


def get_db_or_none() -> AsyncDatabase | None:
    return _client[settings.mongodb_db] if _client is not None else None
