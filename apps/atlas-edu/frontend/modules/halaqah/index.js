/**
 * Atlas Edu — Absensi Halaqah (Qur'an Circle Attendance)
 * Real working attendance sheet with per-student status marking
 */
window.EduHalaqah = (function () {

    // Sample student roster — in production: fetched from backend
    const roster = [
        { id: 'S001', name: 'Ahmad Fauzi',         juz: 'Juz 3',  kelompok: 'Kelompok A' },
        { id: 'S002', name: 'Bilal Hamdani',        juz: 'Juz 5',  kelompok: 'Kelompok A' },
        { id: 'S003', name: 'Fatimah Az-Zahra',     juz: 'Juz 8',  kelompok: 'Kelompok B' },
        { id: 'S004', name: 'Hasan Mubarok',        juz: 'Juz 2',  kelompok: 'Kelompok A' },
        { id: 'S005', name: 'Khadijah Nuraini',     juz: 'Juz 12', kelompok: 'Kelompok B' },
        { id: 'S006', name: 'Muhammad Ali Ridha',   juz: 'Juz 6',  kelompok: 'Kelompok B' },
        { id: 'S007', name: 'Nisa Rahmawati',       juz: 'Juz 4',  kelompok: 'Kelompok A' },
        { id: 'S008', name: 'Umar Abdullah',        juz: 'Juz 9',  kelompok: 'Kelompok C' },
        { id: 'S009', name: 'Zainab Putri',         juz: 'Juz 7',  kelompok: 'Kelompok C' },
        { id: 'S010', name: 'Abdurrahman Firdaus',  juz: 'Juz 15', kelompok: 'Kelompok C' },
    ];

    const statusLabels = { H: 'Hadir', A: 'Alpha', S: 'Sakit', I: 'Izin', T: 'Terlambat' };
    const statusColors = { H: '#03ac0e', A: '#ef4444', S: '#f59e0b', I: '#0891b2', T: '#9333ea' };

    let sessionData = {}; // { 'S001': 'H', 'S002': 'A', ... }
    let today = new Date().toISOString().split('T')[0];

    function openModule() {
        // Load saved data for today
        const saved = sessionStorage.getItem(`halaqah_${today}`);
        sessionData = saved ? JSON.parse(saved) : {};
        _renderScreen();
    }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-halaqah');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-halaqah';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }

        // Hide other content sections
        _setMainVisibility(false);
        screen.style.display = 'block';

        const summary = _calcSummary();

        screen.innerHTML = `
        <div class="mt-3">
            <!-- Back + Header -->
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduHalaqah.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div>
                    <h5 class="fw-bold mb-0">Absensi Halaqah Qur'an</h5>
                    <div class="text-muted" style="font-size:12px;">${_formatDate(today)}</div>
                </div>
                <div class="ms-auto d-flex gap-2">
                    <input type="date" id="halaqah-date-picker" class="form-control" value="${today}" style="width:145px;font-size:12px;" onchange="EduHalaqah.changeDate(this.value)">
                    <button onclick="EduHalaqah.saveAttendance()" style="background:var(--green);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;">
                        <i class="fas fa-save me-1"></i>Simpan
                    </button>
                </div>
            </div>

            <!-- Summary Pills -->
            <div class="d-flex gap-2 flex-wrap mb-3">
                ${Object.entries(statusLabels).map(([k, v]) => `
                <div class="d-flex align-items-center gap-2 px-3 py-2" style="background:#fff;border:1.5px solid ${statusColors[k]}22;border-radius:10px;">
                    <span style="width:10px;height:10px;border-radius:50%;background:${statusColors[k]};display:inline-block;"></span>
                    <span style="font-size:12px;font-weight:700;">${v}</span>
                    <span style="font-size:13px;font-weight:800;color:${statusColors[k]};" id="sum-${k}">${summary[k]}</span>
                </div>`).join('')}
                <div class="ms-auto d-flex align-items-center">
                    <input type="text" placeholder="Cari santri…" oninput="EduHalaqah.filterRoster(this.value)" class="form-control" style="width:150px;font-size:12px;">
                </div>
            </div>

            <!-- Attendance Table -->
            <div class="kit-card" style="overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table class="table table-hover mb-0" id="halaqah-table">
                        <thead style="background:#f8fafc;">
                            <tr>
                                <th>No</th>
                                <th>Nama Santri</th>
                                <th>Juz</th>
                                <th>Kelompok</th>
                                <th class="text-center">Status</th>
                                <th>Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${roster.map((s, i) => _renderRow(s, i)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Batch Actions -->
            <div class="d-flex gap-2 flex-wrap mt-3">
                <button onclick="EduHalaqah.markAll('H')" style="border:1.5px solid #03ac0e;color:#03ac0e;background:#f0fdf4;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">✓ Hadir Semua</button>
                <button onclick="EduHalaqah.exportSummary()" style="border:1.5px solid var(--border);color:var(--text-light);background:#fff;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-file-excel me-1"></i>Export Rekap</button>
            </div>
        </div>
        `;
    }

    function _renderRow(s, i) {
        const status = sessionData[s.id] || '';
        const statusBtns = Object.entries(statusLabels).map(([k, v]) => `
            <button onclick="EduHalaqah.setStatus('${s.id}','${k}')"
                style="min-width:38px;height:32px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;
                       border:1.5px solid ${k===status ? statusColors[k] : 'var(--border)'};
                       background:${k===status ? statusColors[k] : '#fff'};
                       color:${k===status ? '#fff' : 'var(--muted)'};">${k}</button>
        `).join('');
        return `
        <tr id="row-${s.id}">
            <td style="color:var(--muted);font-size:12px;">${i+1}</td>
            <td class="fw-semibold" style="font-size:13px;">${s.name}</td>
            <td style="font-size:12px;color:var(--muted);">${s.juz}</td>
            <td style="font-size:12px;color:var(--muted);">${s.kelompok}</td>
            <td>
                <div class="d-flex gap-1 justify-content-center flex-wrap">${statusBtns}</div>
            </td>
            <td>
                <input type="text" placeholder="Catatan…" id="note-${s.id}"
                    style="border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:12px;width:120px;"
                    value="${sessionStorage.getItem(`note_${today}_${s.id}`) || ''}">
            </td>
        </tr>`;
    }

    function setStatus(studentId, status) {
        sessionData[studentId] = status;
        sessionStorage.setItem(`halaqah_${today}`, JSON.stringify(sessionData));
        // Re-render that row's buttons inline
        const row = document.getElementById(`row-${studentId}`);
        if (!row) return;
        const student = roster.find(s => s.id === studentId);
        const i = roster.indexOf(student);
        row.outerHTML = _renderRow(student, i);
        // Update summary
        const summary = _calcSummary();
        Object.keys(statusLabels).forEach(k => {
            const el = document.getElementById(`sum-${k}`);
            if (el) el.innerText = summary[k];
        });
    }

    function markAll(status) {
        roster.forEach(s => { sessionData[s.id] = status; });
        sessionStorage.setItem(`halaqah_${today}`, JSON.stringify(sessionData));
        _renderScreen();
    }

    function saveAttendance() {
        // Save notes
        roster.forEach(s => {
            const noteEl = document.getElementById(`note-${s.id}`);
            if (noteEl) sessionStorage.setItem(`note_${today}_${s.id}`, noteEl.value);
        });
        sessionStorage.setItem(`halaqah_${today}`, JSON.stringify(sessionData));
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','teacher','HALAQAH_SAVED',today,`Attendance saved for ${today}`);
        _showToast('Absensi berhasil disimpan.', 'success');
    }

    function changeDate(date) {
        today = date;
        const saved = sessionStorage.getItem(`halaqah_${today}`);
        sessionData = saved ? JSON.parse(saved) : {};
        _renderScreen();
    }

    function filterRoster(query) {
        const rows = document.querySelectorAll('#halaqah-table tbody tr');
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)')?.innerText || '';
            row.style.display = name.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    function exportSummary() {
        const summary = _calcSummary();
        _showToast(`Rekap: Hadir ${summary.H} · Alpha ${summary.A} · Sakit ${summary.S} · Izin ${summary.I} · Terlambat ${summary.T}`, 'info');
    }

    function closeModule() {
        const screen = document.getElementById('module-halaqah');
        if (screen) screen.style.display = 'none';
        _setMainVisibility(true);
    }

    function _calcSummary() {
        const s = { H:0, A:0, S:0, I:0, T:0 };
        Object.values(sessionData).forEach(v => { if (s[v] !== undefined) s[v]++; });
        return s;
    }

    function _formatDate(d) {
        return new Date(d).toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    }

    function _setMainVisibility(show) {
        ['screen-director','mgmt-screen-curriculum','template-cardgrid-container','.tokopedia-hero-carousel'].forEach(sel => {
            const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
            if (el) el.closest?.('.kit-card') ? el.closest('.kit-card').style.display = show ? 'block' : 'none' : (el.style.display = show ? 'block' : 'none');
        });
        const heroEl = document.querySelector('.tokopedia-hero-carousel');
        if (heroEl) heroEl.style.display = show ? 'block' : 'none';
        const directorEl = document.getElementById('screen-director');
        if (directorEl) directorEl.style.display = show ? 'block' : 'none';
        const currEl = document.getElementById('mgmt-screen-curriculum');
        if (currEl) currEl.style.display = show ? 'block' : 'none';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card');
        if (gridCard) gridCard.style.display = show ? 'block' : 'none';
        const adminBar = document.getElementById('persona-switcher-bar');
        if (adminBar && show) { /* keep original state */ }
    }

    function _showToast(msg, type) {
        let toastEl = document.getElementById('atlas-toast');
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.id = 'atlas-toast';
            toastEl.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:9999;min-width:260px;max-width:90vw;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;text-align:center;transition:all .3s;pointer-events:none;';
            document.body.appendChild(toastEl);
        }
        const bg = type === 'success' ? '#03ac0e' : type === 'error' ? '#ef4444' : '#1a1a2e';
        toastEl.style.background = bg;
        toastEl.style.color = '#fff';
        toastEl.style.boxShadow = `0 4px 20px ${bg}44`;
        toastEl.style.opacity = '1';
        toastEl.innerText = msg;
        setTimeout(() => { toastEl.style.opacity = '0'; }, 3000);
    }

    // Expose toast globally for other modules
    window.AtlasToast = { show: _showToast };

    return { openModule, closeModule, setStatus, markAll, saveAttendance, changeDate, filterRoster, exportSummary };
})();
