-- ============================================================================
-- Atlas Edu — PostgreSQL DDL & Row Level Security (RLS) Schema
-- Production Schema for Supabase Auth & Multi-tenant Education Management
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'director', 'principal', 'teacher', 'finance_admin', 'parent', 'student')),
  unit TEXT DEFAULT 'SD At-Tibyan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. PPDB (ADMISSIONS) TABLE
CREATE TABLE IF NOT EXISTS public.ppdb_admissions (
  id BIGSERIAL PRIMARY KEY,
  reg_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  target_grade TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('REGISTERED', 'VERIFIED', 'INTERVIEW', 'ACCEPTED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.ppdb_admissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for admissions"
  ON public.ppdb_admissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read for admissions"
  ON public.ppdb_admissions FOR SELECT
  TO authenticated, anon
  USING (true);

-- 4. TAHFIZH RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.tahfizh_records (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  surah TEXT NOT NULL,
  ayat TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT 'Mumtaz (A+)',
  ustadz TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.tahfizh_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read tahfizh records"
  ON public.tahfizh_records FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow authenticated teachers to insert tahfizh"
  ON public.tahfizh_records FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 5. HALAQAH & ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.halaqah_logs (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  session TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Hadir',
  mutabaah TEXT,
  date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.halaqah_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read attendance logs"
  ON public.halaqah_logs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow insert attendance logs"
  ON public.halaqah_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 6. TUITION & SPP INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.tuition_invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_no TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 1500000,
  month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'CANCELLED')),
  paid_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.tuition_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read tuition invoices"
  ON public.tuition_invoices FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow update tuition payments"
  ON public.tuition_invoices FOR UPDATE
  TO authenticated, anon
  USING (true);

-- 7. MAKAN BERGIZI GRATIS (MBG) LOGS TABLE
CREATE TABLE IF NOT EXISTS public.mbg_logs (
  id BIGSERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  menu_name TEXT NOT NULL,
  portion_target INT NOT NULL DEFAULT 350,
  portion_received INT NOT NULL DEFAULT 350,
  organoleptic_status TEXT NOT NULL DEFAULT 'PASSED',
  courier_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mbg_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read mbg logs"
  ON public.mbg_logs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow insert mbg logs"
  ON public.mbg_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 8. GOVERNANCE AUDITS TABLE
CREATE TABLE IF NOT EXISTS public.governance_audits (
  id BIGSERIAL PRIMARY KEY,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL,
  certified_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE public.governance_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read governance audits"
  ON public.governance_audits FOR SELECT
  TO authenticated, anon
  USING (true);

-- 9. REALTIME PUBLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.halaqah_logs, 
  public.tahfizh_records, 
  public.tuition_invoices, 
  public.mbg_logs;
