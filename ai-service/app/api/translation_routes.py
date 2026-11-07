from fastapi import APIRouter
from app.models.request_models import TranslateRequest
from app.models.response_models import TranslationResponse
from app.services.translation_service import translate_text

router = APIRouter(prefix="/translate", tags=["Translation"])

@router.post("", response_model=TranslationResponse)
async def translate_endpoint(request: TranslateRequest):
    translated = translate_text(
        request.text,
        target_language=request.targetLanguage,
        source_language=request.sourceLanguage or "en",
    )
    return TranslationResponse(
        success=True,
        translatedText=translated,
        sourceLanguage=request.sourceLanguage or "en",
        targetLanguage=request.targetLanguage,
    )
