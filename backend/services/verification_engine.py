"""
Verification Engine — Multi-layer verification logic for MediSure AI.
Combines QR validation, database lookup, expiry check, batch validation,
manufacturer verification, duplicate/replay detection.
"""
import json
from datetime import datetime, date
from typing import Optional, Tuple, List, Dict, Any
from sqlalchemy.orm import Session
from models import Medicine, Batch, Manufacturer, VerificationRecord
from schemas import VerificationLayer


def parse_qr_data(qr_raw: str) -> Tuple[bool, Dict[str, Any], str]:
    """
    Layer 1: Validate QR format.
    Expected QR JSON: { "product_id": "...", "batch": "...", "token": "..." }
    Returns (is_valid, parsed_data, error_msg)
    """
    try:
        data = json.loads(qr_raw)
        required_fields = ["product_id"]
        for field in required_fields:
            if field not in data:
                return False, {}, f"QR code is missing required field: '{field}'"
        return True, data, ""
    except json.JSONDecodeError:
        # Try treating it as a plain product_id string
        if qr_raw.strip() and len(qr_raw.strip()) < 200:
            return True, {"product_id": qr_raw.strip()}, ""
        return False, {}, "QR code format is invalid or unreadable."


def check_database_match(
    db: Session, product_id: str, batch_number: Optional[str] = None
) -> Tuple[Optional[Medicine], Optional[Batch], str]:
    """
    Layer 2: Database lookup for medicine and batch.
    Returns (medicine, batch, status_message)
    """
    medicine = db.query(Medicine).filter(Medicine.product_id == product_id).first()
    if not medicine:
        return None, None, "Product not found in database."

    batch = None
    if batch_number:
        batch = db.query(Batch).filter(
            Batch.medicine_id == medicine.id,
            Batch.batch_number == batch_number
        ).first()
        if not batch:
            return medicine, None, "Batch number not found for this product."

    return medicine, batch, "Product found in database."


def check_expiry(expiry_date_str: str) -> Tuple[bool, bool, str]:
    """
    Layer 3: Expiry check.
    Returns (is_valid, is_near_expiry, message)
    """
    try:
        parts = expiry_date_str.strip().split("/")
        if len(parts) == 2:
            month, year = int(parts[0]), int(parts[1])
            # Use last day of expiry month
            if month == 12:
                exp_date = date(year, 12, 31)
            else:
                exp_date = date(year, month + 1, 1)
        else:
            return False, False, "Invalid expiry date format."

        today = date.today()
        days_until_expiry = (exp_date - today).days

        if days_until_expiry < 0:
            return False, False, f"Medicine expired on {expiry_date_str}."
        elif days_until_expiry < 90:
            return True, True, f"Medicine expires on {expiry_date_str} — expiring soon ({days_until_expiry} days)."
        else:
            return True, False, f"Medicine is within validity period. Expires: {expiry_date_str}."
    except Exception:
        return False, False, "Could not parse expiry date."


def check_batch_status(batch: Batch) -> Tuple[bool, str]:
    """
    Layer 4: Batch status validation.
    """
    if batch.status == "active":
        return True, f"Batch {batch.batch_number} is active and valid."
    elif batch.status == "recalled":
        return False, f"⚠️ Batch {batch.batch_number} has been recalled."
    elif batch.status == "discontinued":
        return False, f"Batch {batch.batch_number} has been discontinued."
    else:
        return False, f"Batch status is unknown: {batch.status}."


def check_manufacturer(medicine: Medicine, db: Session) -> Tuple[bool, str]:
    """
    Layer 5: Manufacturer verification.
    """
    manufacturer = db.query(Manufacturer).filter(
        Manufacturer.id == medicine.manufacturer_id
    ).first()
    if not manufacturer:
        return False, "Manufacturer information not found in database."
    if not manufacturer.is_verified:
        return False, f"Manufacturer '{manufacturer.name}' is not a verified entity."
    return True, f"Manufacturer verified: {manufacturer.name} ({manufacturer.country})."


def check_replay_detection(batch: Batch, db: Session) -> Tuple[bool, str]:
    """
    Layer 6: Duplicate/replay detection based on scan_count.
    """
    SUSPICIOUS_THRESHOLD = 30

    if batch.scan_count > SUSPICIOUS_THRESHOLD:
        return False, (
            f"This verification token has been scanned {batch.scan_count} times, "
            f"which is unusually high. This may indicate suspicious activity."
        )
    elif batch.scan_count > 10:
        return True, (
            f"This token has been scanned {batch.scan_count} times. "
            f"Activity is elevated but within acceptable range."
        )
    return True, f"Verification token scan count: {batch.scan_count}. No unusual activity detected."


def run_verification_layers(
    db: Session,
    qr_raw: str,
    qr_data: Dict[str, Any],
    medicine: Optional[Medicine],
    batch: Optional[Batch],
) -> List[VerificationLayer]:
    """
    Run all verification layers and return structured results.
    """
    layers = []

    # Layer 1 — QR Format
    qr_valid, _, qr_err = parse_qr_data(qr_raw)
    layers.append(VerificationLayer(
        name="QR Code Validation",
        status="pass" if qr_valid else "fail",
        detail="QR code format is valid and parseable." if qr_valid else qr_err,
        icon="qr-code"
    ))

    if not medicine:
        layers.append(VerificationLayer(
            name="Database Lookup",
            status="fail",
            detail="Product not found in the trusted medicine database.",
            icon="database"
        ))
        return layers

    # Layer 2 — Database match
    layers.append(VerificationLayer(
        name="Database Lookup",
        status="pass",
        detail=f"Product '{medicine.medicine_name}' found in database.",
        icon="database"
    ))

    # Medicine status check
    if medicine.status == "recalled":
        layers.append(VerificationLayer(
            name="Product Status",
            status="fail",
            detail=f"⚠️ This product ({medicine.product_id}) has been recalled.",
            icon="shield-x"
        ))
    elif medicine.status == "discontinued":
        layers.append(VerificationLayer(
            name="Product Status",
            status="warning",
            detail="This product has been discontinued.",
            icon="shield-x"
        ))
    else:
        layers.append(VerificationLayer(
            name="Product Status",
            status="pass",
            detail=f"Product status: Active.",
            icon="shield-check"
        ))

    # Layer 3 — Expiry
    if batch:
        is_valid, is_near, exp_msg = check_expiry(batch.expiry_date)
        layers.append(VerificationLayer(
            name="Expiry Date Check",
            status="fail" if not is_valid else ("warning" if is_near else "pass"),
            detail=exp_msg,
            icon="calendar"
        ))

        # Layer 4 — Batch status
        batch_ok, batch_msg = check_batch_status(batch)
        layers.append(VerificationLayer(
            name="Batch Validation",
            status="pass" if batch_ok else "fail",
            detail=batch_msg,
            icon="package"
        ))

        # Layer 6 — Replay detection
        replay_ok, replay_msg = check_replay_detection(batch, db)
        layers.append(VerificationLayer(
            name="Duplicate Detection",
            status="pass" if replay_ok else "warning",
            detail=replay_msg,
            icon="activity"
        ))
    else:
        layers.append(VerificationLayer(
            name="Expiry Date Check",
            status="skip",
            detail="Batch information not provided; expiry check skipped.",
            icon="calendar"
        ))
        layers.append(VerificationLayer(
            name="Batch Validation",
            status="skip",
            detail="No batch number provided for validation.",
            icon="package"
        ))
        layers.append(VerificationLayer(
            name="Duplicate Detection",
            status="skip",
            detail="Token verification skipped — batch not identified.",
            icon="activity"
        ))

    # Layer 5 — Manufacturer
    mfg_ok, mfg_msg = check_manufacturer(medicine, db)
    layers.append(VerificationLayer(
        name="Manufacturer Verification",
        status="pass" if mfg_ok else "fail",
        detail=mfg_msg,
        icon="building"
    ))

    return layers
