from pydantic import BaseModel, Field
from typing import Optional, List

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    language: Optional[str] = Field("mr", description="ISO 639-1 code e.g. mr, hi, en, ta")
    state: Optional[str] = Field("All India", description="State context")

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1)
    targetLanguage: str = Field("mr", description="Target language code")
    sourceLanguage: Optional[str] = Field("en", description="Source language code")

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1)
    language: Optional[str] = Field("mr")

class EligibilityCheckRequest(BaseModel):
    age: Optional[int] = None
    state: Optional[str] = "All India"
    occupation: Optional[str] = ""
    annualIncome: Optional[float] = None
    isFarmer: Optional[bool] = False
    gender: Optional[str] = "All"
    schemeId: Optional[str] = None
