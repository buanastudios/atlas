const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const facilitiesRs = await db.execute({
        sql: `SELECT * FROM facilities ORDER BY nama ASC`,
        args: []
      });

      const bookingsRs = await db.execute({
        sql: `SELECT fb.*, f.nama as facility_name
              FROM facility_bookings fb
              JOIN facilities f ON fb.facility_id = f.id
              ORDER BY fb.id DESC LIMIT 30`,
        args: []
      });

      const maintenanceRs = await db.execute({
        sql: `SELECT mo.*, f.nama as facility_name
              FROM maintenance_orders mo
              JOIN facilities f ON mo.facility_id = f.id
              ORDER BY mo.id DESC LIMIT 30`,
        args: []
      });

      return res.status(200).json({
        success: true,
        facilities: facilitiesRs.rows,
        bookings: bookingsRs.rows,
        maintenance: maintenanceRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'create_booking') {
        const { facility_id, keperluan, tanggal, jam_mulai, jam_selesai, peserta } = req.body;
        await db.execute({
          sql: `INSERT INTO facility_bookings (facility_id, keperluan, tanggal, jam_mulai, jam_selesai, peserta, status)
                VALUES (?, ?, ?, ?, ?, ?, 'DISETUJUI')`,
          args: [facility_id, keperluan || 'Kegiatan', tanggal, jam_mulai || '08:00', jam_selesai || '10:00', peserta || 20]
        });
        return res.status(200).json({ success: true, message: 'Permohonan peminjaman ruangan berhasil dikirim.' });
      }

      if (action === 'create_maintenance') {
        const { facility_id, deskripsi, prioritas, biaya_estimasi } = req.body;
        await db.execute({
          sql: `INSERT INTO maintenance_orders (facility_id, deskripsi, prioritas, biaya_estimasi, status)
                VALUES (?, ?, ?, ?, 'OPEN')`,
          args: [facility_id, deskripsi || 'Perbaikan', prioritas || 'Sedang', biaya_estimasi || 0]
        });
        return res.status(200).json({ success: true, message: 'Work order pemeliharaan aset berhasil dibuat.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/facilities] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
