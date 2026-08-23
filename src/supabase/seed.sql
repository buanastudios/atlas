-- ============================================================================
-- Atlas Edu — PostgreSQL Seed Data
-- ============================================================================

INSERT INTO public.governance_audits (domain, title, score, status, certified_date) VALUES
('COBIT 2019 - EDM01', 'Tata Kelola Data Pendidikan & Privasi Santri', 96.50, 'WTP - Compliant', '2026-07-15'),
('ISO 9001:2015', 'Sistem Manajemen Mutu Pembelajaran Terpadu', 98.00, 'Certified', '2026-06-20'),
('SNI ISO/IEC 27001', 'Keamanan Sistem Informasi & Kriptografi Ijazah', 97.80, 'Compliant', '2026-08-01')
ON CONFLICT DO NOTHING;

INSERT INTO public.ppdb_admissions (reg_number, full_name, target_grade, parent_name, phone, status) VALUES
('PPDB-2026-042', 'Sulaiman Al-Habsyi', 'SD Kelas 1', 'Abdullah Al-Habsyi', '081234567890', 'VERIFIED'),
('PPDB-2026-043', 'Aisyah Humaira', 'SD Kelas 1', 'Farid Rahman', '081398765432', 'INTERVIEW'),
('PPDB-2026-044', 'Bilal bin Rabah', 'SD Kelas 1', 'M. Yusuf', '081299887766', 'ACCEPTED')
ON CONFLICT DO NOTHING;

INSERT INTO public.tahfizh_records (student_name, surah, ayat, grade, ustadz, date) VALUES
('Ahmad Fauzan', 'An-Naba', '1-40', 'Mumtaz (A+)', 'Ust. Ibrahim', CURRENT_DATE),
('Fathir Azzam', 'An-Naziat', '1-46', 'Jayyid Jiddan (A)', 'Ust. Ibrahim', CURRENT_DATE),
('Rayhan Putra', 'Abasa', '1-42', 'Mumtaz (A+)', 'Ust. Salman', CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO public.halaqah_logs (student_name, session, status, mutabaah, date) VALUES
('Ahmad Fauzan', 'Shubuh & Halaqah Pagi', 'Hadir', 'Al-Baqarah 1-20 (Lancar)', CURRENT_DATE),
('Muhammad Farhan', 'Shubuh & Halaqah Pagi', 'Hadir', 'Ali Imran 50-75', CURRENT_DATE),
('Zaid bin Tsabit', 'Shubuh & Halaqah Pagi', 'Sakit', 'Demam ringan - Istirahat UKS', CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO public.tuition_invoices (invoice_no, student_name, amount, month, status, paid_at) VALUES
('INV-202608-001', 'Ahmad Fauzan', 1500000, 'Agustus 2026', 'PAID', CURRENT_DATE - INTERVAL '15 days'),
('INV-202608-002', 'Muhammad Farhan', 1500000, 'Agustus 2026', 'PAID', CURRENT_DATE - INTERVAL '12 days'),
('INV-202608-003', 'Zaid bin Tsabit', 1500000, 'Agustus 2026', 'UNPAID', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO public.mbg_logs (date, menu_name, portion_target, portion_received, organoleptic_status, courier_name, receiver_name) VALUES
(CURRENT_DATE, 'Nasi Organik, Ayam Bakar Madu, Sayur Sop, Pisang Barangan', 350, 350, 'PASSED', 'Pak Sugeng (Dapur Sentral)', 'Ustdz. Fatimah')
ON CONFLICT DO NOTHING;
