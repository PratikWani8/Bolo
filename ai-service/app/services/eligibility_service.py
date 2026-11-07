from typing import Dict, Any, List

def evaluate_scheme_criteria(citizen_profile: Dict[str, Any], scheme_rules: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares citizen profile against specific scheme criteria rules.
    """
    age = citizen_profile.get("age")
    state = citizen_profile.get("state", "All India")
    occupation = (citizen_profile.get("occupation") or "").lower()
    income = citizen_profile.get("annualIncome")
    is_farmer = citizen_profile.get("isFarmer", False)
    gender = citizen_profile.get("gender", "All")

    satisfied = []
    missing = []
    eligible = True

    # Age check
    min_age = scheme_rules.get("minAge", 0)
    max_age = scheme_rules.get("maxAge", 120)
    if age is not None:
        if age < min_age:
            eligible = False
            missing.append(f"वयोमर्यादा: किमान {min_age} वर्षे आवश्यक (आपले वय {age} वर्षे आहे)")
        elif age > max_age:
            eligible = False
            missing.append(f"वयोमर्यादा: कमाल {max_age} वर्षे (आपले वय {age} वर्षे आहे)")
        else:
            satisfied.append(f"वयाची अट पूर्ण ({min_age}-{max_age} वर्षे)")

    # Gender check
    req_gender = scheme_rules.get("gender", "All")
    if req_gender != "All" and gender != "All":
        if req_gender.lower() != gender.lower():
            eligible = False
            missing.append(f"ही योजना केवळ {req_gender} प्रवर्गासाठी आहे")
        else:
            satisfied.append(f"लिंग पात्रता पूर्ण ({req_gender})")

    # Farmer requirement
    if scheme_rules.get("isFarmerOnly", False):
        if not is_farmer and "farm" not in occupation and "शेत" not in occupation:
            eligible = False
            missing.append("केवळ शेतकरी/जमीनधारक कुटुंबांसाठी लागू")
        else:
            satisfied.append("शेतकरी निकष पूर्ण")

    # Income ceiling
    max_income = scheme_rules.get("maxIncome")
    if income is not None and max_income is not None:
        if income > max_income:
            eligible = False
            missing.append(f"उत्पन्न मर्यादा: कमाल ₹{max_income:,} (आपले उत्पन्न: ₹{income:,})")
        else:
            satisfied.append(f"उत्पन्न मर्यादेत (कमाल ₹{max_income:,})")

    return {
        "isEligible": eligible,
        "satisfiedCriteria": satisfied,
        "missingCriteria": missing,
        "preliminaryNote": "सदर निष्कर्ष प्राथमिक मार्गदर्शनासाठी आहे. अंतिम पात्रता मूळ कागदपत्रांच्या तपासणीनंतर निश्चित होते."
    }
