import os
from pathlib import Path
from dotenv import load_dotenv

# Load root .env first, then local
root_env = Path(__file__).resolve().parent.parent.parent / '.env'
if root_env.exists():
    load_dotenv(root_env)
load_dotenv()

class Settings:
    PORT: int = int(os.getenv("AI_PORT", "8000"))
    HOST: str = os.getenv("AI_HOST", "0.0.0.0")
    ENV: str = os.getenv("AI_ENV", "development")

    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # STT & TTS Settings
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "groq_whisper")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "gtts")

    # RAG Settings
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.65"))
    DATA_DIR: Path = Path(__file__).resolve().parent / "data"
    DOCUMENTS_DIR: Path = DATA_DIR / "documents"
    VECTOR_STORE_DIR: Path = DATA_DIR / "vector_store"

    # Supported Indic Languages
    SUPPORTED_LANGUAGES = {
        "mr": "Marathi",
        "hi": "Hindi",
        "en": "English",
        "ta": "Tamil",
        "te": "Telugu",
        "kn": "Kannada",
        "bn": "Bengali",
        "gu": "Gujarati",
        "pa": "Punjabi",
        "ml": "Malayalam",
    }

settings = Settings()

# Ensure data directories exist
settings.DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
settings.VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)
