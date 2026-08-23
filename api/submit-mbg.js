/**
 * api/submit-mbg.js
 * POST /api/submit-mbg
 *
 * Saves a new or updated daily MBG (Makan Bergizi Gratis) receipt form.
 * Auto-generates document number if not provided: FRM-MBG-01/SD/MM/YYYY/XXX
 */

const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload = req.body || {};
    const {
      id,
      tanggal,
      hari,
      waktu,
      unit = 'primary',
      
      // Menu Komposisi Detail
      menu_karbohidrat,
      menu_lauk,
      menu_sayur,
      menu_buah_susu,
      
      // Diet Khusus Alergi
      diet_karbohidrat = '',
      diet_lauk = '',
      diet_sayur = '',
      diet_buah_susu = '',
      
      // Kemasan
      jumlah_normal = 0,
      jumlah_diet_alergi = 0,
      bentuk_kemasan = 'Box',
      kondisi_kemasan = 'Baik & Tersegel Rapat',
      catatan_penerima = '',
      
      // Penerima
      penerima_nama,
      penerima_kontak = '',
      penerima_ttd = '',
      
      // Pengantar
      pengantar_nama,
      pengantar_kontak = '',
      pengantar_plat_no = '',
      pengantar_ttd = '',
      catatan_pengantar = '',
      
      // Uji Organoleptik
      uji_aroma = '["Segar"]',
      uji_tampilan = '["Bersih"]',
      uji_rasa = '["Normal"]',
      uji_tekstur = '["Empuk"]',
      uji_catatan = '',
      kesimpulan_pengujian = 'Layak Edar',
      
      // Verifikasi
      penguji_nama,
      penguji_kontak = '',
      penguji_ttd = '',
      kepala_sekolah_nama,
      kepala_sekolah_ttd = '',
      
      created_by = 'system'
    } = payload;

    // Validation
    if (!menu_karbohidrat || !menu_lauk || !penerima_nama || !pengantar_nama || !penguji_nama || !kepala_sekolah_nama) {
      return res.status(400).json({
        success: false,
        error: 'Mohon lengkapi menu, nama penerima, pengantar, penguji, dan kepala sekolah/staff.',
      });
    }

    const jmlNormal = Number(jumlah_normal) || 0;
    const jmlAlergi = Number(jumlah_diet_alergi) || 0;
    const jmlTotal  = jmlNormal + jmlAlergi;
    const status    = kesimpulan_pengujian === 'Layak Edar' ? 'LAYAK_EDAR' : 'TIDAK_LAYAK_EDAR';

    const now = new Date();
    const curMonth = String(now.getMonth() + 1).padStart(2, '0');
    const curYear  = now.getFullYear();

    // If ID provided, update existing
    if (id) {
      await db.execute({
        sql: `UPDATE mbg_receipts SET
                tanggal = ?, hari = ?, waktu = ?, unit = ?,
                menu_karbohidrat = ?, menu_lauk = ?, menu_sayur = ?, menu_buah_susu = ?,
                diet_karbohidrat = ?, diet_lauk = ?, diet_sayur = ?, diet_buah_susu = ?,
                jumlah_normal = ?, jumlah_diet_alergi = ?, jumlah_total = ?,
                bentuk_kemasan = ?, kondisi_kemasan = ?, catatan_penerima = ?,
                penerima_nama = ?, penerima_kontak = ?, penerima_ttd = ?,
                pengantar_nama = ?, pengantar_kontak = ?, pengantar_plat_no = ?, pengantar_ttd = ?, catatan_pengantar = ?,
                uji_aroma = ?, uji_tampilan = ?, uji_rasa = ?, uji_tekstur = ?, uji_catatan = ?, kesimpulan_pengujian = ?,
                penguji_nama = ?, penguji_kontak = ?, penguji_ttd = ?,
                kepala_sekolah_nama = ?, kepala_sekolah_ttd = ?,
                status = ?, updated_at = datetime('now')
              WHERE id = ?`,
        args: [
          tanggal || now.toISOString().slice(0, 10),
          hari || 'Senin',
          waktu || `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} WIB`,
          unit,
          menu_karbohidrat, menu_lauk, menu_sayur || '-', menu_buah_susu || '-',
          diet_karbohidrat, diet_lauk, diet_sayur, diet_buah_susu,
          jmlNormal, jmlAlergi, jmlTotal,
          bentuk_kemasan, kondisi_kemasan, catatan_penerima,
          penerima_nama, penerima_kontak, penerima_ttd,
          pengantar_nama, pengantar_kontak, pengantar_plat_no, pengantar_ttd, catatan_pengantar,
          typeof uji_aroma === 'string' ? uji_aroma : JSON.stringify(uji_aroma),
          typeof uji_tampilan === 'string' ? uji_tampilan : JSON.stringify(uji_tampilan),
          typeof uji_rasa === 'string' ? uji_rasa : JSON.stringify(uji_rasa),
          typeof uji_tekstur === 'string' ? uji_tekstur : JSON.stringify(uji_tekstur),
          uji_catatan,
          kesimpulan_pengujian,
          penguji_nama, penguji_kontak, penguji_ttd,
          kepala_sekolah_nama, kepala_sekolah_ttd,
          status,
          Number(id)
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Form Penerimaan MBG berhasil diperbarui.',
        id: Number(id),
      });
    }

    // New Receipt: Generate sequential document number
    const countRes = await db.execute('SELECT COUNT(*) as total FROM mbg_receipts');
    const seq = String((countRes.rows[0]?.total ?? 0) + 1).padStart(3, '0');
    const nomorDokumen = payload.nomor_dokumen || `FRM-MBG-01/SD/${curMonth}/${curYear}/${seq}`;

    const insertResult = await db.execute({
      sql: `INSERT INTO mbg_receipts (
              nomor_dokumen, tanggal, hari, waktu, unit,
              menu_karbohidrat, menu_lauk, menu_sayur, menu_buah_susu,
              diet_karbohidrat, diet_lauk, diet_sayur, diet_buah_susu,
              jumlah_normal, jumlah_diet_alergi, jumlah_total,
              bentuk_kemasan, kondisi_kemasan, catatan_penerima,
              penerima_nama, penerima_kontak, penerima_ttd,
              pengantar_nama, pengantar_kontak, pengantar_plat_no, pengantar_ttd, catatan_pengantar,
              uji_aroma, uji_tampilan, uji_rasa, uji_tekstur, uji_catatan, kesimpulan_pengujian,
              penguji_nama, penguji_kontak, penguji_ttd,
              kepala_sekolah_nama, kepala_sekolah_ttd,
              status, created_by
            ) VALUES (
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?,
              ?, ?,
              ?, ?
            )`,
      args: [
        nomorDokumen,
        tanggal || now.toISOString().slice(0, 10),
        hari || 'Senin',
        waktu || `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} WIB`,
        unit,
        menu_karbohidrat, menu_lauk, menu_sayur || '-', menu_buah_susu || '-',
        diet_karbohidrat, diet_lauk, diet_sayur, diet_buah_susu,
        jmlNormal, jmlAlergi, jmlTotal,
        bentuk_kemasan, kondisi_kemasan, catatan_penerima,
        penerima_nama, penerima_kontak, penerima_ttd,
        pengantar_nama, pengantar_kontak, pengantar_plat_no, pengantar_ttd, catatan_pengantar,
        typeof uji_aroma === 'string' ? uji_aroma : JSON.stringify(uji_aroma),
        typeof uji_tampilan === 'string' ? uji_tampilan : JSON.stringify(uji_tampilan),
        typeof uji_rasa === 'string' ? uji_rasa : JSON.stringify(uji_rasa),
        typeof uji_tekstur === 'string' ? uji_tekstur : JSON.stringify(uji_tekstur),
        uji_catatan,
        kesimpulan_pengujian,
        penguji_nama, penguji_kontak, penguji_ttd,
        kepala_sekolah_nama, kepala_sekolah_ttd,
        status, created_by
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Form Penerimaan Harian MBG berhasil disimpan.',
      nomor_dokumen: nomorDokumen,
      id: Number(insertResult.lastInsertRowid),
    });
  } catch (err) {
    console.error('[submit-mbg] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
