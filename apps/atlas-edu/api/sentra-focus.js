const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const todayName = days[now.getDay()];

    const matrixRs = await db.execute({
      sql: `SELECT * FROM sentra_daily_focus ORDER BY id ASC`,
      args: []
    });

    const activeToday = matrixRs.rows.find(r => r.hari === todayName) || matrixRs.rows[0];

    return res.status(200).json({
      success: true,
      today: todayName,
      active_sentra: activeToday,
      rotation_matrix: matrixRs.rows
    });
  } catch (err) {
    console.error('[api/sentra-focus] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
