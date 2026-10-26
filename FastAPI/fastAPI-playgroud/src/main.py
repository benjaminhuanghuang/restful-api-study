from fastapi import FastAPI

from api.chat import router as chat_router

app = FastAPI()
app.include_router(chat_router, prefix="/api/chat")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
