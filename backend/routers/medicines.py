from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Medicine, Manufacturer, Batch, get_db
from schemas import MedicineOut, MedicineCreate, BatchCreate, ManufacturerCreate, ManufacturerOut, BatchOut
from routers.auth import get_current_user, get_admin_user
from models import User

router = APIRouter(prefix="/api/medicines", tags=["medicines"])


@router.get("/", response_model=List[MedicineOut])
def list_medicines(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None
):
    query = db.query(Medicine)
    if search:
        query = query.filter(Medicine.medicine_name.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{medicine_id}", response_model=MedicineOut)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found.")
    return med


@router.post("/", response_model=MedicineOut)
def create_medicine(
    data: MedicineCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    existing = db.query(Medicine).filter(Medicine.product_id == data.product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists.")
    med = Medicine(**data.model_dump())
    db.add(med)
    db.commit()
    db.refresh(med)
    return med


@router.put("/{medicine_id}", response_model=MedicineOut)
def update_medicine(
    medicine_id: int,
    data: MedicineCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found.")
    for key, val in data.model_dump().items():
        setattr(med, key, val)
    db.commit()
    db.refresh(med)
    return med


# ── Batches ───────────────────────────────────────────────────────────────────

@router.get("/{medicine_id}/batches", response_model=List[BatchOut])
def list_batches(medicine_id: int, db: Session = Depends(get_db)):
    return db.query(Batch).filter(Batch.medicine_id == medicine_id).all()


@router.post("/batches/", response_model=BatchOut)
def create_batch(
    data: BatchCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    batch = Batch(**data.model_dump())
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


# ── Manufacturers ─────────────────────────────────────────────────────────────

@router.get("/manufacturers/all", response_model=List[ManufacturerOut])
def list_manufacturers(db: Session = Depends(get_db)):
    return db.query(Manufacturer).all()


@router.post("/manufacturers/", response_model=ManufacturerOut)
def create_manufacturer(
    data: ManufacturerCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    mfg = Manufacturer(**data.model_dump())
    db.add(mfg)
    db.commit()
    db.refresh(mfg)
    return mfg
