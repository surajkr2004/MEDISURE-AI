from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Medicine Schemas ──────────────────────────────────────────────────────────

class ManufacturerOut(BaseModel):
    id: int
    name: str
    registration_number: Optional[str] = None
    country: Optional[str] = None
    is_verified: bool

    class Config:
        from_attributes = True


class BatchOut(BaseModel):
    id: int
    batch_number: str
    manufacturing_date: Optional[str] = None
    expiry_date: str
    status: str
    scan_count: int

    class Config:
        from_attributes = True


class MedicineOut(BaseModel):
    id: int
    medicine_name: str
    generic_name: Optional[str] = None
    strength: Optional[str] = None
    dosage_form: Optional[str] = None
    product_id: str
    description: Optional[str] = None
    category: Optional[str] = None
    status: str
    manufacturer: Optional[ManufacturerOut] = None

    class Config:
        from_attributes = True


class MedicineCreate(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    strength: Optional[str] = None
    dosage_form: Optional[str] = None
    manufacturer_id: int
    product_id: str
    description: Optional[str] = None
    category: Optional[str] = None
    status: str = "active"


class BatchCreate(BaseModel):
    medicine_id: int
    batch_number: str
    manufacturing_date: Optional[str] = None
    expiry_date: str
    quantity_produced: Optional[int] = None
    verification_token: Optional[str] = None


class ManufacturerCreate(BaseModel):
    name: str
    registration_number: Optional[str] = None
    country: Optional[str] = None
    contact_email: Optional[str] = None


# ─── Verification Schemas ──────────────────────────────────────────────────────

class QRScanRequest(BaseModel):
    qr_data: str


class VerificationLayer(BaseModel):
    name: str
    status: str  # pass / fail / warning / skip
    detail: str
    icon: Optional[str] = None


class OCRExtractedData(BaseModel):
    raw_text: Optional[str] = None
    medicine_name: Optional[str] = None
    generic_name: Optional[str] = None
    manufacturer: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    mrp: Optional[str] = None
    strength: Optional[str] = None
    ocr_confidence: Optional[float] = None
    match_status: Optional[str] = None
    engine_used: Optional[str] = None


class AIAnalysisResult(BaseModel):
    confidence: float
    status: str  # low_risk / medium_risk / high_risk
    issues: List[str]
    positive_indicators: List[str]
    tamper_detected: bool
    note: str
    blur_score: Optional[float] = None
    is_blurry: Optional[bool] = False
    edge_density: Optional[float] = None
    ocr_data: Optional[OCRExtractedData] = None
    models_active: Optional[List[str]] = None


class VerificationResult(BaseModel):
    verification_id: int
    result: str  # verified / suspicious / unverified / expired
    risk_score: float
    risk_level: str  # low / medium / high
    medicine: Optional[MedicineOut] = None
    batch: Optional[BatchOut] = None
    layers: List[VerificationLayer]
    ai_analysis: Optional[AIAnalysisResult] = None
    scan_timestamp: datetime
    message: str
    recommendation: str
    disclaimer: str


class ImageAnalysisRequest(BaseModel):
    verification_id: Optional[int] = None
    medicine_id: Optional[int] = None


# ─── History / Record Schemas ──────────────────────────────────────────────────

class VerificationRecordOut(BaseModel):
    id: int
    medicine_id: Optional[int] = None
    batch_id: Optional[int] = None
    qr_data: Optional[str] = None
    scan_timestamp: datetime
    result: str
    risk_score: float
    risk_level: str
    qr_status: Optional[str] = None
    ai_status: Optional[str] = None
    ai_confidence: Optional[float] = None
    medicine: Optional[MedicineOut] = None
    batch: Optional[BatchOut] = None

    class Config:
        from_attributes = True


# ─── Report Schemas ────────────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    medicine_name: Optional[str] = None
    manufacturer_name: Optional[str] = None
    batch_number: Optional[str] = None
    qr_code_data: Optional[str] = None
    pharmacy_source: Optional[str] = None
    reason: str
    purchase_date: Optional[str] = None
    is_anonymous: bool = False


class ReportOut(BaseModel):
    id: int
    report_ref: str
    medicine_name: Optional[str] = None
    manufacturer_name: Optional[str] = None
    batch_number: Optional[str] = None
    reason: str
    status: str
    is_anonymous: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Dashboard Schemas ─────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_scans: int
    verified: int
    suspicious: int
    expired: int
    unverified: int
    recent_scans: List[VerificationRecordOut]


class AdminDashboardStats(BaseModel):
    total_scans: int
    verified: int
    suspicious: int
    expired: int
    unverified: int
    total_medicines: int
    total_manufacturers: int
    total_reports: int
    pending_reports: int
    recent_scans: List[VerificationRecordOut]
    monthly_trends: List[Any]
    risk_distribution: Any
    top_flagged: List[Any]
