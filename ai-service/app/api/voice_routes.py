import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from app.models.response_models import VoiceResponse
from app.models.request_models import TTSRequest
from app.services.speech_to_text import transcribe_audio
from app.services.llm_service import generate_grounded_response
from app.services.text_to_speech import generate_speech, generate_speech_base64

router = APIRouter(tags=["Voice"])

@router.post("/voice", response_model=VoiceResponse)
async def voice_pipeline(
    audio: UploadFile = File(...),
    language: str = Form(None)
):
    # Save temporary audio file
    suffix = os.path.splitext(audio.filename or "recording.wav")[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        transcript, detected_lang, _ = transcribe_audio(tmp_path, hint_language=language)
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not transcribe audio.")

        target_lang = language or detected_lang
        result = generate_grounded_response(transcript, target_language=target_lang)

        # Generate voice response audio base64 for direct browser audio tag playback
        audio_b64 = generate_speech_base64(result["text"], language=target_lang)

        return VoiceResponse(
            success=True,
            transcript=transcript,
            detectedLanguage=target_lang,
            text=result["text"],
            confidence=result["confidence"],
            sources=result["sources"],
            suggestedFollowUps=result["followUps"],
            audioBase64=audio_b64,
            isVerifiedSource=result.get("isVerified", True),
        )
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/speech-to-text")
async def speech_to_text_endpoint(
    audio: UploadFile = File(...),
    language: str = Form(None)
):
    suffix = os.path.splitext(audio.filename or "audio.wav")[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        transcript, detected_lang, confidence = transcribe_audio(tmp_path, hint_language=language)
        return {
            "success": True,
            "transcript": transcript,
            "detectedLanguage": detected_lang,
            "confidence": confidence,
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/text-to-speech")
async def text_to_speech_endpoint(request: TTSRequest):
    audio_bytes = generate_speech(request.text, language=request.language or "mr")
    if not audio_bytes:
        raise HTTPException(status_code=500, detail="TTS generation failed")
    return Response(content=audio_bytes, media_type="audio/mpeg")
