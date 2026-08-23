/**
 * api/submit-ppdb.js
 * POST /api/submit-ppdb
 *
 * Submits a new PPDB (student registration) form.
 *
 * Body (JSON):
 *   { studentName, guardianName, guardianPhone, unit }
 *
 * Returns the created registration record with auto-generated registrationNo.
 */

const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentName, guardianName, guardianPhone, unit } = req.body;

    // Validation
    if (!studentName || !guardianName || !guardianPhone || !unit) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: studentName, guardianName, guardianPhone, unit',
      });
    }

    // Count existing registrations to generate sequential registration number
    const countResult = await db.execute('SELECT COUNT(*) as cnt FROM registrations');
    const seq = (countResult.rows[0].cnt ?? 0) + 1;
    const year = new Date().getFullYear();
    const registrationNo = `PPDB-${year}-${String(seq).padStart(3, '0')}`;
    const id = `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    await db.execute({
      sql: `INSERT INTO registrations
              (id, registration_no, student_name, guardian_name, guardian_phone, unit, status)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      args: [id, registrationNo, studentName, guardianName, guardianPhone, unit],
    });

    const row = await db.execute({
      sql: 'SELECT * FROM registrations WHERE id = ?',
      args: [id],
    });

    return res.status(201).json({
      success: true,
      message: `Registration submitted successfully. Your registration number is ${registrationNo}.`,
      data: row.rows[0],
    });
  } catch (err) {
    console.error('[submit-ppdb] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
