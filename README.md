# 🤖 Enterprise AI-Powered PDF RAG Assistant

A production-ready, enterprise-grade **Retrieval-Augmented Generation (RAG)** platform. Users can upload complex PDF documents, extract & smart-chunk text using PyMuPDF, index vector embeddings in a local Qdrant Vector Database via the Google Gemini API, and query their documents with zero-hallucination, document-grounded answers featuring exact page and section citations streamed token-by-token over Server-Sent Events (SSE).

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-chatbot-g8e8.vercel.app/)
![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python 3.12](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant_Vector_DB-DC2626?style=for-the-badge&logo=qdrant&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Key Features

* **Strict Grounded RAG & Zero Hallucination**: Fallbacks automatically to `"I couldn't find this information in the uploaded documents."` if information is absent from retrieved context.
* **Exact Page & Section Citations**: Answers cite exact document names, 1-indexed page numbers, section headings, and vector similarity scores.
* **PyMuPDF PDF Parser**: Fast page-by-page extraction, skipping blank pages and extracting font metrics for heuristic heading detection.
* **Smart Chunker Engine**: Sentence-, paragraph-, and heading-aware chunking with configurable sliding overlap (`CHUNK_SIZE`, `CHUNK_OVERLAP`).
* **Vector Store with Qdrant**: Local Docker Qdrant vector database with Cosine similarity search, payload filtering per user/document, and score thresholding.
* **Token-by-Token SSE Streaming**: Real-time HTTP Server-Sent Events stream generation using Google Gemini 2.5 Flash.
* **JWT Authentication & RBAC**: Secure access tokens, refresh tokens, password hashing with Bcrypt, and Role-Based Access Control (`admin`, `user`).
* **Enterprise Analytics Dashboard**: Tracks total documents, chunk counts, Qdrant vector points, average query latency, and storage usage.
* **Modern Next.js 15 App Router Frontend**: Built with React 19, TypeScript, TailwindCSS, Axios, and TanStack React Query.

---

## 🏗️ Architecture

```
                                    +-----------------------------------+
                                    |     Next.js 15 Frontend (App)     |
                                    +-----------------+-----------------+
                                                      |
                                           HTTPS / SSE Streaming
                                                      |
                                    +-----------------v-----------------+
                                    |     FastAPI Backend Service       |
                                    |  - JWT Auth / CORS Middleware     |
                                    |  - Pydantic v2 Schemas            |
                                    |  - RAG Engine & Smart Chunker     |
                                    +--------+-----------------+--------+
                                             |                 |
                         Mongo Motor Async   |                 | Qdrant Vector Client
                                             |                 |
                                    +--------v--------+  +-----v-----------+
                                    | MongoDB (Async) |  | Local Qdrant DB |
                                    | - Users & Roles |  | - Vector Points |
                                    | - Doc Metadata  |  | - 768-dim Embed |
                                    | - Chat History  |  | - Doc Payload   |
                                    +-----------------+  +-----------------+
```

---

## 🛠️ Tech Stack

* **Backend**: Python 3.12, FastAPI, Pydantic v2, PyMuPDF (`fitz`), Motor (MongoDB Async Driver), `qdrant-client`, `google-genai`, PyJWT, Passlib (Bcrypt), Loguru.
* **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Axios, TanStack React Query, Lucide Icons.
* **Databases**: MongoDB (Document Metadata & Auth), Qdrant (Vector Database).
* **AI/LLM**: Google Gemini Embeddings (`text-embedding-004`), Google Gemini LLM (`gemini-2.5-flash`).
* **Containers**: Docker, Docker Compose.

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # Auth, Documents, Query, Dashboard, Health
│   │   ├── core/               # Config, Logging, Security, DB, Qdrant, Errors
│   │   ├── middleware/         # Auth & Rate Limiting Middleware
│   │   ├── dependencies/       # FastAPI Dependency Injection & RBAC
│   │   ├── models/             # Domain Entities (User, Document, Chunk, Conversation)
│   │   ├── schemas/            # Pydantic v2 DTOs
│   │   ├── repositories/       # Mongo Motor Data Repositories
│   │   ├── services/           # Auth, Document RAG Indexing, Query Services
│   │   ├── rag/                # PyMuPDF Parser, Smart Chunker, Embeddings, VectorStore, Retriever, Pipeline, Prompts
│   │   └── utils/              # PDF File Validation & Hashing Helpers
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   └── .env.example
├── frontend/
│   ├── app/                    # Next.js 15 App Router ((auth), chat, documents, dashboard, settings)
│   ├── components/             # Sidebar, MessageItem, ChatInput, UploadDropzone, DocumentTable, MetricCard
│   ├── hooks/                  # useAuth, useChat, useDocuments, useDashboard
│   ├── services/               # Axios API client, authService, documentService, queryService, dashboardService
│   ├── types/                  # TypeScript definitions
│   ├── styles/                 # Global TailwindCSS styles
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quickstart & Setup

### Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
PROJECT_NAME="AI Document Assistant"
API_V1_STR="/api/v1"
PORT=8000
MONGODB_URI="mongodb://localhost:27017"
QDRANT_URL="http://localhost:6333"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
JWT_SECRET="super-secret-jwt-key"
JWT_REFRESH_SECRET="super-secret-refresh-jwt-key"
```

### Docker Compose (Recommended)

To launch the complete platform (MongoDB, Qdrant, FastAPI Backend):

```bash
docker-compose up --build
```

### Manual Local Execution

#### 1. Start Vector DB & Mongo
```bash
docker run -d -p 6333:6333 qdrant/qdrant
docker run -d -p 27017:27017 mongo:7.0
```

#### 2. Run Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Login and acquire JWT access/refresh tokens | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token using refresh token | No |
| `POST` | `/api/v1/documents/upload` | Upload PDF, parse, chunk, embed & index into Qdrant | Yes |
| `GET` | `/api/v1/documents` | List uploaded user documents & chunk status | Yes |
| `DELETE`| `/api/v1/documents/{id}` | Delete document, file on disk, and Qdrant vectors | Yes |
| `POST` | `/api/v1/query` | RAG Query with citations | Yes |
| `GET` | `/api/v1/query/stream` | RAG Query SSE Stream token-by-token generation | Yes |
| `GET` | `/api/v1/dashboard` | Get system metrics, vector count & avg latency | Yes |
| `GET` | `/health` | Application healthcheck | No |

---

## 📄 License
Distributed under the ISC License.
