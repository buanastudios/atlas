const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const type = req.query.type || 'setoran';

    if (req.method === 'GET') {
      if (type === 'contracts') {
        const rs = await db.execute({
          sql: `SELECT tc.*, s.nama_lengkap as student_name, s.nis, s.kelas
                FROM tahfizh_contracts tc
                JOIN students s ON tc.student_id = s.id
                ORDER BY tc.id DESC`,
          args: []
        });
        return res.status(200).json({ success: true, contracts: rs.rows });
      }

      if (type === 'skill_levels') {
        const rs = await db.execute({
          sql: `SELECT qsl.*, s.nama_lengkap as student_name, s.nis
                FROM quran_skill_levels qsl
                JOIN students s ON qsl.student_id = s.id`,
          args: []
        });
        return res.status(200).json({ success: true, skill_levels: rs.rows });
      }

      if (type === 'khat') {
        const rs = await db.execute({
          sql: `SELECT kp.*, s.nama_lengkap as student_name
                FROM khat_progress kp
                JOIN students s ON kp.student_id = s.id
                ORDER BY kp.id DESC LIMIT 50`,
          args: []
        });
        return res.status(200).json({ success: true, khat_history: rs.rows });
      }

      // Default: fetch setoran history & student list
      const setoranRs = await db.execute({
        sql: `SELECT ts.*, s.nama_lengkap as student_name, s.kelas
              FROM tahfizh_setoran ts
              JOIN students s ON ts.student_id = s.id
              ORDER BY ts.id DESC LIMIT 50`,
        args: []
      });

      const studentsRs = await db.execute({
        sql: `SELECT id, nis, nama_lengkap, kelas FROM students WHERE status_aktif = 1 ORDER BY nama_lengkap ASC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        setoran: setoranRs.rows,
        students: studentsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'save_contract') {
        const { student_id, target_daily_ayat, target_juz, start_surah, end_surah, start_date, target_end_date } = req.body;
        await db.execute({
          sql: `INSERT INTO tahfizh_contracts (student_id, target_daily_ayat, target_juz, start_surah, end_surah, start_date, target_end_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [student_id, target_daily_ayat || 10, target_juz || 1, start_surah || '', end_surah || '', start_date || new Date().toISOString().split('T')[0], target_end_date || '']
        });
        return res.status(200).json({ success: true, message: 'Kontrak Tahfizh Individual berhasil dibuat.' });
      }

      if (action === 'save_khat') {
        const { student_id, khat_style, stage, nilai_geometri, nilai_keindahan, catatan } = req.body;
        await db.execute({
          sql: `INSERT INTO khat_progress (student_id, khat_style, stage, nilai_geometri, nilai_keindahan, catatan)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [student_id, khat_style || 'Naskhi', stage || 'Kaedah Huruf', nilai_geometri || 8, nilai_keindahan || 8, catatan || '']
        });
        return res.status(200).json({ success: true, message: 'Progress Kaligrafi/Khat berhasil disimpan.' });
      }

      // Default: save new setoran
      const { student_id, jenis_setoran, surah_dari, ayat_dari, surah_sampai, ayat_sampai, jumlah_halaman, nilai_kelancaran, nilai_tajwid, nilai_makhraj, catatan } = req.body;
      
      await db.execute({
        sql: `INSERT INTO tahfizh_setoran 
              (student_id, jenis_setoran, surah_dari, ayat_dari, surah_sampai, ayat_sampai, jumlah_halaman, nilai_kelancaran, nilai_tajwid, nilai_makhraj, catatan, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          student_id,
          jenis_setoran || 'Hafalan',
          surah_dari || '',
          ayat_dari || 1,
          surah_sampai || '',
          ayat_sampai || 1,
          jumlah_halaman || 1.0,
          nilai_kelancaran || 8,
          nilai_tajwid || 8,
          nilai_makhraj || 8,
          catatan || '',
          'Lulus'
        ]
      });

      // Update student overall progress
      await db.execute({
        sql: `INSERT INTO tahfizh_progress (student_id, total_juz, last_surah, last_ayat, last_setoran)
              VALUES (?, ?, ?, ?, date('now'))
              ON CONFLICT(student_id) DO UPDATE SET
              total_juz = total_juz + 0.1,
              last_surah = excluded.last_surah,
              last_ayat = excluded.last_ayat,
              last_setoran = date('now')`,
        args: [student_id, 0.1, surah_sampai || '', ayat_sampai || 1]
      });

      return res.status(200).json({ success: true, message: 'Setoran Tahfizh berhasil dicatat.' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/tahfizh] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
