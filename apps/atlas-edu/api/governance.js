const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const periodsRs = await db.execute({
        sql: `SELECT * FROM audit_periods ORDER BY id DESC`,
        args: []
      });

      const findingsRs = await db.execute({
        sql: `SELECT * FROM audit_findings ORDER BY id DESC`,
        args: []
      });

      const checklistRs = await db.execute({
        sql: `SELECT * FROM compliance_checklist ORDER BY id ASC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        periods: periodsRs.rows,
        findings: findingsRs.rows,
        checklist: checklistRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'add_finding') {
        const { period_id, kategori, deskripsi, unit_terkait, rekomendasi, due_date } = req.body;
        await db.execute({
          sql: `INSERT INTO audit_findings (period_id, kategori, deskripsi, unit_terkait, rekomendasi, due_date, status)
                VALUES (?, ?, ?, ?, ?, ?, 'OPEN')`,
          args: [period_id || 1, kategori || 'Temuan Minor', deskripsi, unit_terkait || 'Akademik', rekomendasi || '', due_date || '']
        });
        return res.status(200).json({ success: true, message: 'Temuan audit baru (CAPA) berhasil dicatat.' });
      }

      if (action === 'close_finding') {
        const { finding_id } = req.body;
        await db.execute({
          sql: `UPDATE audit_findings SET status = 'CLOSED', closed_at = datetime('now') WHERE id = ?`,
          args: [finding_id]
        });
        return res.status(200).json({ success: true, message: 'Temuan audit berhasil ditutup (CLOSED).' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/governance] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
