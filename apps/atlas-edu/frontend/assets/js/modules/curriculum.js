/**
 * Project Atlas Edu — 21 Rich Interactive Curriculum App Views Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduCurriculum = (function() {
    let activeSuperCategory = 'all';

    let masterCurriculumItems = [
        // Pillar 1: Core Framework
        { id: "cur_101", category: "core", name: "Struktur & Alokasi Waktu", desc: "Weekly period allocation per level", icon: "fas fa-clock", color: "icon-gradient-teal" },
        { id: "cur_102", category: "core", name: "Master Capaian & Tujuan (CP/TP/CPMK)", desc: "Learning outcomes & competencies", icon: "fas fa-bullseye", color: "icon-gradient-indigo" },
        { id: "cur_103", category: "core", name: "Matriks Kurikulum (Diniyah/OBE)", desc: "Diniyah, National, & OBE Matrix", icon: "fas fa-th", color: "icon-gradient-purple" },
        { id: "cur_104", category: "core", name: "Multi-Level Phase Setup (PAUD-S3)", desc: "Phases A through F Mapping", icon: "fas fa-layer-group", color: "icon-gradient-blue" },

        // Pillar 2: Syllabi & Prep
        { id: "cur_201", category: "syllabi", name: "Modul Ajar / RPP / RPS", desc: "Lesson plans & course syllabi", icon: "fas fa-file-alt", color: "icon-gradient-teal" },
        { id: "cur_202", category: "syllabi", name: "'Idad Lughawi & Hiwar (الحوار)", desc: "Arabic immersion & conversational fluency", icon: "fas fa-comments", color: "icon-gradient-rose" },
        { id: "cur_203", category: "syllabi", name: "TOAFL Arabic Proficiency", desc: "Standardized Arabic Exam Syllabus", icon: "fas fa-award", color: "icon-gradient-amber" },
        { id: "cur_204", category: "syllabi", name: "TOEFL & IELTS Academic Prep", desc: "Standardized English Exam Syllabus", icon: "fas fa-globe", color: "icon-gradient-blue" },
        { id: "cur_205", category: "syllabi", name: "English & Arabic Conversation", desc: "Interactive speaking & public speaking", icon: "fas fa-microphone", color: "icon-gradient-purple" },
        { id: "cur_206", category: "syllabi", name: "Tematik & RKH (Preschool)", desc: "Preschool weekly thematic plans", icon: "fas fa-child", color: "icon-gradient-cyan" },
        { id: "cur_207", category: "syllabi", name: "Bank Soal & Rubrik Asesmen", desc: "Question bank & grading rubrics", icon: "fas fa-question-circle", color: "icon-gradient-indigo" },

        // Pillar 3: Specialization & P5
        { id: "cur_301", category: "specialization", name: "Master P5 (Merdeka)", desc: "Proyek Penguatan Profil Pelajar Pancasila", icon: "fas fa-flag", color: "icon-gradient-emerald" },
        { id: "cur_302", category: "specialization", name: "Karakter, Adab & Tahfidz", desc: "Quranic memorization & character benchmarks", icon: "fas fa-quran", color: "icon-gradient-amber" },
        { id: "cur_303", category: "specialization", name: "MBKM & Konversi SKS", desc: "Independent Campus Credit Transfer", icon: "fas fa-university", color: "icon-gradient-indigo" },
        { id: "cur_304", category: "specialization", name: "Keahlian / Vocational Tracks", desc: "Technical skill concentrations", icon: "fas fa-tools", color: "icon-gradient-purple" },

        // Pillar 4: Research
        { id: "cur_401", category: "research", name: "Matakuliah Prasyarat", desc: "Prerequisite course dependencies", icon: "fas fa-code-branch", color: "icon-gradient-blue" },
        { id: "cur_402", category: "research", name: "Seminar & Bimbingan Skripsi", desc: "Undergraduate thesis advisor portal", icon: "fas fa-user-graduate", color: "icon-gradient-teal" },
        { id: "cur_403", category: "research", name: "Disertasi & Publikasi Scopus", desc: "Doctoral dissertation & Scopus publishing", icon: "fas fa-newspaper", color: "icon-gradient-purple" },

        // Pillar 5: Monitoring & Audits
        { id: "cur_501", category: "monitoring", name: "Progress Capaian Learning", desc: "Real-time learning progress tracking", icon: "fas fa-chart-line", color: "icon-gradient-emerald" },
        { id: "cur_502", category: "monitoring", name: "Remedial & Pengayaan", desc: "Remedial & enrichment modules", icon: "fas fa-plus-square", color: "icon-gradient-amber" },
        { id: "cur_503", category: "monitoring", name: "Supervisi KBM & Coverage", desc: "Classroom supervision & coverage audit", icon: "fas fa-check-circle", color: "icon-gradient-cyan" }
    ];

    function filterSuperCategory(categoryKey) {
        activeSuperCategory = categoryKey;

        document.querySelectorAll('.super-app-pill-btn').forEach(btn => {
            btn.classList.remove('active', 'btn-teal');
            btn.classList.add('btn-light');
        });

        const activeBtn = document.getElementById(`superpill-${categoryKey}`);
        if (activeBtn) {
            activeBtn.classList.remove('btn-light');
            activeBtn.classList.add('active', 'btn-teal');
        }

        renderSuperAppGrid();
    }

    function renderSuperAppGrid(filterQuery = '') {
        const container = document.getElementById('curriculum-5pillars-container');
        if (!container) return;

        const query = filterQuery.toLowerCase().trim();

        const filtered = masterCurriculumItems.filter(item => {
            const matchCategory = (activeSuperCategory === 'all' || item.category === activeSuperCategory);
            const matchQuery = (!query || item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query));
            return matchCategory && matchQuery;
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="text-muted text-center py-4 small">No curriculum app modules match your search or filter.</div>';
            return;
        }

        container.innerHTML = `
            <div class="pwa-app-grid">
                ${filtered.map(item => `
                    <div class="pwa-app-tile" onclick="EduCurriculum.openModuleApp('${item.id}')">
                        <div class="pwa-app-icon ${item.color}"><i class="${item.icon}"></i></div>
                        <div class="pwa-app-label">${item.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function openModuleApp(moduleId) {
        const item = masterCurriculumItems.find(i => i.id === moduleId);
        if (!item) return;

        const viewport = document.getElementById('app-viewport');
        let moduleScreen = document.getElementById('screen-curriculum-detail-app');

        if (!moduleScreen) {
            moduleScreen = document.createElement('div');
            moduleScreen.id = 'screen-curriculum-detail-app';
            moduleScreen.className = 'module-screen mb-4';
            viewport.appendChild(moduleScreen);
        }

        renderInteractiveAppView(moduleScreen, item);

        document.querySelectorAll('.role-dashboard-screen, .mgmt-screen-view, .module-screen').forEach(s => {
            s.style.display = 'none';
        });

        moduleScreen.style.display = 'block';
        window.scrollTo(0, 0);

        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent(
                "curriculum.director@buana.studio", 
                "Director", 
                "MODULE_EXECUTE", 
                moduleId, 
                `Launched interactive module app: ${item.name}`
            );
        }
    }

    function renderInteractiveAppView(container, item) {
        container.innerHTML = `
            <div class="card border-0 shadow-sm p-4 mb-4" style="border-radius: 20px;">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="pwa-app-icon ${item.color}" style="width: 50px; height: 50px; font-size: 22px; margin: 0;">
                            <i class="${item.icon}"></i>
                        </div>
                        <div>
                            <h4 class="fw-bold text-dark m-0">${item.name}</h4>
                            <small class="text-muted">${item.desc} — Live Interactive Executable App</small>
                        </div>
                    </div>
                    <button class="btn btn-outline-secondary rounded-pill px-4 fw-bold" onclick="EduCurriculum.closeModuleApp()">
                        <i class="fas fa-arrow-left me-1"></i> Kembali
                    </button>
                </div>

                <!-- DYNAMIC INTERACTIVE MODULE PROCEDURES WORKSPACE -->
                <div class="p-4 bg-light mb-4" style="border-radius: 16px;">
                    <div class="row g-3 align-items-center">
                        <div class="col-md-8">
                            <h6 class="fw-bold text-dark mb-1"><i class="fas fa-tasks text-teal me-2"></i>Aktifkan & Perbarui Prosedur ${item.name}</h6>
                            <p class="small text-muted m-0">Prosedur terintegrasi dengan Standar Akreditasi Unggul & ISO 9001:2015 QMS Engine</p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button class="btn btn-teal text-white fw-bold px-4 py-2" style="background-color: var(--tokopedia-green); border: none; border-radius: 10px;" onclick="alert('Saving & audit-signing procedure updates!')">
                                <i class="fas fa-save me-1"></i> Simpan Prosedur
                            </button>
                        </div>
                    </div>
                </div>

                <!-- SAMPLE INTERACTIVE MATRIX / WORKFLOW TABLE -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle small mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>KODE SUB-MODUL</th>
                                <th>PARAMETER PROSEDUR</th>
                                <th>TARGET CAPAIAN</th>
                                <th>STATUS AUDIT ISO</th>
                                <th>ACTION WORKFLOW</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="font-monospace fw-bold text-teal">${item.id}-A01</td>
                                <td class="fw-bold text-dark">Penyusunan Capaian & Indikator ${item.name}</td>
                                <td><span class="badge bg-success-subtle text-success">100% Target Met</span></td>
                                <td><span class="badge bg-teal-subtle text-teal">AUDITED_OK</span></td>
                                <td><button class="btn btn-sm btn-outline-success" onclick="alert('Executing procedure check for ${item.name}')"><i class="fas fa-play me-1"></i> Run Procedure</button></td>
                            </tr>
                            <tr>
                                <td class="font-monospace fw-bold text-teal">${item.id}-A02</td>
                                <td class="fw-bold text-dark">Validasi Rubrik & Dokumen ${item.name}</td>
                                <td><span class="badge bg-primary-subtle text-primary">Accredited A</span></td>
                                <td><span class="badge bg-teal-subtle text-teal">AUDITED_OK</span></td>
                                <td><button class="btn btn-sm btn-outline-primary" onclick="alert('Exporting PDF audit log for ${item.name}')"><i class="fas fa-file-pdf me-1"></i> Export PDF</button></td>
                            </tr>
                            <tr>
                                <td class="font-monospace fw-bold text-teal">${item.id}-A03</td>
                                <td class="fw-bold text-dark">Supervisi KBM & Coverage Check ${item.name}</td>
                                <td><span class="badge bg-warning-subtle text-warning">Realtime Verified</span></td>
                                <td><span class="badge bg-success-subtle text-success">WTP_VERIFIED</span></td>
                                <td><button class="btn btn-sm btn-outline-warning" onclick="alert('Viewing live log graph')"><i class="fas fa-chart-line me-1"></i> View Heatmap</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function closeModuleApp() {
        const moduleScreen = document.getElementById('screen-curriculum-detail-app');
        if (moduleScreen) moduleScreen.style.display = 'none';

        const defaultView = document.getElementById('mgmt-screen-curriculum');
        if (defaultView) defaultView.style.display = 'block';
    }

    function searchCurriculum(query) {
        renderSuperAppGrid(query);
    }

    return {
        filterSuperCategory,
        renderSuperAppGrid,
        searchCurriculum,
        openModuleApp,
        closeModuleApp,
        getMasterItems: () => masterCurriculumItems
    };
})();
