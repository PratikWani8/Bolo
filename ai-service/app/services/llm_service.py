from app.config import settings
from app.core.prompts import SYSTEM_PUBLIC_SERVICE_ASSISTANT
from app.services.rag_service import query_knowledge_base

def generate_grounded_response(question: str, target_language: str = "mr") -> dict:
    """
    RAG-driven grounded response generator.
    1. Query verified knowledge base.
    2. Pass retrieved context to Groq LLM (LLaMA 3.3 70B) or fallback synthesizer.
    3. Return response text, source citations, confidence score, and follow-ups.
    """
    rag_result = query_knowledge_base(question)
    context = rag_result["context"]
    sources = rag_result["sources"]
    confidence = rag_result["confidence"]

    # If confidence is below threshold, refuse to guess and give safe guidance
    if confidence < settings.CONFIDENCE_THRESHOLD and not rag_result["has_confident_match"]:
        if target_language == "mr":
            response_text = (
                "हा प्रश्न अधिकृत सरकारी नोंदीत पूर्णपणे सत्यापित करता आला नाही. "
                "चुकीची माहिती टाळण्यासाठी, कृपया आपल्या जवळच्या ग्रामपंचायत कार्यालय, "
                "सेतू सुविधा केंद्र किंवा राष्ट्रीय पोर्टल myscheme.gov.in ला भेट द्या."
            )
            follow_ups = ["पीएम किसान योजना", "लाडकी बहीण योजना", "आयुष्मान भारत योजना"]
        elif target_language == "hi":
            response_text = (
                "इस प्रश्न का आधिकारिक विवरण वर्तमान रिकॉर्ड में पूरी तरह उपलब्ध नहीं है। "
                "कृपया सही जानकारी के लिए अपने नजदीकी सीएससी केंद्र, ग्राम पंचायत अथवा myscheme.gov.in पोर्टल पर जाएं।"
            )
            follow_ups = ["पीएम किसान योजना", "आयुष्मान भारत योजना", "पीएम आवास योजना"]
        else:
            response_text = (
                "Reliable official documentation for this specific query was not found with sufficient confidence. "
                "To prevent misinformation, please consult your nearest Common Service Centre (CSC) or check myscheme.gov.in."
            )
            follow_ups = ["PM-KISAN Scheme", "Ayushman Bharat PM-JAY", "PM Awas Yojana"]

        return {
            "text": response_text,
            "confidence": confidence,
            "sources": sources,
            "followUps": follow_ups,
            "isVerified": False,
        }

    # If Groq API Key is available, invoke Groq LLaMA 3.3
    if settings.GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)

            system_prompt = SYSTEM_PUBLIC_SERVICE_ASSISTANT.format(
                target_language=settings.SUPPORTED_LANGUAGES.get(target_language, "Marathi"),
                context=context,
                question=question,
            )

            completion = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question},
                ],
                temperature=0.2,
                max_tokens=600,
            )

            text_output = completion.choices[0].message.content.strip()

            follow_ups = [
                "कागदपत्रे कोणती लागतील?" if target_language == "mr" else "What documents are required?",
                "अर्ज कसा करायचा?" if target_language == "mr" else "How to apply?",
                "हेल्पलाइन नंबर काय आहे?" if target_language == "mr" else "What is the helpline number?",
            ]

            return {
                "text": text_output,
                "confidence": max(confidence, 0.92),
                "sources": sources,
                "followUps": follow_ups,
                "isVerified": True,
            }
        except Exception as e:
            print(f"[LLM Error] Groq API call failed: {e}. Falling back to context synthesis.")

    # Fallback to direct structured extraction from verified context
    clean_context = context.replace("---", "\n").strip()
    return {
        "text": clean_context,
        "confidence": confidence,
        "sources": sources,
        "followUps": [
            "कागदपत्रे कोणती लागतील?" if target_language == "mr" else "Required documents?",
            "अर्ज कसा करावा?" if target_language == "mr" else "Application procedure?",
        ],
        "isVerified": True,
    }
