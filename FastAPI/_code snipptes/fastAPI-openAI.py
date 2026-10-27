from fastapi import FastAPI
from google import genai

app = FastAPI()
gemini_client = genai.Client(api_key="your_api_key")

@app.get("/")
def root_controller():
    return {"status": "healthy"}

@app.get("/chat")
def chat_controller(prompt: str = "Inspire me"):
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"system_instruction": "You are a helpful assistant."},
    )
    statement = response.text
    return {"statement": statement}
