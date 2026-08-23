const { db } = require('./_db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const type = req.query.type || 'report_card';

    if (req.method === 'GET') {
      if (type === 'cbt') {
        const examsRs = await db.execute({
          sql: `SELECT ce.*, cs.nama as subject_name
                FROM cbt_exams ce
                LEFT JOIN curriculum_subjects cs ON ce.subject_id = cs.id
                ORDER BY ce.id DESC`,
          args: []
        });

        const resultsRs = await db.execute({
          sql: `SELECT cr.*, s.nama_lengkap as student_name, s.nis
                FROM cbt_results cr
                JOIN students s ON cr.student_id = s.id
                ORDER BY cr.id DESC`,
          args: []
        });

        return res.status(200).json({
          success: true,
          exams: examsRs.rows,
          results: resultsRs.rows
        });
      }

      // Default: Report Cards & Grades
      const studentId = req.query.student_id || 1;

      const studentRs = await db.execute({
        sql: `SELECT * FROM students WHERE id = ?`,
        args: [studentId]
      });

      const gradesRs = await db.execute({
        sql: `SELECT rg.*, cs.nama as subject_name, cs.kode, cs.kategori
              FROM report_grades rg
              JOIN report_cards rc ON rg.report_id = rc.id
              JOIN curriculum_subjects cs ON rg.subject_id = cs.id
              WHERE rc.student_id = ?`,
        args: [studentId]
      });

      // Calculate GPA / Average
      let totalScore = 0;
      let count = 0;
      gradesRs.rows.forEach(g => {
        const score = g.nilai_akhir || ((g.nilai_uh || 0) * 0.2 + (g.nilai_uts || 0) * 0.3 + (g.nilai_uas || 0) * 0.5);
        totalScore += score;
        count++;
      });

      const average = count > 0 ? (totalScore / count).toFixed(2) : 85.0;
      const gpa = (average / 25).toFixed(2); // Convert to 4.0 scale

      return res.status(200).json({
        success: true,
        student: studentRs.rows[0] || null,
        grades: gradesRs.rows,
        summary: { average: Number(average), gpa: Number(gpa) }
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'save_grade') {
        const { student_id, subject_id, nilai_uh, nilai_uts, nilai_uas, nilai_praktik, catatan_guru } = req.body;

        // Find or create report card
        let rcRs = await db.execute({
          sql: `SELECT id FROM report_cards WHERE student_id = ? AND semester = 1 LIMIT 1`,
          args: [student_id]
        });

        let rcId;
        if (rcRs.rows.length > 0) {
          rcId = rcRs.rows[0].id;
        } else {
          const ins = await db.execute({
            sql: `INSERT INTO report_cards (student_id, semester, status) VALUES (?, 1, 'FINAL')`,
            args: [student_id]
          });
          rcId = Number(ins.lastInsertRowid);
        }

        // Calculate final score: 20% UH + 30% UTS + 50% UAS
        const uh = Number(nilai_uh) || 80;
        const uts = Number(nilai_uts) || 85;
        const uas = Number(nilai_uas) || 85;
        const finalScore = Number((uh * 0.2 + uts * 0.3 + uas * 0.5).toFixed(2));
        const predicate = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : 'D';

        await db.execute({
          sql: `INSERT INTO report_grades (report_id, subject_id, nilai_uh, nilai_uts, nilai_uas, nilai_praktik, nilai_akhir, predikat, catatan_guru)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(report_id, subject_id) DO UPDATE SET
                nilai_uh = excluded.nilai_uh,
                nilai_uts = excluded.nilai_uts,
                nilai_uas = excluded.nilai_uas,
                nilai_praktik = excluded.nilai_praktik,
                nilai_akhir = excluded.nilai_akhir,
                predikat = excluded.predikat,
                catatan_guru = excluded.catatan_guru`,
          args: [rcId, subject_id || 1, uh, uts, uas, nilai_praktik || 85, finalScore, predicate, catatan_guru || 'Sangat baik']
        });

        return res.status(200).json({
          success: true,
          message: 'Nilai Rapor Digital & Nilai Akhir berhasil dikalkulasi dan disimpan.',
          final_score: finalScore,
          predicate: predicate
        });
      }

      if (action === 'submit_cbt') {
        const { exam_id, student_id, nilai, durasi_pengerjaan } = req.body;
        await db.execute({
          sql: `INSERT INTO cbt_results (exam_id, student_id, nilai, durasi_pengerjaan)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(exam_id, student_id) DO UPDATE SET
                nilai = excluded.nilai,
                durasi_pengerjaan = excluded.durasi_pengerjaan`,
          args: [exam_id || 1, student_id || 1, nilai || 88.5, durasi_pengerjaan || 45]
        });

        return res.status(200).json({ success: true, message: 'Hasil ujian CBT berhasil dikirim dan dinilai.' });
      }

      return res.status(400).json({ success: false, error: 'Action invalid' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/student-lifecycle] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
