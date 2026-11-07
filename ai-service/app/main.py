from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.chat_routes import router as chat_router
from app.api.voice_routes import router as voice_router
from app.api.translation_routes import router as translation_router
from app.api.eligibility_routes import router as eligibility_router
from app.api.knowledge_routes import router as knowledge_router

app = FastAPI(
    title="BOLO AI Microservice",
    description="Multilingual Voice, RAG & LLM Engine for Indian Public Services",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(chat_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
app.include_router(translation_router, prefix="/api")
app.include_router(eligibility_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "BOLO AI Microservice",
        "environment": settings.ENV,
        "llm_provider": settings.LLM_PROVIDER,
        "stt_provider": settings.STT_PROVIDER,
        "tts_provider": settings.TTS_PROVIDER,
        "supported_languages": list(settings.SUPPORTED_LANGUAGES.keys()),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
