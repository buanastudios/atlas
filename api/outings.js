const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const outingsRs = await db.execute({
        sql: `SELECT o.*, e.nama_lengkap as pj_name, COUNT(op.id) as total_participants
              FROM outings o
              LEFT JOIN employees e ON o.penanggung_jawab_id = e.id
              LEFT JOIN outing_participants op ON o.id = op.outing_id
              GROUP BY o.id
              ORDER BY o.tanggal DESC`,
        args: []
      });

      const participantsRs = await db.execute({
        sql: `SELECT op.*, o.judul as outing_title, s.nama_lengkap as student_name, s.kelas
              FROM outing_participants op
              JOIN outings o ON op.outing_id = o.id
              JOIN students s ON op.student_id = s.id
              ORDER BY op.id DESC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        outings: outingsRs.rows,
        participants: participantsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'create_outing') {
        const { judul, jenis, tujuan, tanggal, jam_berangkat, jam_kembali, biaya_per_siswa, deskripsi } = req.body;
        await db.execute({
          sql: `INSERT INTO outings (judul, jenis, tujuan, tanggal, jam_berangkat, jam_kembali, biaya_per_siswa, deskripsi, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED')`,
          args: [judul, jenis || 'Rihlah', tujuan, tanggal, jam_berangkat || '07:00', jam_kembali || '16:00', biaya_per_siswa || 0, deskripsi || '']
        });
        return res.status(200).json({ success: true, message: 'Kegiatan Rihlah / Outing baru berhasil dibuat.' });
      }

      if (action === 'parent_consent') {
        const { outing_id, student_id, status_izin, catatan_ortu } = req.body;
        await db.execute({
          sql: `INSERT INTO outing_participants (outing_id, student_id, status_izin, tgl_izin, catatan_ortu)
                VALUES (?, ?, ?, datetime('now'), ?)
                ON CONFLICT(outing_id, student_id) DO UPDATE SET
                status_izin = excluded.status_izin,
                tgl_izin = datetime('now'),
                catatan_ortu = excluded.catatan_ortu`,
          args: [outing_id, student_id, status_izin || 'DISETUJUI_ORTU', catatan_ortu || '']
        });
        return res.status(200).json({ success: true, message: 'Surat Izin Orang Tua berhasil dikonfirmasi.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/outings] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
