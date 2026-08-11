/**
 * Project Atlas HRIS Engine — Core State & i18n Translation Store
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.AtlasCore = (function() {
    let employees = [];
    let candidates = [];
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

        document.querySelectorAll('.emp-id-label').forEach(el => {
            el.innerText = term;
        });
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        getEmployees: () => employees,
        setEmployees: (data) => { employees = data; saveData(); },
        getCandidates: () => candidates,
        setCandidates: (data) => { candidates = data; saveData(); },
        getSettings: () => settings,
        setSettings: (data) => { settings = Object.assign({}, settings, data); saveSettings(); },
        escapeHtml
    };
})();
