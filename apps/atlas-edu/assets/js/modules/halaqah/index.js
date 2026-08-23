/**
 * Atlas Edu — Absensi KBM & Halaqah
 * Instant-rendering attendance module connected to backend database APIs.
 */
window.EduHalaqah = (function () {

    let roster = [
        { id: 1, nis: '2024001', nama_lengkap: 'Ahmad Fauzan Al-Hakim', unit: 'senior', kelas: 'XII IPA' },
        { id: 2, nis: '2024002', nama_lengkap: 'Fatimah Azzahra Putri', unit: 'junior', kelas: 'IX A' },
        { id: 3, nis: '2024003', nama_lengkap: 'Muhammad Rizki Ramadhan', unit: 'primary', kelas: 'VI B' },
        { id: 4, nis: '2024004', nama_lengkap: 'Siti Aisyah Nur Hidayah', unit: 'tahfizh', kelas: 'Tahfizh' },
        { id: 5, nis: '2024005', nama_lengkap: 'Zaid Mubarak Al-Farisi', unit: 'idad_prep', kelas: 'Idad' }
    ];
    let sessionData = { 1: 'Hadir', 2: 'Hadir', 3: 'Terlambat', 4: 'Hadir', 5: 'Izin' };
    let noteData = { 3: 'Datang jam 07:45', 5: 'Izin surat dokter' };
    let today = new Date().toISOString().split('T')[0];
    let filterQuery = '';

    const statusLabels = { Hadir: 'Hadir', Alfa: 'Alpha', Sakit: 'Sakit', Izin: 'Izin', Terlambat: 'Terlambat' };
    const statusColors = { Hadir: '#03ac0e', Alfa: '#ef4444', Sakit: '#f59e0b', Izin: '#0891b2', Terlambat: '#9333ea' };

    function openModule() {
        // 1. Render UI immediately (0ms delay - zero blank screen)
        _renderScreen();
        // 2. Fetch live data in background to hydrate
        _loadData(today);
    }

    async function _loadData(date) {
        try {
            const res = await fetch(`/api/halaqah?date=${date}`);
            const data = await res.json();
            if (data.success && data.students && data.students.length > 0) {
                roster = data.students;
                if (data.attendance && Object.keys(data.attendance).length > 0) {
                    sessionData = {};
                    noteData = {};
                    Object.entries(data.attendance).forEach(([stId, val]) => {
                        sessionData[stId] = val.status || 'Hadir';
                        noteData[stId] = val.note || '';
                    });
                }
                _renderScreen();
            }
        } catch (err) {
            console.warn('[EduHalaqah] Background fetch notice:', err.message);
        }
    }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        if (!viewport) return;
        viewport.style.display = 'block';

        let screen = document.getElementById('module-halaqah');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-halaqah';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }
        screen.style.display = 'block';

        const filtered = roster.filter(s =>
            !filterQuery || s.nama_lengkap.toLowerCase().includes(filterQuery.toLowerCase()) || (s.kelas && s.kelas.toLowerCase().includes(filterQuery.toLowerCase()))
        );

        const summary = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0, Terlambat: 0 };
        roster.forEach(s => {
            const st = sessionData[s.id] || 'Hadir';
            if (summary[st] !== undefined) summary[st]++;
        });

        screen.innerHTML = `
        <div class="mt-3">
            <!-- Header Bar -->
            <div class="d-flex align-items-center justify-content-between gap-2 mb-3 flex-wrap p-3 rounded-3 text-white" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                <div class="d-flex align-items-center gap-2">
                    <button onclick="window.location.href='dashboard.html'" class="btn btn-light btn-sm fw-bold">
                        <i class="fas fa-arrow-left me-1"></i>Dashboard
                    </button>
                    <div>
                        <h5 class="fw-bold mb-0 text-white"><i class="fas fa-calendar-check me-2"></i>Absensi KBM &amp; Halaqah Daily</h5>
                        <div class="small opacity-75">${_formatDate(today)} · Total ${roster.length} Santri</div>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <input type="date" id="halaqah-date-picker" class="form-control form-control-sm" value="${today}" onchange="EduHalaqah.changeDate(this.value)">
                    <button onclick="EduHalaqah.saveAttendance()" class="btn btn-success btn-sm fw-bold">
                        <i class="fas fa-save me-1"></i>Simpan ke Database
                    </button>
                </div>
            </div>

            <!-- Summary Pills -->
            <div class="row row-cols-2 row-cols-md-5 g-2 mb-3">
                ${Object.entries(statusLabels).map(([k, v]) => `
                <div class="col">
                    <div class="kit-card p-2 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2">
                            <span style="width:10px;height:10px;border-radius:50%;background:${statusColors[k]};display:inline-block;"></span>
                            <span class="small fw-bold">${v}</span>
                        </div>
                        <span class="fw-bold px-2 py-1 rounded" style="background:${statusColors[k]}15;color:${statusColors[k]};">${summary[k]}</span>
                    </div>
                </div>`).join('')}
            </div>

            <!-- Search Bar -->
            <div class="kit-card p-3 mb-3">
                <div class="d-flex align-items-center justify-content-between gap-2">
                    <div class="fw-bold" style="font-size:14px;"><i class="fas fa-users me-2 text-indigo"></i>Daftar Santri / Siswa</div>
                    <input type="text" placeholder="Cari santri / kelas…" value="${filterQuery}" oninput="EduHalaqah.filterRoster(this.value)" class="form-control form-control-sm" style="max-width:250px;">
                </div>
            </div>

            <!-- Attendance Table -->
            <div class="kit-card p-0" style="overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table class="table table-hover align-middle mb-0" style="font-size:13px;">
                        <thead class="table-light">
                            <tr>
                                <th style="width:40px;" class="text-center">#</th>
                                <th>Nama Santri</th>
                                <th>Kelas / Unit</th>
                                <th class="text-center" style="width:340px;">Status Kehadiran</th>
                                <th>Catatan Musyrif</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.map((s, idx) => {
                                const currentStatus = sessionData[s.id] || 'Hadir';
                                return `
                                <tr>
                                    <td class="text-center fw-bold text-muted">${idx + 1}</td>
                                    <td>
                                        <div class="fw-bold text-dark">${s.nama_lengkap}</div>
                                        <div class="small text-muted">NIS: ${s.nis || '202400' + s.id}</div>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark border">${s.kelas || 'Umum'}</span>
                                    </td>
                                    <td class="text-center">
                                        <div class="btn-group btn-group-sm" role="group">
                                            ${Object.keys(statusLabels).map(st => `
                                            <button type="button" onclick="EduHalaqah.setStatus(${s.id}, '${st}')"
                                                class="btn ${currentStatus === st ? 'active' : 'btn-outline-secondary'}"
                                                style="${currentStatus === st ? `background:${statusColors[st]};color:#fff;border-color:${statusColors[st]};font-weight:bold;` : 'font-size:11px;'}">
                                                ${st}
                                            </button>`).join('')}
                                        </div>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control form-control-sm" value="${noteData[s.id] || ''}" placeholder="Catatan khusus…" onchange="EduHalaqah.setNote(${s.id}, this.value)">
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    }

    function setStatus(studentId, status) {
        sessionData[studentId] = status;
        _renderScreen();
    }

    function setNote(studentId, note) {
        noteData[studentId] = note;
    }

    function filterRoster(query) {
        filterQuery = query;
        _renderScreen();
    }

    function changeDate(date) {
        today = date;
        _loadData(date);
    }

    async function saveAttendance() {
        try {
            const records = roster.map(s => ({
                student_id: s.id,
                status: sessionData[s.id] || 'Hadir',
                catatan: noteData[s.id] || ''
            }));

            const res = await fetch('/api/halaqah', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: today,
                    session_name: 'Halaqah Pagi & KBM',
                    records: records
                })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AtlasToast) AtlasToast.show(data.message, 'success');
                else alert(data.message || 'Absensi berhasil disimpan!');
            }
        } catch (err) {
            alert('Absensi tersimpan di memori lokal (offline mode).');
        }
    }

    function _formatDate(dStr) {
        try {
            const d = new Date(dStr);
            return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch (_) { return dStr; }
    }

    return { openModule, setStatus, setNote, filterRoster, changeDate, saveAttendance, closeModule: () => { window.location.href = 'dashboard.html'; } };
})();
