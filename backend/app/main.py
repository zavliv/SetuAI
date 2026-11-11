from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

from app import db
from app.bootstrap import ensure_admin
from app.config import settings
from app.routers import admin, auth, chat, chats, services


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.connect()
    await ensure_admin()
    yield
    await db.close()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(PyMongoError)
async def database_error(_: Request, __: PyMongoError):
    return JSONResponse({"detail": "The database is unavailable. Please try again."}, status_code=503)


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(services.router)
app.include_router(chat.router)
app.include_router(chats.router)


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {"status": "ok", "database": db.get_db_or_none() is not None}
