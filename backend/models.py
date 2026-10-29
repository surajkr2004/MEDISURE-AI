from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

SQLALCHEMY_DATABASE_URL = "sqlite:///./medisure.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class VerificationStatus(str, enum.Enum):
    verified = "verified"
    suspicious = "suspicious"
    unverified = "unverified"
    expired = "expired"


class RiskLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class MedicineStatus(str, enum.Enum):
    active = "active"
    recalled = "recalled"
    discontinued = "discontinued"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    verifications = relationship("VerificationRecord", back_populates="user")
    reports = relationship("Report", back_populates="user")


class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    registration_number = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    contact_email = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    medicines = relationship("Medicine", back_populates="manufacturer")


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    medicine_name = Column(String(200), nullable=False)
    generic_name = Column(String(200), nullable=True)
    strength = Column(String(100), nullable=True)
    dosage_form = Column(String(100), nullable=True)
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"))
    product_id = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    status = Column(String(30), default="active")
    reference_image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    manufacturer = relationship("Manufacturer", back_populates="medicines")
    batches = relationship("Batch", back_populates="medicine")
    verifications = relationship("VerificationRecord", back_populates="medicine")
    reports = relationship("Report", back_populates="medicine")


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    batch_number = Column(String(100), nullable=False)
    manufacturing_date = Column(String(20), nullable=True)
    expiry_date = Column(String(20), nullable=False)
    quantity_produced = Column(Integer, nullable=True)
    verification_token = Column(String(255), unique=True, nullable=True)
    scan_count = Column(Integer, default=0)
    status = Column(String(30), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    medicine = relationship("Medicine", back_populates="batches")
    verifications = relationship("VerificationRecord", back_populates="batch")


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    qr_data = Column(Text, nullable=True)
    scan_timestamp = Column(DateTime, default=datetime.utcnow)
    result = Column(String(30), nullable=False)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="low")
    qr_status = Column(String(50), nullable=True)
    ai_status = Column(String(50), nullable=True)
    ai_confidence = Column(Float, nullable=True)
    layers_data = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="verifications")
    medicine = relationship("Medicine", back_populates="verifications")
    batch = relationship("Batch", back_populates="verifications")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_ref = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=True)
    medicine_name = Column(String(200), nullable=True)
    manufacturer_name = Column(String(200), nullable=True)
    batch_number = Column(String(100), nullable=True)
    qr_code_data = Column(Text, nullable=True)
    pharmacy_source = Column(String(200), nullable=True)
    reason = Column(Text, nullable=False)
    purchase_date = Column(String(20), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(30), default="pending")
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")
    medicine = relationship("Medicine", back_populates="reports")
