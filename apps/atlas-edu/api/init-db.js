/**
 * api/init-db.js
 * GET /api/init-db
 *
 * Initialises the database schema (idempotent — safe to call multiple times).
 * Call this ONCE after deploying to Vercel, or during local dev first run.
 *
 * In production you can hit: https://your-app.vercel.app/api/init-db
 */

const { initSchema } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    await initSchema();
    return res.status(200).json({
      success: true,
      message: 'Database schema initialised successfully.',
    });
  } catch (err) {
    console.error('[init-db] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
