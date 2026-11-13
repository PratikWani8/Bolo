# BOLO - Setup and Installation Guide

Follow these instructions to run BOLO locally or with Docker.

---

## 1. Prerequisites
- **Node.js**: v18.0 or later (v20+ recommended)
- **Python**: v3.10 or later
- **MongoDB**: Local MongoDB instance (or Atlas connection string; fallback in-memory mode supported)
- **Groq API Key**: Optional for live Groq LLaMA models (free tier at [console.groq.com](https://console.groq.com)). Grounded rule-based fallback responses are included if no key is provided.

---

## 2. Quick Start (Local Setup)

### Step 1: Clone and Configure Environment
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### Step 2: Set up Backend (Node.js/Express)
```bash
cd server
npm install
npm run seed     # Pre-populates verified government schemes & helplines
npm run dev      # Starts server on http://localhost:5000
```

### Step 3: Set up AI Microservice (FastAPI/Python)
Open a new terminal:
```bash
cd ai-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Set up Frontend (React/Vite)
Open another terminal:
```bash
cd client
npm install
npm run dev      # Starts frontend on http://localhost:5173
```

---

## 3. Seed Accounts for Testing
When you seed the database (`npm run seed`), default test accounts are created:

| Role | Email | Password |
|---|---|---|
| **Citizen** | `citizen@bolo.gov.in` | `BoloCitizen@123` |
| **Volunteer** | `volunteer@bolo.gov.in` | `BoloVolunteer@123` |
| **Administrator** | `admin@bolo.gov.in` | `BoloAdmin@123` |

You can also register a new account on the registration page anytime.

---

## 4. Docker Deployment
To launch all services with Docker Compose:
```bash
docker-compose up --build
```
This boots MongoDB, AI Microservice, Node.js API, and the React client.
