/**
 * api/_db.js
 * Database helper — auto-switches between Turso (remote) and SQLite (local dev).
 *
 * Environment:
 *   TURSO_DATABASE_URL  →  connects to remote Turso (production)
 *   (absent)            →  falls back to file:local.db
 */

const { createClient } = require('@libsql/client');

let _db = null;

function getDb() {
  if (_db) return _db;

  const remoteUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (remoteUrl) {
    console.log('[db] Connecting to remote Turso:', remoteUrl);
    _db = createClient({ url: remoteUrl, authToken });
  } else {
    console.log('[db] No TURSO_DATABASE_URL — using local file:local.db');
    _db = createClient({ url: 'file:local.db' });
  }

  return _db;
}

const db = getDb();

/**
 * initSchema()
 * Creates ALL tables for every Atlas Edu module.
 * Safe to call multiple times — uses CREATE TABLE IF NOT EXISTS throughout.
 * Run once via:  GET /api/init-db
 */
async function initSchema() {
  const statements = [

    // ── PRAGMA ────────────────────────────────────────────────────────────────
    `PRAGMA journal_mode=WAL`,
    `PRAGMA foreign_keys=ON`,

    // ══════════════════════════════════════════════════════════════════════════
    //  CORE — users, roles, students, employees
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      role          TEXT    NOT NULL DEFAULT 'teacher',
      unit          TEXT,
      email         TEXT,
      is_active     INTEGER NOT NULL DEFAULT 1,
      last_login    TEXT,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS students (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      nis               TEXT    UNIQUE,
      nisn              TEXT    UNIQUE,
      nama_lengkap      TEXT    NOT NULL,
      nama_arab         TEXT,
      jenis_kelamin     TEXT    CHECK(jenis_kelamin IN ('L','P')),
      tempat_lahir      TEXT,
      tanggal_lahir     TEXT,
      alamat            TEXT,
      foto              TEXT,
      unit              TEXT    NOT NULL DEFAULT 'idad_prep',
      kelas             TEXT,
      kamar             TEXT,
      nama_ayah         TEXT,
      hp_ayah           TEXT,
      nama_ibu          TEXT,
      hp_ibu            TEXT,
      nama_wali         TEXT,
      hp_wali           TEXT,
      email_wali        TEXT,
      status_aktif      INTEGER NOT NULL DEFAULT 1,
      status_santri     TEXT    NOT NULL DEFAULT 'Aktif',
      status_lokasi     TEXT    NOT NULL DEFAULT 'Di Pondok',
      tanggal_masuk     TEXT    DEFAULT (date('now')),
      created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS employees (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      nip                 TEXT    UNIQUE,
      nik                 TEXT,
      nama_lengkap        TEXT    NOT NULL,
      nama_arab           TEXT,
      jabatan             TEXT,
      unit                TEXT,
      jenis_kelamin       TEXT    CHECK(jenis_kelamin IN ('L','P')),
      tempat_lahir        TEXT,
      tanggal_lahir       TEXT,
      status_menikah      TEXT,
      no_hp               TEXT,
      email               TEXT,
      alamat              TEXT,
      pendidikan_terakhir TEXT,
      tanggal_masuk       TEXT,
      status_kepegawaian  TEXT    NOT NULL DEFAULT 'Aktif',
      status_aktif        INTEGER NOT NULL DEFAULT 1,
      foto                TEXT,
      created_at          TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: HALAQAH — KBM Attendance
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS halaqah_groups (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_halaqah TEXT   NOT NULL,
      musyrif_id  INTEGER REFERENCES employees(id),
      unit        TEXT    NOT NULL,
      tingkat     TEXT,
      ruangan     TEXT,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS attendance_sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      halaqah_id  INTEGER NOT NULL REFERENCES halaqah_groups(id),
      tanggal     TEXT    NOT NULL,
      sesi        TEXT    NOT NULL DEFAULT 'Pagi',
      mata_pelajaran TEXT,
      pengajar_id INTEGER REFERENCES employees(id),
      catatan     TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS attendance_records (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id   INTEGER NOT NULL REFERENCES attendance_sessions(id),
      student_id   INTEGER NOT NULL REFERENCES students(id),
      status       TEXT    NOT NULL DEFAULT 'Hadir'
                           CHECK(status IN ('Hadir','Izin','Sakit','Alfa','Terlambat')),
      keterangan   TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      UNIQUE(session_id, student_id)
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: TAHFIZH — Quran Memorization
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS tahfizh_targets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      unit        TEXT    NOT NULL UNIQUE,
      target_juz  INTEGER NOT NULL DEFAULT 1,
      target_surah TEXT,
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS tahfizh_setoran (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id      INTEGER NOT NULL REFERENCES students(id),
      musyrif_id      INTEGER REFERENCES employees(id),
      tanggal         TEXT    NOT NULL DEFAULT (date('now')),
      jenis_setoran   TEXT    NOT NULL DEFAULT 'Hafalan'
                              CHECK(jenis_setoran IN ('Hafalan','Murojaah','Tasmi')),
      surah_dari      TEXT    NOT NULL,
      ayat_dari       INTEGER NOT NULL,
      surah_sampai    TEXT    NOT NULL,
      ayat_sampai     INTEGER NOT NULL,
      jumlah_halaman  REAL,
      total_juz       REAL,
      nilai_kelancaran INTEGER CHECK(nilai_kelancaran BETWEEN 1 AND 10),
      nilai_tajwid    INTEGER CHECK(nilai_tajwid BETWEEN 1 AND 10),
      nilai_makhraj   INTEGER CHECK(nilai_makhraj BETWEEN 1 AND 10),
      catatan         TEXT,
      status          TEXT    NOT NULL DEFAULT 'Lulus'
                              CHECK(status IN ('Lulus','Tidak Lulus','Perlu Ulang')),
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS tahfizh_progress (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id      INTEGER NOT NULL REFERENCES students(id) UNIQUE,
      total_juz       REAL    NOT NULL DEFAULT 0,
      last_surah      TEXT,
      last_ayat       INTEGER,
      last_setoran    TEXT,
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: PPDB — New Student Admissions
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS ppdb_periods (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      tahun_ajaran TEXT   NOT NULL,
      unit        TEXT    NOT NULL,
      tanggal_buka TEXT   NOT NULL,
      tanggal_tutup TEXT  NOT NULL,
      kuota       INTEGER NOT NULL DEFAULT 50,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS registrations (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_no TEXT    NOT NULL UNIQUE,
      period_id       INTEGER REFERENCES ppdb_periods(id),
      nama_lengkap    TEXT    NOT NULL,
      jenis_kelamin   TEXT    CHECK(jenis_kelamin IN ('L','P')),
      tempat_lahir    TEXT,
      tanggal_lahir   TEXT,
      asal_sekolah    TEXT,
      unit_tujuan     TEXT    NOT NULL,
      nama_ayah       TEXT,
      hp_ayah         TEXT,
      nama_ibu        TEXT,
      hp_ibu          TEXT,
      email_wali      TEXT,
      alamat          TEXT,
      status          TEXT    NOT NULL DEFAULT 'PENDING'
                              CHECK(status IN ('PENDING','DITERIMA','DITOLAK','CADANGAN','MENGUNDURKAN_DIRI')),
      catatan_admin   TEXT,
      dokumen_kk      TEXT,
      dokumen_akta    TEXT,
      dokumen_ijazah  TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS ppdb_tests (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL REFERENCES registrations(id),
      jenis_tes      TEXT    NOT NULL,
      nilai          REAL,
      penguji_id     INTEGER REFERENCES employees(id),
      catatan        TEXT,
      tanggal        TEXT    NOT NULL DEFAULT (date('now')),
      created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: TUITION — SPP & Finance Ledger
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS tuition_types (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nama        TEXT    NOT NULL,
      unit        TEXT,
      nominal     REAL    NOT NULL,
      deskripsi   TEXT,
      is_active   INTEGER NOT NULL DEFAULT 1
    )`,

    `CREATE TABLE IF NOT EXISTS tuition_bills (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  INTEGER NOT NULL REFERENCES students(id),
      type_id     INTEGER NOT NULL REFERENCES tuition_types(id),
      bulan       TEXT    NOT NULL,
      tahun       INTEGER NOT NULL,
      nominal     REAL    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'BELUM_BAYAR'
                          CHECK(status IN ('BELUM_BAYAR','LUNAS','CICIL','BEBAS')),
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS tuition_payments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id       INTEGER REFERENCES tuition_bills(id),
      student_id    INTEGER NOT NULL REFERENCES students(id),
      student_name  TEXT    NOT NULL,
      nominal       REAL    NOT NULL,
      metode_bayar  TEXT    NOT NULL DEFAULT 'Tunai'
                            CHECK(metode_bayar IN ('Tunai','Transfer','Kartu','Beasiswa')),
      bulan_periode TEXT    NOT NULL,
      no_kwitansi   TEXT    UNIQUE,
      kasir_id      INTEGER REFERENCES employees(id),
      catatan       TEXT,
      paid_at       TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS tuition_exemptions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id  INTEGER NOT NULL REFERENCES students(id),
      type_id     INTEGER REFERENCES tuition_types(id),
      alasan      TEXT    NOT NULL,
      disetujui_oleh INTEGER REFERENCES employees(id),
      berlaku_dari TEXT,
      berlaku_sampai TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: FACILITIES — Asset & Room Management
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS facilities (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nama        TEXT    NOT NULL,
      kode        TEXT    UNIQUE,
      jenis       TEXT    NOT NULL DEFAULT 'Ruangan'
                          CHECK(jenis IN ('Ruangan','Lapangan','Lab','Asrama','Masjid','Aula','Lainnya')),
      kapasitas   INTEGER,
      lokasi      TEXT,
      kondisi     TEXT    NOT NULL DEFAULT 'Baik'
                          CHECK(kondisi IN ('Baik','Rusak Ringan','Rusak Berat','Tidak Aktif')),
      foto        TEXT,
      is_bookable INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS facility_bookings (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id  INTEGER NOT NULL REFERENCES facilities(id),
      pemohon_id   INTEGER REFERENCES employees(id),
      keperluan    TEXT    NOT NULL,
      tanggal      TEXT    NOT NULL,
      jam_mulai    TEXT    NOT NULL,
      jam_selesai  TEXT    NOT NULL,
      peserta      INTEGER,
      status       TEXT    NOT NULL DEFAULT 'PENDING'
                           CHECK(status IN ('PENDING','DISETUJUI','DITOLAK','SELESAI','DIBATALKAN')),
      catatan      TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS maintenance_orders (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      facility_id  INTEGER NOT NULL REFERENCES facilities(id),
      pelapor_id   INTEGER REFERENCES employees(id),
      petugas_id   INTEGER REFERENCES employees(id),
      deskripsi    TEXT    NOT NULL,
      prioritas    TEXT    NOT NULL DEFAULT 'Sedang'
                           CHECK(prioritas IN ('Rendah','Sedang','Tinggi','Darurat')),
      status       TEXT    NOT NULL DEFAULT 'OPEN'
                           CHECK(status IN ('OPEN','IN_PROGRESS','SELESAI','DITUTUP')),
      biaya_estimasi REAL,
      biaya_aktual   REAL,
      tanggal_lapor  TEXT   NOT NULL DEFAULT (datetime('now')),
      tanggal_selesai TEXT,
      foto_before   TEXT,
      foto_after    TEXT,
      catatan       TEXT
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: CLUBS & EXTRACURRICULAR
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS clubs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nama        TEXT    NOT NULL,
      kategori    TEXT    NOT NULL DEFAULT 'Olahraga'
                          CHECK(kategori IN ('Olahraga','Seni','Akademik','Keagamaan','Teknologi','Lainnya')),
      pembina_id  INTEGER REFERENCES employees(id),
      deskripsi   TEXT,
      jadwal      TEXT,
      lokasi      TEXT,
      max_anggota INTEGER DEFAULT 30,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS club_members (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id    INTEGER NOT NULL REFERENCES clubs(id),
      student_id INTEGER NOT NULL REFERENCES students(id),
      posisi     TEXT    DEFAULT 'Anggota',
      tanggal_masuk TEXT  NOT NULL DEFAULT (date('now')),
      is_active  INTEGER NOT NULL DEFAULT 1,
      UNIQUE(club_id, student_id)
    )`,

    `CREATE TABLE IF NOT EXISTS club_meetings (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id    INTEGER NOT NULL REFERENCES clubs(id),
      tanggal    TEXT    NOT NULL,
      agenda     TEXT,
      lokasi     TEXT,
      catatan    TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS club_achievements (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      club_id    INTEGER REFERENCES clubs(id),
      student_id INTEGER REFERENCES students(id),
      nama_lomba TEXT    NOT NULL,
      tingkat    TEXT    NOT NULL DEFAULT 'Sekolah'
                         CHECK(tingkat IN ('Sekolah','Kecamatan','Kota','Provinsi','Nasional','Internasional')),
      peringkat  TEXT,
      tanggal    TEXT    NOT NULL,
      penyelenggara TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: CURRICULUM HUB
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS academic_years (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tahun_ajaran TEXT    NOT NULL UNIQUE,
      semester     INTEGER NOT NULL DEFAULT 1 CHECK(semester IN (1,2)),
      tanggal_mulai TEXT   NOT NULL,
      tanggal_selesai TEXT NOT NULL,
      is_active    INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS curriculum_subjects (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      kode         TEXT    NOT NULL UNIQUE,
      nama         TEXT    NOT NULL,
      nama_arab    TEXT,
      kategori     TEXT    NOT NULL DEFAULT 'Umum'
                           CHECK(kategori IN ('Diniyah','Umum','Tahfizh','Ekskul','Muatan Lokal')),
      unit         TEXT,
      kelas        TEXT,
      jam_per_minggu INTEGER DEFAULT 2,
      is_active    INTEGER NOT NULL DEFAULT 1,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS lesson_plans (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id   INTEGER NOT NULL REFERENCES curriculum_subjects(id),
      teacher_id   INTEGER REFERENCES employees(id),
      academic_year_id INTEGER REFERENCES academic_years(id),
      judul        TEXT    NOT NULL,
      tujuan       TEXT,
      materi       TEXT,
      metode       TEXT,
      penilaian    TEXT,
      file_url     TEXT,
      status       TEXT    NOT NULL DEFAULT 'Draft'
                           CHECK(status IN ('Draft','Diajukan','Disetujui','Revisi')),
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: GOVERNANCE — WTP Audit
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS audit_periods (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tahun        INTEGER NOT NULL,
      semester     INTEGER DEFAULT 1,
      tanggal_mulai TEXT   NOT NULL,
      tanggal_selesai TEXT,
      auditor      TEXT,
      status       TEXT    NOT NULL DEFAULT 'ONGOING'
                           CHECK(status IN ('PLANNED','ONGOING','COMPLETED','ARCHIVED')),
      predikat     TEXT,
      catatan      TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS audit_findings (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      period_id    INTEGER NOT NULL REFERENCES audit_periods(id),
      kategori     TEXT    NOT NULL DEFAULT 'Temuan Minor',
      deskripsi    TEXT    NOT NULL,
      unit_terkait TEXT,
      rekomendasi  TEXT,
      status       TEXT    NOT NULL DEFAULT 'OPEN'
                           CHECK(status IN ('OPEN','IN_PROGRESS','CLOSED','ACCEPTED')),
      due_date     TEXT,
      closed_at    TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS compliance_checklist (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      period_id    INTEGER NOT NULL REFERENCES audit_periods(id),
      standar      TEXT    NOT NULL,
      indikator    TEXT    NOT NULL,
      bobot        REAL    DEFAULT 1.0,
      nilai        REAL,
      status       TEXT    NOT NULL DEFAULT 'BELUM'
                           CHECK(status IN ('BELUM','SEBAGIAN','MEMENUHI','NA')),
      bukti        TEXT,
      catatan      TEXT
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: TAHUN AJARAN — Academic Year Settings
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS school_calendar (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      academic_year_id INTEGER REFERENCES academic_years(id),
      tanggal      TEXT    NOT NULL,
      nama_kegiatan TEXT   NOT NULL,
      jenis        TEXT    NOT NULL DEFAULT 'Kegiatan'
                           CHECK(jenis IN ('Libur','Kegiatan','Ujian','Hari Besar','Lainnya')),
      deskripsi    TEXT,
      unit         TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS class_rooms (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_kelas   TEXT    NOT NULL,
      unit         TEXT    NOT NULL,
      tingkat      TEXT,
      wali_kelas_id INTEGER REFERENCES employees(id),
      academic_year_id INTEGER REFERENCES academic_years(id),
      kapasitas    INTEGER DEFAULT 30,
      is_active    INTEGER NOT NULL DEFAULT 1
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: GRADUATION & IJAZAH
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS graduation_clearances (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id      INTEGER NOT NULL REFERENCES students(id) UNIQUE,
      academic_year_id INTEGER REFERENCES academic_years(id),
      pillar_gpa      INTEGER NOT NULL DEFAULT 0 CHECK(pillar_gpa IN (0,1)),
      pillar_tahfizh  INTEGER NOT NULL DEFAULT 0 CHECK(pillar_tahfizh IN (0,1)),
      pillar_character INTEGER NOT NULL DEFAULT 0 CHECK(pillar_character IN (0,1)),
      pillar_finance  INTEGER NOT NULL DEFAULT 0 CHECK(pillar_finance IN (0,1)),
      gpa_value       REAL,
      tahfizh_juz     REAL,
      finance_balance REAL    DEFAULT 0,
      all_clear       INTEGER NOT NULL DEFAULT 0,
      reviewed_by     INTEGER REFERENCES employees(id),
      reviewed_at     TEXT,
      catatan         TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS ijazah_certificates (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id      INTEGER NOT NULL REFERENCES students(id),
      clearance_id    INTEGER NOT NULL REFERENCES graduation_clearances(id),
      no_ijazah       TEXT    NOT NULL UNIQUE,
      cert_hash       TEXT    NOT NULL UNIQUE,
      tanggal_terbit  TEXT    NOT NULL DEFAULT (date('now')),
      ttd_direktur    TEXT,
      qr_code_url     TEXT,
      status          TEXT    NOT NULL DEFAULT 'DRAFT'
                              CHECK(status IN ('DRAFT','SIGNED','ISSUED','REVOKED')),
      issued_by       INTEGER REFERENCES employees(id),
      issued_at       TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: RAPOR DIGITAL & CBT (student lifecycle)
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS report_cards (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id      INTEGER NOT NULL REFERENCES students(id),
      academic_year_id INTEGER REFERENCES academic_years(id),
      semester        INTEGER NOT NULL CHECK(semester IN (1,2)),
      wali_kelas_id   INTEGER REFERENCES employees(id),
      status          TEXT    NOT NULL DEFAULT 'DRAFT'
                              CHECK(status IN ('DRAFT','FINAL','PUBLISHED')),
      ttd_wali_tgl    TEXT,
      ttd_kepala_tgl  TEXT,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      UNIQUE(student_id, academic_year_id, semester)
    )`,

    `CREATE TABLE IF NOT EXISTS report_grades (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id    INTEGER NOT NULL REFERENCES report_cards(id),
      subject_id   INTEGER NOT NULL REFERENCES curriculum_subjects(id),
      nilai_uh     REAL,
      nilai_uts    REAL,
      nilai_uas    REAL,
      nilai_praktik REAL,
      nilai_akhir  REAL,
      predikat     TEXT,
      catatan_guru TEXT,
      UNIQUE(report_id, subject_id)
    )`,

    `CREATE TABLE IF NOT EXISTS cbt_exams (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      judul        TEXT    NOT NULL,
      subject_id   INTEGER REFERENCES curriculum_subjects(id),
      academic_year_id INTEGER REFERENCES academic_years(id),
      jenis        TEXT    NOT NULL DEFAULT 'UH'
                           CHECK(jenis IN ('UH','UTS','UAS','Try Out','Seleksi')),
      tanggal_mulai TEXT   NOT NULL,
      tanggal_selesai TEXT,
      durasi_menit INTEGER NOT NULL DEFAULT 90,
      status       TEXT    NOT NULL DEFAULT 'DRAFT'
                           CHECK(status IN ('DRAFT','AKTIF','SELESAI','DIARSIP')),
      created_by   INTEGER REFERENCES employees(id),
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS cbt_results (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id    INTEGER NOT NULL REFERENCES cbt_exams(id),
      student_id INTEGER NOT NULL REFERENCES students(id),
      nilai      REAL,
      durasi_pengerjaan INTEGER,
      submitted_at TEXT  NOT NULL DEFAULT (datetime('now')),
      UNIQUE(exam_id, student_id)
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: MBG (Program Makan Bergizi Gratis — SD At-Tibyan)
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS mbg_receipts (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      nomor_dokumen         TEXT    NOT NULL UNIQUE,
      tanggal               TEXT    NOT NULL,
      hari                  TEXT    NOT NULL,
      waktu                 TEXT    NOT NULL,
      unit                  TEXT    NOT NULL DEFAULT 'primary',
      
      -- Komposisi Menu Detail (General)
      menu_karbohidrat      TEXT    NOT NULL,
      menu_lauk             TEXT    NOT NULL,
      menu_sayur            TEXT    NOT NULL,
      menu_buah_susu        TEXT    NOT NULL,
      
      -- Diet Khusus Bagi Yang Alergi
      diet_karbohidrat      TEXT,
      diet_lauk             TEXT,
      diet_sayur            TEXT,
      diet_buah_susu        TEXT,
      
      -- Penerima Kemasan & Pax
      jumlah_normal         INTEGER NOT NULL DEFAULT 0,
      jumlah_diet_alergi    INTEGER NOT NULL DEFAULT 0,
      jumlah_total          INTEGER NOT NULL DEFAULT 0,
      bentuk_kemasan        TEXT    NOT NULL DEFAULT 'Box',
      kondisi_kemasan       TEXT    NOT NULL DEFAULT 'Baik & Tersegel Rapat',
      catatan_penerima      TEXT,
      
      -- Penerima
      penerima_nama         TEXT    NOT NULL,
      penerima_kontak       TEXT,
      penerima_ttd          TEXT,
      
      -- Pengantar
      pengantar_nama        TEXT    NOT NULL,
      pengantar_kontak      TEXT,
      pengantar_plat_no     TEXT,
      pengantar_ttd         TEXT,
      catatan_pengantar     TEXT,
      
      -- Pengujian Organoleptik
      uji_aroma             TEXT    DEFAULT '["Segar"]',
      uji_tampilan          TEXT    DEFAULT '["Bersih"]',
      uji_rasa              TEXT    DEFAULT '["Normal"]',
      uji_tekstur           TEXT    DEFAULT '["Empuk"]',
      uji_catatan           TEXT,
      kesimpulan_pengujian  TEXT    NOT NULL DEFAULT 'Layak Edar',
      
      -- Sign-off
      penguji_nama          TEXT    NOT NULL,
      penguji_kontak        TEXT,
      penguji_ttd           TEXT,
      kepala_sekolah_nama   TEXT    NOT NULL,
      kepala_sekolah_ttd    TEXT,
      
      status                TEXT    NOT NULL DEFAULT 'LAYAK_EDAR',
      created_by            TEXT,
      created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at            TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  AUDIT LOG (cross-module)
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS audit_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT    NOT NULL,
      user_role  TEXT,
      action     TEXT    NOT NULL,
      module     TEXT,
      detail     TEXT,
      ip_address TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  SEED DATA — demo records so the app looks alive on first run
    // ══════════════════════════════════════════════════════════════════════════

    // Academic year
    `INSERT OR IGNORE INTO academic_years (id, tahun_ajaran, semester, tanggal_mulai, tanggal_selesai, is_active)
     VALUES (1, '2026/2027', 1, '2026-07-14', '2026-12-20', 1)`,

    // Demo students
    `INSERT OR IGNORE INTO students (id, nis, nama_lengkap, jenis_kelamin, unit, kelas, nama_ayah, hp_ayah, status_aktif)
     VALUES
       (1, '2024001', 'Ahmad Fauzan Al-Hakim',    'L', 'senior',   'XII IPA', 'Bapak Hakim',  '0812-0001-0001', 1),
       (2, '2024002', 'Fatimah Azzahra Putri',    'P', 'junior',   'IX A',    'Bapak Azzahra','0812-0002-0002', 1),
       (3, '2024003', 'Muhammad Rizki Ramadhan',  'L', 'primary',  'VI B',    'Bapak Ramadhan','0812-0003-0003',1),
       (4, '2024004', 'Siti Aisyah Nur Hidayah',  'P', 'tahfizh',  'Tahfizh', 'Bapak Hidayah','0812-0004-0004', 1),
       (5, '2024005', 'Zaid Mubarak Al-Farisi',   'L', 'idad_prep','Idad',    'Bapak Farisi', '0812-0005-0005', 1)`,

    // Demo employees
    `INSERT OR IGNORE INTO employees (id, nip, nama_lengkap, jabatan, unit, jenis_kelamin, status_kepegawaian)
     VALUES
       (1, 'EMP-001', 'Ustadz Abdurrahman',   'Musyrif Tahfizh', 'tahfizh',  'L', 'Aktif'),
       (2, 'EMP-002', 'Ustadzah Khadijah',     'Wali Kelas IX A', 'junior',   'P', 'Aktif'),
       (3, 'EMP-003', 'Bapak Ibrahim',         'Kepala Sekolah',  'senior',   'L', 'Aktif'),
       (4, 'EMP-004', 'Ustadz Yusuf',          'Guru Fiqih',      'primary',  'L', 'Aktif')`,

    // Demo curriculum subjects
    `INSERT OR IGNORE INTO curriculum_subjects (id, kode, nama, nama_arab, kategori)
     VALUES
       (1, 'DIN-01', 'Al-Quran & Tahfizh',  'القرآن والتحفيظ', 'Tahfizh'),
       (2, 'DIN-02', 'Fiqih',               'الفقه',            'Diniyah'),
       (3, 'DIN-03', 'Akidah Akhlak',       'العقيدة والأخلاق', 'Diniyah'),
       (4, 'UMM-01', 'Matematika',          NULL,               'Umum'),
       (5, 'UMM-02', 'Bahasa Indonesia',    NULL,               'Umum'),
       (6, 'UMM-03', 'Bahasa Arab',         'اللغة العربية',    'Diniyah')`,

    // Demo halaqah groups
    `INSERT OR IGNORE INTO halaqah_groups (id, nama_halaqah, musyrif_id, unit, tingkat)
     VALUES
       (1, 'Halaqah Al-Fatiha',  1, 'senior',   'XII'),
       (2, 'Halaqah Al-Baqarah', 1, 'junior',   'IX'),
       (3, 'Halaqah Ar-Rahman',  4, 'primary',  'VI')`,

    // Demo clubs
    `INSERT OR IGNORE INTO clubs (id, nama, kategori, pembina_id, jadwal, is_active)
     VALUES
       (1, 'Pramuka',              'Keagamaan', 3, 'Sabtu 14:00',  1),
       (2, 'Futsal',               'Olahraga',  4, 'Jumat 15:30',  1),
       (3, 'Kaligrafi & Tahsin',   'Seni',      1, 'Rabu 14:00',   1)`,

    // Demo tuition types
    `INSERT OR IGNORE INTO tuition_types (id, nama, unit, nominal)
     VALUES
       (1, 'SPP Bulanan Senior', 'senior',  750000),
       (2, 'SPP Bulanan Junior', 'junior',  650000),
       (3, 'SPP Bulanan Primary','primary', 550000)`,

    // Demo audit period
    `INSERT OR IGNORE INTO audit_periods (id, tahun, tanggal_mulai, status, predikat)
     VALUES (1, 2026, '2026-01-01', 'COMPLETED', 'WTP')`,

    // Demo facilities
    `INSERT OR IGNORE INTO facilities (id, nama, kode, jenis, kapasitas, kondisi, is_bookable)
     VALUES
       (1, 'Masjid Al-Ikhlas',  'FAC-001', 'Masjid',  500, 'Baik',  1),
       (2, 'Aula Serbaguna',    'FAC-002', 'Aula',    200, 'Baik',  1),
       (3, 'Lab Komputer A',    'FAC-003', 'Lab',      40, 'Baik',  1),
       (4, 'Lapangan Futsal',   'FAC-004', 'Lapangan', 22, 'Baik',  1),
       (5, 'Asrama Putra Blok A','FAC-005','Asrama',   80, 'Baik',  0)`,

    // Demo graduation clearance
    `INSERT OR IGNORE INTO graduation_clearances
       (student_id, academic_year_id, pillar_gpa, pillar_tahfizh, pillar_character, pillar_finance, gpa_value, tahfizh_juz, all_clear)
     VALUES
       (1, 1, 1, 1, 1, 1, 3.85, 10.0, 1),
       (2, 1, 1, 0, 1, 1, 3.60,  5.5, 0)`,

    // Demo MBG receipt
    `INSERT OR IGNORE INTO mbg_receipts (
       id, nomor_dokumen, tanggal, hari, waktu, unit,
       menu_karbohidrat, menu_lauk, menu_sayur, menu_buah_susu,
       diet_karbohidrat, diet_lauk, diet_sayur, diet_buah_susu,
       jumlah_normal, jumlah_diet_alergi, jumlah_total, bentuk_kemasan, kondisi_kemasan, catatan_penerima,
       penerima_nama, penerima_kontak, pengantar_nama, pengantar_kontak, pengantar_plat_no, catatan_pengantar,
       uji_aroma, uji_tampilan, uji_rasa, uji_tekstur, uji_catatan, kesimpulan_pengujian,
       penguji_nama, penguji_kontak, kepala_sekolah_nama, status
     ) VALUES (
       1, 'FRM-MBG-01/SD/08/2026/001', '2026-08-14', 'Jumat', '10:30 WIB', 'primary',
       'Nasi Putih Pulen', 'Ayam Fillet Saus Tiram + Tempe Goreng', 'Sayur Sop Wortel Buncis', 'Pisang Cavendish + Susu UHT 125ml',
       'Nasi Putih', 'Tahu Bacem (Substitusi Telur: Ahmad)', 'Sayur Sop Wortel', 'Pisang Cavendish (Substitusi Susu: Nisa)',
       240, 10, 250, 'Box', 'Baik & Tersegel Rapat', 'Kemasan lengkap dan higienis, suhu hangat terjaga.',
       'Ustadzah Fatimah, S.Pd.', '0812-3456-7890', 'Pak Joko Supriyadi (Katering Berkah)', '0857-1122-3344', 'D 1842 ABX', 'Tiba tepat waktu pk 10:25 WIB',
       '["Segar"]', '["Bersih"]', '["Normal"]', '["Empuk"]', 'Rasa gurih seimbang, kematangan pas, aroma segar khas rempah.', 'Layak Edar',
       'Ustadz Abdullah, S.Gz (Tim Gizi)', '0813-9988-7766', 'Ustadz Ibrahim, M.Pd (Kepala Sekolah)', 'LAYAK_EDAR'
     )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: TAHFIZH & QURAN SKILL LADDER & CONTRACTS
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS quran_skill_levels (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id) UNIQUE,
      level_category TEXT NOT NULL DEFAULT 'Tahfizh'
                   CHECK(level_category IN ('Iqro','Kelancaran','Tahsin','Tahfizh','Mutun_Qiraat')),
      sub_level    TEXT,
      assigned_by  INTEGER REFERENCES employees(id),
      updated_at   TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS tahfizh_contracts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id     INTEGER NOT NULL REFERENCES students(id),
      target_daily_ayat INTEGER NOT NULL DEFAULT 10,
      target_pages_per_week REAL DEFAULT 5.0,
      target_juz     INTEGER NOT NULL DEFAULT 1,
      start_surah    TEXT,
      end_surah      TEXT,
      start_date     TEXT NOT NULL,
      target_end_date TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'ACTIVE'
                     CHECK(status IN ('ACTIVE','COMPLETED','REVISED','CANCELLED')),
      created_at     TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS khat_progress (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id),
      khat_style   TEXT NOT NULL DEFAULT 'Naskhi'
                   CHECK(khat_style IN ('Naskhi','Suluts','Riqah','Diwani','Farisi','Kufi')),
      stage        TEXT NOT NULL DEFAULT 'Kaedah Huruf'
                   CHECK(stage IN ('Kaedah Huruf','Sambungan Huruf','Kaedah Kalimat','Karya Kaligrafi')),
      nilai_geometri INTEGER CHECK(nilai_geometri BETWEEN 1 AND 10),
      nilai_keindahan INTEGER CHECK(nilai_keindahan BETWEEN 1 AND 10),
      catatan      TEXT,
      evaluator_id INTEGER REFERENCES employees(id),
      tanggal      TEXT DEFAULT (date('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: 5-DAY SENTRA FOCUS & MASTER SCHEDULE MATRIX
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS sentra_daily_focus (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      hari         TEXT NOT NULL UNIQUE,
      sentra_code  TEXT NOT NULL,
      sentra_name  TEXT NOT NULL,
      description  TEXT,
      is_active    INTEGER NOT NULL DEFAULT 1
    )`,

    `CREATE TABLE IF NOT EXISTS master_time_blocks (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      block_name   TEXT NOT NULL,
      jam_mulai    TEXT NOT NULL,
      jam_selesai  TEXT NOT NULL,
      sentra_code  TEXT,
      description  TEXT,
      is_active    INTEGER NOT NULL DEFAULT 1
    )`,

    `CREATE TABLE IF NOT EXISTS teacher_role_assignments (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id   INTEGER NOT NULL REFERENCES employees(id),
      role_type    TEXT NOT NULL CHECK(role_type IN ('WaliKelas','GuruSentra','MusyrifTahfizh','GuruPiket','CoTeacher','Coach')),
      class_id     INTEGER REFERENCES class_rooms(id),
      sentra_code  TEXT,
      halaqah_id   INTEGER REFERENCES halaqah_groups(id),
      academic_year_id INTEGER REFERENCES academic_years(id),
      is_active    INTEGER NOT NULL DEFAULT 1,
      created_at   TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS reflection_circle_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id     INTEGER NOT NULL REFERENCES class_rooms(id),
      tanggal      TEXT NOT NULL,
      wali_kelas_id INTEGER REFERENCES employees(id),
      mood_summary TEXT,
      conflicts_resolved TEXT,
      highlights   TEXT,
      homework_notes TEXT,
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(class_id, tanggal)
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: DAILY SCHOOL OPERATIONS (Habits, Shalat, Qailullah, Sickbay)
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS daily_habits (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id),
      tanggal      TEXT NOT NULL,
      shalat_subuh  TEXT CHECK(shalat_subuh IN ('Berjamaah','Munfarid','Absen')),
      shalat_dhuhur TEXT CHECK(shalat_dhuhur IN ('Berjamaah','Munfarid','Absen')),
      shalat_ashar  TEXT CHECK(shalat_ashar IN ('Berjamaah','Munfarid','Absen')),
      shalat_maghrib TEXT CHECK(shalat_maghrib IN ('Berjamaah','Munfarid','Absen')),
      shalat_isya   TEXT CHECK(shalat_isya IN ('Berjamaah','Munfarid','Absen')),
      shalat_dhuha INTEGER DEFAULT 0,
      shalat_tahajjud INTEGER DEFAULT 0,
      dzikir_pagi   INTEGER DEFAULT 0,
      dzikir_petang  INTEGER DEFAULT 0,
      tilawah_halaman REAL DEFAULT 0,
      catatan_orangtua TEXT,
      verified_by_musyrif INTEGER DEFAULT 0,
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, tanggal)
    )`,

    `CREATE TABLE IF NOT EXISTS shalat_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id),
      tanggal      TEXT NOT NULL,
      waktu_shalat TEXT NOT NULL CHECK(waktu_shalat IN ('Subuh','Dhuhur','Ashar','Maghrib','Isya')),
      waktu_jam    TEXT,
      lokasi       TEXT DEFAULT 'Masjid Al-Ikhlas',
      status       TEXT NOT NULL DEFAULT 'Berjamaah Takbiratul Ihram'
                   CHECK(status IN ('Berjamaah Takbiratul Ihram','Masbuq 1 Rakaat','Masbuq 2+ Rakaat','Munfarid','Haid','Absen')),
      catatan      TEXT,
      verified_by  INTEGER REFERENCES employees(id),
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, tanggal, waktu_shalat)
    )`,

    `CREATE TABLE IF NOT EXISTS qailullah_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id),
      tanggal      TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'Tidur Nyenyak'
                   CHECK(status IN ('Tidur Nyenyak','Istirahat Quiet','Piket/Tugas','Izin/Sakit','Absen')),
      musyrif_id   INTEGER REFERENCES employees(id),
      catatan      TEXT,
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, tanggal)
    )`,

    `CREATE TABLE IF NOT EXISTS daily_class_journal (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tanggal      TEXT NOT NULL,
      class_id     INTEGER REFERENCES class_rooms(id),
      teacher_id   INTEGER REFERENCES employees(id),
      sentra_code  TEXT NOT NULL,
      materi_pokok TEXT NOT NULL,
      pencapaian   TEXT,
      hambatan     TEXT,
      siswa_absen  TEXT,
      catatan      TEXT,
      created_at   TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS sickbay_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id   INTEGER NOT NULL REFERENCES students(id),
      tanggal      TEXT NOT NULL,
      jam_masuk    TEXT NOT NULL,
      jam_keluar   TEXT,
      keluhan      TEXT NOT NULL,
      tindakan     TEXT,
      obat_diberikan TEXT,
      petugas_id   INTEGER REFERENCES employees(id),
      status_ortu_diinfokan INTEGER DEFAULT 0,
      created_at   TEXT DEFAULT (datetime('now'))
    )`,

    // ══════════════════════════════════════════════════════════════════════════
    //  MODULE: OUTINGS & FIELD TRIPS (Rihlah)
    // ══════════════════════════════════════════════════════════════════════════

    `CREATE TABLE IF NOT EXISTS outings (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      judul        TEXT NOT NULL,
      jenis        TEXT NOT NULL DEFAULT 'Rihlah'
                   CHECK(jenis IN ('Rihlah','Field Trip','Outbound','Kunjungan Lab','Bakti Sosial')),
      tujuan       TEXT NOT NULL,
      tanggal      TEXT NOT NULL,
      jam_berangkat TEXT,
      jam_kembali  TEXT,
      biaya_per_siswa REAL DEFAULT 0,
      penanggung_jawab_id INTEGER REFERENCES employees(id),
      deskripsi    TEXT,
      status       TEXT NOT NULL DEFAULT 'PLANNED'
                   CHECK(status IN ('PLANNED','APPROVED','ONGOING','COMPLETED','CANCELLED')),
      created_at   TEXT DEFAULT (datetime('now'))
    )`,

    `CREATE TABLE IF NOT EXISTS outing_participants (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      outing_id    INTEGER NOT NULL REFERENCES outings(id),
      student_id   INTEGER NOT NULL REFERENCES students(id),
      status_izin  TEXT NOT NULL DEFAULT 'PENDING'
                   CHECK(status_izin IN ('PENDING','DISETUJUI_ORTU','DITOLAK_ORTU')),
      tgl_izin     TEXT,
      catatan_ortu TEXT,
      bus_no       TEXT,
      UNIQUE(outing_id, student_id)
    )`,

    // 5-Day Sentra Focus seed
    `INSERT OR IGNORE INTO sentra_daily_focus (id, hari, sentra_code, sentra_name, description) VALUES
       (1, 'Senin',  'DINIYYAH', 'Sentra Diniyyah & Tahfizh', 'Al-Quran Setoran, Mutun, Aqidah, Fiqih, Adab'),
       (2, 'Selasa', 'SAINS',    'Sentra Pengetahuan & Sains', 'Cambridge Science, Lab Experiments, Muslim Scientists'),
       (3, 'Rabu',   'LOGIKA',   'Sentra Nalar & Logika', 'Cambridge Math, Problem Solving, Coding & STEM'),
       (4, 'Kamis',  'BAHASA',   'Sentra Bahasa & Communication', 'Arabic & English Immersion, Public Speaking, Debate'),
       (5, 'Jumat',  'LIFESKILL','Sentra Lifeskill & Olahraga', 'Sunnah Sports, Entrepreneurship, P5 Character')`,

    // Seed Extracurricular Clubs
    `INSERT OR IGNORE INTO clubs (id, nama, kategori, jadwal, lokasi) VALUES
       (1, 'Aikido',                'Martial Arts',   'Jumat 15:00', 'Dojo Asrama'),
       (2, 'Taekwondo',             'Martial Arts',   'Rabu 15:00',  'Aula Serbaguna'),
       (3, 'Tsufuk (Self-Defense)', 'Martial Arts',   'Kamis 15:00', 'Lapangan Utama'),
       (4, 'Pencak Silat',          'Martial Arts',   'Selasa 15:00','Lapangan Futsal'),
       (5, 'Archery (Panahan)',     'Sports',         'Jumat 15:00', 'Lapangan Archery'),
       (6, 'Basketball',            'Sports',         'Senin 15:00', 'Lapangan Basket'),
       (7, 'Robotics & Hardware',   'Tech & STEM',    'Rabu 15:00',  'Lab Komputer A'),
       (8, 'Coding & Game Dev',     'Tech & STEM',    'Kamis 15:00', 'Lab Komputer B'),
       (9, 'Drawing & Fine Arts',   'Arts & Design',  'Selasa 15:00','Studio Seni'),
       (10,'Graphic Design',        'Arts & Design',  'Senin 15:00', 'Lab Komputer A'),
       (11,'Photography & Video',   'Arts & Design',  'Rabu 15:00',  'Studio Media'),
       (12,'Public Speaking & Debate','Communication','Kamis 15:00', 'Aula Mini')`,

    // Seed Demo Outing
    `INSERT OR IGNORE INTO outings (id, judul, jenis, tujuan, tanggal, jam_berangkat, jam_kembali, biaya_per_siswa, status) VALUES
       (1, 'Rihlah & Outbound Sains Islam 2026', 'Rihlah', 'Observatorium & Plantologi Lembang', '2026-09-10', '06:30', '17:00', 150000, 'APPROVED')`,

    // Seed Tahfizh Contracts
    `INSERT OR IGNORE INTO tahfizh_contracts (id, student_id, target_daily_ayat, target_pages_per_week, target_juz, start_surah, end_surah, start_date, target_end_date) VALUES
       (1, 1, 28, 14.0, 10, 'Al-Baqarah', 'An-Nas', '2026-07-15', '2027-06-30'),
       (2, 2,  5,  2.5,  5, 'Juz Amma',   'Al-Mulk','2026-07-15', '2027-06-30')`,

    // Audit log seed
    `INSERT OR IGNORE INTO audit_log (id, user_email, user_role, action, module, detail)
     VALUES (1, 'superadmin@buana.studio', 'director', 'INIT_DB', 'system', 'Database schema initialized')`

  ];

  // Execute one by one (libsql doesn't support multi-statement in all modes)
  for (const sql of statements) {
    try {
      await db.execute(sql);
    } catch (err) {
      // Log but continue — some inserts may fail on re-run (unique constraint)
      if (!err.message.includes('UNIQUE') && !err.message.includes('already exists')) {
        console.error('[initSchema] Failed:', sql.slice(0, 80), '\n', err.message);
      }
    }
  }

  console.log('[initSchema] Done — all tables created, seed data inserted.');
}

module.exports = { db, initSchema };
