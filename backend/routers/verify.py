import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from models import Medicine, Batch, VerificationRecord, User, get_db
from schemas import (
    QRScanRequest, VerificationResult, VerificationLayer,
    AIAnalysisResult, MedicineOut, BatchOut
)
from services.verification_engine import (
    parse_qr_data, check_database_match, check_expiry,
    run_verification_layers
)
from services.ai_analysis import (
    simulate_ai_analysis, get_ocr_simulation, run_ai_packaging_analysis
)
from services.risk_engine import (
    calculate_risk_score, determine_risk_level,
    determine_result, get_result_message
)
from routers.auth import get_current_user

router = APIRouter(prefix="/api/verify", tags=["verify"])


def _build_verification_result(
    db: Session,
    qr_raw: str,
    user: Optional[User] = None,
    force_ai_scenario: Optional[str] = None
) -> VerificationResult:
    # Layer 1: Parse QR
    qr_valid, qr_data, qr_err = parse_qr_data(qr_raw)

    if not qr_valid:
        # Save record and return immediately
        record = VerificationRecord(
            user_id=user.id if user else None,
            qr_data=qr_raw,
            result="unverified",
            risk_score=100.0,
            risk_level="high",
            qr_status="invalid"
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        msg = get_result_message("unverified", "high")
        return VerificationResult(
            verification_id=record.id,
            result="unverified",
            risk_score=100.0,
            risk_level="high",
            layers=[VerificationLayer(
                name="QR Code Validation",
                status="fail",
                detail=qr_err,
                icon="qr-code"
            )],
            ai_analysis=simulate_ai_analysis(product_id=None),
            scan_timestamp=record.scan_timestamp,
            message=msg["message"],
            recommendation=msg["recommendation"],
            disclaimer=msg["disclaimer"]
        )

    product_id = qr_data.get("product_id")
    batch_number = qr_data.get("batch")

    # Layers 2–6: DB + expiry + batch + manufacturer + replay
    medicine, batch, _ = check_database_match(db, product_id, batch_number)
    layers = run_verification_layers(db, qr_raw, qr_data, medicine, batch)

    # Check expiry flag for result determination
    batch_expired = False
    if batch:
        is_valid, _, _ = check_expiry(batch.expiry_date)
        batch_expired = not is_valid

    # Real AI Computer Vision & Anomaly Engine
    ai_result = run_ai_packaging_analysis(
        image_input=None,
        product_id=product_id,
        batch_number=batch_number,
        force_scenario=force_ai_scenario
    )

    # Risk engine
    med_status = medicine.status if medicine else None
    risk_score = calculate_risk_score(
        layers,
        ai_confidence=ai_result.confidence,
        ai_status=ai_result.status,
        medicine_status=med_status,
        batch_expired=batch_expired
    )
    risk_level = determine_risk_level(risk_score)
    result = determine_result(risk_score, layers, med_status, batch_expired)
    msg_data = get_result_message(result, risk_level)

    # Increment scan count
    if batch:
        batch.scan_count += 1
        db.commit()

    # Save verification record
    record = VerificationRecord(
        user_id=user.id if user else None,
        medicine_id=medicine.id if medicine else None,
        batch_id=batch.id if batch else None,
        qr_data=qr_raw,
        result=result,
        risk_score=risk_score,
        risk_level=risk_level,
        qr_status="valid" if qr_valid else "invalid",
        ai_status=ai_result.status,
        ai_confidence=ai_result.confidence,
        layers_data=json.dumps([l.model_dump() for l in layers])
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Add AI layer to displayed layers
    ai_layer = VerificationLayer(
        name="AI Packaging Analysis",
        status="pass" if ai_result.status == "low_risk" else (
            "warning" if ai_result.status == "medium_risk" else "fail"
        ),
        detail=f"Packaging similarity confidence: {ai_result.confidence}%. {ai_result.note[:80]}...",
        icon="cpu"
    )
    layers.append(ai_layer)

    return VerificationResult(
        verification_id=record.id,
        result=result,
        risk_score=risk_score,
        risk_level=risk_level,
        medicine=MedicineOut.model_validate(medicine) if medicine else None,
        batch=BatchOut.model_validate(batch) if batch else None,
        layers=layers,
        ai_analysis=ai_result,
        scan_timestamp=record.scan_timestamp,
        message=msg_data["message"],
        recommendation=msg_data["recommendation"],
        disclaimer=msg_data["disclaimer"]
    )


@router.post("/scan", response_model=VerificationResult)
def scan_qr(
    request: QRScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    return _build_verification_result(db, request.qr_data, current_user)


@router.post("/scan-guest", response_model=VerificationResult)
def scan_qr_guest(request: QRScanRequest, db: Session = Depends(get_db)):
    return _build_verification_result(db, request.qr_data, user=None)


@router.post("/demo/{scenario}", response_model=VerificationResult)
def demo_scan(scenario: str, db: Session = Depends(get_db)):
    """
    Demo mode: pre-configured scenarios for presentation.
    """
    scenario_qr_map = {
        "verified":  '{"product_id":"MC500001","batch":"MC500-A102","token":"MSAI-VT-MC500-A102-SECURE"}',
        "expired":   '{"product_id":"VB100002","batch":"VB100-E201","token":"MSAI-VT-VB100-E201-SECURE"}',
        "invalid":   '{"product_id":"FAKE-QR-NOTEXIST","batch":"XX-000"}',
        "mismatch":  '{"product_id":"CG100004","batch":"CG100-B999","token":"WRONG-TOKEN"}',
        "anomaly":   '{"product_id":"IP200005","batch":"IP200-N501","token":"MSAI-VT-IP200-N501-SECURE"}',
        "replay":    '{"product_id":"NC250006","batch":"NC250-S601","token":"MSAI-VT-NC250-S601-REPLAY"}',
    }

    qr_raw = scenario_qr_map.get(scenario)
    if not qr_raw:
        raise HTTPException(status_code=404, detail=f"Demo scenario '{scenario}' not found.")

    return _build_verification_result(db, qr_raw, user=None)


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    filter_result: Optional[str] = None,
    limit: int = 50
):
    query = db.query(VerificationRecord).filter(
        VerificationRecord.user_id == current_user.id
    )
    if filter_result:
        query = query.filter(VerificationRecord.result == filter_result)

    records = query.order_by(VerificationRecord.scan_timestamp.desc()).limit(limit).all()
    return records


@router.get("/record/{record_id}", response_model=VerificationResult)
def get_verification_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(VerificationRecord).filter(
        VerificationRecord.id == record_id,
        VerificationRecord.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Verification record not found.")

    medicine = db.query(Medicine).filter(Medicine.id == record.medicine_id).first() if record.medicine_id else None
    batch = db.query(Batch).filter(Batch.id == record.batch_id).first() if record.batch_id else None

    layers = json.loads(record.layers_data) if record.layers_data else []
    layers_obj = [VerificationLayer(**l) for l in layers]

    msg_data = get_result_message(record.result, record.risk_level)
    ai_result = simulate_ai_analysis(
        product_id=medicine.product_id if medicine else None
    )

    return VerificationResult(
        verification_id=record.id,
        result=record.result,
        risk_score=record.risk_score,
        risk_level=record.risk_level,
        medicine=MedicineOut.model_validate(medicine) if medicine else None,
        batch=BatchOut.model_validate(batch) if batch else None,
        layers=layers_obj,
        ai_analysis=ai_result,
        scan_timestamp=record.scan_timestamp,
        message=msg_data["message"],
        recommendation=msg_data["recommendation"],
        disclaimer=msg_data["disclaimer"]
    )


@router.post("/image", response_model=VerificationResult)
async def analyze_packaging_image(
    file: UploadFile = File(...),
    product_id: Optional[str] = Form(None),
    batch_number: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Real Computer Vision & OCR Analysis on uploaded medicine packaging image.
    Uses OpenCV for blur, edge, and color analysis;
    Scikit-learn IsolationForest for anomaly classification;
    and Tesseract/EasyOCR for medicine name, manufacturer, batch, and expiry extraction.
    """
    image_bytes = await file.read()
    ai_result = run_ai_packaging_analysis(
        image_input=image_bytes,
        product_id=product_id,
        batch_number=batch_number
    )

    # Resolve medicine & batch from OCR detection or hints
    target_pid = product_id or (ai_result.ocr_data.product_id if ai_result.ocr_data else None)
    medicine = None
    if target_pid:
        medicine = db.query(Medicine).filter(
            (Medicine.product_id == target_pid) | (Medicine.medicine_name.ilike(f"%{target_pid}%"))
        ).first()

    extracted_batch = batch_number or (ai_result.ocr_data.batch_number if ai_result.ocr_data else None)
    batch = None
    if extracted_batch:
        batch = db.query(Batch).filter(
            Batch.batch_number.ilike(f"%{extracted_batch}%")
        ).first()

    # Determine verification result
    if ai_result.ocr_data and ai_result.ocr_data.is_expired:
        result_type = "expired"
        risk_level = "high"
        risk_score = 85.0
    elif ai_result.status == "high_risk" or ai_result.tamper_detected:
        result_type = "suspicious"
        risk_level = "high"
        risk_score = round(100.0 - ai_result.confidence, 1)
    elif ai_result.status == "medium_risk":
        result_type = "suspicious"
        risk_level = "medium"
        risk_score = 65.0
    else:
        result_type = "verified"
        risk_level = "low"
        risk_score = round(100.0 - ai_result.confidence, 1)

    record = VerificationRecord(
        user_id=current_user.id if current_user else None,
        medicine_id=medicine.id if medicine else None,
        batch_id=batch.id if batch else None,
        qr_data=f"PHOTO_OCR_SCAN:{file.filename}",
        result=result_type,
        risk_score=risk_score,
        risk_level=risk_level,
        qr_status="image_extracted",
        ai_status=ai_result.status,
        ai_confidence=ai_result.confidence
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    layers = [
        VerificationLayer(
            name="OpenCV Visual Integrity & Blur Check",
            status="fail" if ai_result.is_blurry else "pass",
            detail=f"Laplacian Sharpness: {ai_result.blur_score} (Threshold: 70). Tamper Flag: {ai_result.tamper_detected}",
            icon="camera"
        ),
        VerificationLayer(
            name="Scikit-Learn IsolationForest Packaging Classifier",
            status="pass" if ai_result.status == "low_risk" else ("warning" if ai_result.status == "medium_risk" else "fail"),
            detail=f"Visual Authenticity Confidence: {ai_result.confidence}%. Edge Density: {ai_result.edge_density}",
            icon="cpu"
        )
    ]

    if ai_result.ocr_data and ai_result.ocr_data.raw_text:
        layers.append(
            VerificationLayer(
                name="Tesseract / EasyOCR Field Extraction",
                status="fail" if ai_result.ocr_data.match_status == "mismatch" else ("warning" if ai_result.ocr_data.match_status == "expired" else "pass"),
                detail=f"Brand: {ai_result.ocr_data.medicine_name or 'Detected'} | Batch: {ai_result.ocr_data.batch_number or 'N/A'} | Exp: {ai_result.ocr_data.expiry_date or 'N/A'}",
                icon="file-text"
            )
        )

    msg_data = get_result_message(result_type, risk_level)

    return VerificationResult(
        verification_id=record.id,
        result=result_type,
        risk_score=risk_score,
        risk_level=risk_level,
        medicine=MedicineOut.model_validate(medicine) if medicine else None,
        batch=BatchOut.model_validate(batch) if batch else None,
        layers=layers,
        ai_analysis=ai_result,
        scan_timestamp=record.scan_timestamp,
        message=msg_data["message"],
        recommendation=msg_data["recommendation"],
        disclaimer=msg_data["disclaimer"]
    )


@router.get("/ai-models")
def get_ai_models_status():
    """
    Returns active computer vision, machine learning, and OCR engine specifications.
    """
    import cv2
    import sklearn
    import torch
    from services.ocr_extractor import ocr_extractor

    ocr_engines = ["OpenCV-Conditioning", "Regex-CDSCO-Parser"]
    if ocr_extractor.has_tesseract_binary:
        ocr_engines.append("Tesseract-OCR-v5")
    try:
        import easyocr
        ocr_engines.append("EasyOCR-PyTorch")
    except ImportError:
        pass

    return {
        "status": "operational",
        "computer_vision": {
            "library": "OpenCV",
            "version": cv2.__version__,
            "modules": ["Laplacian Blur Detector", "Canny Edge Analyzer", "HSV Color Histogram", "Contour Geometry"]
        },
        "machine_learning": {
            "framework": "Scikit-Learn",
            "version": sklearn.__version__,
            "pytorch_version": torch.__version__,
            "algorithms": ["IsolationForest (Packaging Anomaly Detection)", "DecisionTree Feature Boundary"],
            "calibrated_features": 8
        },
        "ocr_pipeline": {
            "active_engines": ocr_engines,
            "tesseract_installed": ocr_extractor.has_tesseract_binary,
            "supported_fields": [
                "Brand Name", "Generic IP Name", "Manufacturer", "CDSCO Licence No",
                "Batch Number (B.No.)", "Manufacturing Date (MFD)", "Expiry Date (EXP)", "MRP (INR)"
            ]
        }
    }

