-- ==============================================================================
-- MediSure AI — Production Supabase PostgreSQL Schema & Security Architecture
-- Version: 1.0.0
-- Tagline: Scan. Verify. Stay Safe.
-- Note: All sample medicine and organization data is FICTIONAL and for PBL demonstration.
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. IDENTITY & ORGANIZATIONS
-- ==============================================================================

CREATE TYPE user_role AS ENUM (
    'public',
    'consumer',
    'manufacturer',
    'distributor',
    'wholesaler',
    'pharmacy',
    'reviewer',
    'admin',
    'super_admin'
);

CREATE TYPE org_type AS ENUM (
    'manufacturer',
    'distributor',
    'wholesaler',
    'pharmacy',
    'regulatory_body'
);

CREATE TYPE org_status AS ENUM (
    'draft',
    'pending_review',
    'approved',
    'rejected',
    'suspended'
);

-- User Profiles (Linked with Supabase auth.users or internal auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Foreign key to auth.users if Supabase Auth is enabled
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'consumer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Organizations (Manufacturers, Distributors, Wholesalers, Pharmacies)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    org_type org_type NOT NULL,
    status org_status DEFAULT 'pending_review' NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(100) DEFAULT 'India' NOT NULL,
    state_province VARCHAR(100),
    city VARCHAR(100),
    registered_address TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    website_url VARCHAR(255),
    decision_reason TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Organization Members (Mapping users to organizations)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_role VARCHAR(50) DEFAULT 'member' NOT NULL, -- 'owner', 'manager', 'member'
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(organization_id, profile_id)
);

-- Manufacturer & Distribution Licences
CREATE TABLE IF NOT EXISTS manufacturer_licences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    licence_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL, -- e.g., 'Central Drugs Standard Control Organisation (CDSCO)', 'State Drug Control Administration'
    licence_type VARCHAR(100) NOT NULL, -- e.g., 'Form 25 (Drug Manufacturing)', 'Form 28', 'Wholesale Drug Licence 20B/21B'
    issued_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'submitted' NOT NULL, -- 'submitted', 'verified', 'flagged', 'expired'
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_licence_dates CHECK (valid_until >= issued_date)
);

-- ==============================================================================
-- 2. MEDICINE CATALOG & BATCHES
-- ==============================================================================

CREATE TYPE medicine_status AS ENUM (
    'active',
    'suspended',
    'recalled',
    'discontinued'
);

CREATE TYPE batch_status AS ENUM (
    'active',
    'quarantined',
    'recalled',
    'expired',
    'exhausted'
);

CREATE TYPE qr_code_status AS ENUM (
    'active',
    'scanned',
    'flagged',
    'revoked'
);

-- Medicine Catalog
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) UNIQUE NOT NULL, -- Unique GTIN or internal Product ID
    composition TEXT NOT NULL, -- e.g., 'Paracetamol 500mg, Caffeine 30mg'
    strength VARCHAR(100) NOT NULL, -- e.g., '500 mg'
    dosage_form VARCHAR(100) NOT NULL, -- e.g., 'Tablet', 'Capsule', 'Syrup'
    packaging_desc VARCHAR(255) NOT NULL, -- e.g., 'Blister strip of 10 tablets'
    category VARCHAR(100), -- e.g., 'Analgesic', 'Antibiotic'
    prescription_required BOOLEAN DEFAULT FALSE NOT NULL,
    storage_instructions TEXT,
    status medicine_status DEFAULT 'active' NOT NULL,
    regulatory_approval_ref VARCHAR(100), -- e.g. 'CDSCO/MFG/2024/8892'
    reference_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Medicine Batches
CREATE TABLE IF NOT EXISTS medicine_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_produced INTEGER NOT NULL CHECK (quantity_produced > 0),
    packaging_unit VARCHAR(50) DEFAULT 'units' NOT NULL,
    licence_reference_id UUID REFERENCES manufacturer_licences(id),
    status batch_status DEFAULT 'active' NOT NULL,
    is_recalled BOOLEAN DEFAULT FALSE NOT NULL,
    recall_reason TEXT,
    recalled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(medicine_id, batch_number),
    CONSTRAINT chk_batch_dates CHECK (expiry_date > manufacturing_date)
);

-- Unique QR Identifiers (Batch or Item Level)
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES medicine_batches(id) ON DELETE CASCADE,
    qr_token VARCHAR(255) UNIQUE NOT NULL, -- Cryptographically random or signed token
    serial_number VARCHAR(100),
    status qr_code_status DEFAULT 'active' NOT NULL,
    scan_count INTEGER DEFAULT 0 NOT NULL,
    first_scanned_at TIMESTAMPTZ,
    last_scanned_at TIMESTAMPTZ,
    revocation_reason TEXT,
    revoked_by UUID REFERENCES profiles(id),
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 3. SUPPLY CHAIN & HASH-LINKED LEDGER
-- ==============================================================================

CREATE TYPE shipment_status AS ENUM (
    'created',
    'dispatched',
    'in_transit',
    'received',
    'rejected',
    'partially_received',
    'discrepancy_reported'
);

CREATE TYPE supply_event_type AS ENUM (
    'batch_registered',
    'qr_issued',
    'shipment_created',
    'dispatch_recorded',
    'shipment_received',
    'quantity_discrepancy',
    'shipment_rejected',
    'recall_recorded',
    'qr_revoked',
    'consumer_verified'
);

-- Shipments between Organizations
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_reference VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'SHP-2026-IND-001'
    sender_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    receiver_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    status shipment_status DEFAULT 'created' NOT NULL,
    dispatch_date TIMESTAMPTZ,
    estimated_arrival TIMESTAMPTZ,
    received_date TIMESTAMPTZ,
    tracking_number VARCHAR(100),
    transporter_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_sender_receiver CHECK (sender_org_id <> receiver_org_id)
);

-- Shipment Items (Batches in a shipment)
CREATE TABLE IF NOT EXISTS shipment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES medicine_batches(id) ON DELETE RESTRICT,
    quantity_dispatched INTEGER NOT NULL CHECK (quantity_dispatched > 0),
    quantity_received INTEGER DEFAULT 0 CHECK (quantity_received >= 0),
    discrepancy_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Append-Only Cryptographic Audit Ledger (Supply Chain Events)
CREATE TABLE IF NOT EXISTS supply_chain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_sequence BIGSERIAL UNIQUE NOT NULL,
    batch_id UUID NOT NULL REFERENCES medicine_batches(id) ON DELETE RESTRICT,
    shipment_id UUID REFERENCES shipments(id),
    event_type supply_event_type NOT NULL,
    actor_id UUID REFERENCES profiles(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    target_org_id UUID REFERENCES organizations(id),
    location_text VARCHAR(255),
    event_payload JSONB NOT NULL,
    previous_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of prior event
    current_hash VARCHAR(64) NOT NULL,  -- SHA-256 (previous_hash + sequence + event_type + payload)
    is_tamper_flagged BOOLEAN DEFAULT FALSE NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 4. VERIFICATION, SAFETY & REGULATORY MODULE
-- ==============================================================================

CREATE TYPE verification_result_enum AS ENUM (
    'record_found',
    'expired',
    'recalled',
    'suspicious',
    'revoked',
    'not_found',
    'unable_to_verify',
    'verification_incomplete'
);

-- Verification Scans
CREATE TABLE IF NOT EXISTS verification_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_token VARCHAR(255),
    qr_code_id UUID REFERENCES qr_codes(id),
    medicine_id UUID REFERENCES medicines(id),
    batch_id UUID REFERENCES medicine_batches(id),
    user_id UUID REFERENCES profiles(id),
    ip_hash VARCHAR(64),
    user_agent TEXT,
    scanned_location_city VARCHAR(100),
    scanned_location_country VARCHAR(100) DEFAULT 'India',
    result verification_result_enum NOT NULL,
    risk_score NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'low' NOT NULL, -- 'low', 'medium', 'high'
    checks_summary JSONB NOT NULL, -- Individual layer results
    ai_ocr_extracted JSONB,
    ai_anomaly_signals JSONB,
    warnings TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Counterfeit & Quality Reports
CREATE TABLE IF NOT EXISTS counterfeit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'MS-REP-2026-0042'
    user_id UUID REFERENCES profiles(id),
    medicine_id UUID REFERENCES medicines(id),
    batch_number VARCHAR(100),
    qr_code_data TEXT,
    pharmacy_source VARCHAR(255),
    purchase_date DATE,
    reason_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    packaging_photo_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'under_investigation', 'verified_issue', 'dismissed'
    investigation_notes TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Regulatory Sources (India & Global)
CREATE TABLE IF NOT EXISTS regulatory_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code VARCHAR(10) NOT NULL, -- 'IN', 'US', 'EU', 'GB', 'GLOBAL'
    authority_name VARCHAR(255) NOT NULL, -- e.g., 'Central Drugs Standard Control Organisation (CDSCO)', 'US FDA'
    jurisdiction VARCHAR(100) NOT NULL,
    official_website_url TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- 'drug_recalls', 'nsq_alerts', 'spurious_drugs', 'prohibited_drugs'
    last_fetched_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Regulatory Notices & Quality Alerts
CREATE TABLE IF NOT EXISTS regulatory_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES regulatory_sources(id) ON DELETE RESTRICT,
    notice_reference VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    notice_type VARCHAR(100) NOT NULL, -- 'nsq_alert' (Non-Standard Quality), 'prohibited_drug', 'spurious_alert', 'official_recall'
    publication_date DATE NOT NULL,
    effective_date DATE,
    affected_brand VARCHAR(255),
    affected_generic VARCHAR(255),
    affected_batch VARCHAR(100),
    affected_manufacturer VARCHAR(255),
    summary TEXT NOT NULL,
    official_document_url TEXT NOT NULL,
    review_status VARCHAR(50) DEFAULT 'pending_review' NOT NULL, -- 'pending_review', 'verified_published', 'rejected'
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id),
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'recall', 'licence', 'shipment', 'security', 'report'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 5. INDEXES FOR HIGH-THROUGHPUT LOOKUPS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_medicines_product_code ON medicines(product_code);
CREATE INDEX IF NOT EXISTS idx_medicines_generic_name ON medicines(generic_name);
CREATE INDEX IF NOT EXISTS idx_batches_batch_number ON medicine_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_qr_codes_token ON qr_codes(qr_token);
CREATE INDEX IF NOT EXISTS idx_supply_events_batch ON supply_chain_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_supply_events_seq ON supply_chain_events(event_sequence);
CREATE INDEX IF NOT EXISTS idx_shipments_ref ON shipments(shipment_reference);
CREATE INDEX IF NOT EXISTS idx_reg_notices_type ON regulatory_notices(notice_type);
CREATE INDEX IF NOT EXISTS idx_scans_qr_token ON verification_scans(qr_token);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_licences ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE counterfeit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public / Consumer read policies
CREATE POLICY "Public can view verified medicines" ON medicines FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view batches" ON medicine_batches FOR SELECT USING (true);
CREATE POLICY "Public can verify QR tokens" ON qr_codes FOR SELECT USING (true);
CREATE POLICY "Public can view published regulatory notices" ON regulatory_notices FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view approved organizations" ON organizations FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can view supply chain events" ON supply_chain_events FOR SELECT USING (true);

-- Authenticated User / Consumer policies
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);
CREATE POLICY "Users view own scan history" ON verification_scans FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own reports" ON counterfeit_reports FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) OR is_anonymous = TRUE);

-- ==============================================================================
--- ==============================================================================
-- 7. REAL INDIAN PHARMACEUTICAL SEED DATA (CDSCO / IP STANDARDS)
-- ==============================================================================

-- Seed Profiles
INSERT INTO profiles (id, email, full_name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@medisure.ai', 'Dr. Ramesh Sharma (Chief Admin)', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'compliance@microlabs.in', 'Dr. Priya Nair (Micro Labs QA Director)', 'manufacturer'),
    ('33333333-3333-3333-3333-333333333333', 'distributor@apexpath.demo', 'Vikas Patel (Apex Logistics & Cold-Chain)', 'distributor'),
    ('44444444-4444-4444-4444-444444444444', 'wholesaler@meditrade.demo', 'Anand Kulkarni (MediTrade Wholesale Hub)', 'wholesaler'),
    ('55555555-5555-5555-5555-555555555555', 'pharmacy@apollohealth.demo', 'Suman Roy (ApolloCare Chemist & Retail)', 'pharmacy'),
    ('66666666-6666-6666-6666-666666666666', 'consumer@patient.demo', 'Aarav Mehta (Consumer)', 'consumer'),
    ('77777777-7777-7777-7777-777777777777', 'reviewer@cdsco-audit.demo', 'Kavita Joshi (CDSCO Senior Drug Inspector)', 'reviewer')
ON CONFLICT (id) DO NOTHING;

-- Seed Organizations
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
ON CONFLICT (id) DO NOTHING;

-- Seed Licences
INSERT INTO manufacturer_licences (id, organization_id, licence_number, issuing_authority, licence_type, issued_date, valid_until, verification_status) VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'KTK-25/482', 'Drugs Control Department, Government of Karnataka', 'Form 25 (Drug Manufacturing Licence)', '2022-01-15', '2027-01-14', 'verified'),
    ('b0000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'MH-THN-20B/9012', 'Food & Drugs Administration, Maharashtra (FDA-MH)', 'Form 20B/21B Wholesale Licence', '2023-04-10', '2028-04-09', 'verified'),
    ('b0000003-0000-0000-0000-000000000003', 'a0000005-0000-0000-0000-000000000005', 'MH-NSK-25/891', 'FDA Maharashtra (Nashik Circle)', 'Form 25 (Drug Manufacturing Licence)', '2021-06-01', '2026-05-31', 'verified'),
    ('b0000004-0000-0000-0000-000000000004', 'a0000006-0000-0000-0000-000000000006', 'HP-25-1049', 'State Drugs Controller, Himachal Pradesh', 'Form 25 (Drug Manufacturing Licence)', '2022-08-15', '2027-08-14', 'verified'),
    ('b0000005-0000-0000-0000-000000000005', 'a0000007-0000-0000-0000-000000000007', 'HP-25-832', 'State Drugs Controller, Himachal Pradesh', 'Form 25 (Drug Manufacturing Licence)', '2020-03-20', '2028-03-19', 'verified')
ON CONFLICT (id) DO NOTHING;

-- Seed Real Indian Medicines
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
ON CONFLICT (id) DO NOTHING;

-- Seed Batches (Verified, Expired, Recalled, Packaging Anomaly, Replay Attack)
INSERT INTO medicine_batches (id, medicine_id, batch_number, manufacturing_date, expiry_date, quantity_produced, status, is_recalled, recall_reason) VALUES
    ('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'DOLO650-B25081', '2025-08-15', '2027-07-31', 150000, 'active', FALSE, NULL),
    ('d0000002-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000002', 'AUG625-CL2409', '2024-09-01', '2026-11-30', 80000, 'active', FALSE, NULL),
    ('d0000003-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'PAND-24E091', '2022-06-01', '2024-05-31', 45000, 'expired', FALSE, 'Standard shelf-life expired. Do not dispense or ingest.'),
    ('d0000004-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'TELMA-REC26', '2024-11-10', '2026-10-31', 60000, 'recalled', TRUE, 'Class II Voluntary Recall: Dissolution profile variation identified in stability testing chamber (CDSCO Alert Ref: CDSCO-REC-2026-058). Quarantine remaining stock.'),
    ('d0000005-0000-0000-0000-000000000005', 'c0000005-0000-0000-0000-000000000005', 'AZITH-ANOM2', '2025-04-10', '2027-03-31', 35000, 'active', FALSE, NULL),
    ('d0000006-0000-0000-0000-000000000006', 'c0000006-0000-0000-0000-000000000006', 'SHELCAL-REP01', '2025-07-20', '2027-06-30', 90000, 'active', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed QR Codes
INSERT INTO qr_codes (id, batch_id, qr_token, serial_number, status, scan_count) VALUES
    ('e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'MS-QR-DOLO650-GENUINE-001', 'SN-2025-DOLO-008102', 'active', 2),
    ('e0000002-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000002', 'MS-QR-AUG625-GENUINE-002', 'SN-2024-AUG-041908', 'active', 1),
    ('e0000003-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000003', 'MS-QR-PAND-EXPIRED-003', 'SN-2022-PAND-091244', 'active', 7),
    ('e0000004-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000004', 'MS-QR-TELMA-RECALLED-004', 'SN-2024-TELMA-002619', 'flagged', 29),
    ('e0000005-0000-0000-0000-000000000005', 'd0000005-0000-0000-0000-000000000005', 'MS-QR-AZITH-ANOMALY-005', 'SN-2025-AZITH-005512', 'active', 1),
    ('e0000006-0000-0000-0000-000000000006', 'd0000006-0000-0000-0000-000000000006', 'MS-QR-SHELCAL-REPLAYED-006', 'SN-2025-SHELC-001189', 'flagged', 184)
ON CONFLICT (id) DO NOTHING;

-- Seed Cryptographic Hash-Linked Supply Chain Events (Genesis & Chained Handoffs)
INSERT INTO supply_chain_events (id, event_sequence, batch_id, event_type, actor_id, organization_id, target_org_id, location_text, event_payload, previous_hash, current_hash) VALUES
    ('f0000001-0000-0000-0000-000000000001', 1, 'd0000001-0000-0000-0000-000000000001', 'batch_registered', '22222222-2222-2222-2222-222222222222', 'a0000001-0000-0000-0000-000000000001', NULL, 'Micro Labs Plant Unit II, Kumbalgodu, Bengaluru, Karnataka', '{"action": "batch_manufactured", "units": 150000, "qa_passed": true, "qa_lead": "Dr. Priya Nair", "licence": "KTK-25/482"}', '0000000000000000000000000000000000000000000000000000000000000000', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    ('f0000002-0000-0000-0000-000000000002', 2, 'd0000001-0000-0000-0000-000000000001', 'dispatch_recorded', '22222222-2222-2222-2222-222222222222', 'a0000001-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002', 'Apex Cold-Chain Transit Hub, Bhiwandi, Maharashtra', '{"shipment_ref": "SHP-2025-IND-8812", "units": 25000, "temp_monitored": true, "avg_temp_c": 22.4}', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'a1f8c79234b6e8201cd99182a0349817cf902348ab123498ef01928347102938'),
    ('f0000003-0000-0000-0000-000000000003', 3, 'd0000001-0000-0000-0000-000000000001', 'shipment_received', '33333333-3333-3333-3333-333333333333', 'a0000002-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003', 'MediTrade Stockist Depot, Princess Street, Mumbai', '{"received_units": 25000, "discrepancy": 0, "verified_by": "Vikas Patel", "tamper_seals": "intact"}', 'a1f8c79234b6e8201cd99182a0349817cf902348ab123498ef01928347102938', 'b2e9d80345c7f9312de00293b1450928de013459bc234509fa12039458213049'),
    ('f0000004-0000-0000-0000-000000000004', 4, 'd0000001-0000-0000-0000-000000000001', 'dispatch_recorded', '44444444-4444-4444-4444-444444444444', 'a0000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000004', 'Princess Street Wholesale Drug Hub, Mumbai', '{"invoice_no": "GST-INV-2025-4491", "units": 1500, "destination": "ApolloCare Chemist Thane West"}', 'b2e9d80345c7f9312de00293b1450928de013459bc234509fa12039458213049', 'c3fae91456d8a0423ef11304c2561039ef124560cd345610ab23140569324150'),
    ('f0000005-0000-0000-0000-000000000005', 5, 'd0000001-0000-0000-0000-000000000001', 'shipment_received', '55555555-5555-5555-5555-555555555555', 'a0000004-0000-0000-0000-000000000004', NULL, 'ApolloCare Chemist, Hiranandani Estate, Thane West', '{"received_at_pharmacy": true, "pack_inspection": "intact", "retail_pharmacist": "Suman Roy, Reg. 9482"}', 'c3fae91456d8a0423ef11304c2561039ef124560cd345610ab23140569324150', 'd40bf02567e9b1534fa22415d3672140fa235671de456721bc34251670435261')
ON CONFLICT (id) DO NOTHING;

-- Seed Regulatory Sources
INSERT INTO regulatory_sources (id, country_code, authority_name, jurisdiction, official_website_url, source_type) VALUES
    ('90000001-0000-0000-0000-000000000001', 'IN', 'Central Drugs Standard Control Organisation (CDSCO)', 'India (National)', 'https://cdsco.gov.in', 'drug_recalls'),
    ('90000002-0000-0000-0000-000000000002', 'IN', 'Maharashtra Food & Drugs Administration (FDA-MH)', 'Maharashtra, India', 'https://fda.maharashtra.gov.in', 'nsq_alerts'),
    ('90000003-0000-0000-0000-000000000003', 'US', 'United States Food and Drug Administration (US FDA)', 'United States', 'https://www.fda.gov/drugs', 'drug_recalls'),
    ('90000004-0000-0000-0000-000000000004', 'GB', 'Medicines and Healthcare products Regulatory Agency (MHRA)', 'United Kingdom', 'https://www.gov.uk/mhra', 'spurious_drugs'),
    ('90000005-0000-0000-0000-000000000005', 'GLOBAL', 'World Health Organization (WHO) Surveillance & Monitoring', 'International', 'https://www.who.int/teams/regulation-prequalification', 'spurious_drugs')
ON CONFLICT (id) DO NOTHING;

-- Seed Regulatory Notices (NSQ, Spurious, Recalls)
INSERT INTO regulatory_notices (id, source_id, notice_reference, title, notice_type, publication_date, affected_brand, affected_generic, affected_batch, affected_manufacturer, summary, official_document_url, review_status, is_published) VALUES
    ('91000001-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-NSQ-2026-104', 'CDSCO Drug Alert: Monthly Non-Standard Quality (NSQ) Report (Batch Screening Alert)', 'nsq_alert', '2026-03-20', 'Spurious Antibiotic & Antipyretic Formulations', 'Various Active Pharmaceutical Ingredients', 'Multiple Batches Flagged', 'Unlicensed Regional Formulators', 'Government Analyst testing by Central Drugs Testing Laboratory (CDTL) flagged failure in dissolution and assay content in unauthorized samples seized from unlicensed godowns.', 'https://cdsco.gov.in/notices/nsq-2026-104.pdf', 'verified_published', TRUE),
    ('91000002-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-REC-2026-058', 'Class II Voluntary Recall: Telma 40 (Telmisartan 40mg) Batch TELMA-REC26', 'official_recall', '2026-02-28', 'Telma 40', 'Telmisartan Tablets IP 40mg', 'TELMA-REC26', 'Glenmark Pharmaceuticals Ltd.', 'Voluntary batch recall initiated due to dissolution test profile deviation observed during 18-month accelerated stability testing. No adverse clinical events reported.', 'https://cdsco.gov.in/recalls/rec-2026-058.pdf', 'verified_published', TRUE),
    ('91000003-0000-0000-0000-000000000002', '90000002-0000-0000-0000-000000000002', 'FDA-MH-SPUR-2026-31', 'Spurious Drug Seizure: Counterfeit Augmentin 625 & Azithral 500 Blisters Seized in Thane & Bhiwandi', 'spurious_alert', '2026-03-05', 'Augmentin 625 Duo / Azithral 500 (Counterfeit Packaging)', 'Amoxicillin + Clavulanate / Azithromycin IP', 'Multiple Fictitious Batches', 'Unlicensed Underground Packaging Unit', 'Intelligence wing of Food and Drugs Administration Maharashtra raided unauthorized godown in Bhiwandi seizing counterfeit Alu-Alu strips lacking registered micro-embossed security holograms.', 'https://fda.maharashtra.gov.in/alerts/spur-2026-31.pdf', 'verified_published', TRUE),
    ('91000004-0000-0000-0000-000000000001', '90000001-0000-0000-0000-000000000001', 'CDSCO-GSR-2026-12', 'Statutory Notification: Mandatory 2D Barcode/QR Code Implementation for Top 300 Medicine Brands', 'prohibited_drug', '2026-01-15', 'Top 300 Indian Pharmaceutical Brands', 'Multiple Formulations', 'All New Manufacturing Batches', 'All Licensed Indian Drug Manufacturers', 'Ministry of Health and Family Welfare mandate under Drugs (Amendment) Rules: All top 300 pharmaceutical brands must carry machine-readable 2D barcodes containing unique product identification code, batch number, manufacturing date, and expiry date.', 'https://cdsco.gov.in/rules/gsr-2026-12.pdf', 'verified_published', TRUE)
ON CONFLICT (id) DO NOTHING;
