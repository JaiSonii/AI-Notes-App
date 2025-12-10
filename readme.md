# AI-Powered Notes & Search App

A full-stack web application that allows users to create private notes and perform **semantic search** (searching by meaning, not just keywords) using a local AI model. The entire stack is containerized using Docker.

## 🚀 Features

  * **User Authentication:** Secure Signup/Login using JWT.
  * **Notes Management:** Create, Read, Update, and Delete (CRUD) personal notes.
  * **AI Semantic Search:** Search for "groceries" and find notes about "milk and eggs" using vector embeddings.
  * **Local AI Model:** Uses `@xenova/transformers` to run the `all-MiniLM-L6-v2` model directly in the backend container (no OpenAI API key required).
  * **Vector Database:** Uses **PostgreSQL** with the `pgvector` extension to store and query embeddings.

-----

## 🛠️ Tech Stack

  * **Frontend:** React (Vite), TypeScript, TailwindCSS, Lucide Icons.
  * **Backend:** Node.js, Express, TypeScript, Prisma ORM.
  * **Database:** PostgreSQL 16 (with `pgvector`).
  * **Infrastructure:** Docker & Docker Compose.

-----

## 📋 Prerequisites

  * **Docker Desktop** (must be installed and running).
  * **Git** (to clone the repository).

-----

## ⚡ How to Run the Project

### 1\. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/JaiSonii/AI-Notes-App
cd AI-Notes-App
```

### 2\. Start the Application

Run the following command to build the images and start the containers:

```bash
docker-compose up --build
```

### 3\. Wait for Initialization (First Run Only)

> **⚠️ Important:** On the very first run, the backend container will automatically download the AI Model (\~80MB) from HuggingFace.
>
> Watch the terminal logs for the backend. You might see a pause before the server says `Server running on port 4000`. Please be patient.

### 4\. Access the Application

Once the logs show the services are running, open your browser:

  * **Frontend (App):** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
  * **Backend (API):** [http://localhost:4000](https://www.google.com/search?q=http://localhost:4000) (Health check)

### 5\. Stopping the App

To stop the containers, press `Ctrl + C` in the terminal, or run:

```bash
docker-compose down
```

-----

## 🧠 Current Architecture & Design Decisions

### 1\. Synchronous Embedding Generation

In the current implementation, when a user creates a note, the API **waits** for the AI model to generate the embedding before saving to the database.

  * **Trade-off:** This ensures **Strong Consistency**. The moment the "Save" button finishes loading, the note is immediately searchable via AI.
  * **Downside:** It adds latency (\~200ms) to the save operation and blocks the main Node.js thread during calculation.

### 2\. Raw SQL in Prisma

Prisma's TypeScript client currently treats the `vector` type as `Unsupported`. I used `prisma.$executeRaw` to cast the embeddings (`::vector`) manually for insertion and similarity search (`<=>`).

-----

## 🔮 Future System Design: Scaling & Architecture

If this application were to scale to thousands of concurrent users, the current **Synchronous** model would block the CPU. Here is the proposed architecture for a production-grade system:

### 1\. Asynchronous Workers (Fixing Latency)

To prevent the API from freezing during heavy traffic, we would move the AI processing to a background queue (e.g., BullMQ + Redis).

  * **Flow:** User clicks Save -\> API saves *Text* immediately -\> API responds "Success" -\> Worker processes Embedding in background.

### 2\. The "Immediate Search" Problem

Moving to async workers creates a gap: if a user creates a note and *immediately* searches for it, the AI search might fail because the embedding isn't ready yet (Eventual Consistency).

### 3\. Solution: Hybrid Search Approach

To solve this, we would implement **Hybrid Search**, combining two query techniques:

  * **Query A (Vector):** Searches for semantic meaning (e.g., "Food" finds "Pizza"). *Slower update time.*
  * **Query B (Keyword):** Uses PostgreSQL Full-Text Search (`tsvector` or `ILIKE`) to match exact words. *Instant update time.*

**Result:** The system merges results from both. Even if the AI embedding is still processing, the user can find their new note immediately via keyword match.

### 4\. Performance Indexes

  * **HNSW Index:** Add `CREATE INDEX ON items USING hnsw (embedding vector_l2_ops)` to the Postgres vector column. This changes search complexity from O(N) to O(log N), critical for datasets \> 10,000 notes.

-----

## 🏗️ Project Structure

```text
ai-notes-app/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (AI & DB)
│   │   └── models/         # Prisma schema
│   ├── prisma/
│   │   └── schema.prisma   # DB Schema with vector support
│   └── Dockerfile
├── frontend/               # React + Vite App
│   ├── src/lib/            # API configurations
│   └── Dockerfile
└── docker-compose.yml      # Orchestration config
```