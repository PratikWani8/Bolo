import re
from typing import Tuple

INDIC_SCRIPT_RANGES = {
    'ta': (0x0B80, 0x0BFF),  # Tamil
    'te': (0x0C00, 0x0C7F),  # Telugu
    'kn': (0x0C80, 0x0CFF),  # Kannada
    'ml': (0x0D00, 0x0D7F),  # Malayalam
    'bn': (0x0980, 0x09FF),  # Bengali
    'gu': (0x0A80, 0x0AFF),  # Gujarati
    'pa': (0x0A00, 0x0A7F),  # Gurmukhi / Punjabi
}

MARATHI_MARKERS = [
    'आहे', 'नाही', 'कसा', 'कशी', 'कसे', 'मिळेल', 'योजनेचा', 'योजना', 'माहिती', 
    'करावे', 'कागदपत्रे', 'शेतकरी', 'बहीण', 'अर्ज', 'हप्ता', 'नियम', 'लाभासाठी',
    'करायचा', 'पात्रता', 'गावात', 'अनुदान', 'पैसे'
]

HINDI_MARKERS = [
    'है', 'नहीं', 'कैसे', 'मिलेगा', 'मिलेगी', 'योजना', 'जानकारी', 'दस्तावेज', 
    'किसान', 'आवेदन', 'पात्रता', 'करना', 'पड़ेगा', 'रुपये', 'पैसा', 'लाभ'
]

def detect_language(text: str) -> Tuple[str, float]:
    """
    Detect language of the text.
    Returns (language_code, confidence).
    """
    if not text or not text.strip():
        return 'mr', 0.5

    clean = text.strip()

    # Check Devanagari script (U+0900 to U+097F)
    devanagari_chars = sum(1 for c in clean if 0x0900 <= ord(c) <= 0x097F)
    total_chars = len(clean.replace(' ', ''))

    if total_chars > 0 and (devanagari_chars / total_chars) > 0.3:
        # Distinguish between Marathi and Hindi
        words = clean.split()
        mr_count = sum(1 for w in words if any(m in w for m in MARATHI_MARKERS))
        hi_count = sum(1 for w in words if any(h in w for h in HINDI_MARKERS))

        if mr_count >= hi_count:
            return 'mr', 0.95
        return 'hi', 0.92

    # Check other Indian scripts
    for lang, (start, end) in INDIC_SCRIPT_RANGES.items():
        script_chars = sum(1 for c in clean if start <= ord(c) <= end)
        if total_chars > 0 and (script_chars / total_chars) > 0.3:
            return lang, 0.94

    # Default to English if Latin script
    latin_chars = sum(1 for c in clean if c.isascii() and c.isalpha())
    if total_chars > 0 and (latin_chars / total_chars) > 0.4:
        # Check if user typed Marathi in English (hinglish/maranglish)
        if any(w.lower() in ['kasa', 'milnar', 'mahiti', 'shasan', 'yojana', 'sheti'] for w in clean.split()):
            return 'mr', 0.88
        return 'en', 0.95

    return 'mr', 0.70
