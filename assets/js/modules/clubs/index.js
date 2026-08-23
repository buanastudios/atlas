/**
 * Atlas Edu — Extracurricular & Sports Management (Clubs)
 * Integrated with backend APIs for Aikido, Taekwondo, Archery, Robotics, Coding, Graphic Design, etc.
 */
window.EduClubs = (function () {

    let clubs = [];
    let members = [];
    let achievements = [];
    let activeCategory = 'ALL';
    let isLoading = false;

    const categories = ['ALL', 'Martial Arts', 'Sports', 'Tech & STEM', 'Arts & Design', 'Communication'];

    function openModule() {
        if (clubs.length === 0) {
            clubs = [
                { id: 1, nama: 'Aikido & Self Defense', kategori: 'Martial Arts', pembina: 'Sensei Hamzah', jadwal: 'Sabtu 15:30', max_anggota: 25 },
                { id: 2, nama: 'Panahan Sunnah (Archery Club)', kategori: 'Sports', pembina: 'Ustadz Salman', jadwal: 'Jumat 15:30', max_anggota: 30 },
                { id: 3, nama: 'Robotics & Automation', kategori: 'Tech & STEM', pembina: 'Ir. Farhan', jadwal: 'Rabu 15:30', max_anggota: 20 },
                { id: 4, nama: 'Coding & Game Development', kategori: 'Tech & STEM', pembina: 'Sakti Buana', jadwal: 'Kamis 15:30', max_anggota: 25 },
                { id: 5, nama: 'Desain Grafis & Digital Art', kategori: 'Arts & Design', pembina: 'Ustadzah Maryam', jadwal: 'Selasa 15:30', max_anggota: 20 },
                { id: 6, nama: 'Public Speaking & Debate', kategori: 'Communication', pembina: 'Ustadz Bilal', jadwal: 'Senin 15:30', max_anggota: 30 }
            ];
        }
        _renderScreen();
        _loadData();
    }

    async function _loadData() {
        try {
            const res = await fetch('/api/clubs');
            const data = await res.json();
            if (data.success && data.clubs && data.clubs.length > 0) {
                clubs = data.clubs;
                members = data.members || [];
                achievements = data.achievements || [];
            }
            _renderScreen();
        } catch (err) {
            console.warn('[EduClubs] API fetch background notice:', err);
        }
    }

    function _renderScreen() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-clubs');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-clubs';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        const filteredClubs = activeCategory === 'ALL' ? clubs : clubs.filter(c => c.kategori === activeCategory);

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <button onclick="EduClubs.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">Extracurricular &amp; Sports Hub</h5>
                    <div style="font-size:12px;color:var(--muted);">${clubs.length} Klub Aktif · Aikido, Panahan, Robotics, Graphic Design, etc.</div>
                </div>
                <button onclick="EduClubs.openEnrollModal()" style="background:var(--green);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;">
                    <i class="fas fa-user-plus me-1"></i>Daftar Ekskul
                </button>
            </div>

            <!-- Category Filter Tabs -->
            <div class="super-app-pill-bar mb-3 d-flex gap-2 overflow-auto" style="scrollbar-width:none;">
                ${categories.map(cat => `
                <button onclick="EduClubs.setCategory('${cat}')"
                    style="border-radius:20px;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .15s;
                           border:1.5px solid ${cat === activeCategory ? 'var(--green)' : 'var(--border)'};
                           background:${cat === activeCategory ? 'var(--green)' : '#fff'};
                           color:${cat === activeCategory ? '#fff' : 'var(--text-light)'};">
                    ${cat}
                </button>`).join('')}
            </div>

            <!-- Club Cards Grid -->
            <div class="row g-3 mb-4">
                ${filteredClubs.map(c => `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="kit-card p-3 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <div class="pwa-app-icon icon-gradient-emerald" style="width:42px;height:42px;font-size:18px;border-radius:12px;flex-shrink:0;margin:0;">
                                    <i class="fas ${c.kategori === 'Martial Arts' ? 'fa-user-ninja' : c.kategori === 'Tech & STEM' ? 'fa-robot' : c.kategori === 'Arts & Design' ? 'fa-paint-brush' : 'fa-trophy'}"></i>
                                </div>
                                <div style="min-width:0;">
                                    <div class="fw-bold text-truncate" style="font-size:14px;">${c.nama}</div>
                                    <div style="font-size:11px;color:var(--muted);">${c.jadwal || 'Jadwal Mingguan'} · ${c.lokasi || 'Kampus'}</div>
                                </div>
                            </div>
                            <div class="badge bg-light text-dark border mb-2">${c.kategori}</div>
                            <div style="font-size:12px;color:var(--text-light);">Anggota Aktif: <strong style="color:var(--green);">${c.total_members || 0} Santri</strong></div>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button onclick="EduClubs.openEnrollModal(${c.id})" style="flex:1;border:1.5px solid var(--green);background:#f0fdf4;color:var(--green);border-radius:8px;padding:7px;font-size:12px;font-weight:700;cursor:pointer;">
                                <i class="fas fa-plus me-1"></i>Gabung
                            </button>
                            <button onclick="EduClubs.showAchievementModal(${c.id})" style="flex:1;border:1.5px solid var(--border);background:#fff;color:var(--text);border-radius:8px;padding:7px;font-size:12px;font-weight:700;cursor:pointer;">
                                <i class="fas fa-medal me-1"></i>Prestasi
                            </button>
                        </div>
                    </div>
                </div>`).join('')}
            </div>

            <!-- Active Roster & Trophy History -->
            <div class="row g-3">
                <div class="col-12 col-lg-7">
                    <div class="kit-card p-3">
                        <h6 class="fw-bold mb-3"><i class="fas fa-users me-2 text-green"></i>Daftar Anggota &amp; Sabuk/Tingkat</h6>
                        <div style="overflow-x:auto;">
                            <table class="table table-hover mb-0" style="font-size:12px;">
                                <thead><tr><th>Santri</th><th>Ekskul</th><th>Tingkat / Sabuk</th><th>Aksi</th></tr></thead>
                                <tbody>
                                    ${members.map(m => `
                                    <tr>
                                        <td class="fw-semibold">${m.student_name || 'Santri'} <div class="text-muted small">${m.kelas || ''}</div></td>
                                        <td>${m.club_name || '-'}</td>
                                        <td><span class="badge bg-success">${m.tingkat_sabuk || 'Sabuk Putih'}</span></td>
                                        <td>
                                            <button onclick="EduClubs.updateRank(${m.id})" class="btn btn-sm btn-outline-secondary" style="font-size:10px;">Naik Sabuk</button>
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-5">
                    <div class="kit-card p-3">
                        <h6 class="fw-bold mb-3"><i class="fas fa-award me-2 text-amber"></i>Galeri Prestasi &amp; Kejuaraan</h6>
                        ${achievements.length === 0 ? '<div class="text-muted small">Belum ada catatan kejuaraan.</div>' : ''}
                        <div class="d-flex flex-column gap-2">
                            ${achievements.map(a => `
                            <div class="p-2 border rounded" style="background:#fffbe0;border-color:#fef08a !important;">
                                <div class="fw-bold text-amber" style="font-size:13px;"><i class="fas fa-trophy me-1"></i>${a.peringkat || 'Juara'} — ${a.nama_lomba}</div>
                                <div class="small text-muted">${a.student_name || 'Santri'} · ${a.tingkat || 'Sekolah'} (${a.tanggal})</div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function setCategory(cat) {
        activeCategory = cat;
        _renderScreen();
    }

    async function openEnrollModal(clubId) {
        const selectedClub = clubId ? clubs.find(c => c.id === clubId) : clubs[0];

        const clubOptions = clubs.map(c => `<option value="${c.id}" ${c.id === clubId ? 'selected' : ''}>${c.nama} (${c.kategori})</option>`).join('');

        const modalHtml = `
        <div id="enroll-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
            <div class="kit-card p-4 style="width:100%;max-width:440px;background:#fff;border-radius:16px;">
                <h5 class="fw-bold mb-3">Pendaftaran Ekstrakurikuler</h5>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Pilih Klub Ekskul</label>
                    <select id="enroll-club-id" class="form-select">${clubOptions}</select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">ID / ID Student (1-5)</label>
                    <input type="number" id="enroll-student-id" class="form-control" value="1" min="1" max="100">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Tingkat Sabuk / Skill Initial</label>
                    <input type="text" id="enroll-sabuk" class="form-control" value="Pemula / Sabuk Putih">
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button onclick="document.getElementById('enroll-modal').remove()" class="btn btn-light btn-sm fw-bold">Batal</button>
                    <button onclick="EduClubs.submitEnrollment()" class="btn btn-success btn-sm fw-bold">Daftar Sekarang</button>
                </div>
            </div>
        </div>`;

        const existing = document.getElementById('enroll-modal');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    async function submitEnrollment() {
        const club_id = Number(document.getElementById('enroll-club-id').value);
        const student_id = Number(document.getElementById('enroll-student-id').value);
        const tingkat_sabuk = document.getElementById('enroll-sabuk').value;

        try {
            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'enroll', club_id, student_id, tingkat_sabuk })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AtlasToast) AtlasToast.show(data.message, 'success');
                document.getElementById('enroll-modal')?.remove();
                await openModule();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function updateRank(memberId) {
        const newRank = prompt('Masukkan tingkat sabuk / level baru (misal: Sabuk Kuning / Geup 7):', 'Sabuk Kuning');
        if (!newRank) return;

        try {
            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_rank', member_id: memberId, tingkat_sabuk: newRank })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AtlasToast) AtlasToast.show(data.message, 'success');
                await openModule();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function showAchievementModal(clubId) {
        const namaLomba = prompt('Nama Kejuaraan / Lomba:', 'Kejuaraan Aikido & Martial Arts National 2026');
        if (!namaLomba) return;

        try {
            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add_achievement',
                    club_id: clubId,
                    student_id: 1,
                    nama_lomba: namaLomba,
                    tingkat: 'Nasional',
                    peringkat: 'Juara 1 Gold Medal',
                    penyelenggara: 'Federasi Olahraga'
                })
            });
            const data = await res.json();
            if (data.success) {
                if (window.AtlasToast) AtlasToast.show('Prestasi kejuaraan berhasil ditambahkan!', 'success');
                await openModule();
            }
        } catch (err) {
            console.error(err);
        }
    }

    function closeModule() {
        const screen = document.getElementById('module-clubs');
        if (screen) screen.style.display = 'none';
        _showMain();
    }

    function _hideMain() {
        ['screen-director', 'mgmt-screen-curriculum', '.tokopedia-hero-carousel'].forEach(sel => {
            const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
            if (el) el.style.display = 'none';
        });
    }

    function _showMain() {
        ['screen-director', 'mgmt-screen-curriculum', '.tokopedia-hero-carousel'].forEach(sel => {
            const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
            if (el) el.style.display = 'block';
        });
    }

    return { openModule, closeModule, setCategory, openEnrollModal, submitEnrollment, updateRank, showAchievementModal };
})();
