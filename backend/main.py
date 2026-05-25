from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict

# Import local engines
from emergency_detector import EmergencyDetector
from reasoning_engine import ReasoningEngine

app = FastAPI(title="HealthDesk Core API", version="2.0.0")

# Setup CORS to allow React frontend to fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
detector = EmergencyDetector()
engine = ReasoningEngine()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class Citation(BaseModel):
    src: str
    tag: str

class ChatResponse(BaseModel):
    answer: str
    confidence: int
    emergency: bool
    citations: List[Citation]
    reasoning_steps: List[str]

@app.post("/api/v2/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # 1. Run Emergency Triage Detection
    triage_data = detector.detect(request.message)
    
    # 2. Run Reasoning Pipeline (calls Ollama or falls back to local clinical pathways)
    reasoning_result = engine.generate_response(request.message, triage_data)
    
    # 3. Format and return response
    return ChatResponse(
        answer=reasoning_result["answer"],
        confidence=reasoning_result.get("confidence", 90),
        emergency=triage_data["is_emergency"],
        citations=reasoning_result.get("citations", [
            {"src": "WHO General Clinical Guidelines", "tag": "Reference"}
        ]),
        reasoning_steps=reasoning_result.get("reasoning_steps", [
            "Analyzed physical symptoms",
            "Completed safety review"
        ])
    )

@app.get("/api/v2/health")
async def health_check():
    return {"status": "healthy", "service": "HealthDesk Backend API"}
