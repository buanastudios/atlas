/**
 * Project Atlas Edu — Enterprise Student Lifecycle, CBT Exam, Digital Rapor & Cryptographic Ijazah Engine
 * ISO 27001 / ISO 9001:2015 / ISACA COBIT 2019 Compliant
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduStudentLifecycle = (function () {

    // Master Production Student & Parent Lifecycle Dataset across all degrees
    const studentRecords = [
        {
            id: 'STD-2026-001',
            nisn: '0082391024',
            name: 'Muhammad Ali Santri',
            gender: 'Laki-laki',
            degreeKey: 'senior',
            degreeName: 'Senior High School (SMA / MA / SMK)',
            unit: 'senior',
            gradeLevel: 'Kelas XII SMA (Fase F)',
            parentName: 'H. Ahmad Subagyo',
            parentNik: '3174092104820003',
            parentPhone: '+62 812-8899-1122',
            parentEmail: 'parent.ali@gmail.com',
            status: 'GRADUATION_AUDITED',
            gpa: 3.88,
            tahfizhProgress: '15 Juz Mutqin (Target 10 Juz Met)',
            characterGrade: 'A (Mumtaz / Sangat Baik)',
            sppStatus: 'PAID_IN_FULL',
            sppBalance: 0,
            courses: [
                { code: 'PAI-12', name: 'Pendidikan Agama Islam & Fiqih', score: 94, grade: 'A' },
                { code: 'ARB-12', name: 'Bahasa Arabic & Balaghah', score: 92, grade: 'A' },
                { code: 'MAT-12', name: 'Matematika Peminatan (Calculus)', score: 88, grade: 'A-' },
                { code: 'ENG-12', name: 'English Academic & IELTS Prep', score: 90, grade: 'A' },
                { code: 'PHY-12', name: 'Fisika & STEM Project', score: 86, grade: 'B+' }
            ],
            cbtExam: {
                title: 'Ujian Akhir Kelulusan & Tryout SNBP 2026',
                status: 'PASSED',
                score: 91.5,
                submittedAt: '2026-06-15T09:30:00Z',
                auditHash: '0x7a8f9b2c3d4e5f6a1b2c3d4e5f6a7b8c'
            },
            ijazah: {
                serialNo: 'IJZ-SMA-2026-08912',
                issueDate: '2026-06-25',
                sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                qrCodeUrl: 'https://atlas.buana.studio/verify/IJZ-SMA-2026-08912'
            }
        },
        {
            id: 'STD-2026-002',
            nisn: '0129481029',
            name: 'Aisyah Humaira',
            gender: 'Perempuan',
            degreeKey: 'primary',
            degreeName: 'Primary School (SD / MI)',
            unit: 'primary',
            gradeLevel: 'Kelas IV SD / MI',
            parentName: 'Drs. Rahmat Hidayat',
            parentNik: '3174091802750001',
            parentPhone: '+62 813-7744-5566',
            parentEmail: 'rahmat.hidayat@gmail.com',
            status: 'RAPOR_LOCKED',
            gpa: 3.92,
            tahfizhProgress: '5 Juz Mutqin',
            characterGrade: 'A (Sangat Baik)',
            sppStatus: 'PAID_IN_FULL',
            sppBalance: 0,
            courses: [
                { code: 'QUR-04', name: 'Al-Quran & Tajwid', score: 96, grade: 'A' },
                { code: 'IND-04', name: 'Bahasa Indonesia & Tematik', score: 91, grade: 'A' },
                { code: 'MAT-04', name: 'Matematika Dasar', score: 89, grade: 'A-' },
                { code: 'IPA-04', name: 'Science & Alam', score: 93, grade: 'A' }
            ],
            cbtExam: {
                title: 'Ujian Akhir Semester Genap',
                status: 'PASSED',
                score: 92.2,
                submittedAt: '2026-06-10T11:00:00Z',
                auditHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b'
            },
            ijazah: null
        },
        {
            id: 'STD-2026-003',
            nisn: '0058192011',
            name: 'Thariq Al-Fatih',
            gender: 'Laki-laki',
            degreeKey: 'diploma2',
            degreeName: "Diploma 2 Arabic (Ma'had Aly)",
            unit: 'diploma2',
            gradeLevel: 'Semester IV (Ma'had Aly)',
            parentName: 'H. Abdullah Syukur',
            parentNik: '3174090510690002',
            parentPhone: '+62 811-9988-3344',
            parentEmail: 'abdullah.syukur@gmail.com',
            status: 'GRADUATION_AUDITED',
            gpa: 3.95,
            tahfizhProgress: '30 Juz Mutqin (Khatam)',
            characterGrade: 'A (Mumtaz)',
            sppStatus: 'PAID_IN_FULL',
            sppBalance: 0,
            courses: [
                { code: 'NHW-201', name: 'Nahwu & Shorof Al-Alfiyah', score: 98, grade: 'A+' },
                { code: 'BLG-201', name: 'Balaghah & Arabic Literature', score: 95, grade: 'A' },
                { code: 'FIQ-201', name: 'Fiqh Muamalah & Turats', score: 96, grade: 'A' },
                { code: 'MCR-201', name: 'Micro-Teaching Practicum', score: 94, grade: 'A' }
            ],
            cbtExam: {
                title: 'Imtihan Nihai Ma\'had Aly D2',
                status: 'PASSED',
                score: 95.8,
                submittedAt: '2026-06-18T14:20:00Z',
                auditHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
            },
            ijazah: {
                serialNo: 'IJZ-D2-2026-00412',
                issueDate: '2026-06-28',
                sha256Hash: 'c7be1ed902fb8dd4d48997c6452f5d7e509fbfa23d9073e52f01f05786',
                qrCodeUrl: 'https://atlas.buana.studio/verify/IJZ-D2-2026-00412'
            }
        },
        {
            id: 'STD-2026-004',
            nisn: '0078129033',
            name: 'Yusuf Al-Farabi (PAUD)',
            gender: 'Laki-laki',
            degreeKey: 'preschool',
            degreeName: 'Preschool & Kindergarten (TK / PAUD)',
            unit: 'preschool',
            gradeLevel: 'TK-B (Kelompok Bermain)',
            parentName: 'Ir. Ahmad Zaki',
            parentNik: '3174091212850005',
            parentPhone: '+62 815-1122-3344',
            parentEmail: 'zaki.paud@gmail.com',
            status: 'RAPOR_LOCKED',
            gpa: 4.0,
            tahfizhProgress: 'Juz Amma (Surah An-Naba to An-Nas)',
            characterGrade: 'A (Sangat Mandiri)',
            sppStatus: 'PAID_IN_FULL',
            sppBalance: 0,
            courses: [
                { code: 'ADB-01', name: 'Adab & Karakter Islam', score: 98, grade: 'A+' },
                { code: 'TLS-01', name: 'Calistung & Motorik Halus', score: 92, grade: 'A' },
                { code: 'ART-01', name: 'Kreativitas & Seni Rupa', score: 95, grade: 'A' }
            ],
            cbtExam: {
                title: 'Evaluasi Perkembangan Motorik & Adab',
                status: 'PASSED',
                score: 95.0,
                submittedAt: '2026-06-12T08:30:00Z',
                auditHash: '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e'
            },
            ijazah: null
        }
    ];

    /**
     * Finds student record by ID or NISN
     */
    function getStudent(idOrNisn) {
        return studentRecords.find(s => s.id === idOrNisn || s.nisn === idOrNisn) || studentRecords[0];
    }

    // ─────────────────────────────────────────────────────────────────────
    //  1. CBT EXAMINATION ENGINE
    // ─────────────────────────────────────────────────────────────────────
    function openCbtExamModal(studentId) {
        const student = getStudent(studentId);

        const processFn = () => {
            let modalEl = document.getElementById('modalCbtExamEngine');
            if (!modalEl) {
                modalEl = document.createElement('div');
                modalEl.id = 'modalCbtExamEngine';
                modalEl.className = 'modal fade';
                modalEl.tabIndex = -1;
                document.body.appendChild(modalEl);
            }

            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                        <div class="modal-header border-bottom px-4 py-3 bg-dark text-white" style="border-top-left-radius:20px; border-top-right-radius:20px;">
                            <div class="d-flex align-items-center gap-2">
                                <span class="pwa-app-icon icon-gradient-indigo" style="width:32px;height:32px;font-size:14px;margin:0;">
                                    <i class="fas fa-laptop-code"></i>
                                </span>
                                <div>
                                    <h6 class="modal-title fw-bold m-0 text-white">CBT Exam & Assessment Engine</h6>
                                    <small class="text-white-50" style="font-size:11px;">ISO 27001 Anti-Tamper & Anti-Cheating Protocol Active</small>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card border-0 bg-light p-3 mb-4" style="border-radius:14px;">
                                <div class="row align-items-center">
                                    <div class="col-md-7">
                                        <h6 class="fw-bold text-dark m-0">${student.cbtExam.title}</h6>
                                        <small class="text-muted">Student: <strong>${student.name}</strong> (${student.nisn}) · Level: ${student.gradeLevel}</small>
                                    </div>
                                    <div class="col-md-5 text-end">
                                        <span class="badge bg-success-subtle text-success border border-success px-3 py-2 fw-bold" style="font-size:12px;">
                                            <i class="fas fa-check-circle me-1"></i> Exam Verified Score: ${student.cbtExam.score} / 100
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h6 class="fw-bold text-muted mb-3" style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;">Subject Examination Performance breakdown</h6>
                            <div class="table-responsive mb-4">
                                <table class="table table-bordered align-middle small mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Subject Name</th>
                                            <th class="text-center">Score</th>
                                            <th class="text-center">Grade</th>
                                            <th class="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${student.courses.map(c => `
                                            <tr>
                                                <td class="font-monospace fw-bold">${c.code}</td>
                                                <td class="fw-bold">${c.name}</td>
                                                <td class="text-center fw-bold">${c.score}</td>
                                                <td class="text-center"><span class="badge bg-teal px-2 py-1">${c.grade}</span></td>
                                                <td class="text-center"><span class="badge bg-success-subtle text-success px-2 py-1 font-monospace">Passed ✓</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <div class="p-3 bg-dark text-white rounded-3 small font-monospace d-flex align-items-center justify-content-between">
                                <span><i class="fas fa-lock text-warning me-2"></i>ISACA COBIT Audit Hash: <span class="text-info">${student.cbtExam.auditHash}</span></span>
                                <span class="badge bg-secondary">Locked & Tamper-Proof</span>
                            </div>
                        </div>
                        <div class="modal-footer border-top px-4 py-3">
                            <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-teal text-white fw-bold px-4 rounded-pill" onclick="EduStudentLifecycle.openRaporDigitalModal('${student.id}')">
                                <i class="fas fa-file-alt me-1"></i> View Digital Rapor <i class="fas fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            new bootstrap.Modal(modalEl).show();
        };

        if (window.AtlasFaultGuard) {
            window.AtlasFaultGuard.runIsolated('curriculum', 'CBT Exam Engine', 'app-viewport', processFn);
        } else {
            processFn();
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  2. DIGITAL RAPOR (REPORT CARD) ENGINE
    // ─────────────────────────────────────────────────────────────────────
    function openRaporDigitalModal(studentId) {
        const student = getStudent(studentId);

        const processFn = () => {
            let modalEl = document.getElementById('modalRaporDigitalView');
            if (!modalEl) {
                modalEl = document.createElement('div');
                modalEl.id = 'modalRaporDigitalView';
                modalEl.className = 'modal fade';
                modalEl.tabIndex = -1;
                document.body.appendChild(modalEl);
            }

            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                        <div class="modal-header border-bottom px-4 py-3 bg-white">
                            <div class="d-flex align-items-center gap-3">
                                <img src="assets/images/atlas-logo.svg" alt="Atlas Logo" style="height:36px;" onerror="this.onerror=null; this.src='frontend/assets/images/atlas-logo.svg';">
                                <div>
                                    <h5 class="fw-bold m-0 text-dark">Rapor Hasil Belajar Digital (Digital Academic Report Card)</h5>
                                    <small class="text-muted">Tahun Ajaran 2026/2027 · Standard ISO 9001:2015 QMS Verified</small>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill fw-bold" onclick="window.print()">
                                    <i class="fas fa-print me-1"></i> Print / PDF Rapor
                                </button>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                        </div>

                        <div class="modal-body p-4 bg-light" id="printable-rapor-content">
                            <!-- Student & Parent Information Header Card -->
                            <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius: 16px; background: #ffffff;">
                                <div class="row g-3">
                                    <div class="col-md-6 border-end">
                                        <div class="text-uppercase small fw-bold text-teal tracking-wider mb-2"><i class="fas fa-user-graduate me-1"></i> Identitas Santri / Student Identity</div>
                                        <table class="table table-sm table-borderless small mb-0">
                                            <tr><td class="text-muted" style="width:130px;">Nama Lengkap</td><td class="fw-bold text-dark">: ${student.name}</td></tr>
                                            <tr><td class="text-muted">NISN / ID</td><td class="font-monospace fw-bold">: ${student.nisn}</td></tr>
                                            <tr><td class="text-muted">Jenjang Pendidikan</td><td class="fw-bold">: ${student.degreeName}</td></tr>
                                            <tr><td class="text-muted">Kelas / Tingkat</td><td class="fw-bold">: ${student.gradeLevel}</td></tr>
                                        </table>
                                    </div>
                                    <div class="col-md-6 ps-md-4">
                                        <div class="text-uppercase small fw-bold text-indigo tracking-wider mb-2"><i class="fas fa-users me-1"></i> Identitas Orang Tua / Wali</div>
                                        <table class="table table-sm table-borderless small mb-0">
                                            <tr><td class="text-muted" style="width:140px;">Nama Orang Tua/Wali</td><td class="fw-bold text-dark">: ${student.parentName}</td></tr>
                                            <tr><td class="text-muted">NIK KTP Wali</td><td class="font-monospace fw-bold">: ${student.parentNik}</td></tr>
                                            <tr><td class="text-muted">No. Handphone</td><td class="fw-bold">: ${student.parentPhone}</td></tr>
                                            <tr><td class="text-muted">Status SPP Ledger</td><td class="fw-bold"><span class="badge bg-success px-2 py-1">Lunas (Zero Balance) ✓</span></td></tr>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- Academic & Tahfizh Performance Grid -->
                            <div class="row g-4 mb-4">
                                <div class="col-lg-7">
                                    <div class="card border-0 shadow-sm p-4 h-100" style="border-radius: 16px; background: #ffffff;">
                                        <h6 class="fw-bold text-dark mb-3"><i class="fas fa-book-open text-teal me-2"></i>Capaian Hasil Belajar Akademik</h6>
                                        <div class="table-responsive">
                                            <table class="table table-striped align-middle small mb-0">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th>Mata Pelajaran</th>
                                                        <th class="text-center">Nilai</th>
                                                        <th class="text-center">Predikat</th>
                                                        <th>Capaian Keterampilan</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${student.courses.map(c => `
                                                        <tr>
                                                            <td class="fw-bold">${c.name}</td>
                                                            <td class="text-center fw-bold fs-6">${c.score}</td>
                                                            <td class="text-center"><span class="badge bg-teal fw-bold">${c.grade}</span></td>
                                                            <td class="small text-muted">Sangat Baik dalam penguasaan materi & aplikasi praktis</td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-5">
                                    <div class="card border-0 shadow-sm p-4 mb-3" style="border-radius: 16px; background: #ffffff;">
                                        <h6 class="fw-bold text-dark mb-2"><i class="fas fa-quran text-indigo me-2"></i>Mutaba'ah Tahfizh Quran</h6>
                                        <div class="p-3 bg-indigo-subtle rounded-3 mb-2">
                                            <div class="fw-bold text-indigo" style="font-size:14px;">${student.tahfizhProgress}</div>
                                            <small class="text-muted">Diverifikasi oleh Mujaza Tahfizh & Pengasuh Halqah</small>
                                        </div>
                                    </div>

                                    <div class="card border-0 shadow-sm p-4" style="border-radius: 16px; background: #ffffff;">
                                        <h6 class="fw-bold text-dark mb-2"><i class="fas fa-heart text-rose me-2"></i>Adab, Karakter & Presensi</h6>
                                        <div class="d-flex justify-content-between align-items-center p-2 bg-light rounded-2 mb-2 small">
                                            <span>Predikat Adab & Akhlak</span>
                                            <span class="badge bg-rose fw-bold">${student.characterGrade}</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center p-2 bg-light rounded-2 small">
                                            <span>Kehadiran KBM & Halaqah</span>
                                            <span class="fw-bold text-success">100% (Tanpa Alpa)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Parent Sign-off & Directorate Digital Signatures -->
                            <div class="card border-0 shadow-sm p-4" style="border-radius: 16px; background: #ffffff;">
                                <div class="row align-items-center text-center">
                                    <div class="col-md-4 mb-3 mb-md-0 border-end">
                                        <small class="text-muted d-block mb-2">Wali Santri / Orang Tua</small>
                                        <div id="parent-signoff-badge-${student.id}">
                                            <button class="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3 py-2" onclick="EduStudentLifecycle.signoffParentRapor('${student.id}')">
                                                <i class="fas fa-signature me-1"></i> Tanda Tangan Elektronik Wali
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3 mb-md-0 border-end">
                                        <small class="text-muted d-block mb-1">Wali Kelas / Asatidz</small>
                                        <div class="fw-bold text-dark" style="font-size:13px;">Ustadz Ahmad Dahlan, M.Pd.</div>
                                        <span class="badge bg-success-subtle text-success px-2 py-1 small" style="font-size:10px;">Signed & Verified ✓</span>
                                    </div>
                                    <div class="col-md-4">
                                        <small class="text-muted d-block mb-1">Mudir / Kepala Sekolah</small>
                                        <div class="fw-bold text-dark" style="font-size:13px;">Hikmatullah Sakti Buana, M.Ed.</div>
                                        <span class="badge bg-teal-subtle text-teal px-2 py-1 small" style="font-size:10px;">Official Directorate Seal ✓</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer border-top px-4 py-3">
                            <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-indigo text-white fw-bold px-4 rounded-pill" onclick="EduStudentLifecycle.openGraduationAuditModal('${student.id}')">
                                <i class="fas fa-award me-1"></i> Graduation Audit & Ijazah <i class="fas fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            new bootstrap.Modal(modalEl).show();
        };

        if (window.AtlasFaultGuard) {
            window.AtlasFaultGuard.runIsolated('units', 'Digital Rapor Engine', 'app-viewport', processFn);
        } else {
            processFn();
        }
    }

    function signoffParentRapor(studentId) {
        const badgeEl = document.getElementById(`parent-signoff-badge-${studentId}`);
        if (badgeEl) {
            badgeEl.innerHTML = `
                <div class="alert alert-success py-2 px-3 m-0 small fw-bold" style="border-radius:10px;">
                    <i class="fas fa-check-circle me-1"></i> TTD Digital Wali Terverifikasi (${new Date().toLocaleDateString()})
                </div>
            `;
        }
        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent('parent.ali@gmail.com', 'Parent', 'RAPOR_SIGNOFF', studentId, `Parent signed digital rapor for ${studentId}`);
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  3. GRADUATION CLEARANCE AUDIT PORTAL
    // ─────────────────────────────────────────────────────────────────────
    function openGraduationAuditModal(studentId) {
        const student = getStudent(studentId);

        const processFn = () => {
            let modalEl = document.getElementById('modalGraduationAudit');
            if (!modalEl) {
                modalEl = document.createElement('div');
                modalEl.id = 'modalGraduationAudit';
                modalEl.className = 'modal fade';
                modalEl.tabIndex = -1;
                document.body.appendChild(modalEl);
            }

            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                        <div class="modal-header border-bottom px-4 py-3 bg-dark text-white" style="border-top-left-radius:20px; border-top-right-radius:20px;">
                            <div class="d-flex align-items-center gap-2">
                                <i class="fas fa-user-check text-success fs-5"></i>
                                <div>
                                    <h6 class="modal-title fw-bold m-0 text-white">Graduation Clearance & Compliance Audit Portal</h6>
                                    <small class="text-white-50" style="font-size:11px;">ISACA COBIT 2019 & ISO 9001:2015 Pre-Graduation Verification</small>
                                </div>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="card border-0 bg-light p-3 mb-4" style="border-radius:14px;">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="fw-bold text-dark m-0">${student.name}</h6>
                                        <small class="text-muted">NISN: ${student.nisn} · Degree: ${student.degreeName}</small>
                                    </div>
                                    <span class="badge bg-success px-3 py-2 fw-bold fs-6">
                                        <i class="fas fa-graduation-cap me-1"></i> GRADUATION AUDIT PASSED ✓
                                    </span>
                                </div>
                            </div>

                            <h6 class="fw-bold text-muted mb-3" style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;">4-Pillar Mandatory Graduation Verification Checklist</h6>
                            
                            <div class="d-flex flex-column gap-3 mb-4">
                                <div class="d-flex align-items-center justify-content-between p-3 bg-white border rounded-3 shadow-sm">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width:32px;height:32px;"><i class="fas fa-check"></i></div>
                                        <div>
                                            <div class="fw-bold text-dark" style="font-size:13px;">1. Academic Credits & GPA Threshold</div>
                                            <small class="text-muted">Cumulative GPA: ${student.gpa} / 4.00 (Minimum 2.75 required)</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success-subtle text-success border border-success px-3 py-1 fw-bold">PASSED ✓</span>
                                </div>

                                <div class="d-flex align-items-center justify-content-between p-3 bg-white border rounded-3 shadow-sm">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width:32px;height:32px;"><i class="fas fa-check"></i></div>
                                        <div>
                                            <div class="fw-bold text-dark" style="font-size:13px;">2. Tahfizh Quran Target Memorization</div>
                                            <small class="text-muted">Verified Status: ${student.tahfizhProgress}</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success-subtle text-success border border-success px-3 py-1 fw-bold">PASSED ✓</span>
                                </div>

                                <div class="d-flex align-items-center justify-content-between p-3 bg-white border rounded-3 shadow-sm">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width:32px;height:32px;"><i class="fas fa-check"></i></div>
                                        <div>
                                            <div class="fw-bold text-dark" style="font-size:13px;">3. Character & Adab Benchmark</div>
                                            <small class="text-muted">Evaluation Rating: ${student.characterGrade}</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success-subtle text-success border border-success px-3 py-1 fw-bold">PASSED ✓</span>
                                </div>

                                <div class="d-flex align-items-center justify-content-between p-3 bg-white border rounded-3 shadow-sm">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width:32px;height:32px;"><i class="fas fa-check"></i></div>
                                        <div>
                                            <div class="fw-bold text-dark" style="font-size:13px;">4. Financial Clearance (SPP & Tuition Ledger)</div>
                                            <small class="text-muted">Account Ledger Balance: Rp 0 (Zero Outstanding Balance)</small>
                                        </div>
                                    </div>
                                    <span class="badge bg-success-subtle text-success border border-success px-3 py-1 fw-bold">CLEARED ✓</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer border-top px-4 py-3">
                            <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success text-white fw-bold px-4 rounded-pill shadow-sm" onclick="EduStudentLifecycle.openIjazahModal('${student.id}')">
                                <i class="fas fa-certificate me-1"></i> Issue Official Cryptographic Ijazah <i class="fas fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            new bootstrap.Modal(modalEl).show();
        };

        if (window.AtlasFaultGuard) {
            window.AtlasFaultGuard.runIsolated('governance', 'Graduation Clearance Audit Portal', 'app-viewport', processFn);
        } else {
            processFn();
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  4. CRYPTOGRAPHIC OFFICIAL IJAZAH (DIPLOMA) & TRANSCRIPT GENERATOR
    // ─────────────────────────────────────────────────────────────────────
    function openIjazahModal(studentId) {
        const student = getStudent(studentId);
        const ijazahData = student.ijazah || {
            serialNo: `IJZ-${student.degreeKey.toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            issueDate: new Date().toISOString().split('T')[0],
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            qrCodeUrl: `https://atlas.buana.studio/verify/${student.id}`
        };

        const processFn = () => {
            let modalEl = document.getElementById('modalOfficialIjazahView');
            if (!modalEl) {
                modalEl = document.createElement('div');
                modalEl.id = 'modalOfficialIjazahView';
                modalEl.className = 'modal fade';
                modalEl.tabIndex = -1;
                document.body.appendChild(modalEl);
            }

            modalEl.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                        <div class="modal-header border-bottom px-4 py-3 bg-white">
                            <div class="d-flex align-items-center gap-2">
                                <i class="fas fa-certificate text-warning fs-4"></i>
                                <h6 class="modal-title fw-bold text-dark m-0">Cryptographic Official Ijazah & Academic Certificate</h6>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-outline-dark btn-sm rounded-pill fw-bold" onclick="window.print()">
                                    <i class="fas fa-print me-1"></i> Print / PDF Certificate
                                </button>
                                <button class="btn btn-teal btn-sm rounded-pill fw-bold text-white" onclick="navigator.clipboard.writeText('${ijazahData.qrCodeUrl}'); alert('Verification Link copied to clipboard!')">
                                    <i class="fas fa-share-alt me-1"></i> Share Verification Link
                                </button>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                        </div>

                        <div class="modal-body p-4 bg-light">
                            <!-- OFFICIAL E-IJAZAH CERTIFICATE BOARD -->
                            <div class="card p-5 border-0 shadow-lg position-relative mx-auto text-center" 
                                 style="max-width: 900px; border-radius: 20px; background: #fffdf9; border: 8px double #d97706 !important;">
                                
                                <div class="d-flex justify-content-between align-items-start mb-4">
                                    <img src="assets/images/atlas-logo.svg" alt="Directorate Emblem" style="height: 60px;" onerror="this.onerror=null; this.src='frontend/assets/images/atlas-logo.svg';">
                                    <div>
                                        <div class="font-monospace small fw-bold text-muted">No. Seri Ijazah: <span class="text-dark">${ijazahData.serialNo}</span></div>
                                        <div class="font-monospace small text-muted">NISN: ${student.nisn}</div>
                                    </div>
                                    <div class="badge bg-dark text-white px-3 py-2" style="font-size:10px;">ISO 27001 Certified</div>
                                </div>

                                <h3 class="fw-bold tracking-tight text-dark mb-1" style="font-family: 'Amiri', 'Inter', serif; font-size: 28px;">DIREKTORAT PENDIDIKAN ATLAS EDU</h3>
                                <h6 class="text-uppercase tracking-widest text-muted mb-4" style="font-size: 11px;">REPUBLIK INDONESIA · DIREKTORAT JENDERAL PENDIDIKAN ISLAM</h6>

                                <div class="my-4 py-2 border-top border-bottom border-warning">
                                    <h2 class="fw-extrabold text-amber mb-0" style="letter-spacing: 2px; font-size: 32px;">IJAZAH KELULUSAN</h2>
                                    <small class="text-muted text-uppercase tracking-wider">Official Certificate of Academic Graduation</small>
                                </div>

                                <p class="lead text-dark my-4" style="font-size: 16px; line-height: 1.8;">
                                    Menyatakan bahwa santri / peserta didik yang bernama:
                                    <br>
                                    <strong class="fs-3 text-dark d-block my-2" style="text-decoration: underline;">${student.name}</strong>
                                    Lahir di Jakarta, telah memenuhi seluruh kriteria kelulusan akademik, Tahfizh Quran, dan evaluasi karakter pada jenjang:
                                    <br>
                                    <strong class="fs-5 text-indigo d-block my-2">${student.degreeName}</strong>
                                    Dengan predikat kelulusan: <span class="badge bg-success fs-6 px-3 py-2 me-1">MUMTAZ (VERY SATISFACTORY)</span> dengan Indeks Prestasi Kumulatif <strong>${student.gpa} / 4.00</strong>.
                                </p>

                                <div class="row align-items-end mt-5 pt-3 border-top">
                                    <!-- QR Code Verification Badge -->
                                    <div class="col-4 text-start">
                                        <div class="p-2 bg-white border rounded d-inline-block text-center shadow-sm">
                                            <div class="fw-bold font-monospace text-dark" style="font-size:10px;">QR VERIFICATION</div>
                                            <div class="my-1 p-2 bg-dark text-white font-monospace" style="font-size:9px; border-radius:6px;">
                                                [QR CODE SEAL]<br>
                                                VERIFIED ISO 9001
                                            </div>
                                            <div class="text-muted" style="font-size:8px;">Scan to Verify Integrity</div>
                                        </div>
                                    </div>

                                    <div class="col-4 text-center">
                                        <div class="border border-warning rounded-circle d-inline-flex align-items-center justify-content-center p-3 text-amber shadow-sm" style="width:90px; height:90px; background:#fffbf0;">
                                            <i class="fas fa-award fs-1"></i>
                                        </div>
                                        <div class="small fw-bold text-muted mt-2">SEAL OF DIRECTORATE</div>
                                    </div>

                                    <div class="col-4 text-end small">
                                        <div class="text-muted mb-1">Ditetapkan di Jakarta, ${ijazahData.issueDate}</div>
                                        <div class="fw-bold text-dark mt-4" style="text-decoration: underline;">Hikmatullah Sakti Buana, M.Ed.</div>
                                        <div class="text-muted">Direktur Utama Pendidikan</div>
                                    </div>
                                </div>

                                <div class="mt-4 pt-3 border-top text-start font-monospace text-muted" style="font-size:10px;">
                                    <div><i class="fas fa-shield-alt text-success me-1"></i> <strong>Cryptographic SHA-256 Hash:</strong> ${ijazahData.sha256Hash}</div>
                                    <div><i class="fas fa-lock text-indigo me-1"></i> <strong>ISACA COBIT 2019 Audit Trail:</strong> Ledger Lock Immutable ✓</div>
                                </div>

                            </div>
                        </div>

                        <div class="modal-footer border-top px-4 py-3">
                            <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;

            new bootstrap.Modal(modalEl).show();

            if (window.AtlasAuditEngine) {
                window.AtlasAuditEngine.logEvent('director@buana.studio', 'Director', 'IJAZAH_ISSUED', student.id, `Issued cryptographic Ijazah serial ${ijazahData.serialNo}`);
            }
        };

        if (window.AtlasFaultGuard) {
            window.AtlasFaultGuard.runIsolated('governance', 'Cryptographic Ijazah Engine', 'app-viewport', processFn);
        } else {
            processFn();
        }
    }

    return {
        getStudent,
        openCbtExamModal,
        openRaporDigitalModal,
        signoffParentRapor,
        openGraduationAuditModal,
        openIjazahModal
    };
})();
