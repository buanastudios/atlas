/**
 * Atlas Edu — Tahun Ajaran (Academic Year Period) Manager
 * Settings module: add, activate, lock, and delete academic year periods.
 * Data stored in localStorage for institutional persistence across sessions.
 *
 * Business rules:
 *   • Only ONE period may be AKTIF at a time.
 *   • A LOCKED period cannot be activated, deleted, or modified.
 *   • Year format: YYYY/YYYY where second year = first year + 1.
 *   • Deleting an AKTIF period is blocked — deactivate first.
 *
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduTahunAjaran = (function () {

    const STORE_KEY = 'atlas_tahun_ajaran';

    // ── Seed data (first load) ────────────────────────────────────────────
    function _defaultData() {
        return [
            {
                id:        'TA-001',
                periode:   '2026/2027',
                semester:  'Ganjil',
                mulai:     '2026-07-01',
                selesai:   '2026-12-31',
                status:    'aktif',   // 'aktif' | 'nonaktif'
                locked:    true,
                createdAt: '2026-06-01',
            },
            {
                id:        'TA-002',
                periode:   '2026/2027',
                semester:  'Genap',
                mulai:     '2027-01-01',
                selesai:   '2027-06-30',
                status:    'nonaktif',
                locked:    false,
                createdAt: '2026-06-01',
            },
        ];
    }

    function _load() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : _defaultData();
        } catch (_) { return _defaultData(); }
    }

    function _save(data) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
    }

    // ── Open / render ────────────────────────────────────────────────────
    function openModule() {
        _renderScreen();
    }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-tahun-ajaran');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-tahun-ajaran';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        const data = _load();

        screen.innerHTML = `
        <div class="mt-3">

            <!-- Page Header -->
            <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                    <div class="pwa-app-icon icon-gradient-indigo" style="width:42px;height:42px;font-size:18px;border-radius:12px;margin:0;flex-shrink:0;">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold mb-0">Tahun Ajaran</h5>
                        <div style="font-size:12px;color:var(--muted);">Atur periode akademik sekolah</div>
                    </div>
                </div>
                <button onclick="EduTahunAjaran.closeModule()"
                        style="border:1.5px solid var(--border);background:#fff;color:var(--text-light);border-radius:9px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;">
                    <i class="fas fa-arrow-left me-1"></i>Kembali ke Dashboard
                </button>
            </div>

            <!-- Two-panel layout -->
            <div class="row g-3 align-items-start">

                <!-- LEFT: Add form -->
                <div class="col-12 col-md-4">
                    <div class="kit-card p-4">
                        <div class="fw-bold mb-3" style="font-size:14px;">Tambah Periode Baru</div>

                        <form onsubmit="EduTahunAjaran.savePeriode(event)" novalidate>

                            <div class="mb-3">
                                <label class="form-label fw-semibold" style="font-size:12px;">Tahun Ajaran <span style="color:var(--rose);">*</span></label>
                                <input id="ta-periode" type="text" class="form-control"
                                       placeholder="Cth: 2027/2028"
                                       pattern="^\\d{4}/\\d{4}$"
                                       oninput="EduTahunAjaran.validatePeriode(this)"
                                       required>
                                <div id="ta-periode-hint" style="font-size:11px;color:var(--muted);margin-top:4px;">
                                    Tahun kedua harus +1 dari tahun pertama.
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold" style="font-size:12px;">Semester <span style="color:var(--rose);">*</span></label>
                                <select id="ta-semester" class="form-select" required>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                    <option value="Pendek">Pendek (Intensif)</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold" style="font-size:12px;">Tanggal Mulai <span style="color:var(--rose);">*</span></label>
                                <input id="ta-mulai" type="date" class="form-control" required>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold" style="font-size:12px;">Tanggal Selesai <span style="color:var(--rose);">*</span></label>
                                <input id="ta-selesai" type="date" class="form-control" required>
                            </div>

                            <button type="submit" class="btn-primary-atlas w-100 justify-content-center"
                                    style="border-radius:10px;height:44px;">
                                <i class="fas fa-plus"></i>Simpan Periode
                            </button>
                        </form>
                    </div>
                </div>

                <!-- RIGHT: Period list -->
                <div class="col-12 col-md-8">
                    <div class="kit-card" style="overflow:hidden;">
                        <div class="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                            <span class="fw-bold" style="font-size:14px;">Daftar Tahun Ajaran</span>
                            <span style="font-size:12px;color:var(--muted);">${data.length} periode</span>
                        </div>

                        ${data.length === 0
                            ? '<div class="p-5 text-center text-muted" style="font-size:13px;">Belum ada periode. Tambahkan periode pertama.</div>'
                            : `<div style="overflow-x:auto;">
                                <table class="table mb-0" id="ta-table">
                                    <thead style="background:#f8fafc;">
                                        <tr>
                                            <th>Periode</th>
                                            <th>Semester</th>
                                            <th>Rentang Waktu</th>
                                            <th>Status</th>
                                            <th class="text-end">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.map(p => _renderRow(p)).join('')}
                                    </tbody>
                                </table>
                               </div>`
                        }
                    </div>

                    <!-- Legend -->
                    <div class="d-flex gap-3 mt-3 flex-wrap">
                        <div class="d-flex align-items-center gap-1" style="font-size:11px;color:var(--muted);">
                            <i class="fas fa-power-off" style="color:#03ac0e;"></i> Aktifkan / Non-aktifkan
                        </div>
                        <div class="d-flex align-items-center gap-1" style="font-size:11px;color:var(--muted);">
                            <i class="fas fa-lock" style="color:#f59e0b;"></i> Kunci periode (mencegah perubahan)
                        </div>
                        <div class="d-flex align-items-center gap-1" style="font-size:11px;color:var(--muted);">
                            <i class="fas fa-trash-alt" style="color:#ef4444;"></i> Hapus periode (harus non-aktif)
                        </div>
                    </div>
                </div>

            </div><!-- /row -->
        </div>`;
    }

    // ── Row renderer ──────────────────────────────────────────────────────
    function _renderRow(p) {
        const isAktif   = p.status === 'aktif';
        const isLocked  = p.locked;
        const fmt       = d => d ? d.split('-').reverse().join('/') : '—';

        const rowBg     = isAktif ? 'background:#f0fdf4;' : '';
        const rowBorder = isAktif ? 'border-left:3px solid #03ac0e;' : '';

        const statusBadge = isAktif
            ? `<span style="background:#03ac0e;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:4px;">
                   <i class="fas fa-check-circle"></i>AKTIF
               </span>`
            : `<span style="background:#e5e7eb;color:#6b7280;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">Non-Aktif</span>`;

        const runningLabel = isAktif
            ? `<span style="font-size:11px;font-weight:700;color:#03ac0e;margin-left:6px;">Sedang Berjalan</span>`
            : '';

        // Action buttons
        const btnActivate = `
            <button title="${isAktif ? 'Non-aktifkan' : 'Aktifkan'}"
                    onclick="EduTahunAjaran.toggleAktif('${p.id}')"
                    ${isLocked ? 'disabled' : ''}
                    style="width:32px;height:32px;border-radius:7px;border:1.5px solid ${isAktif?'#03ac0e':'var(--border)'};background:${isAktif?'#f0fdf4':'#fff'};color:${isAktif?'#03ac0e':'var(--muted)'};cursor:${isLocked?'not-allowed':'pointer'};opacity:${isLocked?'.45':'1'};display:inline-flex;align-items:center;justify-content:center;">
                <i class="fas fa-power-off" style="font-size:12px;"></i>
            </button>`;

        const btnLock = `
            <button title="${isLocked ? 'Buka kunci' : 'Kunci periode'}"
                    onclick="EduTahunAjaran.toggleLock('${p.id}')"
                    style="width:32px;height:32px;border-radius:7px;border:1.5px solid ${isLocked?'#f59e0b':'var(--border)'};background:${isLocked?'#fefce8':'#fff'};color:${isLocked?'#b45309':'var(--muted)'};cursor:pointer;display:inline-flex;align-items:center;justify-content:center;">
                <i class="fas fa-${isLocked?'lock':'unlock'}" style="font-size:12px;"></i>
            </button>`;

        const btnDelete = `
            <button title="Hapus periode"
                    onclick="EduTahunAjaran.deletePeriode('${p.id}')"
                    ${isAktif || isLocked ? 'disabled' : ''}
                    style="width:32px;height:32px;border-radius:7px;border:1.5px solid ${(!isAktif&&!isLocked)?'#fecaca':'var(--border)'};background:${(!isAktif&&!isLocked)?'#fff5f5':'#fff'};color:${(!isAktif&&!isLocked)?'#ef4444':'#d1d5db'};cursor:${(isAktif||isLocked)?'not-allowed':'pointer'};opacity:${(isAktif||isLocked)?'.4':'1'};display:inline-flex;align-items:center;justify-content:center;">
                <i class="fas fa-trash-alt" style="font-size:12px;"></i>
            </button>`;

        return `
        <tr style="${rowBg}${rowBorder}">
            <td class="fw-bold" style="font-size:14px;vertical-align:middle;">${p.periode}</td>
            <td style="font-size:13px;font-weight:${isAktif?'700':'400'};color:${isAktif?'#03ac0e':'var(--text)'};vertical-align:middle;">${p.semester}</td>
            <td style="font-size:12px;color:var(--muted);vertical-align:middle;white-space:nowrap;">${fmt(p.mulai)} s.d ${fmt(p.selesai)}</td>
            <td style="vertical-align:middle;">
                ${statusBadge}${runningLabel}
            </td>
            <td style="text-align:right;vertical-align:middle;">
                <div class="d-flex gap-1 justify-content-end">
                    ${btnActivate}
                    ${btnLock}
                    ${btnDelete}
                </div>
            </td>
        </tr>`;
    }

    // ── Form validation ───────────────────────────────────────────────────
    function validatePeriode(input) {
        const hint = document.getElementById('ta-periode-hint');
        const val  = input.value.trim();
        const match = val.match(/^(\d{4})\/(\d{4})$/);
        if (!match) {
            input.style.borderColor = 'var(--rose)';
            if (hint) { hint.innerText = 'Format harus YYYY/YYYY'; hint.style.color = 'var(--rose)'; }
            return false;
        }
        const y1 = parseInt(match[1]), y2 = parseInt(match[2]);
        if (y2 !== y1 + 1) {
            input.style.borderColor = 'var(--rose)';
            if (hint) { hint.innerText = `Tahun kedua harus ${y1 + 1}, bukan ${y2}.`; hint.style.color = 'var(--rose)'; }
            return false;
        }
        input.style.borderColor = 'var(--green)';
        if (hint) { hint.innerText = '✓ Format valid.'; hint.style.color = 'var(--green)'; }
        return true;
    }

    // ── Save new period ───────────────────────────────────────────────────
    function savePeriode(e) {
        e.preventDefault();

        const periodeEl  = document.getElementById('ta-periode');
        const semesterEl = document.getElementById('ta-semester');
        const mulaiEl    = document.getElementById('ta-mulai');
        const selesaiEl  = document.getElementById('ta-selesai');

        if (!validatePeriode(periodeEl)) {
            window.AtlasToast?.show('Format tahun ajaran tidak valid.', 'error');
            return;
        }

        const periode  = periodeEl.value.trim();
        const semester = semesterEl.value;
        const mulai    = mulaiEl.value;
        const selesai  = selesaiEl.value;

        if (!mulai || !selesai) {
            window.AtlasToast?.show('Tanggal mulai dan selesai wajib diisi.', 'error');
            return;
        }
        if (mulai >= selesai) {
            window.AtlasToast?.show('Tanggal selesai harus setelah tanggal mulai.', 'error');
            return;
        }

        const data = _load();

        // Check duplicate
        const exists = data.find(p => p.periode === periode && p.semester === semester);
        if (exists) {
            window.AtlasToast?.show(`Periode ${periode} Semester ${semester} sudah ada.`, 'error');
            return;
        }

        const newPeriode = {
            id:        'TA-' + Date.now().toString().slice(-6),
            periode,
            semester,
            mulai,
            selesai,
            status:    'nonaktif',
            locked:    false,
            createdAt: new Date().toISOString().split('T')[0],
        };

        data.unshift(newPeriode);
        _save(data);

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent('current-user', 'admin', 'TAHUN_AJARAN_ADD', newPeriode.id,
                `Added ${periode} Semester ${semester}`);
        }

        window.AtlasToast?.show(`Periode ${periode} Semester ${semester} berhasil ditambahkan.`, 'success');
        _renderScreen();
    }

    // ── Toggle active status (only one active at a time) ─────────────────
    function toggleAktif(id) {
        const data    = _load();
        const target  = data.find(p => p.id === id);
        if (!target || target.locked) return;

        if (target.status === 'aktif') {
            // Deactivate
            target.status = 'nonaktif';
            window.AtlasToast?.show(`Periode ${target.periode} ${target.semester} dinonaktifkan.`, 'info');
        } else {
            // Deactivate all others first — only one AKTIF allowed
            data.forEach(p => { p.status = 'nonaktif'; });
            target.status = 'aktif';
            window.AtlasToast?.show(`Periode ${target.periode} ${target.semester} sekarang AKTIF.`, 'success');
        }

        _save(data);

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent('current-user', 'admin', 'TAHUN_AJARAN_TOGGLE', id,
                `${target.periode} ${target.semester} → ${target.status}`);
        }

        // Update hero banner in main app
        _syncActivePeriodToApp(data);
        _renderScreen();
    }

    // ── Toggle lock ───────────────────────────────────────────────────────
    function toggleLock(id) {
        const data   = _load();
        const target = data.find(p => p.id === id);
        if (!target) return;

        const willLock = !target.locked;
        if (!willLock && target.status === 'aktif') {
            // Allow unlocking even when active
        }

        target.locked = willLock;
        _save(data);

        window.AtlasToast?.show(
            willLock
                ? `Periode ${target.periode} ${target.semester} dikunci.`
                : `Kunci periode ${target.periode} ${target.semester} dibuka.`,
            'info'
        );

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent('current-user', 'admin', 'TAHUN_AJARAN_LOCK', id,
                `${target.periode} locked=${willLock}`);
        }

        _renderScreen();
    }

    // ── Delete ────────────────────────────────────────────────────────────
    function deletePeriode(id) {
        const data   = _load();
        const target = data.find(p => p.id === id);
        if (!target) return;

        if (target.status === 'aktif') {
            window.AtlasToast?.show('Tidak dapat menghapus periode yang sedang AKTIF. Non-aktifkan terlebih dahulu.', 'error');
            return;
        }
        if (target.locked) {
            window.AtlasToast?.show('Periode dikunci. Buka kunci sebelum menghapus.', 'error');
            return;
        }

        if (!confirm(`Hapus periode ${target.periode} Semester ${target.semester}? Data yang terkait mungkin terpengaruh.`)) return;

        const updated = data.filter(p => p.id !== id);
        _save(updated);

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent('current-user', 'admin', 'TAHUN_AJARAN_DELETE', id,
                `Deleted ${target.periode} ${target.semester}`);
        }

        window.AtlasToast?.show(`Periode ${target.periode} ${target.semester} dihapus.`, 'info');
        _renderScreen();
    }

    // ── Sync active period label to app hero banner ───────────────────────
    function _syncActivePeriodToApp(data) {
        const active = data.find(p => p.status === 'aktif');
        if (!active) return;
        const heroCtx = document.getElementById('hero-unit-context');
        // Append active period info to hero subtitle without overwriting unit name
        // The unit name is set separately by applySessionUnit
    }

    // ── Public helper: get current active period ──────────────────────────
    function getActivePeriod() {
        return _load().find(p => p.status === 'aktif') || null;
    }

    // ── Close / return to dashboard ───────────────────────────────────────
    function closeModule() {
        const screen = document.getElementById('module-tahun-ajaran');
        if (screen) screen.style.display = 'none';
        _showMain();
    }

    function _hideMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const heroEl   = document.querySelector('.tokopedia-hero-carousel');
        if (heroEl) heroEl.style.display = 'none';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card');
        if (gridCard) gridCard.style.display = 'none';
        const adminBar = document.getElementById('persona-switcher-bar');
        if (adminBar) adminBar.style.display = 'none';
    }

    function _showMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
        const heroEl   = document.querySelector('.tokopedia-hero-carousel');
        if (heroEl) heroEl.style.display = 'block';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card');
        if (gridCard) gridCard.style.display = 'block';
        const session  = window.EduLogin?.getStoredSession?.();
        const adminBar = document.getElementById('persona-switcher-bar');
        if (adminBar && session) adminBar.style.display = session.isSuperadmin ? 'block' : 'none';
    }

    return {
        openModule,
        closeModule,
        savePeriode,
        validatePeriode,
        toggleAktif,
        toggleLock,
        deletePeriode,
        getActivePeriod,
    };
})();
