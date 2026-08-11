/**
 * Project Atlas HRIS Engine — Guaranteed Visible HR Ratio Charts Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.AtlasHRIS = (function() {
    let employees = [];
    let candidates = [];
    let leaveRequests = [];
    let chartInstances = {};
    let settings = {
        emp_id_term: 'NIKY',
        current_lang: 'en',
        brand_name: 'Atlas HRIS',
        theme_accent: '#38bdf8',
        auto_ledger_post: true
    };

    const i18n = {
        en: {
            app_title: "Atlas HRIS",
            app_sub: "Mobile Suite",
            dashboard_title: "Executive HR Dashboard & Ratios",
            dashboard_sub: "Real-time key ratios, pending follow-ups, & smartphone app grid",
            btn_add_emp: "Add Employee",
            btn_add_candidate: "Post Candidate",
            btn_settings: "Settings",
            search_placeholder: "Search name, ID, or email..."
        },
        id: {
            app_title: "Atlas HRIS",
            app_sub: "Aplikasi Mobile",
            dashboard_title: "Dashboard Eksklusif & Rasio HR",
            dashboard_sub: "Rasio utama real-time, aktivitas pending, & kisi aplikasi smartphone",
            btn_add_emp: "Tambah Pegawai",
            btn_add_candidate: "Tambah Pelamar",
            btn_settings: "Pengaturan",
            search_placeholder: "Cari nama, ID, atau email..."
        },
        ar: {
            app_title: "تطبيق Atlas HRIS",
            app_sub: "جناح الموارد البشرية",
            dashboard_title: "لوحة التحكم والنسب التنفيذية",
            dashboard_sub: "النسب الرئيسية في الوقت الفعلي والأنشطة المعلقة",
            btn_add_emp: "إضافة موظف",
            btn_add_candidate: "مرشح جديد",
            btn_settings: "الإعدادات",
            search_placeholder: "البحث عن الاسم، المعرف..."
        }
    };

    const defaultEmployees = [
        { id: 1, nip: 'NIKY-2026-001', name: 'Hikmatullah Sakti Buana', email: 'sakti@buana.studio', phone: '081234567890', dept: 'Corporate & Technology', position: 'Lead Architect & Developer', type: 'Full-Time', tenure: '5+ Years', salary: 25000000, status: 'Active', dossierStatus: 'Verified', kpiScore: 98, kpiGrade: 'A+' },
        { id: 2, nip: 'NIKY-2026-002', name: 'Ahmad Fauzi', email: 'fauzi@buana.studio', phone: '081298765432', dept: 'Education (Atlas Edu)', position: 'Head of Curriculum', type: 'Full-Time', tenure: '3 - 5 Years', salary: 12000000, status: 'Active', dossierStatus: 'Verified', kpiScore: 90, kpiGrade: 'A' },
        { id: 3, nip: 'NIKY-2026-003', name: 'Siti Nurhaliza', email: 'siti@buana.studio', phone: '081311223344', dept: 'Healthcare (Atlas Health)', position: 'Chief Medical Officer', type: 'Contract', tenure: '1 - 3 Years', salary: 15000000, status: 'Active', dossierStatus: 'Pending Verification', kpiScore: 85, kpiGrade: 'B+' },
        { id: 4, nip: 'NIKY-2026-004', name: 'Budi Santoso', email: 'budi@buana.studio', phone: '081455667788', dept: 'Commercial POS & Retail', position: 'POS Operations Manager', type: 'Full-Time', tenure: '< 1 Year', salary: 10000000, status: 'Active', dossierStatus: 'Incomplete', kpiScore: 78, kpiGrade: 'B' },
        { id: 5, nip: 'NIKY-2026-005', name: 'Rina Wijaya', email: 'rina@buana.studio', phone: '081566778899', dept: 'Corporate & Technology', position: 'UX Designer', type: 'Internship', tenure: '< 1 Year', salary: 5000000, status: 'Active', dossierStatus: 'Incomplete', kpiScore: 82, kpiGrade: 'B+' }
    ];

    const defaultCandidates = [
        { id: 101, name: 'Rian Hidayat', email: 'rian@gmail.com', dept: 'Corporate & Technology', position: 'Senior Backend Engineer', stage: 'HR Interview', score: 88 },
        { id: 102, name: 'Dewi Lestari', email: 'dewi@gmail.com', dept: 'Healthcare (Atlas Health)', position: 'Clinical Nurse', stage: 'Job Offer', score: 92 }
    ];

    function init() {
        loadSettings();
        loadData();
        applyLanguageAndTerms();
        renderDashboard();
        renderPendingFollowups();
        ensureFancyChartsRender();
        renderEmployeeTable();
        renderCandidatesTable();
        renderPayrollTable();
        renderKPITable();
    }

    function loadSettings() {
        const localSet = localStorage.getItem('atlas_hris_settings');
        if (localSet) {
            try { settings = Object.assign({}, settings, JSON.parse(localSet)); } catch(e){}
        }
    }

    function saveSettings() {
        localStorage.setItem('atlas_hris_settings', JSON.stringify(settings));
        applyLanguageAndTerms();
    }

    function loadData() {
        const localEmp = localStorage.getItem('atlas_hris_employees');
        employees = localEmp ? JSON.parse(localEmp) : defaultEmployees;

        const localCand = localStorage.getItem('atlas_hris_candidates');
        candidates = localCand ? JSON.parse(localCand) : defaultCandidates;
    }

    function saveData() {
        localStorage.setItem('atlas_hris_employees', JSON.stringify(employees));
        localStorage.setItem('atlas_hris_candidates', JSON.stringify(candidates));
    }

    function applyLanguageAndTerms() {
        const lang = settings.current_lang || 'en';
        const dict = i18n[lang] || i18n.en;
        const term = settings.emp_id_term || 'NIKY';

        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.style.fontFamily = "'Amiri', 'Inter', sans-serif";
        } else {
            document.documentElement.dir = 'ltr';
            document.body.style.fontFamily = "'Inter', sans-serif";
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.innerText = dict[key];
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (dict[key]) el.placeholder = dict[key];
        });

        document.querySelectorAll('.emp-id-label').forEach(el => {
            el.innerText = term;
        });

        const selectTerm = document.getElementById('setting_emp_term');
        if (selectTerm) selectTerm.value = term;

        const selectLang = document.getElementById('setting_lang');
        if (selectLang) selectLang.value = lang;

        const brandInput = document.getElementById('setting_brand_name');
        if (brandInput) brandInput.value = settings.brand_name || 'Atlas HRIS';
    }

    // --- GUARANTEED VISIBLE FANCY CHARTS INITIALIZER ---
    function ensureFancyChartsRender(retryCount = 0) {
        if (typeof Chart === 'undefined') {
            if (retryCount < 10) {
                setTimeout(() => ensureFancyChartsRender(retryCount + 1), 300);
            }
            return;
        }

        try {
            // Destroy existing charts to prevent canvas re-render errors
            if (chartInstances.retention) chartInstances.retention.destroy();
            if (chartInstances.absenteeism) chartInstances.absenteeism.destroy();
            if (chartInstances.timeToHire) chartInstances.timeToHire.destroy();

            // 1. Retention vs Turnover Donut Chart
            const canvasRetention = document.getElementById('chart-retention-donut');
            if (canvasRetention) {
                const ctxRetention = canvasRetention.getContext('2d');
                chartInstances.retention = new Chart(ctxRetention, {
                    type: 'doughnut',
                    data: {
                        labels: ['Retention Rate (96.2%)', 'Turnover Rate (3.8%)'],
                        datasets: [{
                            data: [96.2, 3.8],
                            backgroundColor: ['#14b8a6', '#f43f5e'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        cutout: '70%',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } } }
                        }
                    }
                });
            }

            // 2. Absenteeism Trend Line Chart
            const canvasAbsenteeism = document.getElementById('chart-absenteeism-line');
            if (canvasAbsenteeism) {
                const ctxAbsenteeism = canvasAbsenteeism.getContext('2d');
                chartInstances.absenteeism = new Chart(ctxAbsenteeism, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Absenteeism Rate %',
                            data: [3.2, 2.8, 2.4, 2.1, 1.8, 1.6],
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.25)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#d97706'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { display: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
                            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }

            // 3. Time-to-Hire ATS Speed Bar Chart
            const canvasTimeToHire = document.getElementById('chart-timetohire-bar');
            if (canvasTimeToHire) {
                const ctxTimeToHire = canvasTimeToHire.getContext('2d');
                chartInstances.timeToHire = new Chart(ctxTimeToHire, {
                    type: 'bar',
                    data: {
                        labels: ['Screen', 'Interview', 'Offer', 'Onboard'],
                        datasets: [{
                            label: 'Days spent',
                            data: [2, 5, 4, 3],
                            backgroundColor: ['#38bdf8', '#6366f1', '#a855f7', '#10b981'],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { display: true, ticks: { font: { size: 10 } }, grid: { color: '#f1f5f9' } },
                            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }
        } catch(e) {
            console.error('Chart rendering error:', e);
        }
    }

    // --- PENDING FOLLOW-UPS FEED ---
    function renderPendingFollowups() {
        const container = document.getElementById('pending-followups-list');
        if (!container) return;

        const pendingDossiers = employees.filter(e => e.dossierStatus === 'Pending Verification' || e.dossierStatus === 'Menunggu Verifikasi');
        const pendingCandidates = candidates;
        const expiringContracts = employees.filter(e => e.type === 'Contract' || e.type === 'Kontrak');

        let html = '';

        if (pendingDossiers.length > 0) {
            pendingDossiers.forEach(emp => {
                html += `
                <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border-start border-4 border-warning small">
                    <div>
                        <div class="fw-bold text-dark"><i class="fas fa-id-card text-warning me-2"></i>Dossier Verification Required</div>
                        <div class="text-muted" style="font-size:11px;">${emp.name} (${emp.nip}) submitted identity dossier for review</div>
                    </div>
                    <button class="btn btn-sm btn-outline-warning py-0 px-2" onclick="AtlasHRIS.openModuleScreen('mod-directory', 'Employee Directory')">Review</button>
                </div>`;
            });
        }

        if (pendingCandidates.length > 0) {
            pendingCandidates.forEach(cand => {
                html += `
                <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border-start border-4 border-indigo small">
                    <div>
                        <div class="fw-bold text-dark"><i class="fas fa-user-tie text-indigo me-2"></i>ATS Candidate Ready for Offer / Hire</div>
                        <div class="text-muted" style="font-size:11px;">${cand.name} - ${cand.position} (${cand.score}/100)</div>
                    </div>
                    <button class="btn btn-sm btn-outline-indigo py-0 px-2" onclick="AtlasHRIS.openModuleScreen('mod-ats', 'Recruitment Pipeline & ATS')">Onboard</button>
                </div>`;
            });
        }

        if (expiringContracts.length > 0) {
            expiringContracts.forEach(emp => {
                html += `
                <div class="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded border-start border-4 border-info small">
                    <div>
                        <div class="fw-bold text-dark"><i class="fas fa-file-contract text-info me-2"></i>Contract Renewal Attention</div>
                        <div class="text-muted" style="font-size:11px;">${emp.name} (${emp.nip}) - Contract expiring in 30 days</div>
                    </div>
                    <button class="btn btn-sm btn-outline-info py-0 px-2" onclick="AtlasHRIS.openModuleScreen('mod-directory', 'Employee Directory')">Manage</button>
                </div>`;
            });
        }

        container.innerHTML = html || '<div class="text-muted small py-3 text-center">No pending activities requiring follow-up. All clear!</div>';
    }

    // --- SMARTPHONE APP NAVIGATION ---
    function openModuleScreen(moduleId, moduleTitle) {
        document.getElementById('pwa-app-launcher').style.display = 'none';
        
        document.querySelectorAll('.module-screen').forEach(screen => {
            screen.style.display = 'none';
        });

        const target = document.getElementById(moduleId);
        if (target) {
            target.style.display = 'block';
            document.getElementById('active-module-title').innerText = moduleTitle || 'HRIS App';
            document.getElementById('pwa-module-header').style.display = 'flex';
            window.scrollTo(0, 0);
        }

        updateBottomNavActive(moduleId);
    }

    function backToLauncher() {
        document.querySelectorAll('.module-screen').forEach(screen => {
            screen.style.display = 'none';
        });

        document.getElementById('pwa-module-header').style.display = 'none';
        document.getElementById('pwa-app-launcher').style.display = 'block';
        window.scrollTo(0, 0);

        updateBottomNavActive('home');
        ensureFancyChartsRender();
    }

    function updateBottomNavActive(activeId) {
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        if (activeId === 'home') document.getElementById('bnav-home')?.classList.add('active');
        if (activeId === 'mod-directory') document.getElementById('bnav-directory')?.classList.add('active');
        if (activeId === 'mod-expansion') document.getElementById('bnav-expansion')?.classList.add('active');
        if (activeId === 'mod-ats') document.getElementById('bnav-ats')?.classList.add('active');
        if (activeId === 'mod-settings') document.getElementById('bnav-settings')?.classList.add('active');
    }

    // --- NEW BUILDING EXPANSION SIMULATOR ALGORITHM ---
    function runBuildingExpansionSimulation() {
        const buildingType = document.getElementById('sim_building_type').value;
        const capacity = parseInt(document.getElementById('sim_capacity').value || 300);
        const avgSalary = parseFloat(document.getElementById('sim_avg_salary').value || 8500000);

        let ratio = 25;
        if (buildingType === 'Healthcare (Atlas Health)') ratio = 10;
        if (buildingType === 'Commercial POS & Retail') ratio = 40;
        if (buildingType === 'Corporate Branch') ratio = 20;

        const predictedHeadcount = Math.ceil(capacity / ratio);
        const monthlyPayroll = predictedHeadcount * avgSalary;
        const annualPayroll = monthlyPayroll * 12;
        const leadTimeDays = Math.ceil(predictedHeadcount * 1.5) + 14;

        document.getElementById('res_sim_headcount').innerText = `${predictedHeadcount} Staff`;
        document.getElementById('res_sim_monthly_payroll').innerText = `Rp ${monthlyPayroll.toLocaleString('id-ID')}`;
        document.getElementById('res_sim_annual_payroll').innerText = `Rp ${annualPayroll.toLocaleString('id-ID')}`;
        document.getElementById('res_sim_lead_time').innerText = `${leadTimeDays} Days`;

        const managerCount = Math.max(1, Math.floor(predictedHeadcount * 0.1));
        const seniorCount = Math.floor(predictedHeadcount * 0.3);
        const juniorCount = predictedHeadcount - managerCount - seniorCount;

        document.getElementById('sim_matrix_breakdown').innerHTML = `
            <div class="d-flex justify-content-between border-bottom py-2">
                <span>Facility Directors / Managers (10%)</span>
                <span class="fw-bold text-dark">${managerCount} Positions</span>
            </div>
            <div class="d-flex justify-content-between border-bottom py-2">
                <span>Senior Technical & Teaching Staff (30%)</span>
                <span class="fw-bold text-dark">${seniorCount} Positions</span>
            </div>
            <div class="d-flex justify-content-between py-2">
                <span>Operational & Support Staff (60%)</span>
                <span class="fw-bold text-dark">${juniorCount} Positions</span>
            </div>
        `;

        document.getElementById('sim_result_container').style.display = 'block';
    }

    // --- DASHBOARD ANALYTICS ---
    function renderDashboard() {
        const total = employees.length;
        const active = employees.filter(e => e.status === 'Active' || e.status === 'Aktif').length;
        const pendingDos = employees.filter(e => e.dossierStatus === 'Pending Verification' || e.dossierStatus === 'Menunggu Verifikasi').length;
        const totalSalary = employees.reduce((acc, e) => acc + (e.salary || 0), 0);

        document.getElementById('stat-total-emp').innerText = total;
        document.getElementById('stat-active-emp').innerText = `${active} Active`;
        document.getElementById('stat-pending-dos').innerText = pendingDos;
        document.getElementById('stat-payroll-budget').innerText = `Rp ${totalSalary.toLocaleString('id-ID')}`;
    }

    // --- EMPLOYEE DIRECTORY TABLE ---
    function renderEmployeeTable() {
        const tbody = document.getElementById('employee-table-body');
        if (!tbody) return;

        const search = (document.getElementById('search-emp')?.value || '').toLowerCase();
        const deptFilter = document.getElementById('filter-dept')?.value || '';

        const filtered = employees.filter(e => {
            const matchSearch = e.name.toLowerCase().includes(search) || e.nip.toLowerCase().includes(search);
            const matchDept = !deptFilter || e.dept === deptFilter;
            return matchSearch && matchDept;
        });

        tbody.innerHTML = filtered.map(e => {
            let dossierBadge = 'bg-secondary-subtle text-secondary';
            if (e.dossierStatus === 'Verified' || e.dossierStatus === 'Terverifikasi') dossierBadge = 'bg-success-subtle text-success';
            if (e.dossierStatus === 'Pending Verification' || e.dossierStatus === 'Menunggu Verifikasi') dossierBadge = 'bg-warning-subtle text-warning';

            return `
            <tr>
                <td class="ps-4 fw-semibold text-primary">${e.nip}</td>
                <td>
                    <div class="fw-bold text-dark">${escapeHtml(e.name)}</div>
                    <div class="text-muted small" style="font-size:11px;">${escapeHtml(e.email)}</div>
                </td>
                <td>
                    <div>${escapeHtml(e.dept)}</div>
                    <div class="text-muted small" style="font-size:11px;">${escapeHtml(e.position)}</div>
                </td>
                <td>
                    <span class="badge bg-light text-dark border me-1">${e.type}</span>
                    <span class="badge bg-info-subtle text-info">${e.tenure || '< 1 Year'}</span>
                </td>
                <td class="fw-semibold text-teal">Rp ${(e.salary || 0).toLocaleString('id-ID')}</td>
                <td class="text-center">
                    <span class="badge ${dossierBadge} rounded-pill px-2 py-1">${e.dossierStatus}</span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1 py-1 px-2" onclick="AtlasHRIS.editEmployeeModal(${e.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="AtlasHRIS.deleteEmployee(${e.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
        }).join('');
    }

    // --- RECRUITMENT & ATS ---
    function renderCandidatesTable() {
        const tbody = document.getElementById('ats-table-body');
        if (!tbody) return;

        tbody.innerHTML = candidates.map(c => `
            <tr>
                <td class="ps-4 fw-semibold text-dark">${escapeHtml(c.name)}</td>
                <td>${escapeHtml(c.email)}</td>
                <td>${escapeHtml(c.position)}</td>
                <td><span class="badge bg-indigo-subtle text-indigo">${escapeHtml(c.stage)}</span></td>
                <td class="fw-bold text-teal">${c.score}/100</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-success py-1 px-2 me-1" onclick="AtlasHRIS.hireCandidate(${c.id})"><i class="fas fa-user-check me-1"></i> Hire & Onboard</button>
                </td>
            </tr>
        `).join('');
    }

    function hireCandidate(id) {
        const cand = candidates.find(c => c.id === id);
        if (!cand) return;

        const term = settings.emp_id_term || 'NIKY';
        const newIdCode = `${term}-2026-00${employees.length + 1}`;

        if (confirm(`Hire ${cand.name} and onboard into employee directory with ${term}: ${newIdCode}?`)) {
            employees.push({
                id: Date.now(),
                nip: newIdCode,
                name: cand.name,
                email: `${cand.name.toLowerCase().replace(/\s+/g, '')}@buana.studio`,
                phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
                dept: cand.dept,
                position: cand.position,
                type: 'Contract',
                tenure: '< 1 Year',
                salary: 9500000,
                status: 'Active',
                dossierStatus: 'Incomplete',
                kpiScore: 80,
                kpiGrade: 'B+'
            });
            candidates = candidates.filter(c => c.id !== id);
            saveData();
            renderDashboard();
            renderPendingFollowups();
            renderEmployeeTable();
            renderCandidatesTable();
            alert(`${cand.name} successfully hired with ${term}: ${newIdCode}!`);
        }
    }

    // --- PAYROLL & LEDGER ---
    function renderPayrollTable() {
        const tbody = document.getElementById('payroll-table-body');
        if (!tbody) return;

        tbody.innerHTML = employees.map(e => {
            const basic = e.salary || 0;
            const allowance = Math.round(basic * 0.15);
            const bpjs = Math.round(basic * 0.04);
            const netSalary = basic + allowance - bpjs;

            return `
            <tr>
                <td class="ps-4 fw-semibold text-primary">${e.nip}</td>
                <td class="fw-bold text-dark">${escapeHtml(e.name)}</td>
                <td>Rp ${basic.toLocaleString('id-ID')}</td>
                <td class="text-success">+ Rp ${allowance.toLocaleString('id-ID')}</td>
                <td class="text-danger">- Rp ${bpjs.toLocaleString('id-ID')}</td>
                <td class="fw-bold text-teal">Rp ${netSalary.toLocaleString('id-ID')}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-kit-primary py-1 px-2" onclick="AtlasHRIS.postPayrollToLedger('${e.nip}', ${netSalary})">
                        <i class="fas fa-book me-1"></i> Post to Ledger
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

    function postPayrollToLedger(nip, netAmount) {
        alert(`Net Salary Rp ${netAmount.toLocaleString('id-ID')} for ${nip} posted to Atlas Ledger Engine (db_atlas_ledger)!`);
    }

    // --- KPI SCORECARD ---
    function renderKPITable() {
        const tbody = document.getElementById('kpi-table-body');
        if (!tbody) return;

        tbody.innerHTML = employees.map(e => `
            <tr>
                <td class="ps-4 fw-semibold text-primary">${e.nip}</td>
                <td class="fw-bold text-dark">${escapeHtml(e.name)}</td>
                <td>${escapeHtml(e.position)}</td>
                <td class="fw-bold text-teal">${e.kpiScore || 85}/100</td>
                <td class="text-center"><span class="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-1">${e.kpiGrade || 'A'}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-secondary py-1 px-2" onclick="AtlasHRIS.updateKPIScore('${e.nip}')"><i class="fas fa-star me-1"></i> Review KPI</button>
                </td>
            </tr>
        `).join('');
    }

    function updateKPIScore(nip) {
        const emp = employees.find(e => e.nip === nip);
        if (!emp) return;

        const score = parseInt(prompt(`KPI Evaluation Score for ${emp.name} (0-100):`, emp.kpiScore || 85));
        if (!isNaN(score)) {
            emp.kpiScore = score;
            emp.kpiGrade = score >= 95 ? 'A+' : (score >= 88 ? 'A' : (score >= 80 ? 'B+' : 'B'));
            saveData();
            renderKPITable();
            alert(`KPI score for ${emp.name} updated: ${score} (${emp.kpiGrade})`);
        }
    }

    function openAddModal() {
        const term = settings.emp_id_term || 'NIKY';
        document.getElementById('emp_id').value = '';
        document.getElementById('emp_nip').value = `${term}-2026-00${employees.length + 1}`;
        document.getElementById('emp_name').value = '';
        document.getElementById('emp_email').value = '';
        document.getElementById('emp_phone').value = '';
        document.getElementById('emp_dept').value = 'Education (Atlas Edu)';
        document.getElementById('emp_position').value = '';
        document.getElementById('emp_type').value = 'Full-Time';
        document.getElementById('emp_tenure').value = '< 1 Year';
        document.getElementById('emp_salary').value = '8000000';
        document.getElementById('empModalTitle').innerText = 'Add New Employee';
        new bootstrap.Modal(document.getElementById('modalEmployee')).show();
    }

    function editEmployeeModal(id) {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        document.getElementById('emp_id').value = emp.id;
        document.getElementById('emp_nip').value = emp.nip;
        document.getElementById('emp_name').value = emp.name;
        document.getElementById('emp_email').value = emp.email;
        document.getElementById('emp_phone').value = emp.phone || '';
        document.getElementById('emp_dept').value = emp.dept;
        document.getElementById('emp_position').value = emp.position;
        document.getElementById('emp_type').value = emp.type;
        document.getElementById('emp_tenure').value = emp.tenure || '< 1 Year';
        document.getElementById('emp_salary').value = emp.salary;
        document.getElementById('empModalTitle').innerText = 'Edit Employee Profile';
        new bootstrap.Modal(document.getElementById('modalEmployee')).show();
    }

    function saveEmployeeForm(e) {
        e.preventDefault();
        const id = document.getElementById('emp_id').value;
        const nip = document.getElementById('emp_nip').value;
        const name = document.getElementById('emp_name').value;
        const email = document.getElementById('emp_email').value;
        const phone = document.getElementById('emp_phone').value;
        const dept = document.getElementById('emp_dept').value;
        const position = document.getElementById('emp_position').value;
        const type = document.getElementById('emp_type').value;
        const tenure = document.getElementById('emp_tenure').value;
        const salary = parseFloat(document.getElementById('emp_salary').value || 0);

        if (id) {
            const idx = employees.findIndex(emp => emp.id == id);
            if (idx !== -1) {
                employees[idx] = Object.assign({}, employees[idx], { nip, name, email, phone, dept, position, type, tenure, salary });
            }
        } else {
            employees.push({
                id: Date.now(),
                nip,
                name,
                email,
                phone,
                dept,
                position,
                type,
                tenure,
                salary,
                status: 'Active',
                dossierStatus: 'Incomplete',
                kpiScore: 85,
                kpiGrade: 'A'
            });
        }

        saveData();
        renderDashboard();
        renderPendingFollowups();
        renderEmployeeTable();
        renderPayrollTable();
        bootstrap.Modal.getInstance(document.getElementById('modalEmployee')).hide();
        alert('Employee data saved successfully!');
    }

    function deleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees = employees.filter(e => e.id !== id);
            saveData();
            renderDashboard();
            renderPendingFollowups();
            renderEmployeeTable();
        }
    }

    function openSettingsModal() {
        openModuleScreen('mod-settings', 'Settings & Configuration');
    }

    function handleSaveSettingsForm(e) {
        if (e) e.preventDefault();
        settings.emp_id_term = document.getElementById('setting_emp_term').value;
        settings.current_lang = document.getElementById('setting_lang').value;
        settings.brand_name = document.getElementById('setting_brand_name')?.value || 'Atlas HRIS';
        saveSettings();
        renderEmployeeTable();
        alert('All App Configurations & Settings Saved Successfully!');
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        openModuleScreen,
        backToLauncher,
        renderEmployeeTable,
        openAddModal,
        editEmployeeModal,
        saveEmployeeForm,
        deleteEmployee,
        hireCandidate,
        updateKPIScore,
        postPayrollToLedger,
        openSettingsModal,
        handleSaveSettingsForm,
        runBuildingExpansionSimulation
    };
})();
