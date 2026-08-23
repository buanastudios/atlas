const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const framework = req.query.framework || 'ALL';

      const sentraRs = await db.execute({
        sql: `SELECT * FROM sentra_daily_focus ORDER BY id ASC`,
        args: []
      });

      const subjectsRs = await db.execute({
        sql: `SELECT * FROM curriculum_subjects WHERE is_active = 1 ORDER BY kategori ASC, nama ASC`,
        args: []
      });

      const plansRs = await db.execute({
        sql: `SELECT lp.*, cs.nama as subject_name, e.nama_lengkap as teacher_name
              FROM lesson_plans lp
              JOIN curriculum_subjects cs ON lp.subject_id = cs.id
              LEFT JOIN employees e ON lp.teacher_id = e.id
              ORDER BY lp.id DESC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        framework,
        sentra_schedule: sentraRs.rows,
        subjects: subjectsRs.rows,
        lesson_plans: plansRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'submit_rpp') {
        const { subject_id, teacher_id, judul, tujuan, materi, metode, penilaian } = req.body;
        await db.execute({
          sql: `INSERT INTO lesson_plans (subject_id, teacher_id, judul, tujuan, materi, metode, penilaian, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Diajukan')`,
          args: [subject_id || 1, teacher_id || 1, judul || 'RPP Baru', tujuan || '', materi || '', metode || '', penilaian || '']
        });
        return res.status(200).json({ success: true, message: 'Modul Ajar / RPP berhasil diajukan untuk ditelaah.' });
      }

      if (action === 'approve_rpp') {
        const { plan_id, status } = req.body;
        await db.execute({
          sql: `UPDATE lesson_plans SET status = ?, updated_at = datetime('now') WHERE id = ?`,
          args: [status || 'Disetujui', plan_id]
        });
        return res.status(200).json({ success: true, message: `Status Modul Ajar diubah menjadi ${status}.` });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/curriculum] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
