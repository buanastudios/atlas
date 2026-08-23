/**
 * Atlas Edu — Facilities & Asset Management
 * Live room booking & maintenance work order ticketing module.
 */
window.EduFacilities = (function () {

    let rooms = [];
    let bookings = [];
    let maintenance = [];
    let currentTab = 'rooms';
    let isLoading = false;

    async function openModule() {
        await _loadData();
        _renderScreen(currentTab);
    }

    async function _loadData() {
        isLoading = true;
        try {
            const res = await fetch('/api/facilities');
            const data = await res.json();
            if (data.success) {
                rooms = data.facilities || [];
                bookings = data.bookings || [];
                maintenance = data.maintenance || [];
            }
        } catch (err) {
            console.warn('[EduFacilities] API fetch error, fallback:', err);
        } finally {
            isLoading = false;
        }
    }

    function _renderScreen(tab) {
        currentTab = tab || 'rooms';
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-facilities');
        if (!screen) {
            screen = document.createElement('div');
            screen.id = 'module-facilities';
            screen.className = 'px-3 px-md-4 pb-4';
            viewport.appendChild(screen);
        }
        _hideMain();
        screen.style.display = 'block';

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <button onclick="EduFacilities.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">Facilities &amp; Asset Operations</h5>
                    <div style="font-size:12px;color:var(--muted);">${rooms.length} ruang &amp; fasilitas terdaftar</div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="d-flex gap-2 mb-3">
                ${[['rooms','Daftar Ruang'],['bookings','Pemesanan'],['maintenance','Work Order Ticketing']].map(([k,v]) => `
                <button onclick="EduFacilities._renderScreen('${k}')"
                    style="padding:9px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;
                           background:${k===currentTab?'var(--text)':'#fff'};color:${k===currentTab?'#fff':'var(--muted)'};border:1.5px solid ${k===currentTab?'var(--text)':'var(--border)'};">${v}</button>
                `).join('')}
            </div>

            ${currentTab==='rooms'     ? _renderRooms()       : ''}
            ${currentTab==='bookings'  ? _renderBookings()    : ''}
            ${currentTab==='maintenance'?_renderMaintenance()  : ''}
        </div>`;
    }

    function _renderRooms() {
        return `<div class="row g-3">
            ${rooms.map(r => {
                const statusColor = r.kondisi==='Baik'?'#03ac0e':'#ef4444';
                return `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="kit-card p-3 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <div class="pwa-app-icon icon-gradient-teal" style="width:42px;height:42px;font-size:18px;border-radius:12px;flex-shrink:0;margin:0;">
                                    <i class="fas fa-building"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="fw-bold text-truncate" style="font-size:14px;">${r.nama}</div>
                                    <div style="font-size:11px;color:var(--muted);">${r.kode || 'FAC'} · ${r.jenis}</div>
                                </div>
                            </div>
                            <div style="font-size:12px;color:var(--muted);" class="mb-2">Kapasitas: <strong>${r.kapasitas || 30} Orang</strong></div>
                            <span class="badge ${r.kondisi==='Baik'?'bg-success':'bg-danger'}">${r.kondisi}</span>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button onclick="EduFacilities.openBookingForm(${r.id})" style="flex:1;background:var(--green);color:#fff;border:none;border-radius:8px;padding:7px;font-size:12px;font-weight:700;cursor:pointer;">Pesan</button>
                            <button onclick="EduFacilities.openMaintenanceForm(${r.id})" style="flex:1;border:1.5px solid var(--border);background:#fff;color:var(--muted);border-radius:8px;padding:7px;font-size:12px;font-weight:600;cursor:pointer;">Lapor Rusak</button>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    }

    function _renderBookings() {
        return `
        <div class="kit-card p-3">
            <h6 class="fw-bold mb-3"><i class="fas fa-calendar-check me-2 text-teal"></i>Daftar Pemesanan Ruang</h6>
            <div style="overflow-x:auto;">
                <table class="table table-hover mb-0" style="font-size:12px;">
                    <thead><tr><th>Ruang</th><th>Keperluan</th><th>Tanggal</th><th>Jam</th><th>Peserta</th><th>Status</th></tr></thead>
                    <tbody>
                        ${bookings.map(b => `
                        <tr>
                            <td class="fw-semibold">${b.facility_name || 'Ruang'}</td>
                            <td>${b.keperluan}</td>
                            <td>${b.tanggal}</td>
                            <td>${b.jam_mulai} - ${b.jam_selesai}</td>
                            <td>${b.peserta} Orang</td>
                            <td><span class="badge bg-success">${b.status}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    function _renderMaintenance() {
        return `
        <div class="kit-card p-3">
            <h6 class="fw-bold mb-3"><i class="fas fa-tools me-2 text-amber"></i>Work Order Pemeliharaan Aset</h6>
            <div style="overflow-x:auto;">
                <table class="table table-hover mb-0" style="font-size:12px;">
                    <thead><tr><th>Fasilitas</th><th>Deskripsi Kerusakan</th><th>Prioritas</th><th>Estimasi Biaya</th><th>Status</th></tr></thead>
                    <tbody>
                        ${maintenance.map(m => `
                        <tr>
                            <td class="fw-semibold">${m.facility_name || 'Aset'}</td>
                            <td>${m.deskripsi}</td>
                            <td><span class="badge ${m.prioritas==='Tinggi'||m.prioritas==='Darurat'?'bg-danger':'bg-warning text-dark'}">${m.prioritas}</span></td>
                            <td>Rp ${(m.biaya_estimasi||0).toLocaleString('id-ID')}</td>
                            <td><span class="badge bg-secondary">${m.status}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    async function openBookingForm(facilityId) {
        const keperluan = prompt('Keperluan peminjaman ruangan:', 'Rapat Koordinasi Guru / Sentra');
        if (!keperluan) return;

        try {
            const res = await fetch('/api/facilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_booking',
                    facility_id: facilityId,
                    keperluan: keperluan,
                    tanggal: new Date().toISOString().split('T')[0],
                    jam_mulai: '09:30',
                    jam_selesai: '11:45',
                    peserta: 30
                })
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

    async function openMaintenanceForm(facilityId) {
        const deskripsi = prompt('Deskripsi kerusakan aset / fasilitas:', 'AC tidak dingin / Lampu redup');
        if (!deskripsi) return;

        try {
            const res = await fetch('/api/facilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create_maintenance',
                    facility_id: facilityId,
                    deskripsi: deskripsi,
                    prioritas: 'Sedang',
                    biaya_estimasi: 250000
                })
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

    function closeModule() {
        const screen = document.getElementById('module-facilities');
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

    return { openModule, closeModule, openBookingForm, openMaintenanceForm, _renderScreen };
})();
