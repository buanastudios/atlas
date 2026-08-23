/**
 * api/get-courses.js
 * GET /api/get-courses
 *
 * Returns all active (or all) courses.
 * Query params:
 *   ?activeOnly=true   (default: returns all)
 */

const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const activeOnly = req.query.activeOnly === 'true';

    const sql = activeOnly
      ? 'SELECT * FROM courses WHERE is_active = 1 ORDER BY code'
      : 'SELECT * FROM courses ORDER BY code';

    const result = await db.execute(sql);

    // Map is_active integer → boolean for the client
    const courses = result.rows.map((row) => ({
      ...row,
      isActive: row.is_active === 1,
    }));

    return res.status(200).json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (err) {
    console.error('[get-courses] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
