import os
import re
from typing import List
from pypdf import PdfReader
from app.core.security import sanitize_text, is_safe_document_content

def extract_text_from_file(file_path: str) -> str:
    """Extract plain text from uploaded PDF or TXT file."""
    if not os.path.exists(file_path):
        return ""

    ext = os.path.splitext(file_path)[1].lower()
    text = ""

    if ext == ".pdf":
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e:
            print(f"[Document Processor] Error extracting PDF {file_path}: {e}")
    else:
        # Plain text / fallback
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            print(f"[Document Processor] Error reading file {file_path}: {e}")

    # Sanitize and verify safety
    clean_text = sanitize_text(text)
    if not is_safe_document_content(clean_text):
        print(f"[Document Processor Warning] Document contains potential prompt injection. Neutralized.")
        clean_text = re.sub(r'(?i)ignore\s+all\s+previous\s+instructions', '', clean_text)

    return clean_text

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> List[str]:
    """Split text into overlapping chunks for RAG indexing."""
    if not text:
        return []

    # Clean multi-newlines
    normalized = re.sub(r'\s+', ' ', text).strip()
    chunks = []
    start = 0
    text_len = len(normalized)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        # Try to find sentence boundary near end
        if end < text_len:
            period_idx = normalized.rfind('.', start, end)
            if period_idx != -1 and period_idx > start + chunk_size // 2:
                end = period_idx + 1

        chunk = normalized[start:end].strip()
        if len(chunk) > 40:
            chunks.append(chunk)

        start += max(1, chunk_size - overlap)

    return chunks
