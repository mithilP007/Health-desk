from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="HealthDesk Pro API")

# CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class ChatRequest(BaseModel):
    message: str

# Health check
@app.get("/")
def home():
    return {"status": "HealthDesk API running"}

# Chat endpoint (basic safe fallback)
@app.post("/chat")
def chat(req: ChatRequest):
    user_msg = req.message.lower()

    # Simple rule-based fallback (replace later with RAG/LLM)
    if "fever" in user_msg:
        return {"response": "Fever detected. Stay hydrated and consult a doctor if it persists."}

    if "headache" in user_msg:
        return {"response": "Headache may be due to stress or dehydration. Rest recommended."}

    if "emergency" in user_msg:
        return {"response": "Emergency detected. Please contact medical services immediately."}

    return {
        "response": "I am HealthDesk AI. Please describe your symptoms clearly.",
        "confidence": 0.75
    }

# Run server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
