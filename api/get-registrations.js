/**
 * api/get-registrations.js
 * GET /api/get-registrations
 *
 * Returns all PPDB / student registrations.
 * Query params:
 *   ?status=PENDING|ACCEPTED|REJECTED   (optional filter)
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
    const { status } = req.query;

    let sql = 'SELECT * FROM registrations WHERE 1=1';
    const args = [];

    if (status) {
      const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
      if (!validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }
      sql += ' AND status = ?';
      args.push(status.toUpperCase());
    }

    sql += ' ORDER BY created_at DESC';

    const result = await db.execute({ sql, args });

    return res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error('[get-registrations] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
