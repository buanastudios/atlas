/**
 * Atlas Edu — Tahfizh Center
 * Module: modules/tahfizh/index.js
 *
 * Three tracks: Al-Qur'an · Hadith · Kitab Kuning (Hifdzul Mutun)
 *
 * Admin Feature: Kelola Daftar Mutun
 *   Admins can add / activate / deactivate / delete any title.
 *   The setoran form pulls ONLY from active titles in the managed list.
 *   All data persisted in localStorage so it survives sessions.
 *
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduTahfizh = (function () {

    // ─────────────────────────────────────────────────────────────────────
    //  MUTUN STORE  (admin-managed, localStorage-persistent)
    // ─────────────────────────────────────────────────────────────────────
    const STORE_KEY = 'tahfizh_mutun_list';

    /** Default curated list – covers well-known, sunnah-aligned mutun */
    function _defaultMutun() {
        return [
            // ── Al-Qur'an (managed separately via SURAHS, not here) ──
            // Surahs are fixed by revelation; curriculum target is set below as juz targets
            { id:'juz30',      track:'quran',  name:"Juz 30 (Juz 'Amma)",        arabic:"جزء عمّ",               scope:'Qur\'an',      unit:'Surah',   total:37, active:true,  required:true  },
            { id:'juz29',      track:'quran',  name:"Juz 29",                     arabic:"الجزء التاسع والعشرون", scope:'Qur\'an',      unit:'Surah',   total:11, active:true,  required:false },
            { id:'juz1',       track:'quran',  name:"Juz 1 (Al-Baqarah 1–141)",   arabic:"الجزء الأول",           scope:'Qur\'an',      unit:'Ayat',    total:141,active:true,  required:false },
            { id:'kahfi',      track:'quran',  name:"Surah Al-Kahfi (penuh)",      arabic:"سورة الكهف",            scope:'Qur\'an',      unit:'Ayat',    total:110,active:true,  required:false },

            // ── Hadith ────────────────────────────────────────────────
            { id:'arbain',     track:'hadith', name:"Arbain An-Nawawiyah",         arabic:"الأربعون النووية",      scope:'Hadith',       unit:'Hadits',  total:42, active:true,  required:true  },
            { id:'umdah',      track:'hadith', name:"Umdatul Ahkam",               arabic:"عمدة الأحكام",          scope:'Hadith',       unit:'Hadits',  total:417,active:true,  required:false },
            { id:'bulugh',     track:'hadith', name:"Bulughul Maram",              arabic:"بلوغ المرام",           scope:'Hadith',       unit:'Hadits',  total:1596,active:false, required:false },
            { id:'riyadhus',   track:'hadith', name:"Riyadhus Shalihin (pilihan)", arabic:"رياض الصالحين",         scope:'Hadith',       unit:'Hadits',  total:100,active:false, required:false },
            { id:'arbain40',   track:'hadith', name:"Matan 40 Hadits Pilihan",     arabic:"أربعون حديثاً مختاراً", scope:'Hadith',       unit:'Hadits',  total:40, active:true,  required:false },
            { id:'jawahir',    track:'hadith', name:"Jawahirul Kalamiyah",         arabic:"جواهر الكلامية",        scope:'Aqidah',       unit:'Fasal',   total:100,active:true,  required:false },

            // ── Kitab Kuning / Hifdzul Mutun ─────────────────────────
            // Nahwu
            { id:'jurumiyah',  track:'kitab',  name:"Matan Al-Ajurumiyah",         arabic:"الآجُرُّومِيَّة",       scope:'Nahwu',        unit:'Bab',     total:33, active:true,  required:true  },
            { id:'imrithi',    track:'kitab',  name:"Nadhm Al-Imrithi",            arabic:"نظم الإمريطي",          scope:'Nahwu',        unit:'Bait',    total:241,active:true,  required:false },
            { id:'alfiyah',    track:'kitab',  name:"Alfiyah Ibn Malik",            arabic:"ألفية ابن مالك",        scope:'Nahwu',        unit:'Bait',    total:1002,active:false, required:false },
            // Fiqh
            { id:'safinah',    track:'kitab',  name:"Safinatun Najah",             arabic:"سفينة النجاة",          scope:'Fiqh',         unit:'Bab',     total:25, active:true,  required:true  },
            { id:'taqrib',     track:'kitab',  name:"Matan At-Taqrib",             arabic:"متن التقريب",           scope:'Fiqh',         unit:'Bab',     total:45, active:true,  required:false },
            { id:'rahabiyah2', track:'kitab',  name:"Matn Abi Shuja'",             arabic:"متن أبي شجاع",          scope:'Fiqh',         unit:'Bab',     total:60, active:false, required:false },
            // Aqidah
            { id:'aqidawwam',  track:'kitab',  name:"Aqidatul Awwam",              arabic:"عقيدة العوام",          scope:'Aqidah',       unit:'Bait',    total:57, active:true,  required:true  },
            { id:'sanusiyah',  track:'kitab',  name:"Umm Al-Barahin (Sanusiyah)", arabic:"أم البراهين",            scope:'Aqidah',       unit:'Fasal',   total:20, active:true,  required:false },
            { id:'jawhar',     track:'kitab',  name:"Jawhar At-Tawhid",            arabic:"جوهرة التوحيد",         scope:'Aqidah',       unit:'Bait',    total:144,active:false, required:false },
            // Tajwid
            { id:'jazariyah',  track:'kitab',  name:"Al-Muqaddimah Al-Jazariyah", arabic:"المقدمة الجزرية",       scope:'Tajwid',       unit:'Bait',    total:109,active:true,  required:true  },
            { id:'tijandar',   track:'kitab',  name:"Tijan Ad-Darari",             arabic:"تيجان الدراري",         scope:'Tajwid',       unit:'Bab',     total:12, active:false, required:false },
            // Musthalah Hadith
            { id:'baiquniyah', track:'kitab',  name:"Al-Manzumah Al-Baiquniyah",  arabic:"المنظومة البيقونية",    scope:'Musthalah',    unit:'Bait',    total:34, active:true,  required:false },
            // Faraid
            { id:'rahbiyah',   track:'kitab',  name:"Ar-Rahbiyah (Faraid)",        arabic:"الرحبية",               scope:'Faraid',       unit:'Bait',    total:188,active:false, required:false },
            // Ushul Fiqh
            { id:'waraqat',    track:'kitab',  name:"Matn Al-Waraqat",             arabic:"متن الورقات",           scope:'Ushul Fiqh',   unit:'Fasal',   total:10, active:true,  required:false },
            { id:'sulam',      track:'kitab',  name:"Sullam Al-Munawraq",          arabic:"السُّلَّم المنوْرق",     scope:'Mantiq',       unit:'Bait',    total:61, active:false, required:false },
            // Sirah / Maulid
            { id:'burdah',     track:'kitab',  name:"Al-Burdah (Al-Busiri)",       arabic:"البردة",                scope:'Sirah/Maulid', unit:'Bait',    total:160,active:true,  required:false },
            { id:'dibai',      track:'kitab',  name:"Maulid Ad-Diba'i",            arabic:"مولد الديبع",           scope:'Sirah/Maulid', unit:'Fasal',   total:12, active:false, required:false },
            // Akhlak
            { id:'wasaya',     track:'kitab',  name:"Al-Wasaya (Adab Al-'Alim)",   arabic:"الوصايا",               scope:'Akhlak',       unit:'Fasal',   total:10, active:true,  required:false },
            { id:'bidayah',    track:'kitab',  name:"Bidayatul Hidayah (pilihan)", arabic:"بداية الهداية",         scope:'Akhlak',       unit:'Bab',     total:20, active:false, required:false },
        ];
    }

    function _loadMutun() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY)) || _defaultMutun(); }
        catch(_) { return _defaultMutun(); }
    }
    function _saveMutun(list) { localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

    // Active titles only (used by setoran form dropdowns)
    function _activeMutun(track) {
        return _loadMutun().filter(m => m.track === track && m.active);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  GRADE CONFIG
    // ─────────────────────────────────────────────────────────────────────
    const GRADES = [
        { min:90, label:'Mumtaz',        color:'#03ac0e', bg:'#f0fdf4' },
        { min:75, label:'Jayyid Jiddan', color:'#0891b2', bg:'#eff6ff' },
        { min:60, label:'Jayyid',        color:'#9333ea', bg:'#faf5ff' },
        { min:50, label:'Maqbul',        color:'#f59e0b', bg:'#fefce8' },
        { min:0,  label:'Rasib',         color:'#ef4444', bg:'#fff5f5' },
    ];
    function _grade(score) { return GRADES.find(g => score >= g.min) || GRADES[GRADES.length-1]; }

    // Surahs for Quran track
    const SURAHS = [
        {n:1,name:'Al-Fatihah',ayat:7},{n:2,name:'Al-Baqarah',ayat:286},
        {n:3,name:'Ali Imran',ayat:200},{n:4,name:'An-Nisa',ayat:176},
        {n:5,name:'Al-Maidah',ayat:120},{n:9,name:"At-Tawbah",ayat:129},
        {n:12,name:'Yusuf',ayat:111},{n:17,name:"Al-Isra",ayat:111},
        {n:18,name:'Al-Kahfi',ayat:110},{n:19,name:'Maryam',ayat:98},
        {n:20,name:"Ta-Ha",ayat:135},{n:36,name:"Ya-Sin",ayat:83},
        {n:55,name:"Ar-Rahman",ayat:78},{n:56,name:"Al-Waqiah",ayat:96},
        {n:67,name:"Al-Mulk",ayat:30},{n:78,name:"An-Naba",ayat:40},
        {n:87,name:"Al-Ala",ayat:19},{n:93,name:"Ad-Duha",ayat:11},
        {n:94,name:"Ash-Sharh",ayat:8},{n:95,name:"At-Tin",ayat:8},
        {n:96,name:"Al-Alaq",ayat:19},{n:99,name:"Az-Zalzalah",ayat:8},
        {n:103,name:"Al-Asr",ayat:3},{n:107,name:"Al-Maun",ayat:7},
        {n:108,name:"Al-Kawthar",ayat:3},{n:109,name:"Al-Kafirun",ayat:6},
        {n:110,name:"An-Nasr",ayat:3},{n:112,name:"Al-Ikhlas",ayat:4},
        {n:113,name:"Al-Falaq",ayat:5},{n:114,name:"An-Nas",ayat:6},
    ];

    const ROSTER = [
        'Ahmad Fauzi','Bilal Hamdani','Fatimah Az-Zahra','Hasan Mubarok',
        'Khadijah Nuraini','Muhammad Ali Ridha','Nisa Rahmawati',
        'Umar Abdullah','Zainab Putri','Abdurrahman Firdaus',
    ];

    // ─────────────────────────────────────────────────────────────────────
    //  STATE
    // ─────────────────────────────────────────────────────────────────────
    let _category     = 'quran';   // 'quran' | 'hadith' | 'kitab'
    let _type         = 'ziyadah'; // 'ziyadah' | 'murajaah' | 'hafalan' | 'syarah'
    let _view         = 'setoran'; // 'setoran' | 'admin'
    let _adminTab     = 'quran';
    let _clockInterval = null;
    let history       = JSON.parse(sessionStorage.getItem('tahfizh_history') || '[]');
    function _saveHistory() { sessionStorage.setItem('tahfizh_history', JSON.stringify(history)); }
    function _v(id) { return document.getElementById(id)?.value; }

    // ─────────────────────────────────────────────────────────────────────
    //  OPEN / RENDER
    // ─────────────────────────────────────────────────────────────────────
    function openModule() { _view = 'setoran'; _renderScreen(); }

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

        if (_view === 'admin') { _renderAdminPanel(screen); return; }

        // ── Setoran View ──────────────────────────────────────────────
        const todayStr  = new Date().toISOString().split('T')[0];
        const todayRec  = history.filter(h => h.date === todayStr);
        const session   = window.EduLogin?.getStoredSession?.();
        const isAdmin   = session && ['superadmin','director','principal','admin'].includes(session.role);

        screen.innerHTML = `
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:16px 20px 22px;">
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduTahfizh.closeModule()"
                    style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:34px;height:34px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fas fa-arrow-left" style="font-size:13px;"></i>
                </button>
                <div class="text-center flex-grow-1">
                    <div class="fw-bold text-white" style="font-size:17px;">Tahfizh Center</div>
                    <div id="tahfizh-clock" style="font-size:11px;color:rgba(255,255,255,0.65);"></div>
                </div>
                ${isAdmin ? `
                <button onclick="EduTahfizh.openAdminPanel()"
                    title="Kelola Daftar Mutun"
                    style="background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);color:#fff;width:34px;height:34px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fas fa-cog" style="font-size:13px;"></i>
                </button>` : '<div style="width:34px;"></div>'}
            </div>

            <!-- Category tabs -->
            <div class="d-flex gap-2 justify-content-center">
                ${[['quran','fas fa-quran',"Al-Qur'an"],['hadith','fas fa-book','Hadith'],['kitab','fas fa-scroll','Kitab Kuning']].map(([k,ic,lbl])=>`
                <button id="cat-btn-${k}" onclick="EduTahfizh.setCategory('${k}')"
                    style="flex:1;max-width:130px;padding:8px 4px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;
                           background:${k===_category?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.12)'};
                           color:${k===_category?'#4f46e5':'rgba(255,255,255,0.85)'};
                           border:1.5px solid ${k===_category?'transparent':'rgba(255,255,255,0.2)'};">
                    <i class="${ic} d-block mb-1" style="font-size:15px;"></i>${lbl}
                </button>`).join('')}
            </div>
        </div>

        <div class="px-3 px-md-4 pt-3" style="max-width:680px;margin:0 auto;">

            <!-- Status Hari Ini -->
            <div class="kit-card p-3 mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="fw-bold" style="font-size:13px;"><i class="fas fa-list-check me-2" style="color:#4f46e5;"></i>Status Hari Ini</div>
                    <span style="font-size:11px;color:var(--muted);">${new Date().toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'})}</span>
                </div>
                ${todayRec.length===0
                    ? '<div style="font-size:12px;color:var(--muted);text-align:center;padding:8px 0;">Belum ada setoran hari ini.</div>'
                    : `<div class="d-flex gap-2 flex-wrap">
                        ${['quran','hadith','kitab'].map(cat=>{
                            const n=todayRec.filter(r=>r.category===cat).length;
                            if(!n)return'';
                            const lb={'quran':"Al-Qur'an",'hadith':'Hadith','kitab':'Kitab'};
                            return`<span style="background:#f0f0fe;color:#4f46e5;border:1px solid #c7d2fe;border-radius:20px;font-size:11px;font-weight:700;padding:3px 12px;">${lb[cat]}: ${n}×</span>`;
                        }).join('')}
                        <span style="background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;border-radius:20px;font-size:11px;font-weight:700;padding:3px 12px;">Total: ${todayRec.length}</span>
                       </div>`
                }
            </div>

            <!-- Formulir Setoran -->
            <div class="kit-card p-4 mb-3">
                <div class="fw-bold mb-3" style="font-size:14px;"><i class="fas fa-rocket me-2" style="color:#4f46e5;"></i>Formulir Setoran</div>

                <!-- Santri -->
                <div class="mb-3">
                    <label class="form-label fw-semibold" style="font-size:12px;">Nama Santri <span style="color:#ef4444;">*</span></label>
                    <select id="ta-santri" class="form-select">
                        <option value="">— Pilih Santri —</option>
                        ${ROSTER.map(s=>`<option>${s}</option>`).join('')}
                    </select>
                </div>

                <!-- Dynamic form per category -->
                <div id="tahfizh-form-body">${_buildFormBody()}</div>

                <!-- Score -->
                <div id="tahfizh-score-box" class="p-4 mb-3 text-center" style="border-radius:14px;background:#03ac0e;transition:background .3s;">
                    <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.65);letter-spacing:.1em;margin-bottom:4px;">SKOR AKHIR</div>
                    <div id="tahfizh-score-value" style="font-size:52px;font-weight:900;color:#fff;line-height:1;">100</div>
                    <div id="tahfizh-score-grade" style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.18);border-radius:20px;padding:3px 14px;display:inline-block;margin-top:6px;letter-spacing:.06em;">MUMTAZ</div>
                </div>

                <!-- Notes -->
                <div class="mb-4">
                    <label class="form-label fw-semibold" style="font-size:12px;">Catatan Khusus <span style="font-weight:400;color:var(--muted);">(Opsional)</span></label>
                    <textarea id="ta-notes" class="form-control" rows="2" placeholder="Catatan untuk santri…" style="resize:none;font-size:13px;"></textarea>
                </div>

                <button onclick="EduTahfizh.simpanSetoran()"
                    style="width:100%;height:48px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <i class="fas fa-save"></i> SIMPAN SETORAN
                </button>
            </div>

            <!-- Riwayat -->
            <div class="kit-card p-3 mb-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="fw-bold" style="font-size:13px;"><i class="fas fa-history me-2" style="color:var(--muted);"></i>Riwayat Terakhir</div>
                    ${history.length>0?`<button onclick="EduTahfizh._clearHistory()" style="border:none;background:transparent;font-size:11px;color:#ef4444;cursor:pointer;font-weight:600;">Hapus Semua</button>`:''}
                </div>
                ${_buildHistory()}
            </div>
        </div>`;

        setTimeout(()=>_startClock(), 80);
        setTimeout(()=>calcScore(), 120);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  ADMIN PANEL — Kelola Daftar Mutun
    // ─────────────────────────────────────────────────────────────────────
    function openAdminPanel() { _view = 'admin'; _adminTab = 'quran'; _renderScreen(); }

    function _renderAdminPanel(screen) {
        const all    = _loadMutun();
        const tracks = { quran: "Al-Qur'an", hadith: 'Hadith', kitab: 'Kitab Kuning' };
        const list   = all.filter(m => m.track === _adminTab);

        // Group kitab by scope
        const scopeGroups = {};
        list.forEach(m => {
            if (!scopeGroups[m.scope]) scopeGroups[m.scope] = [];
            scopeGroups[m.scope].push(m);
        });

        screen.innerHTML = `
        <!-- Admin Header -->
        <div style="background:linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%);padding:16px 20px 22px;">
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduTahfizh._backToSetoran()"
                    style="background:rgba(255,255,255,0.12);border:none;color:#fff;width:34px;height:34px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fas fa-arrow-left" style="font-size:13px;"></i>
                </button>
                <div class="flex-grow-1">
                    <div class="fw-bold text-white" style="font-size:17px;">Kelola Daftar Mutun</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.6);">Tambah, aktifkan, atau nonaktifkan judul hafalan</div>
                </div>
            </div>

            <!-- Track tabs -->
            <div class="d-flex gap-2 justify-content-center">
                ${Object.entries(tracks).map(([k,lbl])=>`
                <button onclick="EduTahfizh._adminTab='${k}';EduTahfizh.openAdminPanel()"
                    style="flex:1;max-width:130px;padding:8px 4px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;
                           background:${k===_adminTab?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.12)'};
                           color:${k===_adminTab?'#4c1d95':'rgba(255,255,255,0.85)'};
                           border:1.5px solid ${k===_adminTab?'transparent':'rgba(255,255,255,0.25)'};">${lbl}</button>
                `).join('')}
            </div>
        </div>

        <div class="px-3 px-md-4 pt-3 pb-5" style="max-width:720px;margin:0 auto;">

            <!-- Stats strip -->
            <div class="d-flex gap-2 mb-3 flex-wrap">
                <div class="kit-card px-3 py-2 text-center" style="flex:1;min-width:80px;">
                    <div style="font-size:20px;font-weight:800;color:#4f46e5;">${list.length}</div>
                    <div style="font-size:10px;color:var(--muted);">Total Judul</div>
                </div>
                <div class="kit-card px-3 py-2 text-center" style="flex:1;min-width:80px;">
                    <div style="font-size:20px;font-weight:800;color:#03ac0e;">${list.filter(m=>m.active).length}</div>
                    <div style="font-size:10px;color:var(--muted);">Aktif</div>
                </div>
                <div class="kit-card px-3 py-2 text-center" style="flex:1;min-width:80px;">
                    <div style="font-size:20px;font-weight:800;color:#ef4444;">${list.filter(m=>m.required).length}</div>
                    <div style="font-size:10px;color:var(--muted);">Wajib</div>
                </div>
                <div class="kit-card px-3 py-2 text-center" style="flex:1;min-width:80px;">
                    <div style="font-size:20px;font-weight:800;color:var(--muted);">${list.filter(m=>!m.active).length}</div>
                    <div style="font-size:10px;color:var(--muted);">Tidak Aktif</div>
                </div>
            </div>

            <!-- Add new title form -->
            <div class="kit-card p-4 mb-3">
                <div class="fw-bold mb-3" style="font-size:13px;"><i class="fas fa-plus-circle me-2" style="color:#4f46e5;"></i>Tambah Judul Baru</div>
                <div class="row g-2">
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold" style="font-size:11px;">Nama Kitab / Koleksi <span style="color:#ef4444;">*</span></label>
                        <input id="admin-name" type="text" class="form-control" placeholder="mis. Matan Al-Ajurumiyah" style="font-size:12px;">
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold" style="font-size:11px;">Nama Arab (Opsional)</label>
                        <input id="admin-arabic" type="text" class="form-control" placeholder="mis. الآجرومية" style="font-size:13px;font-family:serif;direction:rtl;">
                    </div>
                    <div class="col-6 col-md-4">
                        <label class="form-label fw-semibold" style="font-size:11px;">Disiplin / Scope <span style="color:#ef4444;">*</span></label>
                        <input id="admin-scope" type="text" class="form-control" placeholder="mis. Nahwu, Fiqh…" style="font-size:12px;">
                    </div>
                    <div class="col-6 col-md-4">
                        <label class="form-label fw-semibold" style="font-size:11px;">Satuan</label>
                        <select id="admin-unit" class="form-select" style="font-size:12px;">
                            <option>Bait</option><option>Bab</option><option>Fasal</option>
                            <option>Hadits</option><option>Ayat</option><option>Surah</option><option>Halaman</option>
                        </select>
                    </div>
                    <div class="col-6 col-md-4">
                        <label class="form-label fw-semibold" style="font-size:11px;">Total Satuan</label>
                        <input id="admin-total" type="number" class="form-control" placeholder="mis. 57" min="1" style="font-size:12px;">
                    </div>
                    <div class="col-6 col-md-6">
                        <div class="d-flex gap-3 align-items-center mt-2">
                            <label class="d-flex align-items-center gap-2" style="cursor:pointer;font-size:12px;font-weight:600;">
                                <input type="checkbox" id="admin-required"> Wajib (Fardhu)
                            </label>
                            <label class="d-flex align-items-center gap-2" style="cursor:pointer;font-size:12px;font-weight:600;">
                                <input type="checkbox" id="admin-active" checked> Aktifkan Sekarang
                            </label>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 d-flex align-items-end">
                        <button onclick="EduTahfizh._adminAddTitle()"
                            style="width:100%;height:38px;background:#4f46e5;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;">
                            <i class="fas fa-plus me-1"></i>Tambah ke Daftar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Title list (grouped by scope for kitab) -->
            ${_adminTab === 'kitab'
                ? Object.entries(scopeGroups).map(([scope, items]) => `
                  <div class="mb-3">
                      <div class="fw-bold mb-2 px-1" style="font-size:12px;color:#4c1d95;text-transform:uppercase;letter-spacing:.05em;">${scope}</div>
                      ${items.map(m => _adminRow(m)).join('')}
                  </div>`).join('')
                : `<div>${list.map(m => _adminRow(m)).join('')}</div>`
            }

            ${list.length===0?'<div class="text-muted text-center py-4 kit-card p-4" style="font-size:13px;">Belum ada judul untuk track ini. Tambahkan di atas.</div>':''}
        </div>`;
    }

    function _adminRow(m) {
        return `
        <div class="kit-card p-3 mb-2 d-flex align-items-center gap-3 flex-wrap" id="admin-row-${m.id}"
             style="border-left:3px solid ${m.active?(m.required?'#ef4444':'#03ac0e'):'#e5e7eb'};">
            <!-- Toggle active -->
            <button onclick="EduTahfizh._adminToggleActive('${m.id}')"
                title="${m.active?'Nonaktifkan':'Aktifkan'}"
                style="width:36px;height:36px;border-radius:9px;flex-shrink:0;border:1.5px solid ${m.active?'#03ac0e':'var(--border)'};background:${m.active?'#f0fdf4':'#fff'};color:${m.active?'#03ac0e':'#d1d5db'};cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-${m.active?'toggle-on':'toggle-off'}" style="font-size:16px;"></i>
            </button>

            <!-- Info -->
            <div class="flex-grow-1 min-w-0">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="fw-bold" style="font-size:13px;">${m.name}</span>
                    ${m.arabic?`<span style="font-size:13px;color:#6b7280;font-family:serif;">${m.arabic}</span>`:''}
                </div>
                <div class="d-flex gap-2 mt-1 flex-wrap">
                    <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#f5f3ff;color:#7c3aed;">${m.scope}</span>
                    <span style="font-size:10px;color:var(--muted);">${m.total} ${m.unit}</span>
                    ${m.required?'<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#fff5f5;color:#ef4444;border:1px solid #fecaca;">Wajib</span>':''}
                    ${!m.active?'<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:#f3f4f6;color:#9ca3af;">Non-Aktif</span>':''}
                </div>
            </div>

            <!-- Toggle required -->
            <button onclick="EduTahfizh._adminToggleRequired('${m.id}')"
                title="${m.required?'Jadikan Sunnah':'Jadikan Wajib'}"
                style="font-size:11px;font-weight:700;padding:6px 10px;border-radius:8px;cursor:pointer;
                       border:1.5px solid ${m.required?'#fecaca':'var(--border)'};
                       background:${m.required?'#fff5f5':'#fff'};
                       color:${m.required?'#ef4444':'var(--muted)'};">
                ${m.required?'Wajib':'Sunah'}
            </button>

            <!-- Delete -->
            <button onclick="EduTahfizh._adminDeleteTitle('${m.id}')"
                title="Hapus dari daftar"
                style="width:32px;height:32px;border-radius:8px;border:1.5px solid #fecaca;background:#fff5f5;color:#ef4444;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas fa-trash" style="font-size:11px;"></i>
            </button>
        </div>`;
    }

    // ── Admin actions ─────────────────────────────────────────────────────
    function _adminAddTitle() {
        const name    = document.getElementById('admin-name')?.value.trim();
        const arabic  = document.getElementById('admin-arabic')?.value.trim();
        const scope   = document.getElementById('admin-scope')?.value.trim();
        const unit    = document.getElementById('admin-unit')?.value;
        const total   = parseInt(document.getElementById('admin-total')?.value) || 0;
        const required= document.getElementById('admin-required')?.checked || false;
        const active  = document.getElementById('admin-active')?.checked ?? true;

        if (!name || !scope) { window.AtlasToast?.show('Nama dan Disiplin/Scope wajib diisi.','error'); return; }

        const all = _loadMutun();
        const newItem = {
            id:       'M-' + Date.now().toString().slice(-8),
            track:    _adminTab,
            name, arabic, scope, unit: unit||'Bab', total, active, required,
        };
        all.push(newItem);
        _saveMutun(all);

        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','MUTUN_ADD',newItem.id,`Added "${name}" to ${_adminTab}`);
        window.AtlasToast?.show(`"${name}" berhasil ditambahkan ke daftar.`,'success');
        openAdminPanel();
    }

    function _adminToggleActive(id) {
        const all = _loadMutun();
        const m   = all.find(x => x.id === id);
        if (!m) return;
        m.active = !m.active;
        _saveMutun(all);
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','MUTUN_TOGGLE',id,`${m.name} active=${m.active}`);
        window.AtlasToast?.show(`"${m.name}" ${m.active?'diaktifkan':'dinonaktifkan'}.`, m.active?'success':'info');
        openAdminPanel();
    }

    function _adminToggleRequired(id) {
        const all = _loadMutun();
        const m   = all.find(x => x.id === id);
        if (!m) return;
        m.required = !m.required;
        _saveMutun(all);
        window.AtlasToast?.show(`"${m.name}" dijadikan ${m.required?'Wajib':'Sunah/Pilihan'}.`,'info');
        openAdminPanel();
    }

    function _adminDeleteTitle(id) {
        const all = _loadMutun();
        const m   = all.find(x => x.id === id);
        if (!m) return;
        if (!confirm(`Hapus "${m.name}" dari daftar mutun?`)) return;
        _saveMutun(all.filter(x => x.id !== id));
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','MUTUN_DELETE',id,`Deleted "${m.name}"`);
        window.AtlasToast?.show(`"${m.name}" dihapus dari daftar.`,'info');
        openAdminPanel();
    }

    function _backToSetoran() { _view = 'setoran'; _renderScreen(); }

    // ─────────────────────────────────────────────────────────────────────
    //  FORM BODY (pulls from active managed list)
    // ─────────────────────────────────────────────────────────────────────
    function _buildFormBody() {
        if (_category === 'quran')  return _formQuran();
        if (_category === 'hadith') return _formHadith();
        if (_category === 'kitab')  return _formKitab();
        return '';
    }

    function _formQuran() {
        const activeTargets = _activeMutun('quran');
        return `
        <div class="d-flex gap-0 mb-3" style="border:2px solid #4f46e5;border-radius:10px;overflow:hidden;">
            ${[['ziyadah','Ziyadah (Baru)'],['murajaah','Murajaah (Ulang)']].map(([k,l])=>`
            <button id="type-btn-${k}" onclick="EduTahfizh.setType('${k}')"
                style="flex:1;height:40px;border:none;font-size:12px;font-weight:700;cursor:pointer;
                       background:${k===_type?'#4f46e5':'transparent'};color:${k===_type?'#fff':'#4f46e5'};transition:all .15s;">${l}</button>`).join('')}
        </div>

        ${activeTargets.length>0?`
        <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size:12px;">Target Hafalan</label>
            <select id="ta-quran-target" class="form-select" onchange="EduTahfizh.calcScore()">
                <option value="">— Pilih Target —</option>
                ${activeTargets.map(t=>`<option value="${t.id}">${t.name}${t.required?' ★':''}</option>`).join('')}
                <option value="__custom__">— Surah Bebas —</option>
            </select>
        </div>`:''}

        <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size:12px;">Surah</label>
            <select id="ta-surah" class="form-select" onchange="EduTahfizh._onSurahChange()">
                ${SURAHS.map((s,i)=>`<option value="${i}">${s.n}. ${s.name}</option>`).join('')}
            </select>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;">Dari Ayat</label>
                <input id="ta-dari" type="number" class="form-control" value="1" min="1" max="7" oninput="EduTahfizh.calcScore()"></div>
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;">Hingga Ayat</label>
                <input id="ta-hingga" type="number" class="form-control" value="7" min="1" max="7" oninput="EduTahfizh.calcScore()"></div>
        </div>

        <div class="p-3 mb-3" style="background:#f5f3ff;border-radius:12px;border:1.5px solid #e0e7ff;">
            <div class="fw-bold mb-3" style="font-size:11px;color:#4f46e5;letter-spacing:.05em;text-transform:uppercase;">Penilaian (1–5)</div>
            ${[['tajwid','Tajwid'],['makhraj','Makhraj'],['mad','Mad']].map(([k,l])=>`
            <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                    <span style="font-size:13px;font-weight:600;">${l}</span>
                    <span id="badge-${k}" style="width:24px;height:24px;border-radius:50%;background:#4f46e5;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;">5</span>
                </div>
                <input id="slider-${k}" type="range" min="1" max="5" value="5" class="w-100" oninput="EduTahfizh.calcScore()" style="accent-color:#4f46e5;height:5px;cursor:pointer;">
            </div>`).join('')}
            <div class="mt-2">
                <label class="form-label fw-semibold" style="font-size:12px;">Kualitas Bacaan</label>
                <select id="ta-quality" class="form-select" onchange="EduTahfizh.calcScore()">
                    <option value="20">Lancar</option><option value="14">Cukup Lancar</option>
                    <option value="7">Kurang Lancar</option><option value="0">Tidak Lancar</option>
                </select>
            </div>
        </div>`;
    }

    function _formHadith() {
        const activeList = _activeMutun('hadith');
        if (activeList.length===0) return `<div class="kit-card p-3 text-center text-muted mb-3" style="font-size:13px;"><i class="fas fa-exclamation-circle me-2 text-warning"></i>Tidak ada koleksi hadith yang aktif. Admin perlu mengaktifkannya di pengaturan Mutun.</div>`;
        return `
        <div class="d-flex gap-0 mb-3" style="border:2px solid #0891b2;border-radius:10px;overflow:hidden;">
            ${[['ziyadah','Ziyadah'],['murajaah','Murajaah']].map(([k,l])=>`
            <button id="type-btn-${k}" onclick="EduTahfizh.setType('${k}')"
                style="flex:1;height:40px;border:none;font-size:12px;font-weight:700;cursor:pointer;
                       background:${k===_type?'#0891b2':'transparent'};color:${k===_type?'#fff':'#0891b2'};transition:all .15s;">${l}</button>`).join('')}
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold" style="font-size:12px;">Kitab Hadith <span style="color:#ef4444;">*</span></label>
            <select id="ta-hadith-kitab" class="form-select" onchange="EduTahfizh._onHadithKitabChange()">
                ${activeList.map(m=>`<option value="${m.id}" data-total="${m.total}" data-unit="${m.unit}">${m.name}${m.required?' ★':''}</option>`).join('')}
            </select>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;">Nomor Mulai</label>
                <input id="ta-dari" type="number" class="form-control" value="1" min="1" oninput="EduTahfizh.calcScore()"></div>
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;">Nomor Selesai</label>
                <input id="ta-hingga" type="number" class="form-control" value="5" min="1" oninput="EduTahfizh.calcScore()"></div>
        </div>
        <div class="p-3 mb-3" style="background:#ecfeff;border-radius:12px;border:1.5px solid #a5f3fc;">
            <div class="fw-bold mb-3" style="font-size:11px;color:#0891b2;letter-spacing:.05em;text-transform:uppercase;">Penilaian (1–5)</div>
            ${[['sanad','Hafalan Sanad'],['matn','Hafalan Matan'],['makna','Pemahaman Makna']].map(([k,l])=>`
            <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                    <span style="font-size:13px;font-weight:600;">${l}</span>
                    <span id="badge-${k}" style="width:24px;height:24px;border-radius:50%;background:#0891b2;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;">5</span>
                </div>
                <input id="slider-${k}" type="range" min="1" max="5" value="5" class="w-100" oninput="EduTahfizh.calcScore()" style="accent-color:#0891b2;height:5px;cursor:pointer;">
            </div>`).join('')}
            <div class="mt-2">
                <label class="form-label fw-semibold" style="font-size:12px;">Kelancaran</label>
                <select id="ta-quality" class="form-select" onchange="EduTahfizh.calcScore()">
                    <option value="10">Sangat Lancar</option><option value="7">Cukup Lancar</option>
                    <option value="3">Kurang Lancar</option><option value="0">Tidak Lancar</option>
                </select>
            </div>
        </div>`;
    }

    function _formKitab() {
        const activeList = _activeMutun('kitab');
        if (activeList.length===0) return `<div class="kit-card p-3 text-center text-muted mb-3" style="font-size:13px;"><i class="fas fa-exclamation-circle me-2 text-warning"></i>Tidak ada kitab yang aktif. Admin perlu mengaktifkannya di pengaturan Mutun.</div>`;

        // Group by scope for optgroup
        const groups = {};
        activeList.forEach(m => { if(!groups[m.scope]) groups[m.scope]=[]; groups[m.scope].push(m); });

        return `
        <div class="d-flex gap-0 mb-3" style="border:2px solid #9333ea;border-radius:10px;overflow:hidden;">
            ${[['hafalan','Hafalan Matan'],['syarah','Pemahaman Syarah']].map(([k,l])=>`
            <button id="type-btn-${k}" onclick="EduTahfizh.setType('${k}')"
                style="flex:1;height:40px;border:none;font-size:12px;font-weight:700;cursor:pointer;
                       background:${k===_type?'#9333ea':'transparent'};color:${k===_type?'#fff':'#9333ea'};transition:all .15s;">${l}</button>`).join('')}
        </div>
        <div class="mb-2">
            <label class="form-label fw-semibold" style="font-size:12px;">Kitab / Matan <span style="color:#ef4444;">*</span></label>
            <select id="ta-kitab" class="form-select" onchange="EduTahfizh._onKitabChange()">
                ${Object.entries(groups).map(([scope,items])=>`
                <optgroup label="${scope}">
                    ${items.map(m=>`<option value="${m.id}" data-scope="${m.scope}" data-unit="${m.unit}" data-arabic="${m.arabic||''}">${m.name}${m.required?' ★':''}</option>`).join('')}
                </optgroup>`).join('')}
            </select>
        </div>
        <div class="mb-3 d-flex align-items-center gap-2">
            <span id="kitab-scope-badge" style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;background:#f5f3ff;color:#9333ea;border:1px solid #e9d5ff;">${activeList[0]?.scope||''}</span>
            <span id="kitab-arabic" style="font-size:13px;color:#6b7280;font-family:serif;">${activeList[0]?.arabic||''}</span>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;" id="label-dari">Dari Bab</label>
                <input id="ta-dari" type="text" class="form-control" placeholder="mis. Bab 1" oninput="EduTahfizh.calcScore()"></div>
            <div class="col-6"><label class="form-label fw-semibold" style="font-size:12px;" id="label-hingga">Hingga Bab</label>
                <input id="ta-hingga" type="text" class="form-control" placeholder="mis. Bab 3" oninput="EduTahfizh.calcScore()"></div>
        </div>
        <div class="p-3 mb-3" style="background:#faf5ff;border-radius:12px;border:1.5px solid #e9d5ff;">
            <div class="fw-bold mb-3" style="font-size:11px;color:#9333ea;letter-spacing:.05em;text-transform:uppercase;">Penilaian (1–5)</div>
            ${[['kelancaran','Kelancaran Membaca'],['fasih',"Fashahah / Fasih"],['faham','Pemahaman Kandungan']].map(([k,l])=>`
            <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                    <span style="font-size:13px;font-weight:600;">${l}</span>
                    <span id="badge-${k}" style="width:24px;height:24px;border-radius:50%;background:#9333ea;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;">5</span>
                </div>
                <input id="slider-${k}" type="range" min="1" max="5" value="5" class="w-100" oninput="EduTahfizh.calcScore()" style="accent-color:#9333ea;height:5px;cursor:pointer;">
            </div>`).join('')}
            <div class="mt-2">
                <label class="form-label fw-semibold" style="font-size:12px;">I'rab</label>
                <select id="ta-quality" class="form-select" onchange="EduTahfizh.calcScore()">
                    <option value="10">Tepat & Lengkap</option><option value="7">Sebagian Besar Tepat</option>
                    <option value="3">Perlu Bimbingan</option><option value="0">Belum Bisa</option>
                </select>
            </div>
        </div>`;
    }

    // ─────────────────────────────────────────────────────────────────────
    //  SCORE
    // ─────────────────────────────────────────────────────────────────────
    function calcScore() {
        let score = 100;
        const sliders = {
            quran:  ['tajwid','makhraj','mad'],
            hadith: ['sanad','matn','makna'],
            kitab:  ['kelancaran','fasih','faham'],
        };
        const keys = sliders[_category] || [];
        const vals = keys.map(k => parseInt(document.getElementById(`slider-${k}`)?.value||5));
        const sum  = vals.reduce((a,b)=>a+b, 0);
        const q    = parseInt(_v('ta-quality')||'20');
        score = Math.min(100, Math.round((sum/vals.length/5)*90 + q));
        keys.forEach((k,i)=>{
            const b=document.getElementById(`badge-${k}`);
            const s=document.getElementById(`slider-${k}`);
            if(b&&s)b.innerText=s.value;
        });
        const g = _grade(score);
        const box=document.getElementById('tahfizh-score-box');
        const vEl=document.getElementById('tahfizh-score-value');
        const gEl=document.getElementById('tahfizh-score-grade');
        if(box)box.style.background=g.color;
        if(vEl)vEl.innerText=score;
        if(gEl)gEl.innerText=g.label.toUpperCase();
    }

    // ─────────────────────────────────────────────────────────────────────
    //  CATEGORY / TYPE
    // ─────────────────────────────────────────────────────────────────────
    function setCategory(cat) {
        _category = cat;
        _type = cat==='kitab' ? 'hafalan' : 'ziyadah';
        const body=document.getElementById('tahfizh-form-body');
        if(body) body.innerHTML=_buildFormBody();
        ['quran','hadith','kitab'].forEach(k=>{
            const btn=document.getElementById(`cat-btn-${k}`);
            if(!btn)return;
            btn.style.background = k===cat?'rgba(255,255,255,0.95)':'rgba(255,255,255,0.12)';
            btn.style.color      = k===cat?'#4f46e5':'rgba(255,255,255,0.85)';
            btn.style.border     = `1.5px solid ${k===cat?'transparent':'rgba(255,255,255,0.2)'}`;
        });
        setTimeout(()=>calcScore(),80);
    }

    function setType(type) {
        _type=type;
        const c={quran:'#4f46e5',hadith:'#0891b2',kitab:'#9333ea'}[_category];
        const allT=_category==='kitab'?['hafalan','syarah']:['ziyadah','murajaah'];
        allT.forEach(k=>{
            const btn=document.getElementById(`type-btn-${k}`);
            if(!btn)return;
            btn.style.background=k===type?c:'transparent';
            btn.style.color=k===type?'#fff':c;
        });
    }

    // ─────────────────────────────────────────────────────────────────────
    //  CHANGE HANDLERS
    // ─────────────────────────────────────────────────────────────────────
    function _onSurahChange() {
        const sel=document.getElementById('ta-surah');
        const s=SURAHS[parseInt(sel?.value??0)];
        const d=document.getElementById('ta-dari');
        const h=document.getElementById('ta-hingga');
        if(d&&s){d.max=s.ayat;d.value=1;}
        if(h&&s){h.max=s.ayat;h.value=Math.min(s.ayat,7);}
        calcScore();
    }

    function _onHadithKitabChange() {
        const sel=document.getElementById('ta-hadith-kitab');
        const opt=sel?.options[sel.selectedIndex];
        const total=opt?.dataset?.total||42;
        const d=document.getElementById('ta-dari');
        const h=document.getElementById('ta-hingga');
        if(d){d.max=total;d.value=1;}
        if(h){h.max=total;h.value=Math.min(5,total);}
    }

    function _onKitabChange() {
        const sel=document.getElementById('ta-kitab');
        const opt=sel?.options[sel.selectedIndex];
        const scope=opt?.dataset?.scope||'';
        const unit=opt?.dataset?.unit||'Bab';
        const arabic=opt?.dataset?.arabic||'';
        const sb=document.getElementById('kitab-scope-badge');
        const ab=document.getElementById('kitab-arabic');
        const dl=document.getElementById('label-dari');
        const hl=document.getElementById('label-hingga');
        if(sb)sb.innerText=scope;
        if(ab)ab.innerText=arabic;
        if(dl)dl.innerText=`Dari ${unit}`;
        if(hl)hl.innerText=`Hingga ${unit}`;
    }

    // ─────────────────────────────────────────────────────────────────────
    //  SAVE SETORAN
    // ─────────────────────────────────────────────────────────────────────
    function simpanSetoran() {
        const santri=_v('ta-santri');
        if(!santri){window.AtlasToast?.show('Pilih nama santri.','error');return;}
        let subject='',detail='';
        if(_category==='quran'){
            const s=SURAHS[parseInt(_v('ta-surah')??0)];
            subject=`${s.n}. ${s.name}`;detail=`Ayat ${_v('ta-dari')}–${_v('ta-hingga')}`;
        } else if(_category==='hadith'){
            const sel=document.getElementById('ta-hadith-kitab');
            subject=sel?.options[sel.selectedIndex]?.text||'Hadith';
            detail=`No. ${_v('ta-dari')}–${_v('ta-hingga')}`;
        } else {
            const sel=document.getElementById('ta-kitab');
            subject=sel?.options[sel.selectedIndex]?.text||'Kitab';
            detail=`${_v('ta-dari')} s.d. ${_v('ta-hingga')}`;
        }
        const scoreEl=document.getElementById('tahfizh-score-value');
        const score=parseInt(scoreEl?.innerText||0);
        const g=_grade(score);
        const record={
            id:'SET-'+Date.now().toString().slice(-8),
            category:_category,type:_type,santri,subject,detail,score,
            grade:g.label,gradeColor:g.color,
            notes:_v('ta-notes')||'',
            date:new Date().toISOString().split('T')[0],
            time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}),
        };
        history.push(record);_saveHistory();
        if(window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','teacher','TAHFIZH_SETORAN',record.id,
            `${santri}|${_category}|${subject}|${detail}|Skor:${score}(${g.label})`);
        window.AtlasToast?.show(`✓ ${santri} — ${subject} ${detail} — Skor ${score} (${g.label})`,'success');
        document.getElementById('ta-santri').value='';
        const ta=document.getElementById('ta-notes');if(ta)ta.value='';
        _renderScreen();
    }

    // ─────────────────────────────────────────────────────────────────────
    //  HISTORY
    // ─────────────────────────────────────────────────────────────────────
    function _buildHistory() {
        if(history.length===0) return `<div class="text-center py-4" style="color:var(--muted);font-size:12px;"><i class="fas fa-inbox" style="font-size:26px;opacity:.2;display:block;margin-bottom:8px;"></i>Belum ada riwayat setoran.</div>`;
        const cc={quran:'#4f46e5',hadith:'#0891b2',kitab:'#9333ea'};
        const cl={quran:"Al-Qur'an",hadith:'Hadith',kitab:'Kitab'};
        return `<div class="d-flex flex-column gap-2">${history.slice().reverse().slice(0,15).map(h=>`
        <div class="d-flex align-items-center gap-2 p-2" style="background:#f8fafc;border-radius:10px;">
            <div style="width:36px;height:36px;border-radius:10px;background:${h.gradeColor};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;flex-shrink:0;">${h.score}</div>
            <div class="flex-grow-1 min-w-0">
                <div class="fw-bold" style="font-size:12px;">${h.santri}</div>
                <div style="font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    <span style="color:${cc[h.category]||'#555'};font-weight:700;">${cl[h.category]||''}</span>
                    · ${h.type} · ${h.subject} · ${h.detail} · ${h.grade}
                </div>
            </div>
            <div style="font-size:10px;color:var(--muted);white-space:nowrap;text-align:right;"><div>${h.time}</div><div>${h.date}</div></div>
        </div>`).join('')}</div>`;
    }

    function _clearHistory() {
        if(!confirm('Hapus seluruh riwayat?'))return;
        history=[];_saveHistory();_renderScreen();
    }

    // ─────────────────────────────────────────────────────────────────────
    //  CLOCK / SHOW-HIDE
    // ─────────────────────────────────────────────────────────────────────
    function _startClock() {
        _stopClock();
        const tick=()=>{
            const el=document.getElementById('tahfizh-clock');
            if(!el){_stopClock();return;}
            const n=new Date();
            el.innerText=n.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' | '+n.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
        };
        tick();_clockInterval=setInterval(tick,1000);
    }
    function _stopClock(){if(_clockInterval){clearInterval(_clockInterval);_clockInterval=null;}}

    function closeModule(){
        _stopClock();
        const s=document.getElementById('module-tahfizh');if(s)s.style.display='none';
        _showMain();
    }
    function _hideMain(){
        ['screen-director','mgmt-screen-curriculum'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
        const h=document.querySelector('.tokopedia-hero-carousel');if(h)h.style.display='none';
        const g=document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card');if(g)g.style.display='none';
        const a=document.getElementById('persona-switcher-bar');if(a)a.style.display='none';
    }
    function _showMain(){
        ['screen-director','mgmt-screen-curriculum'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='block';});
        const h=document.querySelector('.tokopedia-hero-carousel');if(h)h.style.display='block';
        const g=document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card');if(g)g.style.display='block';
        const session=window.EduLogin?.getStoredSession?.();
        const a=document.getElementById('persona-switcher-bar');
        if(a&&session)a.style.display=session.isSuperadmin?'block':'none';
    }

    return {
        openModule, closeModule, openAdminPanel, _backToSetoran,
        setCategory, setType, calcScore, simpanSetoran,
        _onSurahChange, _onHadithKitabChange, _onKitabChange,
        _adminAddTitle, _adminToggleActive, _adminToggleRequired, _adminDeleteTitle,
        _clearHistory,
    };
})();
