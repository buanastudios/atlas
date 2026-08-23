const { db } = require('./_db');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const clearancesRs = await db.execute({
        sql: `SELECT gc.*, s.nama_lengkap as student_name, s.nis, s.kelas
              FROM graduation_clearances gc
              JOIN students s ON gc.student_id = s.id
              ORDER BY s.nama_lengkap ASC`,
        args: []
      });

      const certsRs = await db.execute({
        sql: `SELECT ic.*, s.nama_lengkap as student_name, s.nis
              FROM ijazah_certificates ic
              JOIN students s ON ic.student_id = s.id
              ORDER BY ic.id DESC`,
        args: []
      });

      return res.status(200).json({
        success: true,
        clearances: clearancesRs.rows,
        certificates: certsRs.rows
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'toggle_pillar') {
        const { student_id, pillar_name, value } = req.body;
        const validPillars = ['pillar_gpa', 'pillar_tahfizh', 'pillar_character', 'pillar_finance'];
        if (!validPillars.includes(pillar_name)) {
          return res.status(400).json({ success: false, error: 'Pillar invalid' });
        }

        // Get current clearance record
        const cur = await db.execute({
          sql: `SELECT * FROM graduation_clearances WHERE student_id = ?`,
          args: [student_id]
        });

        let rec = cur.rows[0];
        if (!rec) {
          await db.execute({
            sql: `INSERT INTO graduation_clearances (student_id, ${pillar_name}) VALUES (?, ?)`,
            args: [student_id, value ? 1 : 0]
          });
        } else {
          await db.execute({
            sql: `UPDATE graduation_clearances SET ${pillar_name} = ?, updated_at = datetime('now') WHERE student_id = ?`,
            args: [value ? 1 : 0, student_id]
          });
        }

        // Re-evaluate all_clear status
        const updated = await db.execute({
          sql: `SELECT pillar_gpa, pillar_tahfizh, pillar_character, pillar_finance FROM graduation_clearances WHERE student_id = ?`,
          args: [student_id]
        });

        const r = updated.rows[0];
        const allClear = (r.pillar_gpa === 1 && r.pillar_tahfizh === 1 && r.pillar_character === 1 && r.pillar_finance === 1) ? 1 : 0;

        await db.execute({
          sql: `UPDATE graduation_clearances SET all_clear = ? WHERE student_id = ?`,
          args: [allClear, student_id]
        });

        return res.status(200).json({ success: true, message: 'Status 4-Pilar berhasil diperbarui.', all_clear: allClear });
      }

      if (action === 'issue_ijazah') {
        const { student_id, clearance_id } = req.body;
        
        // Generate cryptographic hash
        const noIjazah = `IJZ-ATLAS-${Date.now()}-${student_id}`;
        const certHash = crypto.createHash('sha256').update(`${noIjazah}:${student_id}:${Date.now()}`).digest('hex');

        await db.execute({
          sql: `INSERT INTO ijazah_certificates (student_id, clearance_id, no_ijazah, cert_hash, status, issued_at)
                VALUES (?, ?, ?, ?, 'ISSUED', datetime('now'))`,
          args: [student_id, clearance_id || 1, noIjazah, certHash]
        });

        return res.status(200).json({
          success: true,
          message: 'Digital Ijazah certificate signed and issued.',
          no_ijazah: noIjazah,
          cert_hash: certHash
        });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/graduation] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
