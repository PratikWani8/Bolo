import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.document_processor import extract_text_from_file, chunk_text
from app.services.embedding_service import vector_store

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base & RAG"])

@router.post("/upload")
async def upload_document_to_rag(
    file: UploadFile = File(...),
    title: str = Form(...),
    sourceUrl: str = Form(...),
    department: str = Form(...),
    schemeName: str = Form(""),
    language: str = Form("mr"),
    state: str = Form("All India")
):
    suffix = os.path.splitext(file.filename or "doc.pdf")[1] or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        text = extract_text_from_file(tmp_path)
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from document.")

        chunks = chunk_text(text, chunk_size=500, overlap=100)
        metadata = {
            "title": title,
            "sourceUrl": sourceUrl,
            "department": department,
            "schemeName": schemeName or title,
            "language": language,
            "state": state,
            "verificationStatus": "verified",
        }

        for chunk in chunks:
            vector_store.add_document(chunk, metadata)

        return {
            "success": True,
            "message": f"Successfully indexed {len(chunks)} chunks into vector store.",
            "chunkCount": len(chunks),
            "document": metadata,
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
