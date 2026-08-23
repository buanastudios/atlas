/**
 * Atlas Edu — Graduation & Ijazah Module
 * Business Process:
 *   1. Graduation Candidate List  — view all students by graduation status
 *   2. Clearance Audit (4-Pillar) — GPA · Tahfizh · Character · Financial
 *   3. Issue Official Ijazah      — cryptographic certificate after audit PASSED
 *
 * Status flow:  ENROLLED → AUDIT_ELIGIBLE → GRADUATION_AUDITED → IJAZAH_ISSUED
 */
window.EduGraduation = (function () {

    // ── Candidate data ────────────────────────────────────────────────────────
    // Pulls from EduStudentLifecycle if available, otherwise uses seed data
    function _getCandidates() {
        const lifecycle = window.EduStudentLifecycle;
        if (lifecycle && lifecycle.getAllStudents) return lifecycle.getAllStudents();
        return _seedCandidates();
    }

    function _seedCandidates() {
        return [
            {
                id: 'STD-2026-001', nisn: '0082391024',
                name: 'Muhammad Ali Santri',
                gender: 'Laki-laki',
                tempatLahir: 'Bandung',
                tanggalLahir: '2008-04-15',
                degreeName: 'Senior High School (SMA / MA)',
                gradeLevel: 'Kelas XII SMA',
                parentName: 'H. Ahmad Subagyo',
                status: 'GRADUATION_AUDITED',
                gpa: 3.88,
                tahfizhProgress: '15 Juz Mutqin',
                tahfizhTarget: 10,
                tahfizhAchieved: 15,
                characterGrade: 'A (Mumtaz)',
                sppStatus: 'PAID_IN_FULL',
                sppBalance: 0,
                ijazah: {
                    serialNo: 'IJZ-SMA-2026-08912',
                    issueDate: '2026-06-25',
                    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    qrCodeUrl: 'https://atlas.buana.studio/verify/IJZ-SMA-2026-08912'
                }
            },
            {
                id: 'STD-2026-003', nisn: '0058192011',
                name: 'Thariq Al-Fatih',
                gender: 'Laki-laki',
                tempatLahir: 'Surabaya',
                tanggalLahir: '2002-11-03',
                degreeName: "Diploma 2 Arabic (Ma'had Aly)",
                gradeLevel: "Semester IV (Ma'had Aly)",
                parentName: 'H. Abdullah Syukur',
                status: 'GRADUATION_AUDITED',
                gpa: 3.95,
                tahfizhProgress: '30 Juz Mutqin (Khatam)',
                tahfizhTarget: 30,
                tahfizhAchieved: 30,
                characterGrade: 'A (Mumtaz)',
                sppStatus: 'PAID_IN_FULL',
                sppBalance: 0,
                ijazah: {
                    serialNo: 'IJZ-D2-2026-00412',
                    issueDate: '2026-06-28',
                    sha256Hash: 'c7be1ed902fb8dd4d48997c6452f5d7e509fbfa23d9073e52f01f05786',
                    qrCodeUrl: 'https://atlas.buana.studio/verify/IJZ-D2-2026-00412'
                }
            },
            {
                id: 'STD-2026-005', nisn: '0094812034',
                name: 'Fathimah Az-Zahra Hakim',
                gender: 'Perempuan',
                tempatLahir: 'Yogyakarta',
                tanggalLahir: '2007-07-20',
                degreeName: 'Junior High School (SMP / MTs)',
                gradeLevel: 'Kelas IX SMP',
                parentName: 'Dr. Hakim Santoso',
                status: 'AUDIT_ELIGIBLE',
                gpa: 3.71,
                tahfizhProgress: '8 Juz (Progres sedang)',
                tahfizhTarget: 10,
                tahfizhAchieved: 8,
                characterGrade: 'A- (Sangat Baik)',
                sppStatus: 'OUTSTANDING',
                sppBalance: 750000,
                ijazah: null
            },
            {
                id: 'STD-2026-006', nisn: '0071823045',
                name: 'Umar Khalid Al-Faruq',
                gender: 'Laki-laki',
                tempatLahir: 'Medan',
                tanggalLahir: '2008-01-10',
                degreeName: 'Junior High School (SMP / MTs)',
                gradeLevel: 'Kelas IX SMP',
                parentName: 'Ir. Khalid Maulana',
                status: 'AUDIT_ELIGIBLE',
                gpa: 3.45,
                tahfizhProgress: '10 Juz (Target Tercapai)',
                tahfizhTarget: 10,
                tahfizhAchieved: 10,
                characterGrade: 'B+ (Baik)',
                sppStatus: 'PAID_IN_FULL',
                sppBalance: 0,
                ijazah: null
            },
            {
                id: 'STD-2026-007', nisn: '0083921056',
                name: 'Zaynab Maryam Idris',
                gender: 'Perempuan',
                tempatLahir: 'Makassar',
                tanggalLahir: '2009-09-05',
                degreeName: 'Primary School (SD / MI)',
                gradeLevel: 'Kelas VI SD',
                parentName: 'Ust. Idris Salim',
                status: 'ENROLLED',
                gpa: 2.60,
                tahfizhProgress: '3 Juz (Di bawah target)',
                tahfizhTarget: 5,
                tahfizhAchieved: 3,
                characterGrade: 'B (Baik)',
                sppStatus: 'OUTSTANDING',
                sppBalance: 1200000,
                ijazah: null
            }
        ];
    }

    // ── State ─────────────────────────────────────────────────────────────────
    let candidates = _seedCandidates();
    let _currentFilter = 'all';

    // Persist mutations (issuing ijazah) to session storage
    function _save() { sessionStorage.setItem('graduation_candidates', JSON.stringify(candidates)); }
    function _load() {
        const saved = sessionStorage.getItem('graduation_candidates');
        if (saved) candidates = JSON.parse(saved);
    }
    _load();

    // ── Helpers ───────────────────────────────────────────────────────────────
    function _getCandidate(id) { return candidates.find(c => c.id === id) || candidates[0]; }

    function _computeClearance(c) {
        const gpaPass       = c.gpa >= 2.75;
        const tahfizhPass   = c.tahfizhAchieved >= c.tahfizhTarget;
        const charPass      = c.characterGrade.startsWith('A') || c.characterGrade.startsWith('B+');
        const financePass   = c.sppBalance === 0;
        const allPass       = gpaPass && tahfizhPass && charPass && financePass;
        return { gpaPass, tahfizhPass, charPass, financePass, allPass };
    }

    const STATUS_CONFIG = {
        ENROLLED:           { label: 'Aktif Terdaftar',        color: '#64748b', bg: '#f1f5f9' },
        AUDIT_ELIGIBLE:     { label: 'Siap Audit Kelulusan',   color: '#0891b2', bg: '#eff6ff' },
        GRADUATION_AUDITED: { label: 'Audit Lulus',            color: '#059669', bg: '#f0fdf4' },
        IJAZAH_ISSUED:      { label: 'Ijazah Telah Diterbitkan', color: '#d97706', bg: '#fffbe0' },
    };

    function _badge(status) {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ENROLLED;
        return `<span style="display:inline-flex;align-items:center;gap:5px;background:${cfg.bg};color:${cfg.color};
            border:1.5px solid ${cfg.color};border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;">
            ${cfg.label}</span>`;
    }

    function _pillarRow(icon, num, label, detail, pass) {
        const ok = `<span style="background:#f0fdf4;color:#059669;border:1.5px solid #059669;border-radius:20px;padding:3px 11px;font-size:11px;font-weight:700;">LULUS ✓</span>`;
        const fail= `<span style="background:#fff5f5;color:#ef4444;border:1.5px solid #ef4444;border-radius:20px;padding:3px 11px;font-size:11px;font-weight:700;">BELUM ✗</span>`;
        return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;
            background:#fff;border:1.5px solid ${pass?'#d1fae5':'#fee2e2'};border-radius:12px;gap:12px;">
            <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;">
                <div style="width:36px;height:36px;border-radius:50%;background:${pass?'#059669':'#ef4444'};
                    color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;">
                    <i class="fas ${pass?'fa-check':'fa-times'}"></i>
                </div>
                <div style="min-width:0;">
                    <div style="font-weight:700;font-size:13px;color:var(--text);">${num}. ${label}</div>
                    <div style="font-size:12px;color:var(--muted);margin-top:2px;">${detail}</div>
                </div>
            </div>
            ${pass ? ok : fail}
        </div>`;
    }

    // ── Shared UI helpers ─────────────────────────────────────────────────────
    function _hideMain() {
        const main = document.getElementById('main-content-area');
        if (main) main.style.display = 'none';
    }
    function _showMain() {
        const main = document.getElementById('main-content-area');
        if (main) main.style.display = '';
        const mod  = document.getElementById('module-graduation');
        if (mod)  mod.style.display = 'none';
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  1. MAIN MODULE SCREEN
    // ─────────────────────────────────────────────────────────────────────────
    function openModule() { _renderScreen('all'); }
    function filterView(f) { _currentFilter = f; _renderScreen(f); }
    function closeModule() { _showMain(); }

    function _renderScreen(filter) {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-graduation');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-graduation';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        const filtered = filter === 'all' ? candidates : candidates.filter(c => c.status === filter);
        const counts = {};
        ['all','AUDIT_ELIGIBLE','GRADUATION_AUDITED','IJAZAH_ISSUED','ENROLLED'].forEach(k => {
            counts[k] = k === 'all' ? candidates.length : candidates.filter(c => c.status === k).length;
        });

        const tabs = [
            { key: 'all',               label: 'Semua',          icon: 'fa-list' },
            { key: 'AUDIT_ELIGIBLE',    label: 'Siap Audit',     icon: 'fa-clipboard-check' },
            { key: 'GRADUATION_AUDITED',label: 'Audit Lulus',    icon: 'fa-check-circle' },
            { key: 'IJAZAH_ISSUED',     label: 'Ijazah Terbit',  icon: 'fa-certificate' },
            { key: 'ENROLLED',          label: 'Belum Siap',     icon: 'fa-clock' },
        ];

        screen.innerHTML = `
        <div class="mt-3">
            <!-- Header -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
                <button onclick="EduGraduation.closeModule()"
                    style="background:transparent;border:1.5px solid var(--border);border-radius:9px;
                    padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);flex-shrink:0;">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div style="flex:1;min-width:0;">
                    <h5 style="font-weight:800;margin:0;font-size:16px;">Graduation &amp; Ijazah</h5>
                    <div style="font-size:12px;color:var(--muted);">${candidates.length} kandidat kelulusan · T.A. 2025/2026</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
                    <div style="background:#fffbe0;border:1.5px solid #f59e0b;border-radius:9px;padding:6px 14px;font-size:12px;font-weight:700;color:#d97706;">
                        <i class="fas fa-certificate me-1"></i>${counts['IJAZAH_ISSUED']} Ijazah Terbit
                    </div>
                    <div style="background:#f0fdf4;border:1.5px solid #059669;border-radius:9px;padding:6px 14px;font-size:12px;font-weight:700;color:#059669;">
                        <i class="fas fa-check-circle me-1"></i>${counts['GRADUATION_AUDITED']} Audit Lulus
                    </div>
                </div>
            </div>

            <!-- Business Process Flow Banner -->
            <div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-radius:14px;padding:16px 20px;margin-bottom:16px;color:#fff;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:10px;">Alur Proses Kelulusan</div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    ${[
                        { n:1, icon:'fa-user-graduate', label:'Terdaftar', sub:'Aktif Belajar' },
                        { n:2, icon:'fa-clipboard-check', label:'Siap Audit', sub:'Semua Syarat Lengkap' },
                        { n:3, icon:'fa-award', label:'Audit Kelulusan', sub:'4-Pilar Verifikasi' },
                        { n:4, icon:'fa-certificate', label:'Penerbitan Ijazah', sub:'Dokumen Resmi' },
                    ].map((s, i, arr) => `
                        <div style="display:flex;align-items:center;gap:6px;">
                            <div style="text-align:center;">
                                <div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.12);
                                    display:flex;align-items:center;justify-content:center;margin:0 auto 4px;font-size:13px;">
                                    <i class="fas ${s.icon}"></i>
                                </div>
                                <div style="font-size:10px;font-weight:700;line-height:1.2;">${s.label}</div>
                                <div style="font-size:9px;color:#94a3b8;">${s.sub}</div>
                            </div>
                            ${i < arr.length-1 ? `<i class="fas fa-chevron-right" style="color:#475569;font-size:10px;flex-shrink:0;"></i>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Filter Tabs -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                ${tabs.map(t => `
                <button onclick="EduGraduation.filterView('${t.key}')"
                    style="padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;
                    transition:all .15s;border:1.5px solid ${t.key===filter?'var(--text)':'var(--border)'};
                    background:${t.key===filter?'var(--text)':'#fff'};
                    color:${t.key===filter?'#fff':'var(--text-light)'};">
                    <i class="fas ${t.icon} me-1"></i>${t.label}
                    <span style="margin-left:5px;background:${t.key===filter?'rgba(255,255,255,.25)':'var(--bg)'};
                        border-radius:10px;padding:1px 7px;font-size:10px;">${counts[t.key]||0}</span>
                </button>`).join('')}
            </div>

            <!-- Candidate Cards -->
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${filtered.length === 0 ? `
                <div style="text-align:center;padding:48px 20px;color:var(--muted);">
                    <i class="fas fa-graduation-cap" style="font-size:32px;opacity:.3;margin-bottom:12px;display:block;"></i>
                    Tidak ada kandidat untuk filter ini
                </div>` : filtered.map(c => _candidateCard(c)).join('')}
            </div>
        </div>`;
    }

    function _candidateCard(c) {
        const cl = _computeClearance(c);
        const canAudit    = c.status === 'AUDIT_ELIGIBLE';
        const canIjazah   = c.status === 'GRADUATION_AUDITED';
        const hasIjazah   = c.status === 'IJAZAH_ISSUED' && c.ijazah;
        const auditReady  = cl.allPass;

        return `
        <div style="background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:16px;
            box-shadow:0 1px 4px rgba(0,0,0,.05);transition:box-shadow .15s;"
            onmouseenter="this.style.boxShadow='0 4px 16px rgba(0,0,0,.10)'"
            onmouseleave="this.style.boxShadow='0 1px 4px rgba(0,0,0,.05)'">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
                        <span style="font-weight:800;font-size:14px;color:var(--text);">${c.name}</span>
                        ${_badge(c.status)}
                    </div>
                    <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">
                        NISN: ${c.nisn} · ${c.gradeLevel} · ${c.degreeName}
                    </div>
                    <!-- Mini clearance indicators -->
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${[
                            { ok: cl.gpaPass,     icon:'fa-chart-line', label:`GPA ${c.gpa}` },
                            { ok: cl.tahfizhPass, icon:'fa-quran',      label:`${c.tahfizhAchieved}/${c.tahfizhTarget} Juz` },
                            { ok: cl.charPass,    icon:'fa-star',       label:'Karakter' },
                            { ok: cl.financePass, icon:'fa-wallet',     label: cl.financePass ? 'Lunas' : `Tunggakan ${(c.sppBalance/1000).toFixed(0)}K` },
                        ].map(p => `
                        <span style="display:inline-flex;align-items:center;gap:4px;
                            background:${p.ok?'#f0fdf4':'#fff5f5'};color:${p.ok?'#059669':'#ef4444'};
                            border:1px solid ${p.ok?'#d1fae5':'#fecaca'};
                            border-radius:20px;padding:3px 9px;font-size:10px;font-weight:700;">
                            <i class="fas ${p.icon}" style="font-size:9px;"></i>${p.label}
                        </span>`).join('')}
                    </div>
                </div>
                <!-- Action buttons -->
                <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;align-items:flex-end;">
                    ${hasIjazah ? `
                    <button onclick="EduGraduation.openIjazahView('${c.id}')"
                        style="background:#d97706;color:#fff;border:none;border-radius:9px;
                        padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">
                        <i class="fas fa-certificate me-1"></i>Lihat Ijazah
                    </button>` : ''}
                    ${canIjazah ? `
                    <button onclick="EduGraduation.openIjazahIssueModal('${c.id}')"
                        style="background:#059669;color:#fff;border:none;border-radius:9px;
                        padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">
                        <i class="fas fa-certificate me-1"></i>Terbitkan Ijazah
                    </button>` : ''}
                    <button onclick="EduGraduation.openAuditModal('${c.id}')"
                        style="background:${canAudit?'var(--text)':'transparent'};
                        color:${canAudit?'#fff':'var(--text-light)'};
                        border:1.5px solid ${canAudit?'var(--text)':'var(--border)'};
                        border-radius:9px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">
                        <i class="fas fa-clipboard-check me-1"></i>${canAudit ? 'Mulai Audit' : 'Lihat Audit'}
                    </button>
                </div>
            </div>
        </div>`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  2. GRADUATION CLEARANCE AUDIT MODAL (4-Pillar)
    // ─────────────────────────────────────────────────────────────────────────
    function openAuditModal(studentId) {
        const c  = _getCandidate(studentId);
        const cl = _computeClearance(c);
        const alreadyAudited = c.status === 'GRADUATION_AUDITED' || c.status === 'IJAZAH_ISSUED';

        let modalEl = document.getElementById('modalGraduationAudit');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'modalGraduationAudit';
            modalEl.className = 'modal fade';
            modalEl.tabIndex = -1;
            document.body.appendChild(modalEl);
        }

        const headerColor = cl.allPass ? '#059669' : '#dc2626';
        const headerLabel = alreadyAudited
            ? `<span style="background:rgba(255,255,255,.2);border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">✓ Sudah Diaudit</span>`
            : cl.allPass
                ? `<span style="background:rgba(255,255,255,.2);border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">✓ Siap Diluluskan</span>`
                : `<span style="background:rgba(255,255,255,.2);border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;">✗ Syarat Belum Terpenuhi</span>`;

        modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg" style="border-radius:20px;">
                <!-- Header -->
                <div class="modal-header border-0 px-4 py-3 text-white"
                    style="background:${headerColor};border-top-left-radius:20px;border-top-right-radius:20px;">
                    <div style="display:flex;align-items:center;gap:10px;flex:1;">
                        <div style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);
                            display:flex;align-items:center;justify-content:center;font-size:16px;">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div>
                            <div style="font-weight:800;font-size:14px;">Audit Clearance Kelulusan</div>
                            <div style="font-size:11px;opacity:.8;">4-Pilar Verifikasi Wajib Kelulusan</div>
                        </div>
                        ${headerLabel}
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body p-4">
                    <!-- Student Info Card -->
                    <div style="background:#f8fafc;border:1.5px solid var(--border);border-radius:12px;
                        padding:14px 16px;margin-bottom:20px;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                            <div>
                                <div style="font-weight:800;font-size:15px;color:var(--text);">${c.name}</div>
                                <div style="font-size:12px;color:var(--muted);">NISN: ${c.nisn} · ${c.degreeName}</div>
                                <div style="font-size:12px;color:var(--muted);">Orang Tua/Wali: ${c.parentName}</div>
                            </div>
                            ${_badge(c.status)}
                        </div>
                    </div>

                    <!-- 4-Pillar Checklist -->
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
                        color:var(--muted);margin-bottom:12px;">4-Pilar Verifikasi Wajib Kelulusan</div>
                    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
                        ${_pillarRow('fa-chart-line', 1, 'Nilai Akademik & IPK',
                            `IPK Kumulatif: <strong>${c.gpa}/4.00</strong> (Minimum 2.75)`, cl.gpaPass)}
                        ${_pillarRow('fa-quran', 2, 'Target Hafalan Tahfizh Al-Quran',
                            `Capaian: <strong>${c.tahfizhAchieved} dari ${c.tahfizhTarget} Juz</strong> — ${c.tahfizhProgress}`, cl.tahfizhPass)}
                        ${_pillarRow('fa-star', 3, 'Evaluasi Karakter & Adab',
                            `Nilai Karakter: <strong>${c.characterGrade}</strong> (Minimum B+)`, cl.charPass)}
                        ${_pillarRow('fa-wallet', 4, 'Clearance Keuangan (SPP & Administrasi)',
                            cl.financePass
                                ? `Saldo Tunggakan: <strong>Rp 0 (Lunas)</strong>`
                                : `Tunggakan: <strong style="color:#ef4444;">Rp ${c.sppBalance.toLocaleString('id-ID')}</strong> — Harus dilunasi`, cl.financePass)}
                    </div>

                    <!-- Overall Result -->
                    <div style="border-radius:12px;padding:14px 16px;text-align:center;
                        background:${cl.allPass?'#f0fdf4':'#fff5f5'};
                        border:2px solid ${cl.allPass?'#059669':'#ef4444'};">
                        <i class="fas ${cl.allPass?'fa-check-circle':'fa-times-circle'}"
                            style="font-size:24px;color:${cl.allPass?'#059669':'#ef4444'};margin-bottom:6px;"></i>
                        <div style="font-weight:800;font-size:14px;color:${cl.allPass?'#059669':'#ef4444'};">
                            ${cl.allPass ? 'SEMUA SYARAT TERPENUHI — LAYAK LULUS' : 'SYARAT BELUM LENGKAP — BELUM LAYAK LULUS'}
                        </div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">
                            ${cl.allPass
                                ? 'Siswa memenuhi semua 4 pilar syarat kelulusan'
                                : `${[!cl.gpaPass,!cl.tahfizhPass,!cl.charPass,!cl.financePass].filter(Boolean).length} pilar belum terpenuhi`}
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top px-4 py-3" style="gap:8px;">
                    <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Tutup</button>
                    ${cl.allPass && !alreadyAudited ? `
                    <button type="button" onclick="EduGraduation.confirmGraduationAudit('${c.id}')"
                        class="btn btn-success text-white fw-bold px-4 rounded-pill shadow-sm">
                        <i class="fas fa-check-circle me-1"></i>Konfirmasi Kelulusan
                        <i class="fas fa-arrow-right ms-1"></i>
                    </button>` : ''}
                    ${alreadyAudited ? `
                    <button type="button" onclick="EduGraduation.openIjazahIssueModal('${c.id}');bootstrap.Modal.getInstance(document.getElementById('modalGraduationAudit')).hide()"
                        class="btn fw-bold px-4 rounded-pill shadow-sm text-white"
                        style="background:#d97706;border-color:#d97706;">
                        <i class="fas fa-certificate me-1"></i>
                        ${c.status === 'IJAZAH_ISSUED' ? 'Lihat Ijazah' : 'Terbitkan Ijazah'}
                        <i class="fas fa-arrow-right ms-1"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>`;

        new bootstrap.Modal(modalEl).show();
    }

    // Confirm graduation audit — transitions status
    function confirmGraduationAudit(studentId) {
        const c = _getCandidate(studentId);
        c.status = 'GRADUATION_AUDITED';
        _save();
        bootstrap.Modal.getInstance(document.getElementById('modalGraduationAudit'))?.hide();

        // Show success toast
        _toast('success', `✓ ${c.name} berhasil dinyatakan LULUS. Ijazah dapat segera diterbitkan.`);
        setTimeout(() => _renderScreen(_currentFilter), 400);
        setTimeout(() => openIjazahIssueModal(studentId), 900);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  3. ISSUE OFFICIAL IJAZAH MODAL
    // ─────────────────────────────────────────────────────────────────────────
    function openIjazahIssueModal(studentId) {
        const c = _getCandidate(studentId);

        // Generate ijazah data if not yet issued
        const ijazahData = c.ijazah || {
            serialNo: `IJZ-${(c.degreeName.match(/\b[A-Z]/g)||['X']).join('')}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            issueDate: new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }),
            sha256Hash: Array.from({length:64}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join(''),
            qrCodeUrl: `https://atlas.buana.studio/verify/${c.id}`
        };

        let modalEl = document.getElementById('modalIjazahIssue');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'modalIjazahIssue';
            modalEl.className = 'modal fade';
            modalEl.tabIndex = -1;
            document.body.appendChild(modalEl);
        }

        modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content border-0 shadow-lg" style="border-radius:20px;">
                <!-- Header -->
                <div class="modal-header border-0 px-4 py-3 bg-white" style="border-top-left-radius:20px;border-top-right-radius:20px;">
                    <div style="display:flex;align-items:center;gap:10px;flex:1;">
                        <i class="fas fa-certificate" style="font-size:22px;color:#d97706;"></i>
                        <div>
                            <div style="font-weight:800;font-size:14px;">Penerbitan Ijazah Resmi</div>
                            <div style="font-size:11px;color:var(--muted);">Dokumen Kelulusan Berverifikasi Kriptografis</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <button onclick="window.print()"
                            style="background:transparent;border:1.5px solid var(--border);border-radius:9px;
                            padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;color:var(--text-light);">
                            <i class="fas fa-print me-1"></i>Cetak / PDF
                        </button>
                        <button onclick="navigator.clipboard.writeText('${ijazahData.qrCodeUrl}').then(()=>EduGraduation._toast('info','Link verifikasi disalin!'))"
                            style="background:#0891b2;color:#fff;border:none;border-radius:9px;
                            padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;">
                            <i class="fas fa-share-alt me-1"></i>Bagikan Link
                        </button>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                </div>

                <div class="modal-body p-4" style="background:#f1f5f9;">
                    <!-- IJAZAH CERTIFICATE BOARD -->
                    <div style="max-width:820px;margin:0 auto;background:#fffdf7;border-radius:18px;
                        border:6px double #d97706;padding:36px 40px;box-shadow:0 8px 32px rgba(0,0,0,.12);">

                        <!-- Top Row: Logo + Serial + Badge -->
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#1e293b,#334155);
                                    display:flex;align-items:center;justify-content:center;color:#f59e0b;font-size:22px;">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <div style="font-weight:800;font-size:13px;color:#1e293b;">ATLAS EDU</div>
                                    <div style="font-size:10px;color:#64748b;">Direktorat Pendidikan Islam</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-family:monospace;font-size:10px;color:#64748b;">No. Seri Ijazah:</div>
                                <div style="font-family:monospace;font-size:12px;font-weight:800;color:#1e293b;">${ijazahData.serialNo}</div>
                                <div style="font-family:monospace;font-size:10px;color:#64748b;">NISN: ${c.nisn}</div>
                            </div>
                            <div style="background:#1e293b;color:#f8fafc;border-radius:8px;padding:5px 12px;
                                font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">
                                ISO 27001<br>CERTIFIED
                            </div>
                        </div>

                        <!-- Title -->
                        <div style="text-align:center;border-top:2px solid #f59e0b;border-bottom:2px solid #f59e0b;
                            padding:16px 0;margin-bottom:24px;">
                            <div style="font-size:28px;font-weight:900;letter-spacing:3px;color:#92400e;
                                font-family:'Georgia',serif;">IJAZAH KELULUSAN</div>
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;
                                color:#78716c;margin-top:4px;">Sertifikat Akademik Resmi Kelulusan</div>
                        </div>

                        <!-- Body Text -->
                        <div style="text-align:center;font-size:14px;line-height:2;color:#374151;margin-bottom:28px;">
                            <div>Menerangkan bahwa peserta didik yang bernama:</div>
                            <div style="font-size:26px;font-weight:900;color:#1e293b;
                                text-decoration:underline;font-family:'Georgia',serif;
                                margin:8px 0;">${c.name}</div>
                            <div style="font-size:12px;color:#6b7280;">
                                Lahir di ${c.tempatLahir}, ${new Date(c.tanggalLahir).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
                            </div>
                            <div style="margin-top:12px;">
                                telah menyelesaikan dan memenuhi seluruh persyaratan kelulusan pada jenjang:
                            </div>
                            <div style="font-size:16px;font-weight:800;color:#1d4ed8;margin:8px 0;">
                                ${c.degreeName}
                            </div>
                            <div>
                                dengan predikat
                                <span style="background:#059669;color:#fff;border-radius:6px;padding:3px 10px;
                                    font-weight:800;font-size:13px;margin:0 4px;">MUMTAZ (Sangat Memuaskan)</span>
                                IPK <strong>${c.gpa}/4.00</strong>
                            </div>
                        </div>

                        <!-- Footer Row: QR · Seal · Signature -->
                        <div style="display:flex;align-items:flex-end;justify-content:space-between;
                            border-top:1.5px solid #e5e7eb;padding-top:20px;gap:12px;">
                            <!-- QR Verification -->
                            <div style="text-align:center;">
                                <div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;
                                    padding:10px;display:inline-block;">
                                    <div style="background:#1e293b;color:#fff;font-family:monospace;
                                        font-size:8px;padding:8px;border-radius:6px;line-height:1.6;
                                        width:72px;text-align:center;">
                                        [QR]<br>${c.id}<br>ATLAS<br>VERIFY
                                    </div>
                                    <div style="font-size:8px;color:#94a3b8;margin-top:4px;">Scan untuk verifikasi</div>
                                </div>
                            </div>
                            <!-- Directorate Seal -->
                            <div style="text-align:center;">
                                <div style="width:80px;height:80px;border-radius:50%;
                                    border:3px solid #d97706;background:#fffbeb;
                                    display:flex;align-items:center;justify-content:center;
                                    font-size:28px;color:#d97706;margin:0 auto;">
                                    <i class="fas fa-award"></i>
                                </div>
                                <div style="font-size:9px;font-weight:700;color:#78716c;margin-top:4px;
                                    text-transform:uppercase;letter-spacing:.05em;">STEMPEL DIREKTUR</div>
                            </div>
                            <!-- Signature -->
                            <div style="text-align:right;font-size:12px;">
                                <div style="color:#6b7280;margin-bottom:36px;">
                                    Jakarta, ${ijazahData.issueDate}
                                </div>
                                <div style="font-weight:800;color:#1e293b;border-top:1.5px solid #374151;
                                    padding-top:4px;display:inline-block;">Hikmatullah Sakti Buana</div>
                                <div style="color:#6b7280;font-size:11px;">Direktur Utama Pendidikan</div>
                            </div>
                        </div>

                        <!-- Crypto Integrity Footer -->
                        <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;
                            font-family:monospace;font-size:9px;color:#94a3b8;">
                            <div><i class="fas fa-shield-alt" style="color:#059669;margin-right:4px;"></i>
                                SHA-256: ${ijazahData.sha256Hash}</div>
                            <div><i class="fas fa-lock" style="color:#6366f1;margin-right:4px;"></i>
                                Audit Trail: IMMUTABLE · ISACA COBIT 2019 · Ledger Lock ✓</div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top px-4 py-3" style="gap:8px;">
                    <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Tutup</button>
                    ${c.status !== 'IJAZAH_ISSUED' ? `
                    <button type="button" onclick="EduGraduation.issueIjazah('${c.id}')"
                        class="btn fw-bold px-5 rounded-pill shadow-sm text-white"
                        style="background:#d97706;border-color:#d97706;font-size:14px;">
                        <i class="fas fa-certificate me-2"></i>Terbitkan & Simpan Ijazah Resmi
                    </button>` : `
                    <div style="display:flex;align-items:center;gap:6px;background:#f0fdf4;
                        border:1.5px solid #059669;border-radius:9px;padding:8px 16px;font-size:12px;font-weight:700;color:#059669;">
                        <i class="fas fa-check-circle"></i> Ijazah Sudah Diterbitkan
                    </div>`}
                </div>
            </div>
        </div>`;

        new bootstrap.Modal(modalEl).show();
    }

    // Actually issue the ijazah — mark status and save
    function issueIjazah(studentId) {
        const c = _getCandidate(studentId);
        if (c.status === 'IJAZAH_ISSUED') return;

        c.ijazah = {
            serialNo: `IJZ-${(c.degreeName.match(/\b[A-Z]/g)||['X']).join('')}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            issueDate: new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }),
            sha256Hash: Array.from({length:64}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join(''),
            qrCodeUrl: `https://atlas.buana.studio/verify/${c.id}`
        };
        c.status = 'IJAZAH_ISSUED';
        _save();

        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent('director@buana.studio', 'Director', 'IJAZAH_ISSUED',
                c.id, `Issued Ijazah serial ${c.ijazah.serialNo} for ${c.name}`);
        }

        bootstrap.Modal.getInstance(document.getElementById('modalIjazahIssue'))?.hide();
        _toast('success', `🎓 Ijazah ${c.name} (${c.ijazah.serialNo}) berhasil diterbitkan!`);
        setTimeout(() => _renderScreen(_currentFilter), 400);
    }

    // View already-issued ijazah
    function openIjazahView(studentId) {
        openIjazahIssueModal(studentId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  TOAST HELPER
    // ─────────────────────────────────────────────────────────────────────────
    function _toast(type, msg) {
        const colors = { success:'#059669', info:'#0891b2', warning:'#d97706', error:'#dc2626' };
        const t = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
            background:${colors[type]||colors.info};color:#fff;border-radius:12px;
            padding:12px 22px;font-size:13px;font-weight:700;z-index:9999;
            box-shadow:0 8px 32px rgba(0,0,0,.2);max-width:90vw;text-align:center;
            animation:slideUp .25s ease;`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 4000);
    }

    // Public API — also expose _toast for inline calls
    return {
        openModule,
        closeModule,
        filterView,
        openAuditModal,
        confirmGraduationAudit,
        openIjazahIssueModal,
        openIjazahView,
        issueIjazah,
        _toast,
        // Legacy compat — called from dashboard quick-action button
        openIjazahModal: (id) => id ? openIjazahIssueModal(id) : openModule()
    };
})();
