const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const clubsRs = await db.execute({
        sql: `SELECT c.*, COUNT(cm.id) as total_members
              FROM clubs c
              LEFT JOIN club_members cm ON c.id = cm.club_id AND cm.is_active = 1
              GROUP BY c.id
              ORDER BY c.kategori ASC, c.nama ASC`,
        args: []
      });

      const membersRs = await db.execute({
        sql: `SELECT cm.*, c.nama as club_name, s.nama_lengkap as student_name, s.kelas
              FROM club_members cm
              JOIN clubs c ON cm.club_id = c.id
              JOIN students s ON cm.student_id = s.id
              ORDER BY cm.id DESC`,
        args: []
      });

      const achievementsRs = await db.execute({
        sql: `SELECT ca.*, c.nama as club_name, s.nama_lengkap as student_name
              FROM club_achievements ca
              LEFT JOIN clubs c ON ca.club_id = c.id
              LEFT JOIN students s ON ca.student_id = s.id
              ORDER BY ca.id DESC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        clubs: clubsRs.rows,
        members: membersRs.rows,
        achievements: achievementsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'enroll') {
        const { club_id, student_id, tingkat_sabuk } = req.body;
        await db.execute({
          sql: `INSERT INTO club_members (club_id, student_id, tingkat_sabuk)
                VALUES (?, ?, ?)
                ON CONFLICT(club_id, student_id) DO UPDATE SET
                is_active = 1,
                tingkat_sabuk = excluded.tingkat_sabuk`,
          args: [club_id, student_id, tingkat_sabuk || 'Pemula / Sabuk Putih']
        });
        return res.status(200).json({ success: true, message: 'Pendaftaran ekstrakurikuler berhasil.' });
      }

      if (action === 'update_rank') {
        const { member_id, tingkat_sabuk } = req.body;
        await db.execute({
          sql: `UPDATE club_members SET tingkat_sabuk = ? WHERE id = ?`,
          args: [tingkat_sabuk, member_id]
        });
        return res.status(200).json({ success: true, message: 'Tingkat sabuk/level berhasil diperbarui.' });
      }

      if (action === 'add_achievement') {
        const { club_id, student_id, nama_lomba, tingkat, peringkat, penyelenggara, tanggal } = req.body;
        await db.execute({
          sql: `INSERT INTO club_achievements (club_id, student_id, nama_lomba, tingkat, peringkat, penyelenggara, tanggal)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [club_id, student_id, nama_lomba, tingkat || 'Sekolah', peringkat || 'Juara 1', penyelenggara || '', tanggal || new Date().toISOString().split('T')[0]]
        });
        return res.status(200).json({ success: true, message: 'Prestasi lomba berhasil dicatat.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/clubs] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
