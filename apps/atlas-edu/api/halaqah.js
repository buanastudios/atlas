const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const date = req.query.date || new Date().toISOString().split('T')[0];

      // Get students
      const studentsRs = await db.execute({
        sql: `SELECT s.id, s.nis, s.nama_lengkap, s.unit, s.kelas
              FROM students s
              WHERE s.status_aktif = 1
              ORDER BY s.nama_lengkap ASC`,
        args: []
      });

      // Get attendance records for this date
      const attendanceRs = await db.execute({
        sql: `SELECT ar.student_id, ar.status, ar.keterangan
              FROM attendance_records ar
              JOIN attendance_sessions ases ON ar.session_id = ases.id
              WHERE ases.tanggal = ?`,
        args: [date]
      });

      const attendanceMap = {};
      attendanceRs.rows.forEach(r => {
        attendanceMap[r.student_id] = { status: r.status, note: r.keterangan };
      });

      return res.status(200).json({
        success: true,
        date,
        students: studentsRs.rows,
        attendance: attendanceMap
      });
    }

    if (req.method === 'POST') {
      const { date, session_name, halaqah_id, records } = req.body || {};
      const tanggal = date || new Date().toISOString().split('T')[0];
      const halId = halaqah_id || 1;

      // Find or create attendance session
      let sessionRs = await db.execute({
        sql: `SELECT id FROM attendance_sessions WHERE tanggal = ? AND halaqah_id = ?`,
        args: [tanggal, halId]
      });

      let sessionId;
      if (sessionRs.rows.length > 0) {
        sessionId = sessionRs.rows[0].id;
      } else {
        const insSess = await db.execute({
          sql: `INSERT INTO attendance_sessions (halaqah_id, tanggal, sesi) VALUES (?, ?, ?)`,
          args: [halId, tanggal, session_name || 'Pagi']
        });
        sessionId = Number(insSess.lastInsertRowid);
      }

      // Upsert attendance records
      if (records && typeof records === 'object') {
        for (const [studentId, data] of Object.entries(records)) {
          const status = typeof data === 'string' ? data : data.status;
          const note = typeof data === 'object' ? (data.note || '') : '';

          if (status) {
            await db.execute({
              sql: `INSERT INTO attendance_records (session_id, student_id, status, keterangan)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(session_id, student_id) DO UPDATE SET
                    status = excluded.status,
                    keterangan = excluded.keterangan`,
              args: [sessionId, studentId, status, note]
            });
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Absensi halaqah berhasil disimpan.',
        session_id: sessionId
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/halaqah] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
