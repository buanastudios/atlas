const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { search, status, limit = 100, offset = 0 } = req.query;

    let sql  = `SELECT id, nis, nisn, nama_lengkap, nama_arab, jenis_kelamin,
                       tempat_lahir, tanggal_lahir, nama_ayah, hp_ayah,
                       nama_ibu, hp_ibu, nama_wali, hp_wali as no_hp_wali,
                       status_aktif, status_santri, status_lokasi, kelas, kamar
                FROM students WHERE 1=1`;
    const args = [];

    if (search) {
      sql += ' AND (nama_lengkap LIKE ? OR nis LIKE ?)';
      args.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      sql += ' AND status_santri = ?';
      args.push(status);
    }

    sql += ` ORDER BY nama_lengkap ASC LIMIT ? OFFSET ?`;
    args.push(Number(limit), Number(offset));

    const result = await db.execute({ sql, args });

    let countSql  = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
    const countArgs = [];
    if (search) { countSql += ' AND (nama_lengkap LIKE ? OR nis LIKE ?)'; countArgs.push(`%${search}%`, `%${search}%`); }
    if (status) { countSql += ' AND status_santri = ?';   countArgs.push(status); }

    const countResult = await db.execute({ sql: countSql, args: countArgs });

    return res.status(200).json({
      success: true,
      data:    result.rows,
      count:   result.rows.length,
      total:   countResult.rows[0]?.total ?? 0,
    });

  } catch (err) {
    console.error('[get-students] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
