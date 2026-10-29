import random
import string
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from models import Report, Medicine, User, get_db
from schemas import ReportCreate, ReportOut
from routers.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


def generate_report_ref():
    year = datetime.utcnow().year
    suffix = ''.join(random.choices(string.digits, k=5))
    return f"MS-{year}-{suffix}"


@router.post("/", response_model=ReportOut)
def create_report(
    data: ReportCreate,
    db: Session = Depends(get_db)
):

    report = Report(
        report_ref=generate_report_ref(),
        user_id=None,
        medicine_name=data.medicine_name,
        manufacturer_name=data.manufacturer_name,
        batch_number=data.batch_number,
        qr_code_data=data.qr_code_data,
        pharmacy_source=data.pharmacy_source,
        reason=data.reason,
        purchase_date=data.purchase_date,
        is_anonymous=data.is_anonymous,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.post("/authenticated", response_model=ReportOut)
def create_report_authenticated(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = Report(
        report_ref=generate_report_ref(),
        user_id=current_user.id if not data.is_anonymous else None,
        medicine_name=data.medicine_name,
        manufacturer_name=data.manufacturer_name,
        batch_number=data.batch_number,
        qr_code_data=data.qr_code_data,
        pharmacy_source=data.pharmacy_source,
        reason=data.reason,
        purchase_date=data.purchase_date,
        is_anonymous=data.is_anonymous,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/my", response_model=List[ReportOut])
def my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Report).filter(Report.user_id == current_user.id).all()


@router.get("/", response_model=List[ReportOut])
def admin_list_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
    status_filter: Optional[str] = None
):
    query = db.query(Report)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    return query.order_by(Report.created_at.desc()).all()


@router.put("/{report_id}/status")
def update_report_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    report.status = status
    db.commit()
    return {"message": "Status updated.", "status": status}
