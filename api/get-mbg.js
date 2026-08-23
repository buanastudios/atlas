/**
 * api/get-mbg.js
 * GET /api/get-mbg
 *
 * Retrieves MBG (Makan Bergizi Gratis) receipts from the database.
 * Query params:
 *   ?id=1               (fetch specific receipt by ID)
 *   ?search=katering    (search by menu, nomor_dokumen, or courier)
 *   ?status=LAYAK_EDAR  (filter by status)
 *   ?limit=50           (pagination limit)
 *   ?offset=0           (pagination offset)
 */

const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id, search, status, limit = 50, offset = 0 } = req.query || {};

    if (id) {
      const result = await db.execute({
        sql: 'SELECT * FROM mbg_receipts WHERE id = ? LIMIT 1',
        args: [Number(id)],
      });

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Data MBG tidak ditemukan' });
      }

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    }

    let sql = 'SELECT * FROM mbg_receipts WHERE 1=1';
    const args = [];

    if (search) {
      sql += ' AND (nomor_dokumen LIKE ? OR menu_lauk LIKE ? OR pengantar_nama LIKE ? OR penerima_nama LIKE ?)';
      const term = `%${search}%`;
      args.push(term, term, term, term);
    }

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    args.push(Number(limit), Number(offset));

    const result = await db.execute({ sql, args });

    // Count query
    let countSql = 'SELECT COUNT(*) as total FROM mbg_receipts WHERE 1=1';
    const countArgs = [];
    if (search) {
      countSql += ' AND (nomor_dokumen LIKE ? OR menu_lauk LIKE ? OR pengantar_nama LIKE ? OR penerima_nama LIKE ?)';
      const term = `%${search}%`;
      countArgs.push(term, term, term, term);
    }
    if (status) {
      countSql += ' AND status = ?';
      countArgs.push(status);
    }

    const countResult = await db.execute({ sql: countSql, args: countArgs });

    return res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      total: countResult.rows[0]?.total ?? 0,
    });
  } catch (err) {
    console.error('[get-mbg] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
