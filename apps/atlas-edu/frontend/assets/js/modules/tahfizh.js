/**
 * Atlas Edu — Tahfizh Center (Setoran Hafalan)
 * Cross-level module: applies to ALL academic units (PAUD through Kampus).
 * Features: Ziyadah/Murajaah toggle, Surah picker, Tajwid/Makhraj/Mad sliders,
 * live score calculation with grade label, history log, and progress tracker.
 *
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduTahfizh = (function () {

    // ── Quran Surah list (114 surahs) ─────────────────────────────────────
    const SURAHS = [
        {n:1,  name:'Al-Fatihah',    ayat:7},  {n:2,  name:'Al-Baqarah',     ayat:286},
        {n:3,  name:'Ali Imran',     ayat:200},{n:4,  name:'An-Nisa',        ayat:176},
        {n:5,  name:'Al-Maidah',     ayat:120},{n:6,  name:'Al-Anam',        ayat:165},
        {n:7,  name:'Al-Araf',       ayat:206},{n:8,  name:'Al-Anfal',       ayat:75},
        {n:9,  name:'At-Tawbah',     ayat:129},{n:10, name:'Yunus',          ayat:109},
        {n:11, name:'Hud',           ayat:123},{n:12, name:'Yusuf',          ayat:111},
        {n:13, name:'Ar-Rad',        ayat:43}, {n:14, name:'Ibrahim',        ayat:52},
        {n:15, name:'Al-Hijr',       ayat:99}, {n:16, name:'An-Nahl',        ayat:128},
        {n:17, name:'Al-Isra',       ayat:111},{n:18, name:'Al-Kahfi',       ayat:110},
        {n:19, name:'Maryam',        ayat:98}, {n:20, name:'Ta-Ha',          ayat:135},
        {n:36, name:'Ya-Sin',        ayat:83}, {n:55, name:'Ar-Rahman',      ayat:78},
        {n:56, name:'Al-Waqiah',     ayat:96}, {n:67, name:'Al-Mulk',        ayat:30},
        {n:78, name:'An-Naba',       ayat:40}, {n:93, name:'Ad-Duha',        ayat:11},
        {n:94, name:"Ash-Sharh",     ayat:8},  {n:95, name:'At-Tin',         ayat:8},
        {n:96, name:'Al-Alaq',       ayat:19}, {n:99, name:'Az-Zalzalah',    ayat:8},
        {n:100,name:'Al-Adiyat',     ayat:11}, {n:101,name:'Al-Qariah',      ayat:11},
        {n:102,name:'At-Takathur',   ayat:8},  {n:103,name:'Al-Asr',         ayat:3},
        {n:104,name:'Al-Humazah',    ayat:9},  {n:105,name:'Al-Fil',         ayat:5},
        {n:106,name:'Quraysh',       ayat:4},  {n:107,name:'Al-Maun',        ayat:7},
        {n:108,name:'Al-Kawthar',    ayat:3},  {n:109,name:'Al-Kafirun',     ayat:6},
        {n:110,name:'An-Nasr',       ayat:3},  {n:111,name:'Al-Masad',       ayat:5},
        {n:112,name:'Al-Ikhlas',     ayat:4},  {n:113,name:'Al-Falaq',       ayat:5},
        {n:114,name:'An-Nas',        ayat:6},
    ];

    const GRADES = [
        { min: 90,  label: 'Mumtaz',       ar: 'ممتاز',       color: '#03ac0e', bg: '#f0fdf4' },
        { min: 75,  label: 'Jayyid Jiddan',ar: 'جيد جداً',    color: '#0891b2', bg: '#eff6ff' },
        { min: 60,  label: 'Jayyid',       ar: 'جيد',         color: '#9333ea', bg: '#faf5ff' },
        { min: 50,  label: 'Maqbul',       ar: 'مقبول',       color: '#f59e0b', bg: '#fefce8' },
        { min: 0,   label: 'Rasib',        ar: 'راسب',        color: '#ef4444', bg: '#fff5f5' },
    ];

    const QUALITY_SCORES = { Lancar: 20, 'Cukup Lancar': 14, 'Kurang Lancar': 7, 'Tidak Lancar': 0 };

    // Sample roster — in production fetched per unit
    const ROSTER = [
        'Ahmad Fauzi','Bilal Hamdani','Fatimah Az-Zahra','Hasan Mubarok',
        'Khadijah Nuraini','Muhammad Ali Ridha','Nisa Rahmawati',
        'Umar Abdullah','Zainab Putri','Abdurrahman Firdaus',
    ];

    let history = JSON.parse(sessionStorage.getItem('tahfizh_history') || '[]');
    function _saveHistory() { sessionStorage.setItem('tahfizh_history', JSON.stringify(history)); }

    // ── Live clock ────────────────────────────────────────────────────────
    let _clockInterval = null;
    function _startClock() {
        _stopClock();
        const el = document.getElementById('tahfizh-clock');
        if (!el) return;
        function tick() {
            const now = new Date();
            const opts = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
            const dateStr = now.toLocaleDateString('id-ID', opts);
            const timeStr = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
            if (el) el.innerText = `${dateStr} | ${timeStr}`;
        }
        tick();
        _clockInterval = setInterval(tick, 1000);
    }
    function _stopClock() { if (_clockInterval) { clearInterval(_clockInterval); _clockInterval = null; } }

    // ── Score calculation ─────────────────────────────────────────────────
    function _calcScore() {
        const tajwid  = parseInt(document.getElementById('slider-tajwid')?.value  || 5);
        const makhraj = parseInt(document.getElementById('slider-makhraj')?.value || 5);
        const mad     = parseInt(document.getElementById('slider-mad')?.value     || 5);
        const quality = document.getElementById('ta-quality')?.value || 'Lancar';

        // Slider contribution: (sum / max) * 80 points
        const sliderScore = ((tajwid + makhraj + mad) / 15) * 80;
        // Quality contribution: 20 points
        const qualityScore = QUALITY_SCORES[quality] ?? 0;
        const total = Math.round(sliderScore + qualityScore);

        const grade = GRADES.find(g => total >= g.min) || GRADES[GRADES.length - 1];

        const scoreEl = document.getElementById('tahfizh-score-value');
        const gradeEl = document.getElementById('tahfizh-score-grade');
        const boxEl   = document.getElementById('tahfizh-score-box');

        if (scoreEl) scoreEl.innerText = total;
        if (gradeEl) gradeEl.innerText = grade.label.toUpperCase();
        if (boxEl) {
            boxEl.style.background = grade.color;
        }

        // Update slider value displays
        ['tajwid','makhraj','mad'].forEach(k => {
            const badge = document.getElementById(`badge-${k}`);
            const slider = document.getElementById(`slider-${k}`);
            if (badge && slider) badge.innerText = slider.value;
        });
    }

    // ── Surah change → update ayat max ───────────────────────────────────
    function onSurahChange() {
        const sel    = document.getElementById('ta-surah');
        const idx    = parseInt(sel?.value ?? 0);
        const surah  = SURAHS[idx];
        const hingga = document.getElementById('ta-hingga');
        const dari   = document.getElementById('ta-dari');
        if (hingga && surah) { hingga.max = surah.ayat; hingga.value = surah.ayat; }
        if (dari   && surah) { dari.max   = surah.ayat; dari.value   = 1; }
    }

    // ── Type toggle (Ziyadah / Murajaah) ─────────────────────────────────
    function setType(type) {
        ['ziyadah','murajaah'].forEach(t => {
            const btn = document.getElementById(`btn-type-${t}`);
            if (!btn) return;
            const active = t === type;
            btn.style.background    = active ? 'var(--green)' : 'transparent';
            btn.style.color         = active ? '#fff' : 'var(--green)';
            btn.style.border        = `2px solid var(--green)`;
            btn.style.fontWeight    = '700';
        });
    }

    // ── Open module ───────────────────────────────────────────────────────
    function openModule() { _renderScreen(); }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-tahfizh');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-tahfizh';
            screen.className = 'pb-4';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        const todayLabel = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
        const todayHistory = history.filter(h => h.date === new Date().toISOString().split('T')[0]);

        screen.innerHTML = `
        <!-- Indigo gradient header matching screenshot -->
        <div style="background:linear-gradient(135deg,#4f46e5 0%,#6d28d9 100%);padding:16px 20px 20px;margin-bottom:0;">
            <div class="d-flex align-items-center gap-2 mb-1">
                <button onclick="EduTahfizh.closeModule()" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                    <i class="fas fa-arrow-left" style="font-size:13px;"></i>
                </button>
                <div class="text-center flex-grow-1">
                    <div class="fw-bold text-white" style="font-size:17px;">Tahfizh Center</div>
                    <div id="tahfizh-clock" style="font-size:11px;color:rgba(255,255,255,0.7);"></div>
                </div>
                <div style="width:32px;"></div><!-- spacer -->
            </div>
        </div>

        <div class="px-3 px-md-4 pt-3" style="max-width:680px;margin:0 auto;">

            <!-- Status Hari Ini -->
            <div class="kit-card p-3 mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="fw-bold" style="font-size:13px;"><i class="fas fa-list-check me-2" style="color:var(--indigo);"></i>Status Hari Ini</div>
                    <span style="font-size:11px;font-weight:700;color:var(--muted);">${todayLabel}</span>
                </div>
                ${todayHistory.length === 0
                    ? '<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px 0;">Belum ada santri yang setor di halaqah ini.</div>'
                    : `<div style="font-size:12px;color:var(--muted);">${todayHistory.length} setoran tercatat hari ini.</div>
                       <div class="d-flex gap-2 flex-wrap mt-2">
                           ${todayHistory.slice(-4).map(h => `
                           <span style="background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;border-radius:20px;font-size:11px;font-weight:700;padding:3px 10px;">
                               ${h.santri} · ${h.surah} · ${h.score}
                           </span>`).join('')}
                       </div>`
                }
            </div>

            <!-- Formulir Setoran -->
            <div class="kit-card p-4 mb-3">
                <div class="fw-bold mb-3" style="font-size:14px;"><i class="fas fa-rocket me-2" style="color:var(--indigo);"></i>Formulir Setoran</div>

                <!-- Santri -->
                <div class="mb-3">
                    <label class="form-label fw-semibold" style="font-size:12px;">Nama Santri</label>
                    <select id="ta-santri" class="form-select">
                        <option value="">— Pilih Santri —</option>
                        ${ROSTER.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>

                <!-- Type toggle -->
                <div class="d-flex gap-0 mb-3" style="border:2px solid var(--green);border-radius:10px;overflow:hidden;">
                    <button id="btn-type-ziyadah"  onclick="EduTahfizh.setType('ziyadah')"
                        style="flex:1;height:40px;border:none;font-size:13px;font-weight:700;cursor:pointer;background:var(--green);color:#fff;transition:all .15s;">
                        Ziyadah
                    </button>
                    <button id="btn-type-murajaah" onclick="EduTahfizh.setType('murajaah')"
                        style="flex:1;height:40px;border:none;font-size:13px;font-weight:700;cursor:pointer;background:transparent;color:var(--green);transition:all .15s;">
                        Murajaah
                    </button>
                </div>

                <!-- Surah -->
                <div class="mb-3">
                    <label class="form-label fw-semibold" style="font-size:12px;">Surah</label>
                    <select id="ta-surah" class="form-select" onchange="EduTahfizh.onSurahChange()">
                        ${SURAHS.map((s,i) => `<option value="${i}">${s.n}. ${s.name}</option>`).join('')}
                    </select>
                </div>

                <!-- Ayat range -->
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <label class="form-label fw-semibold" style="font-size:12px;">Dari Ayat</label>
                        <input id="ta-dari" type="number" class="form-control" value="1" min="1" max="7">
                    </div>
                    <div class="col-6">
                        <label class="form-label fw-semibold" style="font-size:12px;">Hingga Ayat</label>
                        <input id="ta-hingga" type="number" class="form-control" value="7" min="1" max="7">
                    </div>
                </div>

                <!-- Penilaian sliders -->
                <div class="p-3 mb-3" style="background:#f5f3ff;border-radius:12px;border:1.5px solid #e0e7ff;">
                    <div class="fw-bold mb-3" style="font-size:12px;color:var(--indigo);letter-spacing:.04em;text-transform:uppercase;">
                        Penilaian Hafalan (1–5)
                    </div>

                    ${[['tajwid','Tajwid'],['makhraj','Makhraj'],['mad','Mad']].map(([k,label]) => `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label style="font-size:13px;font-weight:600;">${label}</label>
                            <span id="badge-${k}" style="width:26px;height:26px;border-radius:50%;background:var(--indigo);color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;">5</span>
                        </div>
                        <input id="slider-${k}" type="range" min="1" max="5" value="5" class="w-100"
                               oninput="EduTahfizh._calcScore()"
                               style="accent-color:var(--indigo);height:6px;cursor:pointer;">
                        <div class="d-flex justify-content-between" style="font-size:10px;color:var(--muted);margin-top:2px;">
                            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                        </div>
                    </div>`).join('')}

                    <!-- Quality -->
                    <div>
                        <label class="form-label fw-semibold" style="font-size:12px;">Kualitas Bacaan Ziyadah</label>
                        <select id="ta-quality" class="form-select" onchange="EduTahfizh._calcScore()">
                            <option value="Lancar">Lancar</option>
                            <option value="Cukup Lancar">Cukup Lancar</option>
                            <option value="Kurang Lancar">Kurang Lancar</option>
                            <option value="Tidak Lancar">Tidak Lancar</option>
                        </select>
                    </div>
                </div>

                <!-- Score display -->
                <div id="tahfizh-score-box" class="p-4 mb-3 text-center"
                     style="border-radius:14px;background:var(--green);transition:background .3s;">
                    <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:.08em;margin-bottom:4px;">SKOR AKHIR</div>
                    <div id="tahfizh-score-value" style="font-size:52px;font-weight:900;color:#fff;line-height:1;">100</div>
                    <div id="tahfizh-score-grade" style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.15);border-radius:20px;padding:3px 14px;display:inline-block;margin-top:6px;letter-spacing:.06em;">MUMTAZ</div>
                </div>

                <!-- Notes -->
                <div class="mb-4">
                    <label class="form-label fw-semibold" style="font-size:12px;">Catatan Khusus <span style="font-weight:400;color:var(--muted);">(Opsional)</span></label>
                    <textarea id="ta-notes" class="form-control" rows="3" placeholder="Ketik catatan di sini…" style="resize:none;"></textarea>
                </div>

                <!-- Submit -->
                <button onclick="EduTahfizh.simpanSetoran()"
                        style="width:100%;height:48px;background:linear-gradient(135deg,#4f46e5,#6d28d9);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:.02em;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .15s;">
                    <i class="fas fa-save"></i> SIMPAN SETORAN
                </button>
            </div>

            <!-- History -->
            <div class="kit-card p-3 mb-4">
                <div class="fw-bold mb-3" style="font-size:13px;"><i class="fas fa-history me-2" style="color:var(--muted);"></i>Riwayat Input Terakhir</div>
                ${history.length === 0
                    ? `<div class="text-center py-4" style="color:var(--muted);font-size:12px;">
                            <i class="fas fa-inbox" style="font-size:28px;opacity:.3;display:block;margin-bottom:8px;"></i>
                            Belum ada riwayat setoran hari ini.
                       </div>`
                    : `<div class="d-flex flex-column gap-2">
                            ${history.slice().reverse().slice(0,10).map(h => `
                            <div class="d-flex align-items-center gap-2 p-2" style="background:#f8fafc;border-radius:10px;">
                                <div style="width:36px;height:36px;border-radius:10px;background:${h.gradeColor};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;flex-shrink:0;">${h.score}</div>
                                <div class="flex-grow-1 min-w-0">
                                    <div class="fw-bold" style="font-size:12px;">${h.santri}</div>
                                    <div style="font-size:11px;color:var(--muted);">${h.type} · ${h.surah} ${h.dari}–${h.hingga} · ${h.grade}</div>
                                </div>
                                <div style="font-size:10px;color:var(--muted);white-space:nowrap;">${h.time}</div>
                            </div>`).join('')}
                       </div>`
                }
            </div>

        </div>`;

        // Start live clock
        setTimeout(() => _startClock(), 100);
        // Init score display
        setTimeout(() => _calcScore(), 150);
    }

    // ── Save setoran ──────────────────────────────────────────────────────
    function simpanSetoran() {
        const santri  = document.getElementById('ta-santri')?.value;
        const surahIdx= parseInt(document.getElementById('ta-surah')?.value ?? 0);
        const dari    = document.getElementById('ta-dari')?.value;
        const hingga  = document.getElementById('ta-hingga')?.value;
        const notes   = document.getElementById('ta-notes')?.value;
        const quality = document.getElementById('ta-quality')?.value;
        const type    = document.getElementById('btn-type-ziyadah')?.style.background.includes('rgb')
                            ? 'Ziyadah' : 'Murajaah';

        if (!santri) { window.AtlasToast?.show('Pilih nama santri terlebih dahulu.', 'error'); return; }

        const tajwid  = parseInt(document.getElementById('slider-tajwid')?.value  || 5);
        const makhraj = parseInt(document.getElementById('slider-makhraj')?.value || 5);
        const mad     = parseInt(document.getElementById('slider-mad')?.value     || 5);
        const sliderScore = Math.round(((tajwid + makhraj + mad) / 15) * 80);
        const score   = sliderScore + (QUALITY_SCORES[quality] ?? 0);
        const grade   = GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
        const surah   = SURAHS[surahIdx];

        const record = {
            id:         'SET-' + Date.now().toString().slice(-8),
            santri,
            type,
            surah:      `${surah.n}. ${surah.name}`,
            dari,
            hingga,
            tajwid,
            makhraj,
            mad,
            quality,
            score,
            grade:      grade.label,
            gradeColor: grade.color,
            notes,
            date:       new Date().toISOString().split('T')[0],
            time:       new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }),
        };

        history.push(record);
        _saveHistory();

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent('current-user', 'teacher', 'TAHFIZH_SETORAN', record.id,
                `${santri} · ${type} · ${surah.name} · Score:${score} (${grade.label})`);
        }

        window.AtlasToast?.show(`✓ Setoran ${santri} disimpan — Skor ${score} (${grade.label})`, 'success');

        // Reset form
        document.getElementById('ta-santri').value = '';
        document.getElementById('ta-notes').value  = '';
        ['tajwid','makhraj','mad'].forEach(k => {
            const s = document.getElementById(`slider-${k}`);
            if (s) s.value = 5;
        });
        _calcScore();
        _renderScreen(); // refresh history
    }

    // ── Close ─────────────────────────────────────────────────────────────
    function closeModule() {
        _stopClock();
        const screen = document.getElementById('module-tahfizh');
        if (screen) screen.style.display = 'none';
        _showMain();
    }

    function _hideMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = 'none';
        });
        const heroEl = document.querySelector('.tokopedia-hero-carousel'); if (heroEl) heroEl.style.display = 'none';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card'); if (gridCard) gridCard.style.display = 'none';
        const adminBar = document.getElementById('persona-switcher-bar'); if (adminBar) adminBar.style.display = 'none';
    }
    function _showMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = 'block';
        });
        const heroEl = document.querySelector('.tokopedia-hero-carousel'); if (heroEl) heroEl.style.display = 'block';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card'); if (gridCard) gridCard.style.display = 'block';
        const session = window.EduLogin?.getStoredSession?.();
        const adminBar = document.getElementById('persona-switcher-bar');
        if (adminBar && session) adminBar.style.display = session.isSuperadmin ? 'block' : 'none';
    }

    return { openModule, closeModule, setType, onSurahChange, _calcScore, simpanSetoran };
})();
