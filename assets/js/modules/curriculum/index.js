/**
 * Atlas Edu — Curriculum Module Hub & 5-Day Sentra Rotation Engine
 * Integrated with backend APIs for Cambridge, Merdeka + P5, K-13, Sentra, and Diniyah Syllabi.
 */
window.EduCurriculum = (function() {

    let activeFramework = 'ALL';
    let sentraSchedule = [];
    let subjects = [];
    let lessonPlans = [];

    function openModule() {
        if (sentraSchedule.length === 0) {
            sentraSchedule = [
                { hari: 'Senin', sentra_name: 'Sentra Diniyyah & Tahfizh', description: 'Al-Quran Setoran, Mutun, Aqidah, Fiqih' },
                { hari: 'Selasa', sentra_name: 'Sentra Pengetahuan & Sains', description: 'Cambridge Science, Lab Experiments, Muslim Scientists' },
                { hari: 'Rabu', sentra_name: 'Sentra Nalar & Logika', description: 'Cambridge Math, Problem Solving, Coding & STEM' },
                { hari: 'Kamis', sentra_name: 'Sentra Bahasa & Communication', description: 'Arabic & English Immersion, Public Speaking' },
                { hari: 'Jumat', sentra_name: 'Sentra Lifeskill & Olahraga', description: 'Sunnah Sports, Entrepreneurship, P5 Karakter' }
            ];
        }
        if (subjects.length === 0) {
            subjects = [
                { id: 1, kode: 'DIN-01', nama: 'Al-Qur\'an & Tahfizh', nama_arab: 'القرآن والتفيظ', kategori: 'Diniyah', jam_per_minggu: 10 },
                { id: 2, kode: 'DIN-02', nama: 'Matan Al-Ajurumiyah', nama_arab: 'الآجرومية', kategori: 'Diniyah', jam_per_minggu: 4 },
                { id: 3, kode: 'CAM-01', nama: 'Cambridge Science Checkpoint', nama_arab: 'العلوم', kategori: 'Cambridge', jam_per_minggu: 6 },
                { id: 4, kode: 'CAM-02', nama: 'Cambridge Mathematics', nama_arab: 'الرياضيات', kategori: 'Cambridge', jam_per_minggu: 6 },
                { id: 5, kode: 'MRD-01', nama: 'Proyek Penguatan Profil Pelajar Pancasila (P5)', nama_arab: 'مشروع بنية Character', kategori: 'Merdeka', jam_per_minggu: 4 }
            ];
        }
        _renderScreen();
        _loadData();
    }

    async function _loadData() {
        try {
            const resSF = await fetch('/api/sentra-focus');
            const dataSF = await resSF.json();
            if (dataSF.success && dataSF.rotation_matrix && dataSF.rotation_matrix.length > 0) {
                sentraSchedule = dataSF.rotation_matrix;
            }

            const resC = await fetch('/api/curriculum');
            const dataC = await resC.json();
            if (dataC.success && dataC.subjects && dataC.subjects.length > 0) {
                subjects = dataC.subjects;
                lessonPlans = dataC.lesson_plans || [];
            }
            _renderScreen();
        } catch (err) {
            console.warn('[EduCurriculum] API fetch background notice:', err);
        }
    }

    function _renderScreen() {
        const container = document.getElementById('curriculum-5pillars-container') || document.getElementById('app-viewport');
        if (!container) return;

        const sentraCards = sentraSchedule.map(s => `
            <div class="col">
                <div class="kit-card p-3 h-100 text-center border-start border-4 border-success">
                    <div class="fw-bold text-success" style="font-size:11px;text-transform:uppercase;">${s.hari}</div>
                    <div class="fw-bold text-dark mt-1" style="font-size:13px;">${s.sentra_name}</div>
                    <div class="small text-muted mt-1" style="font-size:11px;">${s.description}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
        <div class="mb-4 mt-2">
            <!-- 5-Day Sentra Focus Header -->
            <div class="p-3 mb-3 text-white rounded-3" style="background: linear-gradient(135deg, #03ac0e 0%, #0d9488 100%);">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <span class="badge bg-white text-dark mb-1 fw-bold" style="font-size:10px;">Visi Institusi</span>
                        <h5 class="fw-bold mb-0">"Sekolah Calon Huffaz &amp; Ilmuwan Muslim"</h5>
                        <div class="small opacity-75">Sistem Kurikulum Sentra 5 Hari Rotation: Diniyyah · Sains · Logika · Bahasa · Lifeskill</div>
                    </div>
                    <button onclick="EduCurriculum.openRPPModal()" class="btn btn-light btn-sm fw-bold text-success">
                        <i class="fas fa-plus me-1"></i>Buat Modul Ajar / RPP
                    </button>
                </div>
            </div>

            <!-- 5-Day Matrix -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-2 mb-4">
                ${sentraCards}
            </div>

            <!-- Multi-Framework Tabs -->
            <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <div class="fw-bold" style="font-size:14px;"><i class="fas fa-book-reader me-2 text-teal"></i>Katalog Mata Pelajaran &amp; Modul Ajar</div>
                <div class="d-flex gap-2">
                    <button onclick="EduCurriculum.setFramework('ALL')" class="btn btn-sm ${activeFramework==='ALL'?'btn-teal':'btn-outline-secondary'}">Semua Framework</button>
                    <button onclick="EduCurriculum.setFramework('CAMBRIDGE')" class="btn btn-sm ${activeFramework==='CAMBRIDGE'?'btn-teal':'btn-outline-secondary'}">Cambridge</button>
                    <button onclick="EduCurriculum.setFramework('MERDEKA')" class="btn btn-sm ${activeFramework==='MERDEKA'?'btn-teal':'btn-outline-secondary'}">Merdeka + P5</button>
                    <button onclick="EduCurriculum.setFramework('DINIYAH')" class="btn btn-sm ${activeFramework==='DINIYAH'?'btn-teal':'btn-outline-secondary'}">Diniyah Pesantren</button>
                </div>
            </div>

            <!-- Subjects & RPP Grid -->
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <div class="kit-card p-3">
                        <h6 class="fw-bold mb-3">Daftar Mata Pelajaran (${subjects.length})</h6>
                        <div class="list-group list-group-flush" style="font-size:13px;">
                            ${subjects.map(sub => `
                            <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                <div>
                                    <div class="fw-semibold">${sub.nama} ${sub.nama_arab ? `<span class="text-success me-1">(${sub.nama_arab})</span>`:''}</div>
                                    <div class="small text-muted">${sub.kode} · Kategori: ${sub.kategori}</div>
                                </div>
                                <span class="badge bg-light text-dark border">${sub.jam_per_minggu || 2} Jam/Mgg</span>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="kit-card p-3">
                        <h6 class="fw-bold mb-3">Modul Ajar / RPP Diajukan</h6>
                        ${lessonPlans.length === 0 ? '<div class="text-muted small">Belum ada modul ajar yang dibuat.</div>' : ''}
                        <div class="d-flex flex-column gap-2">
                            ${lessonPlans.map(lp => `
                            <div class="p-2 border rounded">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="fw-bold style="font-size:13px;">${lp.judul}</div>
                                    <span class="badge ${lp.status==='Disetujui'?'bg-success':lp.status==='Diajukan'?'bg-warning text-dark':'bg-secondary'}">${lp.status}</span>
                                </div>
                                <div class="small text-muted mt-1">${lp.subject_name || 'Mapel'} · Penyusun: ${lp.teacher_name || 'Guru'}</div>
                                ${lp.status==='Diajukan' ? `
                                <div class="mt-2 text-end">
                                    <button onclick="EduCurriculum.approveRPP(${lp.id}, 'Disetujui')" class="btn btn-sm btn-success py-0" style="font-size:10px;">Setujui</button>
                                </div>`:''}
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function setFramework(fw) {
        activeFramework = fw;
        _renderScreen();
    }

    function openRPPModal() {
        const judul = prompt('Judul Modul Ajar / RPP Baru:', 'Modul Ajar Sentra Sains - Eksperimen Fisika Sederhana');
        if (!judul) return;

        fetch('/api/curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'submit_rpp',
                subject_id: 5,
                teacher_id: 1,
                judul: judul,
                tujuan: 'Siswa memahami hukum sains Islam',
                materi: 'Sains Eksperimental',
                metode: 'Praktikum Lab'
            })
        }).then(r => r.json()).then(d => {
            if (d.success) {
                if (window.AtlasToast) AtlasToast.show(d.message, 'success');
                openModule();
            }
        });
    }

    function approveRPP(planId, status) {
        fetch('/api/curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve_rpp', plan_id: planId, status: status })
        }).then(r => r.json()).then(d => {
            if (d.success) {
                if (window.AtlasToast) AtlasToast.show(d.message, 'success');
                openModule();
            }
        });
    }

    return {
        openModule,
        setFramework,
        openRPPModal,
        approveRPP,
        filterSuperCategory: () => {},
        renderSuperAppGrid: openModule,
        openModuleApp: () => {}
    };
})();
