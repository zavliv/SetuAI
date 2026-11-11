from fastapi import APIRouter, Depends

from app.deps import current_user
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["chat"], dependencies=[Depends(current_user)])


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    return ChatResponse(
        answer="The knowledge base is not connected yet. This is a placeholder reply.",
    )
