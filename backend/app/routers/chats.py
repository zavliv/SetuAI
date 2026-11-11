from datetime import UTC, datetime

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from pymongo.asynchronous.database import AsyncDatabase

from app.db import get_db
from app.deps import current_user
from app.schemas import ChatOut, ChatSave, ChatSummary

router = APIRouter(prefix="/api/chats", tags=["chats"])

MAX_CHATS_PER_USER = 300


def chat_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(404, "Chat not found.")


def summary(doc: dict) -> ChatSummary:
    return ChatSummary(id=str(doc["_id"]), title=doc["title"], updated_at=doc["updated_at"])


def full(doc: dict) -> ChatOut:
    return ChatOut(**summary(doc).model_dump(), messages=doc["messages"])


@router.get("", response_model=list[ChatSummary])
async def list_chats(user: dict = Depends(current_user), db: AsyncDatabase = Depends(get_db)):
    docs = (
        await db.chats.find({"user_id": user["_id"]}, {"messages": 0})
        .sort("updated_at", -1)
        .limit(200)
        .to_list()
    )
    return [summary(d) for d in docs]


@router.post("", response_model=ChatOut, status_code=201)
async def create_chat(payload: ChatSave, user: dict = Depends(current_user), db: AsyncDatabase = Depends(get_db)):
    if await db.chats.count_documents({"user_id": user["_id"]}) >= MAX_CHATS_PER_USER:
        raise HTTPException(400, "You have reached the chat limit. Delete some old chats first.")
    now = datetime.now(UTC)
    doc = {
        "user_id": user["_id"],
        "title": payload.title,
        "messages": [m.model_dump() for m in payload.messages],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.chats.insert_one(doc)
    doc["_id"] = result.inserted_id
    return full(doc)


@router.get("/{chat_id_value}", response_model=ChatOut)
async def get_chat(chat_id_value: str, user: dict = Depends(current_user), db: AsyncDatabase = Depends(get_db)):
    doc = await db.chats.find_one({"_id": chat_id(chat_id_value), "user_id": user["_id"]})
    if not doc:
        raise HTTPException(404, "Chat not found.")
    return full(doc)


@router.put("/{chat_id_value}", response_model=ChatOut)
async def save_chat(
    chat_id_value: str,
    payload: ChatSave,
    user: dict = Depends(current_user),
    db: AsyncDatabase = Depends(get_db),
):
    doc = await db.chats.find_one_and_update(
        {"_id": chat_id(chat_id_value), "user_id": user["_id"]},
        {
            "$set": {
                "title": payload.title,
                "messages": [m.model_dump() for m in payload.messages],
                "updated_at": datetime.now(UTC),
            }
        },
        return_document=True,
    )
    if not doc:
        raise HTTPException(404, "Chat not found.")
    return full(doc)


@router.delete("/{chat_id_value}", status_code=204)
async def delete_chat(chat_id_value: str, user: dict = Depends(current_user), db: AsyncDatabase = Depends(get_db)):
    result = await db.chats.delete_one({"_id": chat_id(chat_id_value), "user_id": user["_id"]})
    if not result.deleted_count:
        raise HTTPException(404, "Chat not found.")
