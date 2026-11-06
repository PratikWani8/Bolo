import re

def sanitize_text(text: str) -> str:
    """Sanitize user input to avoid prompt injection and control character abuse."""
    if not text:
        return ""
    # Strip null bytes and control chars
    clean = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    # Truncate overly long queries
    return clean.strip()[:1000]

def is_safe_document_content(text: str) -> bool:
    """Inspect extracted document text for prompt injection patterns."""
    dangerous_patterns = [
        r'ignore\s+all\s+previous\s+instructions',
        r'you\s+are\s+now\s+a\s+DAN',
        r'system\s*:\s*override',
    ]
    for pattern in dangerous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return False
    return True
