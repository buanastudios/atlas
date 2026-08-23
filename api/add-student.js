/**
 * api/add-student.js
 * POST /api/add-student
 *
 * Body (JSON):
 *   { name, guardian, phone, unit }
 *
 * Returns the created student row.
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
    const { name, guardian, phone, unit } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'name is required' });
    }

    const id = `stu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    await db.execute({
      sql: `INSERT INTO students (id, name, guardian, phone, unit)
            VALUES (?, ?, ?, ?, ?)`,
      args: [id, name, guardian ?? null, phone ?? null, unit ?? null],
    });

    const row = await db.execute({
      sql: 'SELECT * FROM students WHERE id = ?',
      args: [id],
    });

    return res.status(201).json({
      success: true,
      data: row.rows[0],
    });
  } catch (err) {
    console.error('[add-student] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
