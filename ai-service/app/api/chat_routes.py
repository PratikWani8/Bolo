from fastapi import APIRouter
from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse
from app.services.llm_service import generate_grounded_response
from app.services.language_detection import detect_language

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    detected_lang, _ = detect_language(request.query)
    target_lang = request.language or detected_lang

    result = generate_grounded_response(request.query, target_language=target_lang)

    return ChatResponse(
        success=True,
        text=result["text"],
        confidence=result["confidence"],
        detectedLanguage=target_lang,
        sources=result["sources"],
        suggestedFollowUps=result["followUps"],
        isVerifiedSource=result.get("isVerified", True),
    )
