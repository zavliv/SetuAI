from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl, field_validator


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    language: str = "en"


class Source(BaseModel):
    title: str
    url: str
    last_verified: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = []


class SignupRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def password_fits_bcrypt(cls, value: str) -> str:
        if len(value.encode()) > 72:
            raise ValueError("Password is too long. Use at most 72 bytes.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


Role = Literal["user", "admin"]


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    created_at: datetime


class RoleUpdate(BaseModel):
    role: Role


Category = Literal["identity", "travel", "money", "health", "farm", "certificate"]


class Text(BaseModel):
    en: str = Field(min_length=1, max_length=2000)
    hi: str = Field(default="", max_length=2000)


class Link(BaseModel):
    label: str = Field(min_length=1, max_length=120)
    url: HttpUrl


class ServiceIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    slug: str = Field(pattern=r"^[a-z0-9][a-z0-9-]{1,39}$")
    category: Category
    title: Text
    note: Text
    summary: Text
    who: Text
    prompt: Text
    docs: list[Text] = Field(max_length=30)
    steps: list[Text] = Field(max_length=30)
    mistakes: list[Text] = Field(max_length=30)
    link: Link
    keywords: list[str] = Field(default=[], max_length=30)


class ServiceUpdate(ServiceIn):
    slug: str | None = None


class ServiceOut(ServiceIn):
    updated_at: datetime | None = None


class ChatMessageIn(BaseModel):
    role: Literal["user", "assistant"]
    text: str = Field(max_length=20000)
    service_id: str | None = Field(default=None, max_length=40)


class ChatSave(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=120)
    messages: list[ChatMessageIn] = Field(max_length=200)


class ChatSummary(BaseModel):
    id: str
    title: str
    updated_at: datetime


class ChatOut(ChatSummary):
    messages: list[ChatMessageIn]
