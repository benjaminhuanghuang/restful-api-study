from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from services.llm import fake_llm_stream

from .models import ChatRequest

router = APIRouter()


@router.post("/completions")
async def chat_completions(body: ChatRequest):
    return StreamingResponse(
        fake_llm_stream(body.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
