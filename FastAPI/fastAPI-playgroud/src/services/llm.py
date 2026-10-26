import asyncio
import json
import time
import uuid
from typing import AsyncGenerator

FAKE_REPLY = (
    "This is a simulated streaming response from a fake LLM. "
    "Each word is sent as a separate chunk, just like a real "
    "token-by-token completion stream."
)


async def fake_llm_stream(message: str) -> AsyncGenerator[str, None]:
    completion_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
    created = int(time.time())
    words = FAKE_REPLY.split(" ")

    for i, word in enumerate(words):
        delta = word if i == 0 else f" {word}"
        chunk = {
            "id": completion_id,
            "object": "chat.completion.chunk",
            "created": created,
            "choices": [
                {
                    "index": 0,
                    "delta": {"content": delta},
                    "finish_reason": None,
                }
            ],
        }
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.08)

    final_chunk = {
        "id": completion_id,
        "object": "chat.completion.chunk",
        "created": created,
        "choices": [
            {
                "index": 0,
                "delta": {},
                "finish_reason": "stop",
            }
        ],
    }
    yield f"data: {json.dumps(final_chunk)}\n\n"
    yield "data: [DONE]\n\n"
