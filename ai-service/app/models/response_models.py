from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SourceCitation(BaseModel):
    title: str
    url: str
    department: str
    confidence: float

class ChatResponse(BaseModel):
    success: bool = True
    text: str
    confidence: float
    detectedLanguage: str
    sources: List[SourceCitation] = []
    suggestedFollowUps: List[str] = []
    scheme: Optional[Dict[str, Any]] = None
    isVerifiedSource: bool = True

class VoiceResponse(BaseModel):
    success: bool = True
    transcript: str
    detectedLanguage: str
    text: str
    confidence: float
    sources: List[SourceCitation] = []
    suggestedFollowUps: List[str] = []
    scheme: Optional[Dict[str, Any]] = None
    audioBase64: Optional[str] = None
    isVerifiedSource: bool = True

class TranslationResponse(BaseModel):
    success: bool = True
    translatedText: str
    sourceLanguage: str
    targetLanguage: str
