/**
 * Atlas Edu — Tahfizh & Mutun Center
 * Includes Individual Learning Contracts, 5-Tier Qur'an Skill Leveling, and Khat Calligraphy Mastery.
 */
window.EduTahfizh = (function () {

    let history = [];
    let contracts = [];
    let skillLevels = [];
    let khatHistory = [];
    let students = [];
    let _category = 'quran';

    function openModule() {
        if (students.length === 0) {
            students = [
                { id: 1, nama_lengkap: 'Ahmad Fauzan Al-Hakim', kelas: 'XII IPA' },
                { id: 2, nama_lengkap: 'Fatimah Azzahra Putri', kelas: 'IX A' },
                { id: 3, nama_lengkap: 'Muhammad Rizki Ramadhan', kelas: 'VI B' },
                { id: 4, nama_lengkap: 'Siti Aisyah Nur Hidayah', kelas: 'Tahfizh' },
                { id: 5, nama_lengkap: 'Zaid Mubarak Al-Farisi', kelas: 'Idad' }
            ];
        }
        if (contracts.length === 0) {
            contracts = [
                { id: 1, student_name: 'Ahmad Fauzan Al-Hakim', target_daily_ayat: 28, target_juz: 30, start_date: '2026-08-01', target_end_date: '2027-06-30' },
                { id: 2, student_name: 'Fatimah Azzahra Putri', target_daily_ayat: 10, target_juz: 15, start_date: '2026-08-01', target_end_date: '2027-06-30' }
            ];
        }
        _renderScreen();
        _loadData();
    }

    async function _loadData() {
        try {
            const res = await fetch('/api/tahfizh');
            const data = await res.json();
            if (data.success && data.students && data.students.length > 0) {
                history = data.setoran || [];
                students = data.students || [];
            }
            const resC = await fetch('/api/tahfizh?type=contracts');
            const dataC = await resC.json();
            if (dataC.success && dataC.contracts && dataC.contracts.length > 0) contracts = dataC.contracts;

            const resK = await fetch('/api/tahfizh?type=khat');
            const dataK = await resK.json();
            if (dataK.success && dataK.khat_history) khatHistory = dataK.khat_history;
            _renderScreen();
        } catch (err) {
            console.warn('[EduTahfizh] API fetch background notice:', err);
        }
    }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-tahfizh');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-tahfizh';
            screen.className = 'pb-5';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        screen.innerHTML = `
        <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:20px;color:#fff;">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                    <button onclick="EduTahfizh.closeModule()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;font-weight:700;">
                        <i class="fas fa-arrow-left me-1"></i>Kembali
                    </button>
                    <div>
                        <h4 class="fw-bold mb-0">Tahfizh &amp; Mutun Center</h4>
                        <div class="small opacity-75">Sekolah Calon Huffaz &amp; Ilmuwan Muslim</div>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button onclick="EduTahfizh.openContractModal()" class="btn btn-light btn-sm fw-bold text-primary">
                        <i class="fas fa-file-contract me-1"></i>Kontrak Tahfizh Individual
                    </button>
                    <button onclick="EduTahfizh.openKhatModal()" class="btn btn-light btn-sm fw-bold text-purple">
                        <i class="fas fa-pen-nib me-1"></i>Khat / Kaligrafi
                    </button>
                </div>
            </div>
        </div>

        <div class="px-3 px-md-4 pt-3" style="max-width:900px;margin:0 auto;">
            <!-- Qur'an Skill Ladder Banner -->
            <div class="kit-card p-3 mb-3" style="background:#f8fafc;border-left:4px solid #4f46e5;">
                <div class="fw-bold mb-1" style="font-size:13px;"><i class="fas fa-graduation-cap me-2 text-indigo"></i>Jenjang Leveling Pembelajaran Qur'an</div>
                <div class="d-flex gap-2 flex-wrap mt-2">
                    <span class="badge bg-secondary">Level 1: Iqro / Tilawati</span>
                    <span class="badge bg-info text-dark">Level 2: Kelancaran Membaca</span>
                    <span class="badge bg-warning text-dark">Level 3: Tahsin Tajwid</span>
                    <span class="badge bg-primary">Level 4: Tahfizh Ziyadah</span>
                    <span class="badge bg-success">Level 5: Mutun &amp; Qira'at</span>
                </div>
            </div>

            <!-- Setoran Form -->
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <div class="kit-card p-4">
                        <h6 class="fw-bold mb-3"><i class="fas fa-plus-circle me-2 text-indigo"></i>Input Setoran Hafalan Baru</h6>
                        
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Pilih Santri</label>
                            <select id="ta-student-id" class="form-select">
                                ${students.map(s => `<option value="${s.id}">${s.nama_lengkap} (${s.kelas || 'Santri'})</option>`).join('')}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Jenis Setoran</label>
                            <select id="ta-jenis" class="form-select">
                                <option value="Hafalan">Ziyadah (Hafalan Baru)</option>
                                <option value="Murojaah">Murojaah (Pengulangan)</option>
                                <option value="Tasmi">Tasmi' (Ujian Publik)</option>
                            </select>
                        </div>

                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small fw-bold">Surah Dari</label>
                                <input type="text" id="ta-surah-dari" class="form-control" value="Al-Baqarah">
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-bold">Ayat Dari</label>
                                <input type="number" id="ta-ayat-dari" class="form-control" value="1">
                            </div>
                        </div>

                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small fw-bold">Surah Sampai</label>
                                <input type="text" id="ta-surah-sampai" class="form-control" value="Al-Baqarah">
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-bold">Ayat Sampai</label>
                                <input type="number" id="ta-ayat-sampai" class="form-control" value="28">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Nilai Scoring (1-10)</label>
                            <div class="row g-2">
                                <div class="col-4"><input type="number" id="ta-nilai-kelancaran" class="form-control" placeholder="Kelancaran" value="9"></div>
                                <div class="col-4"><input type="number" id="ta-nilai-tajwid" class="form-control" placeholder="Tajwid" value="9"></div>
                                <div class="col-4"><input type="number" id="ta-nilai-makhraj" class="form-control" placeholder="Makhraj" value="9"></div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Catatan Musyrif</label>
                            <input type="text" id="ta-catatan" class="form-control" placeholder="Makhraj huruf 'Ain diperjelas">
                        </div>

                        <button onclick="EduTahfizh.submitSetoran()" class="btn btn-indigo text-white w-100 fw-bold" style="background:#4f46e5;">
                            <i class="fas fa-save me-1"></i>Simpan Setoran
                        </button>
                    </div>
                </div>

                <!-- Contracts & Khat History Column -->
                <div class="col-12 col-md-6">
                    <!-- Contracts -->
                    <div class="kit-card p-3 mb-3">
                        <h6 class="fw-bold mb-2"><i class="fas fa-file-contract me-2 text-primary"></i>Kontrak Tahfizh Individual Active</h6>
                        ${contracts.length === 0 ? '<div class="small text-muted">Belum ada kontrak individual.</div>' : ''}
                        <div class="d-flex flex-column gap-2">
                            ${contracts.map(c => `
                            <div class="p-2 border rounded" style="background:#f0f9ff;font-size:12px;">
                                <div class="fw-bold text-primary">${c.student_name || 'Santri'}</div>
                                <div class="text-dark">Target Daily: <strong>${c.target_daily_ayat} Ayat / Hari</strong> (${c.target_juz} Juz Target)</div>
                                <div class="text-muted small">Periode: ${c.start_date} s/d ${c.target_end_date || '-'}</div>
                            </div>`).join('')}
                        </div>
                    </div>

                    <!-- Khat Calligraphy -->
                    <div class="kit-card p-3">
                        <h6 class="fw-bold mb-2"><i class="fas fa-pen-nib me-2 text-purple"></i>Catatan Progress Seni Khat / Kaligrafi</h6>
                        ${khatHistory.length === 0 ? '<div class="small text-muted">Belum ada progress Khat.</div>' : ''}
                        <div class="d-flex flex-column gap-2">
                            ${khatHistory.map(k => `
                            <div class="p-2 border rounded" style="background:#faf5ff;font-size:12px;">
                                <div class="fw-bold text-purple">${k.student_name || 'Santri'} — Khat ${k.khat_style}</div>
                                <div class="text-muted">Tahap: ${k.stage} · Skor: ${k.nilai_geometri || 8}/10</div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    async function submitSetoran() {
        const student_id = Number(document.getElementById('ta-student-id').value);
        const jenis_setoran = document.getElementById('ta-jenis').value;
        const surah_dari = document.getElementById('ta-surah-dari').value;
        const ayat_dari = Number(document.getElementById('ta-ayat-dari').value);
        const surah_sampai = document.getElementById('ta-surah-sampai').value;
        const ayat_sampai = Number(document.getElementById('ta-ayat-sampai').value);
        const nilai_kelancaran = Number(document.getElementById('ta-nilai-kelancaran').value);
        const nilai_tajwid = Number(document.getElementById('ta-nilai-tajwid').value);
        const nilai_makhraj = Number(document.getElementById('ta-nilai-makhraj').value);
        const catatan = document.getElementById('ta-catatan').value;

        try {
            const res = await fetch('/api/tahfizh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id, jenis_setoran, surah_dari, ayat_dari, surah_sampai, ayat_sampai,
                    nilai_kelancaran, nilai_tajwid, nilai_makhraj, catatan
                })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AtlasToast) AtlasToast.show(data.message, 'success');
                await openModule();
            }
        } catch (err) {
            console.error(err);
        }
    }

    function openContractModal() {
        const dailyAyat = prompt('Target Ayat per Hari santri (misal: 28 ayat/hari atau 5 ayat/hari):', '28');
        if (!dailyAyat) return;

        fetch('/api/tahfizh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save_contract',
                student_id: 1,
                target_daily_ayat: Number(dailyAyat),
                target_juz: 10,
                start_surah: 'Al-Baqarah',
                end_surah: 'An-Nas',
                start_date: new Date().toISOString().split('T')[0],
                target_end_date: '2027-06-30'
            })
        }).then(r => r.json()).then(d => {
            if (d.success) {
                if (window.AtlasToast) AtlasToast.show(d.message, 'success');
                openModule();
            }
        });
    }

    function openKhatModal() {
        const style = prompt('Rumpun Khat (Naskhi / Suluts / Riqah / Diwani / Kufi):', 'Naskhi');
        if (!style) return;

        fetch('/api/tahfizh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save_khat',
                student_id: 1,
                khat_style: style,
                stage: 'Kaedah Huruf',
                nilai_geometri: 9,
                nilai_keindahan: 8,
                catatan: 'Presisi nib sudut 45 derajat sangat baik'
            })
        }).then(r => r.json()).then(d => {
            if (d.success) {
                if (window.AtlasToast) AtlasToast.show(d.message, 'success');
                openModule();
            }
        });
    }

    function closeModule() {
        const screen = document.getElementById('module-tahfizh');
        if (screen) screen.style.display = 'none';
        _showMain();
    }

    function _hideMain() {
        ['screen-director', 'mgmt-screen-curriculum', '.tokopedia-hero-carousel'].forEach(sel => {
            const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
            if (el) el.style.display = 'none';
        });
    }

    function _showMain() {
        ['screen-director', 'mgmt-screen-curriculum', '.tokopedia-hero-carousel'].forEach(sel => {
            const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
            if (el) el.style.display = 'block';
        });
    }

    return { openModule, closeModule, submitSetoran, openContractModal, openKhatModal };
})();
