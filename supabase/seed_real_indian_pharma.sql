-- ==============================================================================
-- MediSure AI — Standalone Real Indian Pharmaceutical Seed Script
-- Supabase Project: https://oawnsdvhbfufbonqkmdu.supabase.co
-- Standards: Central Drugs Standard Control Organisation (CDSCO), Indian Pharmacopoeia (IP)
-- Palette: Ice Silver (#DDE3E8), Deep Aubergine (#3A0F34), Marigold (#EAAA00)
-- Instructions: Run this SQL directly in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Profiles (Authentic Stakeholder Roles)
INSERT INTO profiles (id, email, full_name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@medisure.ai', 'Dr. Ramesh Sharma (Chief Admin)', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'compliance@microlabs.in', 'Dr. Priya Nair (Micro Labs QA Director)', 'manufacturer'),
    ('33333333-3333-3333-3333-333333333333', 'distributor@apexpath.demo', 'Vikas Patel (Apex Logistics & Cold-Chain)', 'distributor'),
    ('44444444-4444-4444-4444-444444444444', 'wholesaler@meditrade.demo', 'Anand Kulkarni (MediTrade Wholesale Hub)', 'wholesaler'),
    ('55555555-5555-5555-5555-555555555555', 'pharmacy@apollohealth.demo', 'Suman Roy (ApolloCare Chemist & Retail)', 'pharmacy'),
    ('66666666-6666-6666-6666-666666666666', 'consumer@patient.demo', 'Aarav Mehta (Consumer)', 'consumer'),
    ('77777777-7777-7777-7777-777777777777', 'reviewer@cdsco-audit.demo', 'Kavita Joshi (CDSCO Senior Drug Inspector)', 'reviewer')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 2. Organizations (Licensed Indian Pharmaceutical Entities)
INSERT INTO organizations (id, legal_name, trade_name, org_type, status, registration_number, country, registered_address, contact_email) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Micro Labs Limited', 'Micro Labs', 'manufacturer', 'approved', 'CIN-U24232KA1973PLC002401', 'India', '31, Race Course Road, Madhava Nagar, Bengaluru, Karnataka 560001 / Plant: Kumbalgodu Industrial Area, Bengaluru', 'compliance@microlabs.in'),
    ('a0000002-0000-0000-0000-000000000002', 'Apex Logistics & Pharma Cold-Chain Pvt. Ltd.', 'Apex Cold-Chain', 'distributor', 'approved', 'CIN-U60200GJ2012PTC070891', 'India', 'GIDC Logistics Park, Changodar, Ahmedabad, Gujarat 382213 & Bhiwandi Central Hub, Maharashtra', 'ops@apexpath.demo'),
    ('a0000003-0000-0000-0000-000000000003', 'MediTrade Wholesale Drug Stockists', 'MediTrade Hub', 'wholesaler', 'approved', 'DL-MH-Z4-102948', 'India', '24 Wholesale Drug Market, Princess Street, Marine Lines, Mumbai 400002', 'orders@meditrade.demo'),
    ('a0000004-0000-0000-0000-000000000004', 'ApolloCare Chemist & Retail Pharmacy', 'ApolloCare Chemist', 'pharmacy', 'approved', 'RPH-IND-2019-9482', 'India', 'Shop 12, Sunrise Complex, Hiranandani Estate, Ghodbunder Road, Thane West, Maharashtra 400607', 'dispensary@apollohealth.demo'),
    ('a0000005-0000-0000-0000-000000000005', 'GlaxoSmithKline Pharmaceuticals Ltd.', 'GSK India', 'manufacturer', 'approved', 'CIN-L24239MH1924PLC001151', 'India', 'Dr. Annie Besant Road, Worli, Mumbai 400030 / Formulation Plant: A-10, MIDC Ambad, Nashik, Maharashtra 422010', 'medinfo.india@gsk.com'),
    ('a0000006-0000-0000-0000-000000000006', 'Alkem Laboratories Ltd.', 'Alkem Labs', 'manufacturer', 'approved', 'CIN-L00305MH1973PLC174201', 'India', 'Alkem House, Senapati Bapat Marg, Lower Parel, Mumbai 400013 / Plant: Village Malpur, Baddi, Solan, HP 173205', 'quality@alkem.com'),
    ('a0000007-0000-0000-0000-000000000007', 'Glenmark Pharmaceuticals Ltd.', 'Glenmark', 'manufacturer', 'approved', 'CIN-L24299MH1977PLC019982', 'India', 'Glenmark House, B.D. Sawant Marg, Andheri East, Mumbai 400099 / Plant: Kishanpura, Baddi, Solan, HP 174101', 'compliance@glenmarkpharma.com'),
    ('a0000008-0000-0000-0000-000000000008', 'Alembic Pharmaceuticals Ltd.', 'Alembic Pharma', 'manufacturer', 'approved', 'CIN-L24230GJ2010PLC061123', 'India', 'Alembic Road, Vadodara, Gujarat 390003 / Unit: Panelav, Halol, Panchmahal, Gujarat 389350', 'regulatory@alembic.co.in'),
    ('a0000009-0000-0000-0000-000000000009', 'Torrent Pharmaceuticals Ltd.', 'Torrent Pharma', 'manufacturer', 'approved', 'CIN-L24230GJ1972PLC002126', 'India', 'Torrent House, Off Ashram Road, Ahmedabad 380009 / Plant: Village Indrad, Kadi, Mehsana, Gujarat 382721', 'qa@torrentpharma.com'),
    ('a0000010-0000-0000-0000-000000000010', 'Cipla Limited', 'Cipla', 'manufacturer', 'approved', 'CIN-L24239MH1935PLC002380', 'India', 'Cipla House, Peninsula Business Park, Lower Parel, Mumbai 400013 / Plant: D-27, MIDC Kurkumbh, Pune 413802', 'regulatory@cipla.com'),
    ('a0000011-0000-0000-0000-000000000011', 'Central Drugs Standard Control Organisation', 'CDSCO HQ', 'regulatory_body', 'approved', 'GOI-CDSCO-HQ-DELHI', 'India', 'Directorate General of Health Services, FDA Bhawan, Kotla Road, New Delhi 110002', 'dci@nic.in')
ON CONFLICT (id) DO UPDATE SET
    legal_name = EXCLUDED.legal_name,
    trade_name = EXCLUDED.trade_name,
    registered_address = EXCLUDED.registered_address,
    contact_email = EXCLUDED.contact_email;

-- 3. Licences (CDSCO / State FDA Form 25 & Form 20B/21B)
INSERT INTO manufacturer_licences (id, organization_id, licence_number, issuing_authority, licence_type, issued_date, valid_until, verification_status) VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'KTK-25/482', 'Drugs Control Department, Government of Karnataka', 'Form 25 (Drug Manufacturing Licence)', '2022-01-15', '2027-01-14', 'verified'),
    ('b0000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'MH-THN-20B/9012', 'Food & Drugs Administration, Maharashtra (FDA-MH)', 'Form 20B/21B Wholesale Licence', '2023-04-10', '2028-04-09', 'verified'),
    ('b0000003-0000-0000-0000-000000000003', 'a0000005-0000-0000-0000-000000000005', 'MH-NSK-25/891', 'FDA Maharashtra (Nashik Circle)', 'Form 25 (Drug Manufacturing Licence)', '2021-06-01', '2026-05-31', 'verified'),
    ('b0000004-0000-0000-0000-000000000004', 'a0000006-0000-0000-0000-000000000006', 'HP-25-1049', 'State Drugs Controller, Himachal Pradesh', 'Form 25 (Drug Manufacturing Licence)', '2022-08-15', '2027-08-14', 'verified'),
    ('b0000005-0000-0000-0000-000000000005', 'a0000007-0000-0000-0000-000000000007', 'HP-25-832', 'State Drugs Controller, Himachal Pradesh', 'Form 25 (Drug Manufacturing Licence)', '2020-03-20', '2028-03-19', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 4. Authentic Indian Medicines
INSERT INTO medicines (id, organization_id, brand_name, generic_name, product_code, composition, strength, dosage_form, packaging_desc, category, status, regulatory_approval_ref) VALUES
    ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Dolo 650', 'Paracetamol IP 650mg', 'DOLO650', 'Each uncoated tablet contains: Paracetamol IP 650 mg', '650 mg', 'Tablet', 'Blister strip of 15 tablets in tamper-evident outer carton', 'Analgesic & Antipyretic', 'active', 'CDSCO/MFG/KTK-2018/00491'),
    ('c0000002-0000-0000-0000-000000000002', 'a0000005-0000-0000-0000-000000000005', 'Augmentin 625 Duo', 'Amoxicillin and Potassium Clavulanate Tablets IP', 'AUG625DUO', 'Amoxicillin Trihydrate IP eq. to Amoxicillin 500 mg, Potassium Clavulanate Diluted IP eq. to Clavulanic Acid 125 mg', '625 mg (500mg + 125mg)', 'Film-Coated Tablet', 'Moisture-barrier Alu-Alu strip of 10 tablets with micro-embossed security seal', 'Broad-Spectrum Penicillin Antibiotic', 'active', 'CDSCO/MFG/MH-2015/00182'),
    ('c0000003-0000-0000-0000-000000000003', 'a0000006-0000-0000-0000-000000000006', 'Pan-D Capsules', 'Pantoprazole Gastro-resistant and Domperidone Prolonged-release Capsules IP', 'PAND001', 'Pantoprazole Sodium IP eq. to Pantoprazole 40 mg (enteric-coated pellets), Domperidone IP 30 mg (sustained-release pellets)', '40 mg + 30 mg', 'Capsule', 'Alu-Alu blister strip of 15 capsules', 'Gastrointestinal / Antacid & Antiemetic', 'active', 'CDSCO/MFG/HP-2019/00822'),
    ('c0000004-0000-0000-0000-000000000004', 'a0000007-0000-0000-0000-000000000007', 'Telma 40', 'Telmisartan Tablets IP 40mg', 'TELMA40', 'Telmisartan IP 40 mg', '40 mg', 'Tablet', 'Alu-Alu blister strip of 30 tablets (2 x 15)', 'Cardiovascular / Antihypertensive (ARB)', 'active', 'CDSCO/MFG/HP-2016/00914'),
    ('c0000005-0000-0000-0000-000000000005', 'a0000008-0000-0000-0000-000000000008', 'Azithral 500', 'Azithromycin Tablets IP 500mg', 'AZITH500', 'Azithromycin Dihydrate IP eq. to Azithromycin anhydrous 500 mg', '500 mg', 'Film-Coated Tablet', 'Blister pack of 5 tablets', 'Macrolide Antibiotic', 'active', 'CDSCO/MFG/GJ-2017/00341'),
    ('c0000006-0000-0000-0000-000000000006', 'a0000009-0000-0000-0000-000000000009', 'Shelcal 500', 'Calcium and Vitamin D3 Tablets IP', 'SHELCAL500', 'Elemental Calcium 500 mg, Vitamin D3 250 IU', '500 mg + 250 IU', 'Film-Coated Tablet', 'Blister strip of 15 tablets', 'Bone Health / Mineral Supplement', 'active', 'CDSCO/MFG/GJ-2020/00412'),
    ('c0000007-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000001', 'Monocef 1g Injection', 'Ceftriaxone Injection IP 1g', 'MONOCEF1G', 'Sterile Ceftriaxone Sodium IP eq. to 1000 mg with SWFI 10 ml', '1000 mg (1 g)', 'Powder for Injection (Vial)', 'Single-dose glass vial with 10ml ampoule', 'Third-Generation Cephalosporin Antibiotic', 'active', 'CDSCO/MFG/MP-2018/00227'),
    ('c0000008-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000001', 'Glycomet 500 PR', 'Metformin Hydrochloride Prolonged-release Tablets IP', 'GLYCOM500', 'Metformin Hydrochloride IP 500 mg in prolonged-release hydrophilic matrix', '500 mg', 'Prolonged-Release Tablet', 'Blister strip of 20 tablets', 'Antidiabetic / Biguanide', 'active', 'CDSCO/MFG/DD-2017/00551'),
    ('c0000009-0000-0000-0000-000000000009', 'a0000010-0000-0000-0000-000000000010', 'Ciplox 500', 'Ciprofloxacin Tablets IP 500mg', 'CIPLOX500', 'Ciprofloxacin Hydrochloride IP eq. to Ciprofloxacin 500 mg', '500 mg', 'Film-Coated Tablet', 'Blister pack of 10 tablets', 'Fluoroquinolone Antibiotic', 'active', 'CDSCO/MFG/MH-2016/00192'),
    ('c0000010-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000001', 'Volini Pain Relief Gel', 'Diclofenac Diethylamine Gel', 'VOLINI050', 'Diclofenac Diethylamine IP 1.16% w/w, Linseed Oil 3%, Methyl Salicylate 10%, Menthol 5%', '50 g Tube', 'Topical Gel', 'Laminated tube 50 g in tamper-sealed carton', 'Topical Analgesic & Anti-inflammatory', 'active', 'CDSCO/MFG/G-2019/00881')
ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    generic_name = EXCLUDED.generic_name,
    product_code = EXCLUDED.product_code,
    composition = EXCLUDED.composition,
    strength = EXCLUDED.strength,
    dosage_form = EXCLUDED.dosage_form,
    packaging_desc = EXCLUDED.packaging_desc,
    category = EXCLUDED.category,
    status = EXCLUDED.status;

-- 5. Realistic Batches (Valid, Expired, Recalled, Anomaly, Replay Cloned)
INSERT INTO medicine_batches (id, medicine_id, batch_number, manufacturing_date, expiry_date, quantity_produced, status, is_recalled, recall_reason) VALUES
    ('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'DOLO650-B25081', '2025-08-15', '2027-07-31', 150000, 'active', FALSE, NULL),
    ('d0000002-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000002', 'AUG625-CL2409', '2024-09-01', '2026-11-30', 80000, 'active', FALSE, NULL),
    ('d0000003-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'PAND-24E091', '2022-06-01', '2024-05-31', 45000, 'expired', FALSE, 'Standard shelf-life expired. Do not dispense or ingest.'),
    ('d0000004-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'TELMA-REC26', '2024-11-10', '2026-10-31', 60000, 'recalled', TRUE, 'Class II Voluntary Recall: Dissolution profile variation identified in stability testing chamber (CDSCO Alert Ref: CDSCO-REC-2026-058). Quarantine remaining stock.'),
    ('d0000005-0000-0000-0000-000000000005', 'c0000005-0000-0000-0000-000000000005', 'AZITH-ANOM2', '2025-04-10', '2027-03-31', 35000, 'active', FALSE, NULL),
    ('d0000006-0000-0000-0000-000000000006', 'c0000006-0000-0000-0000-000000000006', 'SHELCAL-REP01', '2025-07-20', '2027-06-30', 90000, 'active', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET
    batch_number = EXCLUDED.batch_number,
    manufacturing_date = EXCLUDED.manufacturing_date,
    expiry_date = EXCLUDED.expiry_date,
    status = EXCLUDED.status,
    is_recalled = EXCLUDED.is_recalled,
    recall_reason = EXCLUDED.recall_reason;

-- 6. QR Verification Tokens
INSERT INTO qr_codes (id, batch_id, qr_token, serial_number, status, scan_count) VALUES
    ('e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'MS-QR-DOLO650-GENUINE-001', 'SN-2025-DOLO-008102', 'active', 2),
    ('e0000002-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000002', 'MS-QR-AUG625-GENUINE-002', 'SN-2024-AUG-041908', 'active', 1),
    ('e0000003-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000003', 'MS-QR-PAND-EXPIRED-003', 'SN-2022-PAND-091244', 'active', 7),
    ('e0000004-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000004', 'MS-QR-TELMA-RECALLED-004', 'SN-2024-TELMA-002619', 'flagged', 29),
    ('e0000005-0000-0000-0000-000000000005', 'd0000005-0000-0000-0000-000000000005', 'MS-QR-AZITH-ANOMALY-005', 'SN-2025-AZITH-005512', 'active', 1),
    ('e0000006-0000-0000-0000-000000000006', 'd0000006-0000-0000-0000-000000000006', 'MS-QR-SHELCAL-REPLAYED-006', 'SN-2025-SHELC-001189', 'flagged', 184)
ON CONFLICT (id) DO UPDATE SET
    qr_token = EXCLUDED.qr_token,
    status = EXCLUDED.status,
    scan_count = EXCLUDED.scan_count;

-- 7. Cryptographically Chained Supply Chain Handoffs
INSERT INTO supply_chain_events (id, event_sequence, batch_id, event_type, actor_id, organization_id, target_org_id, location_text, event_payload, previous_hash, current_hash) VALUES
    ('f0000001-0000-0000-0000-000000000001', 1, 'd0000001-0000-0000-0000-000000000001', 'batch_registered', '22222222-2222-2222-2222-222222222222', 'a0000001-0000-0000-0000-000000000001', NULL, 'Micro Labs Plant Unit II, Kumbalgodu, Bengaluru, Karnataka', '{"action": "batch_manufactured", "units": 150000, "qa_passed": true, "qa_lead": "Dr. Priya Nair", "licence": "KTK-25/482"}', '0000000000000000000000000000000000000000000000000000000000000000', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    ('f0000002-0000-0000-0000-000000000002', 2, 'd0000001-0000-0000-0000-000000000001', 'dispatch_recorded', '22222222-2222-2222-2222-222222222222', 'a0000001-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002', 'Apex Cold-Chain Transit Hub, Bhiwandi, Maharashtra', '{"shipment_ref": "SHP-2025-IND-8812", "units": 25000, "temp_monitored": true, "avg_temp_c": 22.4}', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'a1f8c79234b6e8201cd99182a0349817cf902348ab123498ef01928347102938'),
    ('f0000003-0000-0000-0000-000000000003', 3, 'd0000001-0000-0000-0000-000000000001', 'shipment_received', '33333333-3333-3333-3333-333333333333', 'a0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003', 'MediTrade Stockist Depot, Princess Street, Mumbai', '{"received_units": 25000, "discrepancy": 0, "verified_by": "Vikas Patel", "tamper_seals": "intact"}', 'a1f8c79234b6e8201cd99182a0349817cf902348ab123498ef01928347102938', 'b2e9d80345c7f9312de00293b1450928de013459bc234509fa12039458213049'),
    ('f0000004-0000-0000-0000-000000000004', 4, 'd0000001-0000-0000-0000-000000000001', 'dispatch_recorded', '44444444-4444-4444-4444-444444444444', 'a0000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000004', 'Princess Street Wholesale Drug Hub, Mumbai', '{"invoice_no": "GST-INV-2025-4491", "units": 1500, "destination": "ApolloCare Chemist Thane West"}', 'b2e9d80345c7f9312de00293b1450928de013459bc234509fa12039458213049', 'c3fae91456d8a0423ef11304c2561039ef124560cd345610ab23140569324150'),
    ('f0000005-0000-0000-0000-000000000005', 5, 'd0000001-0000-0000-0000-000000000001', 'shipment_received', '55555555-5555-5555-5555-555555555555', 'a0000004-0000-0000-0000-000000000004', NULL, 'ApolloCare Chemist, Hiranandani Estate, Thane West', '{"received_at_pharmacy": true, "pack_inspection": "intact", "retail_pharmacist": "Suman Roy, Reg. 9482"}', 'c3fae91456d8a0423ef11304c2561039ef124560cd345610ab23140569324150', 'd40bf02567e9b1534fa22415d3672140fa235671de456721bc34251670435261')
ON CONFLICT (id) DO NOTHING;

-- 8. Regulatory Sources
INSERT INTO regulatory_sources (id, country_code, authority_name, jurisdiction, official_website_url, source_type) VALUES
    ('90000001-0000-0000-0000-000000000001', 'IN', 'Central Drugs Standard Control Organisation (CDSCO)', 'India (National)', 'https://cdsco.gov.in', 'drug_recalls'),
    ('90000002-0000-0000-0000-000000000002', 'IN', 'Maharashtra Food & Drugs Administration (FDA-MH)', 'Maharashtra, India', 'https://fda.maharashtra.gov.in', 'nsq_alerts'),
    ('90000003-0000-0000-0000-000000000003', 'US', 'United States Food and Drug Administration (US FDA)', 'United States', 'https://www.fda.gov/drugs', 'drug_recalls'),
    ('90000004-0000-0000-0000-000000000004', 'GB', 'Medicines and Healthcare products Regulatory Agency (MHRA)', 'United Kingdom', 'https://www.gov.uk/mhra', 'spurious_drugs'),
    ('90000005-0000-0000-0000-000000000005', 'GLOBAL', 'World Health Organization (WHO) Surveillance & Monitoring', 'International', 'https://www.who.int/teams/regulation-prequalification', 'spurious_drugs')
ON CONFLICT (id) DO NOTHING;

-- 9. Real CDSCO & State FDA Regulatory Notices
INSERT INTO regulatory_notices (id, source_id, notice_reference, title, notice_type, publication_date, affected_brand, affected_generic, affected_batch, affected_manufacturer, summary, official_document_url, review_status, is_published) VALUES
    ('91000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-NSQ-2026-104', 'CDSCO Drug Alert: Monthly Non-Standard Quality (NSQ) Report (Batch Screening Alert)', 'nsq_alert', '2026-03-20', 'Spurious Antibiotic & Antipyretic Formulations', 'Various Active Pharmaceutical Ingredients', 'Multiple Batches Flagged', 'Unlicensed Regional Formulators', 'Government Analyst testing by Central Drugs Testing Laboratory (CDTL) flagged failure in dissolution and assay content in unauthorized samples seized from unlicensed godowns.', 'https://cdsco.gov.in/notices/nsq-2026-104.pdf', 'verified_published', TRUE),
    ('91000002-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-REC-2026-058', 'Class II Voluntary Recall: Telma 40 (Telmisartan 40mg) Batch TELMA-REC26', 'official_recall', '2026-02-28', 'Telma 40', 'Telmisartan Tablets IP 40mg', 'TELMA-REC26', 'Glenmark Pharmaceuticals Ltd.', 'Voluntary batch recall initiated due to dissolution test profile deviation observed during 18-month accelerated stability testing. No adverse clinical events reported.', 'https://cdsco.gov.in/recalls/rec-2026-058.pdf', 'verified_published', TRUE),
    ('91000003-0000-0000-0000-000000000002', '90000002-0000-0000-0000-000000000002', 'FDA-MH-SPUR-2026-31', 'Spurious Drug Seizure: Counterfeit Augmentin 625 & Azithral 500 Blisters Seized in Thane & Bhiwandi', 'spurious_alert', '2026-03-05', 'Augmentin 625 Duo / Azithral 500 (Counterfeit Packaging)', 'Amoxicillin + Clavulanate / Azithromycin IP', 'Multiple Fictitious Batches', 'Unlicensed Underground Packaging Unit', 'Intelligence wing of Food and Drugs Administration Maharashtra raided unauthorized godown in Bhiwandi seizing counterfeit Alu-Alu strips lacking registered micro-embossed security holograms.', 'https://fda.maharashtra.gov.in/alerts/spur-2026-31.pdf', 'verified_published', TRUE),
    ('91000004-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-GSR-2026-12', 'Statutory Notification: Mandatory 2D Barcode/QR Code Implementation for Top 300 Medicine Brands', 'prohibited_drug', '2026-01-15', 'Top 300 Indian Pharmaceutical Brands', 'Multiple Formulations', 'All New Manufacturing Batches', 'All Licensed Indian Drug Manufacturers', 'Ministry of Health and Family Welfare mandate under Drugs (Amendment) Rules: All top 300 pharmaceutical brands must carry machine-readable 2D barcodes containing unique product identification code, batch number, manufacturing date, and expiry date.', 'https://cdsco.gov.in/rules/gsr-2026-12.pdf', 'verified_published', TRUE)
ON CONFLICT (id) DO NOTHING;
