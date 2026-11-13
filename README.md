# BOLO – Voice Help for Everyday Government Services
> *Your Voice. Your Language. Your Government Services.*
> *आपला आवाज. आपली भाषा. आपल्या सरकारी सेवा.*

[![Platform](https://img.shields.io/badge/Platform-Indian%20Public%20Services-0C4A60.svg)](https://myscheme.gov.in)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-0E7490.svg)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-E06A1B.svg)](https://nodejs.org)
[![AI Microservice](https://img.shields.io/badge/AI-FastAPI%20%7C%20Groq%20%7C%20Whisper-059669.svg)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌾 The Problem
Over 800 million citizens in rural and semi-urban India are entitled to vital social welfare schemes (financial aid, subsidized seeds, health coverage, pension, housing grants). However, complex bureaucratic jargon, language barriers, high digital illiteracy, and dependence on predatory middlemen prevent citizens from claiming their legitimate benefits.

## 🗣️ What is BOLO?
**BOLO** is an AI-powered, voice-first digital public-service assistance platform. Citizens can simply speak in their native tongue (such as Marathi, Hindi, English, Tamil, Bengali, Telugu, and more) and receive simple, verified, jargon-free explanations, eligibility assessments, step-by-step application instructions, required document checklists, and direct official links and helplines.

### Key Capabilities
- 🎙️ **Voice-First Interaction**: High-contrast, single-tap microphone with live audio waveform and noise suppression.
- 🇮🇳 **Multilingual Support**: Supports Marathi, Hindi, English, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi, and Malayalam.
- 🛡️ **Zero Hallucination / Grounded RAG**: Retrieval-Augmented Generation strictly grounded on official government sources (`myScheme.gov.in`, `india.gov.in`, `web.umang.gov.in`).
- 📶 **Low-Connectivity Resilience**: PWA with offline caching of scheme directories, emergency helplines, and FAQs.
- 🎯 **Conversational Eligibility Checker**: Multi-step conversational assessment mapping citizen profile to scheme criteria.
- 👥 **Role-Based Access Control**: Tailored workflows for Citizens, Field Volunteers, and Government Administrators.

---

## 🏛️ Architecture & Modules
Detailed technical specifications can be found in:
- [Architecture Blueprint](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [Setup & Deployment Guide](docs/setup-guide.md)

---

## 🚀 Quick Run
```bash
# 1. Start Server
cd server
npm install
npm run seed
npm run dev

# 2. Start AI Service
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 3. Start Client
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
