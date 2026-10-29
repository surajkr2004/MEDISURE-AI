"""
MediSure AI — FastAPI Backend
Prototype / Demonstration System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Base, engine
from routers import auth, verify, medicines, reports, dashboard
from seed_data import seed

# Create tables
Base.metadata.create_all(bind=engine)

# Seed demo data
seed()

app = FastAPI(
    title="MediSure AI API",
    description=(
        "MediSure AI — Prototype Medicine Verification System. "
        "DEMONSTRATION DATA ONLY. Not real pharmaceutical data."
    ),
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(verify.router)
app.include_router(medicines.router)
app.include_router(reports.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "app": "MediSure AI",
        "version": "1.0.0",
        "status": "running",
        "note": "Prototype demonstration system — not real pharmaceutical data",
        "docs": "/docs"
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": "2026"}
