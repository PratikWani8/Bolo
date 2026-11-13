# BOLO API Documentation

## Base URLs
- **Node.js Express API**: `http://localhost:5000/api`
- **FastAPI AI Microservice**: `http://localhost:8000/api`

---

## 1. Authentication APIs (`/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register new user (Citizen/Volunteer/Admin) | No |
| POST | `/auth/login` | Login with email/phone & password | No |
| GET | `/auth/me` | Get currently authenticated profile | Yes (Bearer Token) |

---

## 2. Schemes APIs (`/schemes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/schemes` | List schemes with search, category, and state filter | Optional |
| GET | `/schemes/:id` | Get scheme details by ID or slug | Optional |
| POST | `/schemes` | Create new scheme | Admin |
| PUT | `/schemes/:id` | Update scheme details | Admin |
| DELETE | `/schemes/:id` | Remove scheme | Admin |

---

## 3. Conversational AI & Voice APIs (`/ai`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/ai/chat` | Send text query, returns grounded RAG answer with citations | Optional |
| POST | `/ai/voice` | Upload audio file, performs STT + RAG + TTS pipeline | Optional |
| POST | `/ai/speech-to-text` | Standalone audio transcription & language detection | Optional |
| POST | `/ai/text-to-speech` | Synthesize speech from text in regional Indic language | Optional |
| POST | `/ai/translate` | Translate text while preserving scheme names & links | Optional |

---

## 4. Eligibility Evaluation (`/eligibility`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/eligibility/check` | Evaluates user profile against verified scheme rules | Optional |

---

## 5. Knowledge Base & Documents (`/knowledge`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/knowledge` | List uploaded government documents & vector status | Admin |
| POST | `/knowledge/upload` | Upload PDF/Doc for OCR, chunking & vector indexing | Admin |
| GET | `/knowledge/:id` | Get document metadata & verification status | Admin |
| DELETE | `/knowledge/:id` | Delete document and remove associated vector chunks | Admin |
| POST | `/knowledge/:id/reprocess` | Re-index document chunks | Admin |

---

## 6. Citizen Conversations (`/conversations`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/conversations` | List user conversation history | Yes |
| GET | `/conversations/:id` | Get messages in specific conversation | Yes |
| DELETE | `/conversations/:id` | Clear conversation history | Yes |

---

## 7. Helplines & Assistance (`/helplines` & `/volunteer`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/helplines` | List verified state & central helplines | No |
| POST | `/helplines` | Create/update helpline record | Admin |
| POST | `/volunteer/assisted-query`| Record query handled on behalf of a citizen | Volunteer/Admin |
| GET | `/volunteer/stats` | View assistance statistics | Volunteer/Admin |

---

## 8. Analytics & Administration (`/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/admin/analytics` | Summary stats (queries, active users, languages) | Admin |
| GET | `/admin/unanswered-queries`| Log of queries with low confidence for review | Admin |
