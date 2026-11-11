from fastapi import APIRouter, Depends, HTTPException
from pymongo.asynchronous.database import AsyncDatabase

from app.db import get_db
from app.deps import current_user
from app.routers.admin import service_out
from app.schemas import ServiceOut

router = APIRouter(prefix="/api/services", tags=["services"], dependencies=[Depends(current_user)])


@router.get("", response_model=list[ServiceOut])
async def list_services(db: AsyncDatabase = Depends(get_db)):
    docs = await db.services.find().sort("title.en", 1).to_list()
    return [service_out(d) for d in docs]


@router.get("/{slug}", response_model=ServiceOut)
async def get_service(slug: str, db: AsyncDatabase = Depends(get_db)):
    doc = await db.services.find_one({"slug": slug})
    if not doc:
        raise HTTPException(404, "Service not found.")
    return service_out(doc)
