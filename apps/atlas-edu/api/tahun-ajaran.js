const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const yearsRs = await db.execute({
        sql: `SELECT * FROM academic_years ORDER BY id DESC`,
        args: []
      });

      const calendarRs = await db.execute({
        sql: `SELECT * FROM school_calendar ORDER BY tanggal ASC`,
        args: []
      });

      const roomsRs = await db.execute({
        sql: `SELECT cr.*, e.nama_lengkap as wali_kelas_nama
              FROM class_rooms cr
              LEFT JOIN employees e ON cr.wali_kelas_id = e.id
              ORDER BY cr.nama_kelas ASC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        years: yearsRs.rows,
        calendar: calendarRs.rows,
        classrooms: roomsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'set_active_year') {
        const { year_id } = req.body;
        await db.execute({ sql: `UPDATE academic_years SET is_active = 0`, args: [] });
        await db.execute({ sql: `UPDATE academic_years SET is_active = 1 WHERE id = ?`, args: [year_id] });
        return res.status(200).json({ success: true, message: 'Tahun Ajaran aktif berhasil diubah.' });
      }

      if (action === 'add_calendar') {
        const { academic_year_id, tanggal, nama_kegiatan, jenis, deskripsi } = req.body;
        await db.execute({
          sql: `INSERT INTO school_calendar (academic_year_id, tanggal, nama_kegiatan, jenis, deskripsi)
                VALUES (?, ?, ?, ?, ?)`,
          args: [academic_year_id || 1, tanggal, nama_kegiatan, jenis || 'Kegiatan', deskripsi || '']
        });
        return res.status(200).json({ success: true, message: 'Agenda kalender pendidikan berhasil ditambahkan.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/tahun-ajaran] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
