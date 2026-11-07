from typing import List, Dict, Any
from app.services.embedding_service import vector_store
from app.services.source_verification import verify_source_provenance

# Initial verified knowledge base
INITIAL_KNOWLEDGE_BASE = [
    {
        "text": """प्रधानमंत्री किसान सन्मान निधी (PM-KISAN) योजना:
पात्रता: स्वतःच्या नावावर लागवडीयोग्य शेतजमीन असलेले लहान व अल्पभूधारक शेतकरी कुटुंब.
फायदे: दरवर्षी ₹६,००० चे थेट आर्थिक सहाय्य तीन समान हप्त्यांमध्ये (प्रत्येक हप्ता ₹२,०००) थेट बँक खात्यात (DBT).
आवश्यक कागदपत्रे: आधार कार्ड (सक्रिय मोबाईल नंबरशी लिंक), ७/१२ उतारा किंवा जमिनीची मालकी नोंद (RoR), आधार-लिंक्ड बँक खाते पासबुक.
अर्ज प्रक्रिया: pmkisan.gov.in वर 'New Farmer Registration' किंवा जवळच्या सीएससी (CSC) / ग्रामपंचायत कार्यालयात भेट देऊन ई-केवायसी (e-KYC) पूर्ण करा.
हेल्पलाइन: १५५२६१ किंवा ०११-२४३००६०६. अधिकृत संकेतस्थळ: https://pmkisan.gov.in""",
        "metadata": {
            "title": "PM-KISAN Operational Circular 2025",
            "schemeName": "Pradhan Mantri Kisan Samman Nidhi",
            "department": "Ministry of Agriculture & Farmers Welfare",
            "sourceUrl": "https://pmkisan.gov.in",
            "language": "mr",
            "state": "All India",
            "verificationStatus": "verified"
        }
    },
    {
        "text": """मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र शासन):
पात्रता: महाराष्ट्रातील २१ ते ६५ वयोगटातील महिला. कुटुंबाचे वार्षिक उत्पन्न ₹२.५० लाखांपेक्षा कमी असणे आवश्यक. पिवळे किंवा केशरी रेशनकार्ड असल्यास स्वतंत्र उत्पन्नाचा दाखला लागत नाही.
फायदे: दरमहा ₹१,५०० थेट लाभार्थी महिलेच्या आधार-संलग्न बँक खात्यात जमा (वार्षिक ₹१८,०००).
आवश्यक कागदपत्रे: आधार कार्ड, अधिवास प्रमाणपत्र (Domicile) किंवा १५ वर्षे रहिवासी असल्याचा दाखला / शाळा सोडल्याचा दाखला / रेशन कार्ड, उत्पन्नाचा दाखला (किंवा पिवळे/केशरी रेशनकार्ड), बँक पासबुक.
अर्ज प्रक्रिया: नारी शक्ती दूत ॲप किंवा ladakibahin.maharashtra.gov.in पोर्टलवर नोंदणी, किंवा अंगणवाडी केंद्र, सेतू सुविधा केंद्र, ग्रामपंचायतीत विनामूल्य अर्ज करा.
हेल्पलाइन: १८१ / ०२२-२२०२७०५०. अधिकृत संकेतस्थळ: https://ladakibahin.maharashtra.gov.in""",
        "metadata": {
            "title": "Mukhyamantri Majhi Ladki Bahin Yojana GR",
            "schemeName": "Mukhyamantri Majhi Ladki Bahin Yojana",
            "department": "Department of Women & Child Development, Maharashtra",
            "sourceUrl": "https://ladakibahin.maharashtra.gov.in",
            "language": "mr",
            "state": "Maharashtra",
            "verificationStatus": "verified"
        }
    },
    {
        "text": """Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana):
Eligibility: Rural and urban families identified under SECC 2011 deprivation criteria, active NFSA ration card holders, and all senior citizens aged 70+ under expanded Ayushman Vay Vandana.
Benefits: Free, cashless, paperless inpatient hospital care up to ₹5,00,000 per family per year across 27,000+ empanelled government and private hospitals across India.
Required Documents: Aadhaar Card and active Ration Card / Family ID.
Application Steps: Check name on beneficiary.nha.gov.in using mobile number, or visit any empanelled hospital Aarogya Mitra desk or CSC to generate Ayushman Golden Card.
Helpline: 14555 (Toll-Free). Official Portal: https://nha.gov.in/PM-JAY""",
        "metadata": {
            "title": "Ayushman Bharat PM-JAY Scheme Handbook",
            "schemeName": "Ayushman Bharat PM-JAY",
            "department": "National Health Authority",
            "sourceUrl": "https://nha.gov.in/PM-JAY",
            "language": "en",
            "state": "All India",
            "verificationStatus": "verified"
        }
    },
    {
        "text": """Pradhan Mantri Awas Yojana - Gramin (PMAY-G):
Eligibility: Rural households living in kutcha or dilapidated houses, identified through SECC 2011 and Awaas+ survey list.
Benefits: Financial assistance of ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult regions, plus 90 days MGNREGA wages (~₹25,000) and ₹12,000 for toilet construction.
Required Documents: Aadhaar Card, Bank Passbook, MGNREGA Job Card, land/plot affidavit.
Application Steps: Contact Gram Panchayat Secretary or Gram Sevak. Inclusion is verified through Gram Sabha and geotagged.
Helpline: 1800-11-6446. Official Portal: https://pmayg.nic.in""",
        "metadata": {
            "title": "PMAY Gramin Guidelines",
            "schemeName": "Pradhan Mantri Awas Yojana - Gramin",
            "department": "Ministry of Rural Development",
            "sourceUrl": "https://pmayg.nic.in",
            "language": "en",
            "state": "All India",
            "verificationStatus": "verified"
        }
    },
    {
        "text": """Pradhan Mantri Vishwakarma Scheme:
Eligibility: Artisans and craftspeople working with hands and tools across 18 traditional family trades (carpenters, blacksmiths, potters, masons, tailors, cobblers, barbers).
Benefits: Free 5-7 days training with ₹500/day stipend, modern Toolkit incentive worth ₹15,000 e-voucher, and collateral-free enterprise loan up to ₹3,00,000 at 5% interest.
Required Documents: Aadhaar Card, Bank Passbook, Ration Card.
Application Steps: Apply at nearest CSC with biometric verification, followed by Gram Panchayat / ULB verification.
Helpline: 1800-267-7777. Official Portal: https://pmvishwakarma.gov.in""",
        "metadata": {
            "title": "PM Vishwakarma Scheme Portal Guidelines",
            "schemeName": "Pradhan Mantri Vishwakarma Scheme",
            "department": "Ministry of MSME",
            "sourceUrl": "https://pmvishwakarma.gov.in",
            "language": "en",
            "state": "All India",
            "verificationStatus": "verified"
        }
    }
]

def initialize_knowledge_base():
    """Seed the vector store with authentic government scheme knowledge chunks."""
    if len(vector_store.documents) == 0:
        for entry in INITIAL_KNOWLEDGE_BASE:
            vector_store.add_document(entry["text"], entry["metadata"])
        print(f"[RAG Engine] Indexed {len(vector_store.documents)} official verified government knowledge chunks.")

# Auto-initialize
initialize_knowledge_base()

def query_knowledge_base(query: str, top_k: int = 3, threshold: float = 0.35) -> Dict[str, Any]:
    """
    Search vector store for relevant chunks matching citizen query.
    Returns context text, source citations, and confidence score.
    """
    matches = vector_store.search(query, top_k=top_k, threshold=threshold)

    if not matches:
        return {
            "context": "",
            "sources": [],
            "confidence": 0.40,
            "has_confident_match": False,
        }

    top_confidence = matches[0]["similarity"]
    combined_context = "\n---\n".join([m["text"] for m in matches])
    sources = []

    for m in matches:
        meta = m["metadata"]
        raw_source = {
            "title": meta.get("schemeName") or meta.get("title", "Government Welfare Scheme"),
            "url": meta.get("sourceUrl", "https://myscheme.gov.in"),
            "department": meta.get("department", "Government of India"),
            "confidence": round(m["similarity"], 2),
        }
        sources.append(verify_source_provenance(raw_source))

    return {
        "context": combined_context,
        "sources": sources,
        "confidence": round(top_confidence, 2),
        "has_confident_match": top_confidence >= 0.50,
    }
