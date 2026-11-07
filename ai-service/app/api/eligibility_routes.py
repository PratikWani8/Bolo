from fastapi import APIRouter
from app.models.request_models import EligibilityCheckRequest
from app.services.eligibility_service import evaluate_scheme_criteria

router = APIRouter(prefix="/eligibility", tags=["Eligibility"])

@router.post("/evaluate")
async def evaluate_eligibility_endpoint(request: EligibilityCheckRequest):
    profile = request.model_dump()
    # Evaluate with standard welfare rule profile
    result = evaluate_scheme_criteria(profile, {
        "minAge": 18,
        "maxAge": 100,
        "gender": request.gender or "All",
        "maxIncome": 250000,
        "isFarmerOnly": request.isFarmer or False,
    })
    return {"success": True, "evaluation": result}
