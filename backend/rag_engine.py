"""
HealthDesk Pro - Custom Multi-Model RAG Engine
Builds vector database from WHO/NIH PDFs
Provides citation-aware medical answers using dynamic model routing
"""

import os
import json
import chromadb
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import requests
from typing import List, Dict, Tuple
import re

class HealthDeskRAG:
    def __init__(self, docs_path=None, db_path="chroma_db"):
        """
        Initialize RAG engine
        - docs_path: Folder with PDF files
        - db_path: Where to store vector database
        """
        print("🏥 Initializing HealthDesk Multi-Model RAG Engine...")
        
        # AUTO-DETECT DOCUMENTS FOLDER
        if docs_path is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            docs_path = os.path.join(current_dir, "documents")
        
        # Paths
        self.docs_path = docs_path
        self.db_path = db_path
        self.ollama_url = "http://localhost:11434/api/generate"
        self.ollama_tags_url = "http://localhost:11434/api/tags"
        
        print(f"📁 Documents Path: {self.docs_path}")
        
        # Initialize ChromaDB (local, no server needed)
        print("📦 Loading ChromaDB...")
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="medical_knowledge",
            metadata={"description": "WHO/NIH medical documents"}
        )
        
        # Load embedding model (local, downloads once)
        print("🧠 Loading embedding model...")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Document tracking
        self.loaded_documents = set()
        
        # Model Configuration Mapping
        self.model_metadata = {
            "deepseek-r1:14b": {
                "role": "Complex Reasoning (CoT)",
                "temp": 0.3
            },
            "meditron:7b": {
                "role": "Clinical Specialist",
                "temp": 0.2
            },
            "qwen2.5:14b": {
                "role": "Multilingual Specialist",
                "temp": 0.3
            },
            "gemma3:4b": {
                "role": "General Practitioner",
                "temp": 0.4
            },
            "tinyllama:latest": {
                "role": "Fast Triage / Fallback",
                "temp": 0.3
            }
        }
        
        print("✅ RAG Engine ready!")
        
    def _get_available_ollama_models(self) -> List[str]:
        """
        Dynamically query active models downloaded in Ollama on port 11434.
        Prevents 'model not found' crashes by ensuring we only route to pulled models.
        """
        try:
            res = requests.get(self.ollama_tags_url, timeout=3)
            if res.status_code == 200:
                data = res.json()
                models = [m["name"] for m in data.get("models", [])]
                print(f"📋 Available local Ollama models: {models}")
                return models
        except Exception as e:
            print(f"⚠️ Could not fetch active Ollama tags: {e}")
        return []

    def detect_language(self, text: str) -> str:
        """Detect Indian language unicode tags"""
        if re.search(r'[஀-௿]', text):
            return "tamil"
        if re.search(r'[ऀ-ॿ]', text):
            return "hindi"
        if re.search(r'[ఀ-౿]', text):
            return "telugu"
        return "english"

    def detect_complexity(self, text: str) -> bool:
        """Detect if query demands complex medical reasoning or emergency action"""
        complex_indicators = [
            "chest pain", "heart attack", "stroke", "unconscious", "breathing",
            "severe", "emergency", "differential diagnosis", "choking",
            "நெஞ்சு வலி", "மாரடைப்பு", "பக்கவாதம்",  # Tamil
            "छाती में दर्द", "दिल का दौरा", "बेहोश"  # Hindi
        ]
        text_lower = text.lower()
        return any(ind in text_lower for ind in complex_indicators)

    def select_best_model(self, query: str, emergency_detected: bool = False) -> str:
        """
        Smart self-healing model routing logic.
        Auto-selects the optimal clinical model, but verifies availability before returning.
        """
        available = self._get_available_ollama_models()
        
        # Absolute Fallback if no connection or empty models list
        if not available:
            return "tinyllama:latest"
            
        lang = self.detect_language(query)
        is_complex = self.detect_complexity(query)
        
        target_model = "tinyllama:latest"
        reason = "Default triage fallback"
        
        # Priority 1: Emergency/Complex -> DeepSeek-R1 14B
        if (emergency_detected or is_complex):
            if "deepseek-r1:14b" in available:
                target_model = "deepseek-r1:14b"
                reason = "Complex clinical reasoning requested (DeepSeek-R1)"
            elif "meditron:7b" in available:
                target_model = "meditron:7b"
                reason = "DeepSeek-R1 unavailable; routing to Meditron clinical specialist"
            elif "gemma3:4b" in available:
                target_model = "gemma3:4b"
                reason = "DeepSeek-R1 unavailable; routing to Gemma 3 general specialist"
        
        # Priority 2: Indian Languages -> Qwen 2.5 14B
        elif lang in ["tamil", "hindi", "telugu"]:
            if "qwen2.5:14b" in available:
                target_model = "qwen2.5:14b"
                reason = f"Native regional language ({lang}) routing to Qwen 2.5 14B"
            elif "gemma3:4b" in available:
                target_model = "gemma3:4b"
                reason = f"Regional language ({lang}) routing to Gemma 3 fallback"
        
        # Priority 3: General Clinical FAQs -> Meditron 7B
        elif any(kw in query.lower() for kw in ["what is", "symptoms", "causes", "prevention"]):
            if "meditron:7b" in available:
                target_model = "meditron:7b"
                reason = "General clinical information query routed to Meditron 7B"
            elif "gemma3:4b" in available:
                target_model = "gemma3:4b"
                reason = "Meditron 7B unavailable; routing to Gemma 3 general specialist"
                
        # Priority 4: Fast Fallback -> Gemma 3 4B
        else:
            if "gemma3:4b" in available:
                target_model = "gemma3:4b"
                reason = "Quick general inquiry routed to Gemma 3 4B"
            elif "tinyllama:latest" in available:
                target_model = "tinyllama:latest"
                reason = "Gemma 3 unavailable; routing to TinyLlama fast triage"
                
        # Double check: If the selected target_model is NOT physically downloaded,
        # fallback to whatever model is currently available to avoid api crashes.
        if target_model not in available:
            old_target = target_model
            target_model = available[0]
            reason = f"Target {old_target} is still downloading; safely self-healed to active {target_model}"
            
        print(f"🎯 [Model Router] Selected model: '{target_model}' | Reason: {reason}")
        return target_model

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract all text from a PDF file
        Returns: Clean text string
        """
        print(f"  📄 Reading: {os.path.basename(pdf_path)}")
        
        try:
            reader = PdfReader(pdf_path)
            text = ""
            
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page_text
            
            # Clean text
            text = self._clean_text(text)
            print(f"     ✓ Extracted {len(text)} characters")
            return text
            
        except Exception as e:
            print(f"     ❌ Error reading PDF: {e}")
            return ""
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep medical symbols
        text = re.sub(r'[^\w\s\.\,\;\:\-\(\)\/\%\°\℃\℉]', ' ', text)
        return text.strip()
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[Dict]:
        """
        Split text into overlapping chunks
        Returns: List of chunk dicts with metadata
        """
        print(f"  ✂️  Chunking text (size={chunk_size}, overlap={overlap})...")
        
        sentences = text.split('. ')
        chunks = []
        current_chunk = []
        current_length = 0
        chunk_id = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            sentence_length = len(sentence.split())
            
            if current_length + sentence_length > chunk_size and current_chunk:
                # Save current chunk
                chunk_text = '. '.join(current_chunk) + '.'
                chunks.append({
                    "id": chunk_id,
                    "text": chunk_text,
                    "length": len(current_chunk)
                })
                chunk_id += 1
                
                # Start new chunk with overlap
                overlap_sentences = current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
                current_chunk = overlap_sentences + [sentence]
                current_length = sum(len(s.split()) for s in current_chunk)
            else:
                current_chunk.append(sentence)
                current_length += sentence_length
        
        # Don't forget last chunk
        if current_chunk:
            chunk_text = '. '.join(current_chunk) + '.'
            chunks.append({
                "id": chunk_id,
                "text": chunk_text,
                "length": len(current_chunk)
            })
        
        print(f"     ✓ Created {len(chunks)} chunks")
        return chunks
    
    def ingest_document(self, filename: str):
        """
        Process a single PDF: extract, chunk, embed, store
        """
        pdf_path = os.path.join(self.docs_path, filename)
        
        if not os.path.exists(pdf_path):
            print(f"❌ File not found: {pdf_path}")
            return False
        
        if filename in self.loaded_documents:
            print(f"⏭️  Already loaded: {filename}")
            return True
        
        print(f"\n📥 Processing: {filename}")
        
        # Step 1: Extract text
        text = self.extract_text_from_pdf(pdf_path)
        if not text:
            return False
        
        # Step 2: Chunk
        chunks = self.chunk_text(text, chunk_size=500, overlap=50)
        
        # Step 3: Embed and store
        print(f"  🔢 Embedding {len(chunks)} chunks...")
        
        for chunk in chunks:
            # Create unique ID
            doc_id = f"{filename}_chunk_{chunk['id']}"
            
            # Generate embedding
            embedding = self.embedder.encode(chunk['text']).tolist()
            
            # Store in ChromaDB
            self.collection.add(
                embeddings=[embedding],
                documents=[chunk['text']],
                metadatas=[{
                    "source": filename,
                    "chunk_id": chunk['id'],
                    "page": self._extract_page(chunk['text'])
                }],
                ids=[doc_id]
            )
        
        self.loaded_documents.add(filename)
        print(f"  ✅ Stored in database")
        return True
    
    def _extract_page(self, text: str) -> str:
        """Extract page number from chunk text"""
        match = re.search(r'--- Page (\d+) ---', text)
        return match.group(1) if match else "unknown"
    
    def ingest_all_documents(self):
        """
        Process all PDFs in documents folder
        """
        print("\n" + "="*50)
        print("📚 INGESTING ALL DOCUMENTS")
        print("="*50)
        
        # CHECK IF DOCUMENTS FOLDER EXISTS
        if not os.path.exists(self.docs_path):
            print(f"❌ Documents folder not found!")
            print(f"📁 Expected path: {self.docs_path}")
            return
        
        pdf_files = [f for f in os.listdir(self.docs_path) if f.endswith('.pdf')]
        
        if not pdf_files:
            print("❌ No PDF files found in documents folder!")
            return
        
        print(f"Found {len(pdf_files)} PDF files")
        
        success_count = 0
        for filename in pdf_files:
            if self.ingest_document(filename):
                success_count += 1
        
        print(f"\n{'='*50}")
        print(f"✅ Ingested: {success_count}/{len(pdf_files)} documents")
        print(f"📊 Total chunks in database: {self.collection.count()}")
        print("="*50)
    
    def search(self, query: str, top_k: int = 3) -> Dict:
        """
        Search for relevant medical information
        Returns: ChromaDB results with documents and metadata
        """
        print(f"\n🔍 Searching: '{query}'")
        
        # Embed query
        query_embedding = self.embedder.encode(query).tolist()
        
        # Search database
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        print(f"  ✓ Found {len(results['documents'][0])} relevant chunks")
        
        # Format results
        formatted = []
        for i, (doc, meta, dist) in enumerate(zip(
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            formatted.append({
                "text": doc,
                "source": meta['source'],
                "chunk_id": meta['chunk_id'],
                "page": meta['page'],
                "relevance_score": round(1 - dist, 3)
            })
        
        return {
            "results": formatted,
            "query": query
        }
    
    def generate_answer(self, query: str, search_results: Dict) -> Dict:
        """
        Generate medical answer using retrieved context + LLM (with dynamic model router)
        """
        # Dynamic Model Selection
        selected_model = self.select_best_model(query)
        meta = self.model_metadata.get(selected_model, {"role": "General Practitioner", "temp": 0.3})
        
        print(f"🤖 Generating answer using '{selected_model}' ({meta['role']})...")
        
        # Build context from search results
        context_parts = []
        sources = []
        
        for i, result in enumerate(search_results['results']):
            context_parts.append(
                f"[Document: {result['source']}, Page: {result['page']}, Relevance: {result['relevance_score']}]\n"
                f"{result['text'][:800]}"
            )
            sources.append({
                "document": result['source'],
                "page": result['page'],
                "relevance": result['relevance_score']
            })
        
        context = "\n\n".join(context_parts)
        
        # Build medical prompt
        system_prompt = f"""You are HealthDesk Pro, an advanced medical information assistant running {selected_model} ({meta['role']}).
STRICT RULES:
1. Use ONLY the provided WHO/NIH documents to answer
2. Cite the source document and page for every claim
3. NEVER diagnose definitively - use "may indicate", "could suggest"
4. Provide confidence level (0-100%)
5. List possible differential diagnoses when appropriate
6. ALWAYS end with: "⚠️ This is general information. Consult a qualified healthcare provider."
7. For emergency symptoms, prioritize immediate action over detailed explanation
8. Use simple language but maintain medical accuracy"""

        full_prompt = f"""{system_prompt}

MEDICAL DOCUMENTS:
{context}

USER QUESTION: {query}

Provide a structured response:
- Direct answer with citations
- Confidence level
- Possible differential diagnoses (if applicable)
- Recommended next steps
- Emergency warnings (if applicable)"""

        # Call Ollama
        try:
            response = requests.post(
                self.ollama_url,
                json={
                    "model": selected_model,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": meta["temp"],
                        "num_ctx": 8192
                    }
                },
                timeout=60
            )

            data = response.json()

            if "response" in data:
                answer = data["response"]
            elif "message" in data:
                answer = data["message"]["content"]
            else:
                answer = str(data)

            print("  ✓ Answer generated")

            return {
                "answer": answer,
                "sources": sources,
                "context_used": len(context_parts),
                "model_used": selected_model,
                "model_role": meta["role"]
            }

        except Exception as e:
            print(f"  ❌ Error calling Ollama: {e}")

            return {
                "answer": "Error generating response. Please check if Ollama is running.",
                "sources": [],
                "context_used": 0,
                "model_used": selected_model,
                "model_role": meta["role"]
            }
    
    def chat(self, query: str) -> Dict:
        """
        Complete RAG pipeline: search + generate
        """
        print("\n" + "-"*50)
        print(f"💬 HealthDesk RAG Query: '{query}'")
        print("-"*50)
        
        # Step 1: Search
        search_results = self.search(query, top_k=3)
        
        # Step 2: Generate
        if search_results['results']:
            result = self.generate_answer(query, search_results)
            result['query'] = query
            return result
        else:
            # Safe select even when search is empty (just to match returned metadata structure)
            selected_model = self.select_best_model(query)
            meta = self.model_metadata.get(selected_model, {"role": "General Triage Fallback", "temp": 0.3})
            return {
                "answer": "I don't have information about that in my medical documents. Please consult a healthcare provider.",
                "sources": [],
                "context_used": 0,
                "query": query,
                "model_used": selected_model,
                "model_role": meta["role"]
            }
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        return {
            "total_documents": len(self.loaded_documents),
            "total_chunks": self.collection.count(),
            "documents_list": list(self.loaded_documents)
        }


# Singleton for FastAPI
_rag_instance = None

def get_rag():
    """Get or create RAG singleton"""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = HealthDeskRAG()
    return _rag_instance


if __name__ == "__main__":
    # Test run
    rag = HealthDeskRAG()
    rag.ingest_all_documents()
    
    # Test query
    result = rag.chat("What are symptoms of dengue fever?")
    
    print("\n" + "="*50)
    print("ANSWER:")
    print(result['answer'])
    
    print("\nSOURCES:")
    for src in result['sources']:
        print(f"  • {src['document']} (Page {src['page']}, Relevance: {src['relevance']})")
