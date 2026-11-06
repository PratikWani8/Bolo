import io
import base64
from gtts import gTTS

# gTTS supported Indian language codes
GTTS_LANG_MAP = {
    'mr': 'mr',  # Marathi
    'hi': 'hi',  # Hindi
    'en': 'en',  # English (Indian accent if available)
    'ta': 'ta',  # Tamil
    'te': 'te',  # Telugu
    'kn': 'kn',  # Kannada
    'bn': 'bn',  # Bengali
    'gu': 'gu',  # Gujarati
    'ml': 'ml',  # Malayalam
    'pa': 'hi',  # Punjabi fallback to Hindi or en
}

def generate_speech(text: str, language: str = 'mr') -> bytes:
    """
    Generates browser-compatible MP3 speech audio bytes using gTTS.
    """
    if not text or not text.strip():
        text = "माहिती उपलब्ध नाही."

    # Truncate overly long text for audio efficiency
    truncated_text = text[:400].strip()

    lang_code = GTTS_LANG_MAP.get(language, 'mr')
    tld = 'co.in' if lang_code == 'en' else 'com'

    try:
        tts = gTTS(text=truncated_text, lang=lang_code, slow=False, tld=tld)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp.read()
    except Exception as e:
        print(f"[TTS Error] gTTS generation failed: {e}. Retrying in Hindi fallback.")
        try:
            tts = gTTS(text=truncated_text, lang='hi', slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()
        except Exception as e2:
            print(f"[TTS Fallback Error]: {e2}")
            return b""

def generate_speech_base64(text: str, language: str = 'mr') -> str:
    """
    Returns audio as data:audio/mp3;base64 string for direct frontend audio tag playback.
    """
    audio_bytes = generate_speech(text, language)
    if not audio_bytes:
        return ""
    b64 = base64.b64encode(audio_bytes).decode('utf-8')
    return f"data:audio/mp3;base64,{b64}"
