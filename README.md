<p align="center">
  <img src="https://raw.githubusercontent.com/mithilP007/Health-desk/main/assets/logo.png" alt="HealthDesk Pro" width="120">
</p>

<h1 align="center">🏥 HealthDesk Pro</h1>

<p align="center">
  <b>Privacy-First Offline Medical AI with Advanced Reasoning</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#team">Team</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg">
  <img src="https://img.shields.io/badge/license-MIT-green.svg">
  <img src="https://img.shields.io/badge/python-3.10+-blue.svg">
  <img src="https://img.shields.io/badge/react-18+-61DAFB.svg">
  <img src="https://img.shields.io/badge/ollama-local-orange.svg">
  <img src="https://img.shields.io/badge/status-active-success.svg">
</p>

---

## 🚨 Problem

People search symptoms on Google and get:
- Wrong medical advice
- Ads instead of answers
- Privacy leakage to cloud servers

No **offline, private, reliable medical AI** exists for rural + low-internet areas.

---

## 💡 Solution

**HealthDesk Pro** is a **fully offline medical AI system** that:

- Runs locally (no internet required)
- Uses WHO / NIH documents only
- Gives cited medical answers
- Detects emergencies instantly
- Supports multiple Indian languages

---

## ✨ Features

### 🔒 Privacy First
- 100% offline processing
- No cloud APIs
- No data tracking

### 🧠 Medical Intelligence
- RAG-based document QA
- WHO / NIH citations
- Confidence scoring

### 🚨 Emergency Detection
- Chest pain → instant emergency alert
- Stroke detection
- Breathing difficulty alerts
- Auto suggests calling 108 (India)

### 🌐 Multilingual
- English
- Tamil
- Hindi
- Telugu
- +200 languages via models

---

## 🏗️ Architecture


Frontend (React)
↓
FastAPI Backend
↓
RAG Engine (ChromaDB)
↓
Ollama Models
↓
WHO / NIH Documents


---

## 🛠️ Tech Stack

- Frontend: React 18
- Backend: FastAPI
- LLM: Ollama
- Models: Gemma 3 / DeepSeek / Qwen
- Vector DB: ChromaDB
- Embeddings: nomic-embed-text

---

## 📦 Installation

### 1. Clone Repo
```bash
git clone https://github.com/mithilP007/Health-desk.git
cd Health-desk
2. Install Ollama Models
ollama pull gemma3:4b
ollama pull deepseek-r1:14b
ollama pull qwen2.5:14b
ollama pull nomic-embed-text
3. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
4. Frontend Setup
cd frontend
npm install
npm start
🚀 Usage

Open:

http://localhost:3000

Example queries:

"What are dengue symptoms?"
"I have chest pain"
"How does malaria spread?"
"நெஞ்சு வலி இருக்கிறது"
📁 Project Structure
Health-desk/
├── backend/
├── frontend/
├── knowledge/
├── docker-compose.yml
├── README.md
🧪 Testing
pytest backend/tests/

Check:

Emergency detection
Citation accuracy
Safety filters
Multilingual responses
👥 Team
Role	Work
Engine Dev	Backend + RAG + API
Knowledge Engineer	WHO/NIH documents
Safety Engineer	Prompts + testing
🔮 Future Scope
Voice AI (speech-to-text)
Mobile app
Medical image detection
IoT health devices integration
⚠️ Disclaimer

This system provides general medical information only.
Not a replacement for professional doctors.

For emergencies → Call 108 (India) immediately.

❤️ Credits
WHO (Medical Guidelines)
NIH (Health Data)
Ollama (Local LLMs)
Open-source community
<p align="center"> Built for rural healthcare accessibility ❤️ </p> ```
