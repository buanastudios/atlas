const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const type = req.query.type || 'roles';

    if (req.method === 'GET') {
      if (type === 'reflection') {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const rs = await db.execute({
          sql: `SELECT rcl.*, cr.nama_kelas, e.nama_lengkap as wali_kelas_nama
                FROM reflection_circle_logs rcl
                JOIN class_rooms cr ON rcl.class_id = cr.id
                LEFT JOIN employees e ON rcl.wali_kelas_id = e.id
                WHERE rcl.tanggal = ?`,
          args: [date]
        });
        return res.status(200).json({ success: true, date, reflections: rs.rows });
      }

      if (type === 'master_schedule') {
        const rs = await db.execute({
          sql: `SELECT * FROM master_time_blocks ORDER BY jam_mulai ASC`,
          args: []
        });
        return res.status(200).json({ success: true, schedule_blocks: rs.rows });
      }

      // Default: teacher role assignments
      const rolesRs = await db.execute({
        sql: `SELECT tra.*, e.nama_lengkap as teacher_name, e.jabatan, cr.nama_kelas
              FROM teacher_role_assignments tra
              JOIN employees e ON tra.teacher_id = e.id
              LEFT JOIN class_rooms cr ON tra.class_id = cr.id
              ORDER BY e.nama_lengkap ASC`,
        args: []
      });

      const teachersRs = await db.execute({
        sql: `SELECT id, nip, nama_lengkap, jabatan, unit FROM employees WHERE status_kepegawaian = 'Aktif'`,
        args: []
      });

      return res.status(200).json({
        success: true,
        assignments: rolesRs.rows,
        teachers: teachersRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'assign_role') {
        const { teacher_id, role_type, class_id, sentra_code, halaqah_id } = req.body;
        await db.execute({
          sql: `INSERT INTO teacher_role_assignments (teacher_id, role_type, class_id, sentra_code, halaqah_id)
                VALUES (?, ?, ?, ?, ?)`,
          args: [teacher_id, role_type || 'WaliKelas', class_id || null, sentra_code || null, halaqah_id || null]
        });
        return res.status(200).json({ success: true, message: 'Penugasan peran guru berhasil disimpan.' });
      }

      if (action === 'save_reflection') {
        const { class_id, wali_kelas_id, mood_summary, conflicts_resolved, highlights, homework_notes } = req.body;
        const date = new Date().toISOString().split('T')[0];
        await db.execute({
          sql: `INSERT INTO reflection_circle_logs (class_id, tanggal, wali_kelas_id, mood_summary, conflicts_resolved, highlights, homework_notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(class_id, tanggal) DO UPDATE SET
                mood_summary = excluded.mood_summary,
                conflicts_resolved = excluded.conflicts_resolved,
                highlights = excluded.highlights,
                homework_notes = excluded.homework_notes`,
          args: [class_id || 1, date, wali_kelas_id || 1, mood_summary || '', conflicts_resolved || '', highlights || '', homework_notes || '']
        });
        return res.status(200).json({ success: true, message: 'Catatan Reflection & Resolution Circle sore berhasil disimpan.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/teacher-mgmt] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
