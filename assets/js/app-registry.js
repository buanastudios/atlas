/**
 * Atlas Edu — App Registry  (app-registry.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for all available modules / apps.
 *
 * HOW TO ADD A NEW MODULE (developer checklist):
 * ──────────────────────────────────────────────
 * 1. Create folder:  assets/js/modules/<your-module>/
 *    Required files:
 *      index.js        — module IIFE (exposes window.EduYourModule)
 *      manifest.json   — copy template below, fill in your details
 *    Optional:
 *      style.css       — scoped styles
 *
 * 2. Create page:    <your-module>.html  (copy any existing page shell)
 *    Change only:
 *      - <title>
 *      - AtlasLayout.init('<your-module>')
 *      - window.addEventListener('atlas:ready', () => EduYourModule.openModule())
 *      - <link> + <script> tags for your module
 *
 * 3. Add ONE entry to the MODULES array below — that's all.
 *    The launcher, admin panel, layout nav, and App Store all read from here.
 *
 * 4. Admin must toggle the module ON in the Admin Panel before users see it.
 *    (If enabledByDefault is true, it appears immediately after refresh.)
 *
 * manifest.json template:
 * {
 *   "id":              "my-module",
 *   "name":            "Human Readable Name",
 *   "version":         "1.0.0",
 *   "icon":            "fa-icon-name",
 *   "color":           "icon-gradient-teal",
 *   "category":        "My Category",
 *   "page":            "my-module.html",
 *   "script":          "assets/js/modules/my-module/index.js",
 *   "style":           "assets/js/modules/my-module/style.css",
 *   "globalVar":       "EduMyModule",
 *   "description":     "What this module does",
 *   "author":          "Your Name",
 *   "contact":         "dev@example.com",
 *   "enabledByDefault": false,
 *   "systemRequired":  false,
 *   "permissions":     ["my-module:read"]
 * }
 */
window.AtlasRegistry = (function () {

    // ── Available gradient color tokens ──────────────────────────────────────
    // icon-gradient-teal | icon-gradient-indigo | icon-gradient-purple
    // icon-gradient-blue | icon-gradient-amber  | icon-gradient-rose
    // icon-gradient-emerald | icon-gradient-cyan | icon-gradient-green

    // ── Module Catalog ────────────────────────────────────────────────────────
    // To add a module: append ONE object here. Everything else auto-wires.
    const MODULES = [

        // ── Diniyah ──────────────────────────────────────────────────────────
        {
            id:               'halaqah',
            name:             'Absensi KBM',
            version:          '1.2.0',
            icon:             'fa-calendar-check',
            color:            'icon-gradient-indigo',
            category:         'Diniyah',
            page:             'halaqah.html',
            script:           'assets/js/modules/halaqah/index.js',
            style:            'assets/js/modules/halaqah/style.css',
            globalVar:        'EduHalaqah',
            description:      'Attendance management for Halaqah, KBM, and daily Islamic study sessions.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['attendance:read', 'attendance:write'],
        },
        {
            id:               'tahfizh',
            name:             'Tahfizh Quran',
            version:          '2.0.0',
            icon:             'fa-quran',
            color:            'icon-gradient-purple',
            category:         'Diniyah',
            page:             'tahfizh.html',
            script:           'assets/js/modules/tahfizh/index.js',
            style:            'assets/js/modules/tahfizh/style.css',
            globalVar:        'EduTahfizh',
            description:      'Track and manage Quran memorization progress, setoran, and tahfizh evaluations.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['tahfizh:read', 'tahfizh:write'],
        },

        // ── Academic ─────────────────────────────────────────────────────────
        {
            id:               'curriculum',
            name:             'Curriculum Hub',
            version:          '1.3.0',
            icon:             'fa-book-reader',
            color:            'icon-gradient-teal',
            category:         'Academic',
            page:             'curriculum.html',
            script:           'assets/js/modules/curriculum/index.js',
            style:            'assets/js/modules/curriculum/style.css',
            globalVar:        'EduCurriculum',
            description:      '21-module curriculum management: syllabi, frameworks, specializations, research, and monitoring.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['curriculum:read', 'curriculum:write'],
        },
        {
            id:               'rapor',
            name:             'Rapor Digital',
            version:          '1.0.0',
            icon:             'fa-file-alt',
            color:            'icon-gradient-teal',
            category:         'Academic',
            page:             null,
            script:           null,
            style:            null,
            globalVar:        'EduStudentLifecycle',
            onClick:          'EduStudentLifecycle.openRaporDigitalModal()',
            description:      'Digital report cards with parent sign-off and cryptographic audit trail.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['rapor:read', 'rapor:write'],
        },
        {
            id:               'cbt',
            name:             'CBT Exam',
            version:          '1.0.0',
            icon:             'fa-laptop-code',
            color:            'icon-gradient-purple',
            category:         'Academic',
            page:             null,
            script:           null,
            style:            null,
            globalVar:        'EduStudentLifecycle',
            onClick:          'EduStudentLifecycle.openCbtExamModal()',
            description:      'Computer-based testing engine with anti-tamper and anti-cheating protocols.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['exam:read', 'exam:write'],
        },
        {
            id:               'graduation',
            name:             'Graduation & Ijazah',
            version:          '1.0.0',
            icon:             'fa-graduation-cap',
            color:            'icon-gradient-amber',
            category:         'Academic',
            page:             'graduation.html',
            script:           'assets/js/modules/graduation/index.js',
            style:            null,
            globalVar:        'EduGraduation',
            description:      '4-pillar graduation clearance audit and official cryptographic Ijazah certificate issuance.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['graduation:read', 'graduation:write', 'ijazah:issue'],
        },

        // ── Admissions ───────────────────────────────────────────────────────
        {
            id:               'ppdb',
            name:             'PPDB Online',
            version:          '1.1.0',
            icon:             'fa-user-plus',
            color:            'icon-gradient-blue',
            category:         'Admissions',
            page:             'ppdb.html',
            script:           'assets/js/modules/ppdb/index.js',
            style:            'assets/js/modules/ppdb/style.css',
            globalVar:        'EduPpdb',
            description:      'New student registration and admissions workflow — multi-step with document tracking.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['ppdb:read', 'ppdb:write'],
        },

        // ── Finance ──────────────────────────────────────────────────────────
        {
            id:               'tuition',
            name:             'SPP Ledger',
            version:          '1.0.0',
            icon:             'fa-credit-card',
            color:            'icon-gradient-teal',
            category:         'Finance',
            page:             'tuition.html',
            script:           'assets/js/modules/tuition/index.js',
            style:            'assets/js/modules/tuition/style.css',
            globalVar:        'EduTuition',
            description:      'Monthly tuition payment tracking, receipts, and financial ledger per student.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['finance:read', 'finance:write'],
        },

        // ── Asset ────────────────────────────────────────────────────────────
        {
            id:               'facilities',
            name:             'Facilities',
            version:          '1.0.0',
            icon:             'fa-building',
            color:            'icon-gradient-amber',
            category:         'Asset',
            page:             'facilities.html',
            script:           'assets/js/modules/facilities/index.js',
            style:            'assets/js/modules/facilities/style.css',
            globalVar:        'EduFacilities',
            description:      'Facility and asset booking, maintenance work orders, and room scheduling.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['facilities:read', 'facilities:write'],
        },

        // ── Activity ─────────────────────────────────────────────────────────
        {
            id:               'clubs',
            name:             'Clubs & Extra',
            version:          '1.0.0',
            icon:             'fa-trophy',
            color:            'icon-gradient-emerald',
            category:         'Activity',
            page:             'clubs.html',
            script:           'assets/js/modules/clubs/index.js',
            style:            'assets/js/modules/clubs/style.css',
            globalVar:        'EduClubs',
            description:      'Extracurricular clubs management: members, meetings, achievements, and scheduling.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['clubs:read', 'clubs:write'],
        },

        // ── Governance ───────────────────────────────────────────────────────
        {
            id:               'governance',
            name:             'WTP Audit',
            version:          '1.1.0',
            icon:             'fa-award',
            color:            'icon-gradient-cyan',
            category:         'Governance',
            page:             'governance.html',
            script:           'assets/js/modules/governance/index.js',
            style:            'assets/js/modules/governance/style.css',
            globalVar:        'EduGovernanceAudit',
            description:      'COBIT 2019 & ISO 9001 governance audit, WTP certification, and compliance reporting.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['governance:read', 'governance:admin'],
        },

        // ── Settings ─────────────────────────────────────────────────────────
        {
            id:               'tahun-ajaran',
            name:             'Tahun Ajaran',
            version:          '1.0.0',
            icon:             'fa-calendar-alt',
            color:            'icon-gradient-rose',
            category:         'Settings',
            page:             'tahun-ajaran.html',
            script:           'assets/js/modules/tahun-ajaran/index.js',
            style:            'assets/js/modules/tahun-ajaran/style.css',
            globalVar:        'EduTahunAjaran',
            description:      'Academic year configuration: semester dates, holiday calendars, and school year lifecycle.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['settings:admin'],
        },

        // ── Operational & Nutrisi ─────────────────────────────────────────────
        {
            id:               'mbg',
            name:             'Makan Bergizi (MBG)',
            version:          '1.0.0',
            icon:             'fa-utensils',
            color:            'icon-gradient-emerald',
            category:         'Operational',
            page:             'mbg.html',
            script:           'assets/js/modules/mbg/index.js',
            style:            'assets/js/modules/mbg/style.css',
            globalVar:        'EduMbg',
            description:      'Formulir Penerimaan Harian Program Makan Bergizi Gratis (MBG), diet alergi, uji organoleptik mutu, dan serah terima kurir SD At-Tibyan.',
            author:           'Buana Studios',
            contact:          'dev@buana.studio',
            enabledByDefault: true,
            systemRequired:   false,
            permissions:      ['mbg:read', 'mbg:write', 'mbg:approve'],
        },

        // ── PLACEHOLDER: future modules go here ───────────────────────────────
        // Just uncomment + fill in the fields below, then deploy.
        // {
        //     id:               'library',
        //     name:             'Digital Library',
        //     version:          '0.1.0',
        //     icon:             'fa-book',
        //     color:            'icon-gradient-indigo',
        //     category:         'Academic',
        //     page:             'library.html',
        //     script:           'assets/js/modules/library/index.js',
        //     style:            'assets/js/modules/library/style.css',
        //     globalVar:        'EduLibrary',
        //     description:      'Digital book catalog, borrowing, and reading progress tracking.',
        //     author:           '',
        //     contact:          '',
        //     enabledByDefault: false,   // ← false = disabled until admin toggles it on
        //     systemRequired:   false,
        //     permissions:      ['library:read'],
        // },
    ];

    // ── Registry Version (bump when adding/removing modules) ─────────────────
    const REGISTRY_VERSION = '1.0.0';

    // Public API
    function getAll()    { return MODULES; }
    function getById(id) { return MODULES.find(m => m.id === id) || null; }
    function getVersion(){ return REGISTRY_VERSION; }

    return { getAll, getById, getVersion, REGISTRY_VERSION };
})();
