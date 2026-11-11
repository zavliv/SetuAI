import json
import re
from datetime import UTC, datetime
from pathlib import Path

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import DESCENDING
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

from app.db import get_db
from app.deps import admin_user, user_out
from app.schemas import RoleUpdate, ServiceIn, ServiceOut, ServiceUpdate, UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(admin_user)])

SEED_FILE = Path(__file__).resolve().parent.parent / "seed" / "services.json"


def object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except InvalidId:
        raise HTTPException(404, "User not found.")


def service_out(doc: dict) -> ServiceOut:
    return ServiceOut.model_validate({k: v for k, v in doc.items() if k != "_id"})


@router.get("/stats")
async def stats(db: AsyncDatabase = Depends(get_db)):
    recent = await db.users.find().sort("created_at", DESCENDING).limit(5).to_list()
    return {
        "users": await db.users.count_documents({}),
        "admins": await db.users.count_documents({"role": "admin"}),
        "services": await db.services.count_documents({}),
        "recent_users": [user_out(u) for u in recent],
    }


@router.get("/users", response_model=list[UserOut])
async def list_users(
    q: str = Query("", max_length=80),
    limit: int = Query(100, ge=1, le=200),
    skip: int = Query(0, ge=0),
    db: AsyncDatabase = Depends(get_db),
):
    query: dict = {}
    if q.strip():
        pattern = {"$regex": re.escape(q.strip()), "$options": "i"}
        query = {"$or": [{"name": pattern}, {"email": pattern}]}
    users = await db.users.find(query).sort("created_at", DESCENDING).skip(skip).limit(limit).to_list()
    return [user_out(u) for u in users]


@router.patch("/users/{user_id}", response_model=UserOut)
async def update_user_role(
    user_id: str,
    payload: RoleUpdate,
    me: dict = Depends(admin_user),
    db: AsyncDatabase = Depends(get_db),
):
    target = object_id(user_id)
    if target == me["_id"]:
        raise HTTPException(400, "You cannot change your own role.")
    user = await db.users.find_one_and_update(
        {"_id": target}, {"$set": {"role": payload.role}}, return_document=True
    )
    if not user:
        raise HTTPException(404, "User not found.")
    return user_out(user)


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, me: dict = Depends(admin_user), db: AsyncDatabase = Depends(get_db)):
    target = object_id(user_id)
    if target == me["_id"]:
        raise HTTPException(400, "You cannot delete your own account.")
    result = await db.users.delete_one({"_id": target})
    if not result.deleted_count:
        raise HTTPException(404, "User not found.")


@router.get("/services", response_model=list[ServiceOut])
async def list_services(db: AsyncDatabase = Depends(get_db)):
    docs = await db.services.find().sort("title.en", 1).to_list()
    return [service_out(d) for d in docs]


@router.post("/services/seed")
async def seed_services(db: AsyncDatabase = Depends(get_db)):
    items = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    inserted = 0
    for item in items:
        service = ServiceIn.model_validate({**item, "slug": item["id"]})
        if await db.services.find_one({"slug": service.slug}, {"_id": 1}):
            continue
        await db.services.insert_one({**service.model_dump(mode="json"), "updated_at": datetime.now(UTC)})
        inserted += 1
    return {"inserted": inserted}


@router.get("/services/{slug}", response_model=ServiceOut)
async def get_service(slug: str, db: AsyncDatabase = Depends(get_db)):
    doc = await db.services.find_one({"slug": slug})
    if not doc:
        raise HTTPException(404, "Service not found.")
    return service_out(doc)


@router.post("/services", response_model=ServiceOut, status_code=201)
async def create_service(payload: ServiceIn, db: AsyncDatabase = Depends(get_db)):
    doc = {**payload.model_dump(mode="json"), "updated_at": datetime.now(UTC)}
    try:
        await db.services.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(409, "A service with this slug already exists.")
    return service_out(doc)


@router.put("/services/{slug}", response_model=ServiceOut)
async def update_service(slug: str, payload: ServiceUpdate, db: AsyncDatabase = Depends(get_db)):
    data = payload.model_dump(mode="json", exclude={"slug"})
    doc = await db.services.find_one_and_update(
        {"slug": slug},
        {"$set": {**data, "updated_at": datetime.now(UTC)}},
        return_document=True,
    )
    if not doc:
        raise HTTPException(404, "Service not found.")
    return service_out(doc)


@router.delete("/services/{slug}", status_code=204)
async def delete_service(slug: str, db: AsyncDatabase = Depends(get_db)):
    result = await db.services.delete_one({"slug": slug})
    if not result.deleted_count:
        raise HTTPException(404, "Service not found.")
