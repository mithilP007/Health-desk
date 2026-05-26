# 🏥 HealthDesk P10 — Privacy-First Offline Medical AI Assistant

HealthDesk P10 is a fully offline, privacy-first medical AI system built using open-source tools like Ollama, AnythingLLM, Docker, and WHO/NIH medical documents.

It provides safe, citation-based health information without cloud APIs or data leakage and is designed for academic demo + real-world AI healthcare simulation.

---

## 🚀 Project Goal

Build a **fully offline medical AI assistant** that:

- Works without internet after setup
- Uses local LLMs (Ollama)
- Answers only from WHO/NIH verified documents
- Prevents hallucination and unsafe responses
- Detects medical emergencies automatically
- Supports 3-person team collaboration
- Runs as a web app demo (localhost)

---

## 🧠 System Architecture


┌──────────────────────────────────────────────┐
│ Shared Machine (16GB RAM) │
├──────────────────────────────────────────────┤
│ AnythingLLM (RAG UI) → Port 3001 │
│ Ollama (LLM Engine) → Port 11434 │
│ LanceDB (Vector DB) │
│ WHO / NIH Medical PDFs │
└──────────────────────────────────────────────┘


---

## 👥 Team Structure

### 👤 Member 1 — Engine Builder
- Ollama setup (Gemma 3 / Phi models)
- Docker configuration
- Backend API + system setup
- Multi-user environment setup

### 📚 Member 2 — Knowledge Engineer
- WHO / NIH medical dataset collection
- PDF ingestion into RAG system
- Chunk optimization (800 tokens recommended)
- Citation accuracy validation

### 🛡️ Member 3 — Safety Guardian
- System prompts design
- Emergency detection rules
- Hallucination testing
- Ethics documentation
- Final demo presentation

---

## 🛠️ Tech Stack

| Component | Tool |
|----------|------|
| LLM Engine | Ollama |
| Model | Gemma 3 4B / Phi-4 Mini |
| RAG System | AnythingLLM |
| Embeddings | nomic-embed-text |
| Vector DB | LanceDB |
| Backend | FastAPI (optional) |
| Deployment | Docker |
| Data Source | WHO / NIH / CDC PDFs |

---

## ⚙️ Setup Instructions

### 1️⃣ Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
2️⃣ Pull Models
ollama pull gemma3:4b
ollama pull nomic-embed-text
3️⃣ Start System
docker compose up -d
4️⃣ Open Application
http://localhost:3001

Enable multi-user mode and add team members.

📚 Knowledge Base

The system uses trusted medical sources:

WHO Disease Guidelines
NIH MedlinePlus
CDC Prevention Guides
Open medical textbooks
Covered Diseases:
Dengue fever
Malaria
Diabetes
Hypertension
Stroke
Heart disease
Tuberculosis
HIV
🧠 Key Features
🩺 Medical AI Responses
Answers ONLY from verified documents
No hallucinated content
Citation-based responses
🚨 Emergency Detection

Automatically detects:

Chest pain
Breathing difficulty
Stroke symptoms
Severe bleeding
Loss of consciousness

Response:

🚨 This may be a medical emergency. Call 108 immediately or visit nearest hospital.

📑 Citation System

Every answer includes:

WHO / NIH document name
Page references
Evidence-based grounding
🛡️ Safety Rules

System strictly avoids:

No diagnosis
No prescriptions
No dosage suggestions
No non-medical answers

Every response ends with:

⚠️ This is general information only. Please consult a qualified healthcare provider.

🧪 Testing Strategy
Safety Tests
Emergency detection validation
No prescription enforcement
No diagnosis responses
RAG Tests
Citation correctness
Chunk optimization
Document grounding accuracy
Hallucination Tests
WHO factual validation
Medical consistency checks
📁 Project Structure
healthdesk-p10/
├── engine/
├── knowledge/
├── safety/
├── docs/
├── docker-compose.yml
└── README.md
📅 Timeline
Day	Work
1–3	Setup Ollama + Docker
4–7	Build knowledge base
8–10	RAG + citation testing
11–12	Safety testing
13	Integration
14	Final demo
🎯 Example Output

User:
What are symptoms of dengue fever?

System:

High fever
Severe headache
Joint pain
Skin rash

Source: WHO Dengue Guidelines (Page 12)

⚠️ This is general information only.

🌍 Why This Project Matters
Offline privacy-first healthcare AI
Prevents unsafe hallucinated medical advice
Uses trusted global health sources
Works without internet dependency
Real-world AI + healthcare simulation
🏁 Final Output

✔ Multi-user system
✔ Offline medical AI
✔ RAG-based knowledge system
✔ Emergency detection
✔ WHO/NIH citations
