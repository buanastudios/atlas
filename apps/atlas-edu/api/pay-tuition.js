const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const paymentsRs = await db.execute({
        sql: `SELECT id, student_id, student_name, nominal as amount, bulan_periode as month_period, metode_bayar as payment_method, no_kwitansi, paid_at
              FROM tuition_payments
              ORDER BY paid_at DESC`,
        args: []
      });

      const totalPaid = paymentsRs.rows.reduce((sum, p) => sum + (p.amount || 0), 0);

      return res.status(200).json({
        success: true,
        payments: paymentsRs.rows,
        summary: {
          total_paid: totalPaid,
          count: paymentsRs.rows.length,
          month: '2026-08'
        }
      });
    }

    if (req.method === 'POST') {
      const { studentId, studentName, amount, monthPeriod, paymentMethod } = req.body || {};

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Jumlah nominal pembayaran harus valid.' });
      }

      const receiptNo = `KW/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2,'0')}/${Date.now().toString().slice(-5)}`;

      await db.execute({
        sql: `INSERT INTO tuition_payments (student_id, student_name, nominal, bulan_periode, metode_bayar, no_kwitansi, catatan)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [studentId || 1, studentName || 'Ahmad Fauzan Al-Hakim', amount, monthPeriod || '2026-08', paymentMethod || 'Transfer', receiptNo, 'Lunas']
      });

      return res.status(201).json({
        success: true,
        message: `Kwitansi pembayaran SPP Rp ${amount.toLocaleString('id-ID')} berhasil diterbitkan.`,
        receipt_no: receiptNo,
        amount: amount,
        month: monthPeriod || '2026-08'
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[pay-tuition] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
