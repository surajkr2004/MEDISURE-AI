"""
Risk Engine — Combines all verification layer signals into a final risk assessment.
"""
from typing import List, Optional
from schemas import VerificationLayer


def calculate_risk_score(
    layers: List[VerificationLayer],
    ai_confidence: Optional[float] = None,
    ai_status: Optional[str] = None,
    medicine_status: Optional[str] = None,
    batch_expired: bool = False
) -> float:
    """
    Calculate a risk score from 0 (no risk) to 100 (maximum risk).
    Higher score = higher risk.
    """
    score = 0.0
    weights = {
        "QR Code Validation": 20,
        "Database Lookup": 25,
        "Product Status": 20,
        "Expiry Date Check": 15,
        "Batch Validation": 10,
        "Manufacturer Verification": 10,
        "Duplicate Detection": 10,
    }

    for layer in layers:
        weight = weights.get(layer.name, 5)
        if layer.status == "fail":
            score += weight
        elif layer.status == "warning":
            score += weight * 0.5

    # AI signal
    if ai_confidence is not None:
        if ai_status == "high_risk":
            score += 15
        elif ai_status == "medium_risk":
            score += 7

    return min(round(score, 1), 100.0)


def determine_risk_level(score: float) -> str:
    if score <= 20:
        return "low"
    elif score <= 55:
        return "medium"
    else:
        return "high"


def determine_result(
    score: float,
    layers: List[VerificationLayer],
    medicine_status: Optional[str] = None,
    batch_expired: bool = False
) -> str:
    """
    Determine final result category from risk score + specific conditions.
    Returns: verified / suspicious / unverified / expired
    """
    if batch_expired:
        return "expired"

    if medicine_status in ("recalled", "discontinued"):
        return "unverified"

    # Check if core layers (DB lookup) failed
    db_layer = next((l for l in layers if l.name == "Database Lookup"), None)
    qr_layer = next((l for l in layers if l.name == "QR Code Validation"), None)

    if db_layer and db_layer.status == "fail":
        return "unverified"
    if qr_layer and qr_layer.status == "fail":
        return "unverified"

    if score <= 20:
        return "verified"
    elif score <= 55:
        return "suspicious"
    else:
        return "unverified"


def get_result_message(result: str, risk_level: str) -> dict:
    """
    Return user-facing messages for each result type.
    """
    messages = {
        "verified": {
            "title": "Verification Successful",
            "message": "The available product information matches the trusted records.",
            "recommendation": (
                "Continue using as prescribed. This result is based on available database records. "
                "Always purchase medicines from licensed pharmacies."
            ),
            "icon": "✓",
            "color": "green"
        },
        "suspicious": {
            "title": "Verification Needs Attention",
            "message": "Some information could not be fully verified or shows potential inconsistencies.",
            "recommendation": (
                "Do not rely on this result alone. Contact a pharmacist, the manufacturer, "
                "or a relevant regulatory authority before using this medicine."
            ),
            "icon": "⚠️",
            "color": "yellow"
        },
        "unverified": {
            "title": "Potentially Unsafe / Unverified",
            "message": "This product could not be verified against available records.",
            "recommendation": (
                "Do not use this medicine until its authenticity and safety have been confirmed "
                "by an appropriate professional or authority."
            ),
            "icon": "🚨",
            "color": "red"
        },
        "expired": {
            "title": "Expired Medicine Detected",
            "message": "This medicine's expiry date has passed.",
            "recommendation": (
                "Do not use expired medicines. Dispose of them safely through a pharmacy "
                "or authorized medicine disposal facility."
            ),
            "icon": "⚠️",
            "color": "red"
        }
    }

    result_data = messages.get(result, messages["unverified"])
    result_data["disclaimer"] = (
        "MediSure AI is a prototype verification-assistance system. "
        "Results are not a substitute for professional medical advice, "
        "pharmaceutical authentication, regulatory verification, or laboratory testing. "
        "Do not change or stop prescribed medication based solely on this result."
    )
    return result_data
