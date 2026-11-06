from app.config import settings
from app.core.prompts import TRANSLATION_PROMPT

def translate_text(text: str, target_language: str = "mr", source_language: str = "en") -> str:
    """
    Translates text while strictly preserving government scheme names, URLs, and helplines.
    """
    if not text or not text.strip():
        return ""

    if target_language == source_language:
        return text

    if settings.GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            prompt = TRANSLATION_PROMPT.format(
                target_language=settings.SUPPORTED_LANGUAGES.get(target_language, target_language),
                text=text,
            )
            completion = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"[Translation Error] Groq translation failed: {e}")

    # Fallback identity
    return text
