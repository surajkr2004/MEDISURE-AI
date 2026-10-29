from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import VerificationRecord, Medicine, Manufacturer, Batch, Report, User, get_db
from schemas import DashboardStats, AdminDashboardStats
from routers.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/user", response_model=DashboardStats)
def user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(VerificationRecord).filter(
        VerificationRecord.user_id == current_user.id
    ).order_by(VerificationRecord.scan_timestamp.desc()).all()

    total = len(records)
    verified = sum(1 for r in records if r.result == "verified")
    suspicious = sum(1 for r in records if r.result == "suspicious")
    expired = sum(1 for r in records if r.result == "expired")
    unverified = sum(1 for r in records if r.result == "unverified")
    recent = records[:10]

    return DashboardStats(
        total_scans=total,
        verified=verified,
        suspicious=suspicious,
        expired=expired,
        unverified=unverified,
        recent_scans=recent
    )


@router.get("/admin", response_model=AdminDashboardStats)
def admin_dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    all_records = db.query(VerificationRecord).order_by(
        VerificationRecord.scan_timestamp.desc()
    ).all()

    total = len(all_records)
    verified = sum(1 for r in all_records if r.result == "verified")
    suspicious = sum(1 for r in all_records if r.result == "suspicious")
    expired = sum(1 for r in all_records if r.result == "expired")
    unverified = sum(1 for r in all_records if r.result == "unverified")

    total_medicines = db.query(Medicine).count()
    total_manufacturers = db.query(Manufacturer).count()
    total_reports = db.query(Report).count()
    pending_reports = db.query(Report).filter(Report.status == "pending").count()

    # Monthly trends (last 6 months — use demo data for prototype)
    monthly_trends = _generate_monthly_trends(all_records)

    # Risk distribution
    risk_dist = {
        "low": sum(1 for r in all_records if r.risk_level == "low"),
        "medium": sum(1 for r in all_records if r.risk_level == "medium"),
        "high": sum(1 for r in all_records if r.risk_level == "high"),
    }

    # Top flagged medicines
    top_flagged = _get_top_flagged(db)

    return AdminDashboardStats(
        total_scans=total,
        verified=verified,
        suspicious=suspicious,
        expired=expired,
        unverified=unverified,
        total_medicines=total_medicines,
        total_manufacturers=total_manufacturers,
        total_reports=total_reports,
        pending_reports=pending_reports,
        recent_scans=all_records[:10],
        monthly_trends=monthly_trends,
        risk_distribution=risk_dist,
        top_flagged=top_flagged
    )


def _generate_monthly_trends(records: list) -> list:
    now = datetime.utcnow()
    months = []
    for i in range(5, -1, -1):
        month_start = (now - timedelta(days=30 * i)).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        month_end = (month_start + timedelta(days=32)).replace(day=1)
        label = month_start.strftime("%b")
        month_records = [
            r for r in records
            if month_start <= r.scan_timestamp < month_end
        ]
        months.append({
            "month": label,
            "total": len(month_records),
            "verified": sum(1 for r in month_records if r.result == "verified"),
            "suspicious": sum(1 for r in month_records if r.result == "suspicious"),
            "unverified": sum(1 for r in month_records if r.result == "unverified"),
            "expired": sum(1 for r in month_records if r.result == "expired"),
        })
    return months


def _get_top_flagged(db: Session) -> list:
    results = (
        db.query(
            Medicine.medicine_name,
            func.count(VerificationRecord.id).label("suspicious_count")
        )
        .join(VerificationRecord, VerificationRecord.medicine_id == Medicine.id)
        .filter(VerificationRecord.result.in_(["suspicious", "unverified", "expired"]))
        .group_by(Medicine.id)
        .order_by(func.count(VerificationRecord.id).desc())
        .limit(5)
        .all()
    )
    return [{"medicine": r[0], "count": r[1]} for r in results]
