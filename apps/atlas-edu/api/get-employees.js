const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const search = req.query.search || '';
      let sql = `SELECT * FROM employees WHERE 1=1`;
      const args = [];

      if (search) {
        sql += ` AND (nama_lengkap LIKE ? OR nip LIKE ? OR jabatan LIKE ?)`;
        args.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      sql += ` ORDER BY nama_lengkap ASC`;
      const rs = await db.execute({ sql, args });

      return res.status(200).json({ success: true, employees: rs.rows, count: rs.rows.length });
    }

    if (req.method === 'POST') {
      const { nip, nama_lengkap, jabatan, unit, jenis_kelamin, no_hp, email } = req.body || {};
      if (!nama_lengkap) {
        return res.status(400).json({ success: false, error: 'Nama lengkap guru/karyawan wajib diisi.' });
      }

      const generatedNip = nip || `EMP-${Date.now().toString().slice(-4)}`;

      await db.execute({
        sql: `INSERT INTO employees (nip, nama_lengkap, jabatan, unit, jenis_kelamin, no_hp, email, status_kepegawaian)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'Aktif')`,
        args: [generatedNip, nama_lengkap, jabatan || 'Pengajar', unit || 'senior', jenis_kelamin || 'L', no_hp || '', email || '']
      });

      return res.status(200).json({ success: true, message: 'Profil guru/karyawan berhasil ditambahkan.', nip: generatedNip });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/get-employees] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
