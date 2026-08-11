/**
 * Atlas Edu — Clubs & Ekskul Manager
 * Real member roster, meeting log, attendance
 */
window.EduClubs = (function () {

    let clubs = JSON.parse(sessionStorage.getItem('clubs_data') || 'null') || [
        { id:'CLB001', name:'Robotics Club',      coach:'Ust. Farid',     schedule:'Senin 14:00',  members:[{id:'M1',name:'Ahmad Fauzi',kelas:'VIII A',joined:'2026-01-10'},{id:'M2',name:'Bilal Hamdani',kelas:'VIII A',joined:'2026-01-10'},{id:'M3',name:'Hasan Mubarok',kelas:'VII C',joined:'2026-02-05'}], meetings:[] },
        { id:'CLB002', name:'Tahfidz Qur\'an Club',coach:'Ust. Ahmad',    schedule:'Selasa 07:00', members:[{id:'M4',name:'Fatimah Az-Zahra',kelas:'IX B',joined:'2026-01-12'},{id:'M5',name:'Khadijah Nuraini',kelas:'IX B',joined:'2026-01-12'}], meetings:[] },
        { id:'CLB003', name:'English Debate',     coach:'Ust. Hakim',     schedule:'Rabu 15:30',   members:[{id:'M6',name:'Muhammad Ali Ridha',kelas:'VII A',joined:'2026-03-01'},{id:'M7',name:'Nisa Rahmawati',kelas:'VIII A',joined:'2026-03-01'}], meetings:[] },
        { id:'CLB004', name:'Panahan (Archery)',   coach:'Ust. Salim',    schedule:'Kamis 16:00',  members:[{id:'M8',name:'Umar Abdullah',kelas:'IX C',joined:'2026-01-20'}], meetings:[] },
    ];

    function _save() { sessionStorage.setItem('clubs_data', JSON.stringify(clubs)); }

    let activeClubId = null;

    function openModule() { _renderClubList(); }

    function _renderClubList() {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-clubs');
        if (!screen) { screen = document.createElement('div'); screen.id = 'module-clubs'; screen.className = 'px-3 px-md-4 pb-4'; viewport.appendChild(screen); }
        _hideMain(); screen.style.display = 'block';

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduClubs.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">Clubs & Kegiatan Ekstrakulikuler</h5>
                    <div style="font-size:12px;color:var(--muted);">${clubs.length} club aktif</div>
                </div>
            </div>

            <div class="row g-2">
                ${clubs.map(c => `
                <div class="col-12 col-md-6">
                    <div class="kit-card p-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <div class="pwa-app-icon icon-gradient-emerald" style="width:42px;height:42px;font-size:18px;border-radius:12px;flex-shrink:0;margin:0;">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div>
                                <div class="fw-bold" style="font-size:14px;">${c.name}</div>
                                <div style="font-size:11px;color:var(--muted);">${c.coach} · ${c.schedule}</div>
                            </div>
                            <div class="ms-auto fw-bold" style="font-size:13px;color:var(--teal);">${c.members.length} anggota</div>
                        </div>
                        <div class="d-flex gap-2 mt-2">
                            <button onclick="EduClubs.openClubDetail('${c.id}')" style="flex:1;border:1.5px solid var(--border);background:#fff;color:var(--text);border-radius:8px;padding:8px;font-size:12px;font-weight:700;cursor:pointer;">
                                <i class="fas fa-users me-1"></i>Anggota
                            </button>
                            <button onclick="EduClubs.logMeeting('${c.id}')" style="flex:1;border:1.5px solid var(--green);background:#f0fdf4;color:var(--green);border-radius:8px;padding:8px;font-size:12px;font-weight:700;cursor:pointer;">
                                <i class="fas fa-plus me-1"></i>Catat Pertemuan
                            </button>
                        </div>
                        ${c.meetings.length>0?`<div style="font-size:11px;color:var(--muted);margin-top:8px;">Pertemuan terakhir: ${c.meetings[c.meetings.length-1].date} · ${c.meetings[c.meetings.length-1].topic}</div>`:''}
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    }

    function openClubDetail(clubId) {
        activeClubId = clubId;
        const club = clubs.find(c => c.id === clubId);
        if (!club) return;
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-clubs');

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduClubs._renderClubList()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Semua Club
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">${club.name}</h5>
                    <div style="font-size:12px;color:var(--muted);">${club.coach} · ${club.schedule}</div>
                </div>
                <button onclick="EduClubs.addMember('${clubId}')" style="background:var(--green);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;">
                    <i class="fas fa-user-plus me-1"></i>Tambah
                </button>
            </div>

            <!-- Members Table -->
            <div class="kit-card mb-3" style="overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table class="table table-hover mb-0">
                        <thead style="background:#f8fafc;"><tr><th>No</th><th>Nama</th><th>Kelas</th><th>Bergabung</th><th></th></tr></thead>
                        <tbody>
                            ${club.members.map((m,i) => `
                            <tr>
                                <td style="color:var(--muted);font-size:12px;">${i+1}</td>
                                <td class="fw-semibold" style="font-size:13px;">${m.name}</td>
                                <td style="font-size:12px;color:var(--muted);">${m.kelas}</td>
                                <td style="font-size:12px;color:var(--muted);">${m.joined}</td>
                                <td><button onclick="EduClubs.removeMember('${clubId}','${m.id}')" style="border:1px solid #fecaca;color:#ef4444;background:#fff5f5;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;">Keluarkan</button></td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Meeting Log -->
            <div class="section-heading mb-2" style="font-size:14px;">Log Pertemuan</div>
            ${club.meetings.length===0 ? '<div class="text-muted small kit-card p-3">Belum ada pertemuan tercatat.</div>' : `
            <div class="kit-card" style="overflow:hidden;"><div style="overflow-x:auto;"><table class="table table-hover mb-0">
                <thead style="background:#f8fafc;"><tr><th>Tanggal</th><th>Topik</th><th>Hadir</th></tr></thead>
                <tbody>
                    ${club.meetings.map(m => `
                    <tr>
                        <td style="font-size:12px;">${m.date}</td>
                        <td style="font-size:13px;font-weight:600;">${m.topic}</td>
                        <td style="font-size:12px;color:var(--green);font-weight:700;">${m.attendees} / ${club.members.length}</td>
                    </tr>`).join('')}
                </tbody>
            </table></div></div>`}
        </div>`;
    }

    function addMember(clubId) {
        const club = clubs.find(c => c.id === clubId);
        if (!club) return;
        const name = prompt('Nama santri yang akan ditambahkan:'); if (!name) return;
        const kelas = prompt('Kelas:') || '-';
        club.members.push({ id:'M'+Date.now(), name: name.trim(), kelas, joined: new Date().toISOString().split('T')[0] });
        _save();
        window.AtlasToast?.show(`${name.trim()} berhasil ditambahkan ke ${club.name}.`, 'success');
        openClubDetail(clubId);
    }

    function removeMember(clubId, memberId) {
        const club = clubs.find(c => c.id === clubId);
        if (!club) return;
        const member = club.members.find(m => m.id === memberId);
        if (!member) return;
        if (!confirm(`Keluarkan ${member.name} dari ${club.name}?`)) return;
        club.members = club.members.filter(m => m.id !== memberId);
        _save();
        window.AtlasToast?.show(`${member.name} dikeluarkan dari ${club.name}.`, 'info');
        openClubDetail(clubId);
    }

    function logMeeting(clubId) {
        const club = clubs.find(c => c.id === clubId);
        if (!club) return;
        const topic = prompt(`Topik pertemuan ${club.name}:`); if (!topic) return;
        const attendees = parseInt(prompt(`Jumlah hadir (maks ${club.members.length}):`) || club.members.length);
        club.meetings.push({ date: new Date().toLocaleDateString('id-ID'), topic, attendees: Math.min(attendees, club.members.length) });
        _save();
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','teacher','CLUB_MEETING',clubId,`${club.name}: ${topic}`);
        window.AtlasToast?.show(`Pertemuan "${topic}" berhasil dicatat.`, 'success');
        _renderClubList();
    }

    function closeModule() {
        const screen = document.getElementById('module-clubs');
        if (screen) screen.style.display = 'none';
        _showMain();
    }

    function _hideMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        const heroEl = document.querySelector('.tokopedia-hero-carousel'); if (heroEl) heroEl.style.display = 'none';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card'); if (gridCard) gridCard.style.display = 'none';
    }
    function _showMain() {
        ['screen-director','mgmt-screen-curriculum'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'block'; });
        const heroEl = document.querySelector('.tokopedia-hero-carousel'); if (heroEl) heroEl.style.display = 'block';
        const gridCard = document.querySelector('#template-cardgrid-container')?.closest?.('.kit-card'); if (gridCard) gridCard.style.display = 'block';
    }

    return { openModule, closeModule, _renderClubList, openClubDetail, addMember, removeMember, logMeeting };
})();
