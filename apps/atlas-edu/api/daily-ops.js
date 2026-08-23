const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const type = req.query.type || 'habits';
    const date = req.query.date || new Date().toISOString().split('T')[0];

    if (req.method === 'GET') {
      if (type === 'shalat') {
        const rs = await db.execute({
          sql: `SELECT sl.*, s.nama_lengkap as student_name, s.kelas
                FROM shalat_logs sl
                JOIN students s ON sl.student_id = s.id
                WHERE sl.tanggal = ?
                ORDER BY sl.id DESC`,
          args: [date]
        });
        return res.status(200).json({ success: true, date, shalat_logs: rs.rows });
      }

      if (type === 'qailullah') {
        const rs = await db.execute({
          sql: `SELECT ql.*, s.nama_lengkap as student_name, s.kelas
                FROM qailullah_logs ql
                JOIN students s ON ql.student_id = s.id
                WHERE ql.tanggal = ?`,
          args: [date]
        });
        return res.status(200).json({ success: true, date, qailullah_logs: rs.rows });
      }

      if (type === 'journal') {
        const rs = await db.execute({
          sql: `SELECT dcj.*, e.nama_lengkap as teacher_name
                FROM daily_class_journal dcj
                LEFT JOIN employees e ON dcj.teacher_id = e.id
                WHERE dcj.tanggal = ?`,
          args: [date]
        });
        return res.status(200).json({ success: true, date, journals: rs.rows });
      }

      if (type === 'sickbay') {
        const rs = await db.execute({
          sql: `SELECT sb.*, s.nama_lengkap as student_name, s.kelas
                FROM sickbay_logs sb
                JOIN students s ON sb.student_id = s.id
                ORDER BY sb.id DESC LIMIT 30`,
          args: []
        });
        return res.status(200).json({ success: true, sickbay_logs: rs.rows });
      }

      // Default: daily habits
      const rs = await db.execute({
        sql: `SELECT dh.*, s.nama_lengkap as student_name, s.kelas
              FROM daily_habits dh
              JOIN students s ON dh.student_id = s.id
              WHERE dh.tanggal = ?`,
        args: [date]
      });

      const studentsRs = await db.execute({
        sql: `SELECT id, nis, nama_lengkap, kelas FROM students WHERE status_aktif = 1 ORDER BY nama_lengkap ASC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        date,
        habits: rs.rows,
        students: studentsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'save_shalat') {
        const { student_id, waktu_shalat, waktu_jam, lokasi, status, catatan } = req.body;
        await db.execute({
          sql: `INSERT INTO shalat_logs (student_id, tanggal, waktu_shalat, waktu_jam, lokasi, status, catatan)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(student_id, tanggal, waktu_shalat) DO UPDATE SET
                waktu_jam = excluded.waktu_jam,
                status = excluded.status,
                catatan = excluded.catatan`,
          args: [student_id, date, waktu_shalat || 'Dhuhur', waktu_jam || '12:05', lokasi || 'Masjid Al-Ikhlas', status || 'Berjamaah Takbiratul Ihram', catatan || '']
        });
        return res.status(200).json({ success: true, message: 'Presensi Shalat berhasil dicatat.' });
      }

      if (action === 'save_qailullah') {
        const { student_id, status, catatan } = req.body;
        await db.execute({
          sql: `INSERT INTO qailullah_logs (student_id, tanggal, status, catatan)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(student_id, tanggal) DO UPDATE SET
                status = excluded.status,
                catatan = excluded.catatan`,
          args: [student_id, date, status || 'Tidur Nyenyak', catatan || '']
        });
        return res.status(200).json({ success: true, message: 'Jurnal Istirahat Qailullah berhasil disimpan.' });
      }

      if (action === 'save_journal') {
        const { class_id, teacher_id, sentra_code, materi_pokok, pencapaian, hambatan, siswa_absen } = req.body;
        await db.execute({
          sql: `INSERT INTO daily_class_journal (tanggal, class_id, teacher_id, sentra_code, materi_pokok, pencapaian, hambatan, siswa_absen)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [date, class_id || 1, teacher_id || 1, sentra_code || 'SAINS', materi_pokok || 'Materi Daily', pencapaian || '', hambatan || '', siswa_absen || '']
        });
        return res.status(200).json({ success: true, message: 'Jurnal KBM Daily Sentra berhasil disimpan.' });
      }

      if (action === 'save_sickbay') {
        const { student_id, jam_masuk, keluhan, tindakan, obat_diberikan } = req.body;
        await db.execute({
          sql: `INSERT INTO sickbay_logs (student_id, tanggal, jam_masuk, keluhan, tindakan, obat_diberikan)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [student_id, date, jam_masuk || '09:00', keluhan || '', tindakan || '', obat_diberikan || '']
        });
        return res.status(200).json({ success: true, message: 'Catatan Penanganan UKS / Klinik berhasil disimpan.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/daily-ops] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
