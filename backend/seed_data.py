"""
MediSure AI — Authentic Indian Pharmaceutical Database Seeder
Features authentic CDSCO Form 25 / IP formulation records.
Manufacturers: Micro Labs, GSK, Alkem, Glenmark, Alembic, Torrent, Aristo, USV, Cipla, Sun Pharma.
Formulations: Dolo 650, Augmentin 625 Duo, Pan-D, Telma 40, Azithral 500, Shelcal 500, Monocef 1g, Glycomet 500 PR, Ciplox 500, Volini Gel.
"""
from models import Base, User, Manufacturer, Medicine, Batch, VerificationRecord
from database import engine, SessionLocal
from passlib.context import CryptContext
from datetime import datetime, timedelta
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing if re-seeding
    db.query(VerificationRecord).delete()
    db.query(Batch).delete()
    db.query(Medicine).delete()
    db.query(Manufacturer).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding database with authentic Indian pharmaceutical data...")

    # ── 1. Users ──────────────────────────────────────────────────────────────
    users = [
        User(
            name="Dr. Ramesh Sharma",
            email="admin@medisure.ai",
            password_hash=pwd_context.hash("Admin@123"),
            role="admin"
        ),
        User(
            name="Dr. Priya Nair",
            email="compliance@microlabs.in",
            password_hash=pwd_context.hash("Manufacturer@123"),
            role="manufacturer"
        ),
        User(
            name="Aarav Mehta",
            email="user@medisure.ai",
            password_hash=pwd_context.hash("User@123"),
            role="user"
        ),
    ]
    db.add_all(users)
    db.flush()

    # ── 2. Real Indian Manufacturers ───────────────────────────────────────────
    manufacturers = [
        Manufacturer(
            name="Micro Labs Limited",
            registration_number="CIN-U24232KA1973PLC002401 (Licence KTK-25/482)",
            country="India",
            contact_email="compliance@microlabs.in",
            is_verified=True
        ),
        Manufacturer(
            name="GlaxoSmithKline Pharmaceuticals Ltd.",
            registration_number="CIN-L24239MH1924PLC001151 (Licence MH-NSK-25/891)",
            country="India",
            contact_email="medinfo.india@gsk.com",
            is_verified=True
        ),
        Manufacturer(
            name="Alkem Laboratories Ltd.",
            registration_number="CIN-L00305MH1973PLC174201 (Licence HP-25-1049)",
            country="India",
            contact_email="quality@alkem.com",
            is_verified=True
        ),
        Manufacturer(
            name="Glenmark Pharmaceuticals Ltd.",
            registration_number="CIN-L24299MH1977PLC019982 (Licence HP-25-832)",
            country="India",
            contact_email="compliance@glenmarkpharma.com",
            is_verified=True
        ),
        Manufacturer(
            name="Alembic Pharmaceuticals Ltd.",
            registration_number="CIN-L24230GJ2010PLC061123 (Licence G-25-711)",
            country="India",
            contact_email="regulatory@alembic.co.in",
            is_verified=True
        ),
        Manufacturer(
            name="Torrent Pharmaceuticals Ltd.",
            registration_number="CIN-L24230GJ1972PLC002126 (Licence G-25-1018)",
            country="India",
            contact_email="qa@torrentpharma.com",
            is_verified=True
        ),
        Manufacturer(
            name="Aristo Pharmaceuticals Pvt. Ltd.",
            registration_number="CIN-U24239MH1971PTC015425 (Licence MP-25-619)",
            country="India",
            contact_email="regulatory@aristopharma.org",
            is_verified=True
        ),
        Manufacturer(
            name="USV Private Limited",
            registration_number="CIN-U24230MH1961PTC012161 (Licence DD-25-302)",
            country="India",
            contact_email="compliance@usvindia.com",
            is_verified=True
        ),
        Manufacturer(
            name="Cipla Limited",
            registration_number="CIN-L24239MH1935PLC002380 (Licence MH-PUN-28/311)",
            country="India",
            contact_email="regulatory@cipla.com",
            is_verified=True
        ),
        Manufacturer(
            name="Sun Pharmaceutical Industries Ltd.",
            registration_number="CIN-L24230GJ1993PLC019050 (Licence G-25-881)",
            country="India",
            contact_email="regulatory.india@sunpharma.com",
            is_verified=True
        )
    ]
    db.add_all(manufacturers)
    db.flush()

    (mfg_micro, mfg_gsk, mfg_alkem, mfg_glenmark, mfg_alembic,
     mfg_torrent, mfg_aristo, mfg_usv, mfg_cipla, mfg_sun) = manufacturers

    # ── 3. Real Indian Medicines ───────────────────────────────────────────────
    medicines = [
        # 1. Dolo 650 (Micro Labs)
        Medicine(
            medicine_name="Dolo 650",
            generic_name="Paracetamol IP 650mg",
            strength="650 mg",
            dosage_form="Tablet",
            manufacturer_id=mfg_micro.id,
            product_id="DOLO650",
            description="Antipyretic and analgesic tablet indicated for fast relief of fever, headache, and body aches.",
            category="Analgesic & Antipyretic",
            status="active"
        ),
        # 2. Augmentin 625 Duo (GSK)
        Medicine(
            medicine_name="Augmentin 625 Duo",
            generic_name="Amoxicillin and Potassium Clavulanate Tablets IP",
            strength="625 mg (500mg + 125mg)",
            dosage_form="Film-Coated Tablet",
            manufacturer_id=mfg_gsk.id,
            product_id="AUG625DUO",
            description="Broad-spectrum antibacterial formulation indicated for respiratory, urinary tract, and soft tissue infections.",
            category="Broad-Spectrum Penicillin Antibiotic",
            status="active"
        ),
        # 3. Pan-D Capsules (Alkem)
        Medicine(
            medicine_name="Pan-D Capsules",
            generic_name="Pantoprazole and Domperidone Prolonged-release Capsules IP",
            strength="40 mg + 30 mg",
            dosage_form="Capsule",
            manufacturer_id=mfg_alkem.id,
            product_id="PAND001",
            description="Proton pump inhibitor combined with prokinetic domperidone for GERD, dyspepsia, and acid reflux.",
            category="Gastrointestinal / Antacid & Antiemetic",
            status="active"
        ),
        # 4. Telma 40 (Glenmark)
        Medicine(
            medicine_name="Telma 40",
            generic_name="Telmisartan Tablets IP 40mg",
            strength="40 mg",
            dosage_form="Tablet",
            manufacturer_id=mfg_glenmark.id,
            product_id="TELMA40",
            description="Angiotensin II receptor blocker (ARB) indicated for essential hypertension and cardiovascular risk reduction.",
            category="Cardiovascular / Antihypertensive",
            status="active"
        ),
        # 5. Azithral 500 (Alembic)
        Medicine(
            medicine_name="Azithral 500",
            generic_name="Azithromycin Tablets IP 500mg",
            strength="500 mg",
            dosage_form="Film-Coated Tablet",
            manufacturer_id=mfg_alembic.id,
            product_id="AZITH500",
            description="Macrolide antibiotic active against respiratory tract infections, otitis media, and skin infections.",
            category="Macrolide Antibiotic",
            status="active"
        ),
        # 6. Shelcal 500 (Torrent)
        Medicine(
            medicine_name="Shelcal 500",
            generic_name="Calcium and Vitamin D3 Tablets IP",
            strength="500 mg + 250 IU",
            dosage_form="Film-Coated Tablet",
            manufacturer_id=mfg_torrent.id,
            product_id="SHELCAL500",
            description="Essential mineral supplement indicated for osteoporosis prevention, calcium deficiency, and healthy bone matrix.",
            category="Bone Health / Mineral Supplement",
            status="active"
        ),
        # 7. Monocef 1g Injection (Aristo)
        Medicine(
            medicine_name="Monocef 1g Injection",
            generic_name="Ceftriaxone Injection IP 1g",
            strength="1000 mg (1 g)",
            dosage_form="Powder for Injection (Vial)",
            manufacturer_id=mfg_aristo.id,
            product_id="MONOCEF1G",
            description="Third-generation cephalosporin antibiotic indicated for severe bacterial infections and surgical prophylaxis.",
            category="Third-Generation Cephalosporin Antibiotic",
            status="active"
        ),
        # 8. Glycomet 500 PR (USV)
        Medicine(
            medicine_name="Glycomet 500 PR",
            generic_name="Metformin Hydrochloride Prolonged-release Tablets IP",
            strength="500 mg",
            dosage_form="Prolonged-Release Tablet",
            manufacturer_id=mfg_usv.id,
            product_id="GLYCOM500",
            description="First-line biguanide antidiabetic formulation for glycemic control in Type 2 Diabetes Mellitus.",
            category="Antidiabetic / Biguanide",
            status="active"
        ),
        # 9. Ciplox 500 (Cipla)
        Medicine(
            medicine_name="Ciplox 500",
            generic_name="Ciprofloxacin Tablets IP 500mg",
            strength="500 mg",
            dosage_form="Film-Coated Tablet",
            manufacturer_id=mfg_cipla.id,
            product_id="CIPLOX500",
            description="Broad-spectrum fluoroquinolone antibiotic targeting complicated UTIs, bone, and gastrointestinal infections.",
            category="Fluoroquinolone Antibiotic",
            status="active"
        ),
        # 10. Volini Pain Relief Gel (Sun Pharma)
        Medicine(
            medicine_name="Volini Pain Relief Gel",
            generic_name="Diclofenac Diethylamine Gel",
            strength="50 g Tube",
            dosage_form="Topical Gel",
            manufacturer_id=mfg_sun.id,
            product_id="VOLINI050",
            description="Topical anti-inflammatory formulation for relief of joint aches, muscle sprains, and back pain.",
            category="Topical Analgesic & Anti-inflammatory",
            status="active"
        )
    ]
    db.add_all(medicines)
    db.flush()

    (med_dolo, med_aug, med_pand, med_telma, med_azith,
     med_shelc, med_monoc, med_glycom, med_ciplox, med_volini) = medicines

    # ── 4. Batches Covering Key Verification States ───────────────────────────
    batches = [
        # Scenario 1: Genuine Dolo 650 (Micro Labs)
        Batch(
            medicine_id=med_dolo.id,
            batch_number="DOLO650-B25081",
            manufacturing_date="08/2025",
            expiry_date="07/2027",
            quantity_produced=150000,
            verification_token="MSAI-VT-DOLO650-B25081-SECURE",
            scan_count=2,
            status="active"
        ),
        # Scenario 2: Genuine Augmentin 625 Duo (GSK)
        Batch(
            medicine_id=med_aug.id,
            batch_number="AUG625-CL2409",
            manufacturing_date="09/2024",
            expiry_date="11/2026",
            quantity_produced=80000,
            verification_token="MSAI-VT-AUG625-CL2409-SECURE",
            scan_count=1,
            status="active"
        ),
        # Scenario 3: Expired Batch — Pan-D Capsules (Alkem)
        Batch(
            medicine_id=med_pand.id,
            batch_number="PAND-24E091",
            manufacturing_date="06/2022",
            expiry_date="05/2024",
            quantity_produced=45000,
            verification_token="MSAI-VT-PAND-24E091-EXPIRED",
            scan_count=7,
            status="expired"
        ),
        # Scenario 4: Recalled Batch — Telma 40 (Glenmark)
        Batch(
            medicine_id=med_telma.id,
            batch_number="TELMA-REC26",
            manufacturing_date="11/2024",
            expiry_date="10/2026",
            quantity_produced=60000,
            verification_token="MSAI-VT-TELMA-REC26-RECALL",
            scan_count=29,
            status="recalled"
        ),
        # Scenario 5: Packaging Anomaly — Azithral 500 (Alembic)
        Batch(
            medicine_id=med_azith.id,
            batch_number="AZITH-ANOM2",
            manufacturing_date="04/2025",
            expiry_date="03/2027",
            quantity_produced=35000,
            verification_token="MSAI-VT-AZITH-ANOM2-FLAG",
            scan_count=1,
            status="active"
        ),
        # Scenario 6: Cloned Replay Attack — Shelcal 500 (Torrent)
        Batch(
            medicine_id=med_shelc.id,
            batch_number="SHELCAL-REP01",
            manufacturing_date="07/2025",
            expiry_date="06/2027",
            quantity_produced=90000,
            verification_token="MSAI-VT-SHELCAL-REP01-REPLAY",
            scan_count=184,  # Flagged replay attack
            status="active"
        ),
        # Scenario 7: Active Monocef 1g (Aristo)
        Batch(
            medicine_id=med_monoc.id,
            batch_number="MONOC1-25G12",
            manufacturing_date="07/2025",
            expiry_date="06/2027",
            quantity_produced=40000,
            verification_token="MSAI-VT-MONOC1-25G12-SECURE",
            scan_count=0,
            status="active"
        ),
        # Scenario 8: Active Glycomet 500 (USV)
        Batch(
            medicine_id=med_glycom.id,
            batch_number="GLY500-25H03",
            manufacturing_date="08/2025",
            expiry_date="07/2028",
            quantity_produced=120000,
            verification_token="MSAI-VT-GLY500-25H03-SECURE",
            scan_count=0,
            status="active"
        ),
        # Scenario 9: Active Ciplox 500 (Cipla)
        Batch(
            medicine_id=med_ciplox.id,
            batch_number="CIP500-25K19",
            manufacturing_date="10/2025",
            expiry_date="09/2028",
            quantity_produced=75000,
            verification_token="MSAI-VT-CIP500-25K19-SECURE",
            scan_count=3,
            status="active"
        ),
        # Scenario 10: Active Volini Gel (Sun Pharma)
        Batch(
            medicine_id=med_volini.id,
            batch_number="VOL050-25J44",
            manufacturing_date="09/2025",
            expiry_date="08/2027",
            quantity_produced=50000,
            verification_token="MSAI-VT-VOL050-25J44-SECURE",
            scan_count=0,
            status="active"
        )
    ]
    db.add_all(batches)
    db.flush()

    # ── 5. Sample Verification Records for Audit Log ───────────────────────────
    sample_records = [
        VerificationRecord(
            user_id=users[2].id,
            medicine_id=med_dolo.id,
            batch_id=batches[0].id,
            qr_data='{"product_id":"DOLO650","batch":"DOLO650-B25081","token":"MSAI-VT-DOLO650-B25081-SECURE"}',
            scan_timestamp=datetime.utcnow() - timedelta(hours=2),
            result="verified",
            risk_score=4.0,
            risk_level="low",
            qr_status="valid",
            ai_status="low_risk",
            ai_confidence=97.0
        ),
        VerificationRecord(
            user_id=users[2].id,
            medicine_id=med_aug.id,
            batch_id=batches[1].id,
            qr_data='{"product_id":"AUG625DUO","batch":"AUG625-CL2409","token":"MSAI-VT-AUG625-CL2409-SECURE"}',
            scan_timestamp=datetime.utcnow() - timedelta(hours=5),
            result="verified",
            risk_score=6.0,
            risk_level="low",
            qr_status="valid",
            ai_status="low_risk",
            ai_confidence=95.0
        ),
        VerificationRecord(
            user_id=users[2].id,
            medicine_id=med_pand.id,
            batch_id=batches[2].id,
            qr_data='{"product_id":"PAND001","batch":"PAND-24E091","token":"MSAI-VT-PAND-24E091-EXPIRED"}',
            scan_timestamp=datetime.utcnow() - timedelta(days=1),
            result="expired",
            risk_score=78.0,
            risk_level="high",
            qr_status="valid",
            ai_status="medium_risk",
            ai_confidence=82.0
        ),
        VerificationRecord(
            user_id=users[2].id,
            medicine_id=med_telma.id,
            batch_id=batches[3].id,
            qr_data='{"product_id":"TELMA40","batch":"TELMA-REC26","token":"MSAI-VT-TELMA-REC26-RECALL"}',
            scan_timestamp=datetime.utcnow() - timedelta(days=2),
            result="recalled",
            risk_score=92.0,
            risk_level="high",
            qr_status="flagged",
            ai_status="medium_risk",
            ai_confidence=89.0
        ),
        VerificationRecord(
            user_id=users[2].id,
            medicine_id=med_shelc.id,
            batch_id=batches[5].id,
            qr_data='{"product_id":"SHELCAL500","batch":"SHELCAL-REP01","token":"MSAI-VT-SHELCAL-REP01-REPLAY"}',
            scan_timestamp=datetime.utcnow() - timedelta(days=3),
            result="suspicious",
            risk_score=72.0,
            risk_level="high",
            qr_status="replay_detected",
            ai_status="high_risk",
            ai_confidence=74.0
        ),
    ]
    db.add_all(sample_records)

    db.commit()
    db.close()
    print("[OK] Real Indian Pharmaceutical Database seeded successfully!")
    print("\nAvailable real medicines seeded:")
    print("  1. Dolo 650 (Micro Labs) - DOLO650")
    print("  2. Augmentin 625 Duo (GSK) - AUG625DUO")
    print("  3. Pan-D Capsules (Alkem) - PAND001")
    print("  4. Telma 40 (Glenmark) - TELMA40")
    print("  5. Azithral 500 (Alembic) - AZITH500")
    print("  6. Shelcal 500 (Torrent) - SHELCAL500")
    print("  7. Monocef 1g (Aristo) - MONOCEF1G")
    print("  8. Glycomet 500 PR (USV) - GLYCOM500")
    print("  9. Ciplox 500 (Cipla) - CIPLOX500")
    print(" 10. Volini Gel (Sun Pharma) - VOLINI050")


if __name__ == "__main__":
    seed()
