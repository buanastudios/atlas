/**
 * Atlas Edu — Facilities & Asset Management
 * Real room booking system with ticket numbers and work orders
 */
window.EduFacilities = (function () {

    const rooms = [
        { id:'R01', name:'Aula Utama',          capacity:200, type:'hall',      floor:'GF', status:'available' },
        { id:'R02', name:'Lab Komputer A',       capacity:40,  type:'lab',       floor:'L1', status:'booked'    },
        { id:'R03', name:'Ruang Rapat Pimpinan', capacity:20,  type:'meeting',   floor:'L2', status:'available' },
        { id:'R04', name:'Lab Bahasa',           capacity:35,  type:'lab',       floor:'L1', status:'available' },
        { id:'R05', name:'Masjid / Musholla',    capacity:300, type:'religious', floor:'GF', status:'available' },
        { id:'R06', name:'Lapangan Basket',      capacity:100, type:'sport',     floor:'GF', status:'maintenance'},
    ];

    let bookings    = JSON.parse(sessionStorage.getItem('facilities_bookings')    || '[]');
    let workOrders  = JSON.parse(sessionStorage.getItem('facilities_workorders')  || '[]');
    function _save() {
        sessionStorage.setItem('facilities_bookings',   JSON.stringify(bookings));
        sessionStorage.setItem('facilities_workorders', JSON.stringify(workOrders));
    }

    const typeIcons = { hall:'fas fa-theater-masks', lab:'fas fa-flask', meeting:'fas fa-handshake', religious:'fas fa-mosque', sport:'fas fa-running' };
    const typeColors = { hall:'icon-gradient-purple', lab:'icon-gradient-blue', meeting:'icon-gradient-teal', religious:'icon-gradient-amber', sport:'icon-gradient-emerald' };

    function openModule() { _renderScreen('rooms'); }

    function _renderScreen(tab) {
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-facilities');
        if (!screen) { screen = document.createElement('div'); screen.id = 'module-facilities'; screen.className = 'px-3 px-md-4 pb-4'; viewport.appendChild(screen); }
        _hideMain(); screen.style.display = 'block';

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3">
                <button onclick="EduFacilities.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">Fasilitas & Manajemen Aset</h5>
                    <div style="font-size:12px;color:var(--muted);">${rooms.length} ruang / fasilitas terdaftar</div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="d-flex gap-2 mb-3">
                ${[['rooms','Daftar Ruang'],['bookings','Pemesanan'],['maintenance','Work Order']].map(([k,v]) => `
                <button onclick="EduFacilities._renderScreen('${k}')"
                    style="padding:9px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;
                           background:${k===tab?'var(--text)':'#fff'};color:${k===tab?'#fff':'var(--muted)'};border:1.5px solid ${k===tab?'var(--text)':'var(--border)'};">${v}</button>
                `).join('')}
            </div>

            ${tab==='rooms'     ? _renderRooms()       : ''}
            ${tab==='bookings'  ? _renderBookings()    : ''}
            ${tab==='maintenance'?_renderWorkOrders()  : ''}
        </div>`;
    }

    function _renderRooms() {
        return `<div class="row g-2">
            ${rooms.map(r => {
                const statusColor = r.status==='available'?'#03ac0e':r.status==='booked'?'#f59e0b':'#ef4444';
                const statusLabel = r.status==='available'?'Tersedia':r.status==='booked'?'Sedang Dipakai':'Maintenance';
                return `
                <div class="col-12 col-md-6">
                    <div class="kit-card p-3 d-flex align-items-center gap-3">
                        <div class="pwa-app-icon ${typeColors[r.type]||'icon-gradient-teal'}" style="width:46px;height:46px;font-size:20px;border-radius:12px;flex-shrink:0;margin:0;">
                            <i class="${typeIcons[r.type]||'fas fa-door-open'}"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <div class="fw-bold" style="font-size:13px;">${r.name}</div>
                            <div style="font-size:11px;color:var(--muted);">Lantai ${r.floor} · Kapasitas ${r.capacity} orang</div>
                            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:${statusColor}18;color:${statusColor};border:1px solid ${statusColor}33;">${statusLabel}</span>
                        </div>
                        <div class="d-flex flex-column gap-1">
                            ${r.status==='available'
                                ? `<button onclick="EduFacilities.openBookingForm('${r.id}')" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Pesan</button>`
                                : ''}
                            <button onclick="EduFacilities.openMaintenanceForm('${r.id}')" style="border:1.5px solid var(--border);background:#fff;color:var(--muted);border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;">Laporkan</button>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
    }

    function _renderBookings() {
        if (bookings.length === 0) return '<div class="text-muted text-center py-5 kit-card p-4">Belum ada pemesanan ruang.</div>';
        return `<div class="kit-card" style="overflow:hidden;"><div style="overflow-x:auto;"><table class="table table-hover mb-0">
            <thead style="background:#f8fafc;"><tr><th>No. Booking</th><th>Ruang</th><th>Pemohon</th><th>Tanggal</th><th>Jam</th><th>Tujuan</th><th>Status</th></tr></thead>
            <tbody>
                ${bookings.map(b => `
                <tr>
                    <td style="font-size:11px;font-family:monospace;font-weight:700;">${b.bookingNo}</td>
                    <td class="fw-semibold" style="font-size:13px;">${b.roomName}</td>
                    <td style="font-size:12px;">${b.requester}</td>
                    <td style="font-size:12px;">${b.date}</td>
                    <td style="font-size:12px;">${b.startTime}–${b.endTime}</td>
                    <td style="font-size:12px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${b.purpose}</td>
                    <td><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;">Dikonfirmasi</span></td>
                </tr>`).join('')}
            </tbody>
        </table></div></div>`;
    }

    function _renderWorkOrders() {
        if (workOrders.length === 0) return '<div class="text-muted text-center py-5 kit-card p-4">Tidak ada work order aktif.</div>';
        return `<div class="kit-card" style="overflow:hidden;"><div style="overflow-x:auto;"><table class="table table-hover mb-0">
            <thead style="background:#f8fafc;"><tr><th>No. WO</th><th>Fasilitas</th><th>Masalah</th><th>Dilaporkan</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
                ${workOrders.map(wo => `
                <tr>
                    <td style="font-size:11px;font-family:monospace;font-weight:700;">${wo.woNo}</td>
                    <td class="fw-semibold" style="font-size:13px;">${wo.roomName}</td>
                    <td style="font-size:12px;">${wo.issue}</td>
                    <td style="font-size:12px;">${wo.reportedAt}</td>
                    <td><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;
                        background:${wo.status==='done'?'#f0fdf4':'#fff5f5'};
                        color:${wo.status==='done'?'#03ac0e':'#ef4444'};
                        border:1px solid ${wo.status==='done'?'#bbf7d0':'#fecaca'};">${wo.status==='done'?'Selesai':'Dalam Proses'}</span></td>
                    <td>${wo.status!=='done'?`<button onclick="EduFacilities.resolveWO('${wo.woNo}')" style="border:1.5px solid #03ac0e;color:#03ac0e;background:#fff;border-radius:8px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;">Selesai</button>`:'—'}</td>
                </tr>`).join('')}
            </tbody>
        </table></div></div>`;
    }

    function openBookingForm(roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;
        const requester = prompt(`Nama pemohon (untuk ${room.name}):`); if (!requester) return;
        const date      = prompt('Tanggal pemesanan (YYYY-MM-DD):', new Date().toISOString().split('T')[0]); if (!date) return;
        const startTime = prompt('Jam mulai (HH:MM):', '08:00'); if (!startTime) return;
        const endTime   = prompt('Jam selesai (HH:MM):', '10:00'); if (!endTime) return;
        const purpose   = prompt('Tujuan penggunaan:'); if (!purpose) return;
        const bookingNo = 'BKG-' + Date.now().toString().slice(-6);
        bookings.push({ bookingNo, roomId, roomName: room.name, requester, date, startTime, endTime, purpose, status: 'confirmed' });
        _save();
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','ROOM_BOOKED',bookingNo,`${room.name} by ${requester}`);
        window.AtlasToast?.show(`Pemesanan berhasil! No. Booking: ${bookingNo}`, 'success');
        _renderScreen('bookings');
    }

    function openMaintenanceForm(roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;
        const issue = prompt(`Deskripsikan masalah / kerusakan pada ${room.name}:`); if (!issue) return;
        const woNo = 'WO-' + Date.now().toString().slice(-6);
        workOrders.push({ woNo, roomId, roomName: room.name, issue, reportedAt: new Date().toLocaleDateString('id-ID'), status: 'open' });
        room.status = 'maintenance';
        _save();
        window.AtlasToast?.show(`Work Order dibuat: ${woNo}. Tim maintenance akan segera menindaklanjuti.`, 'info');
        _renderScreen('maintenance');
    }

    function resolveWO(woNo) {
        const wo = workOrders.find(w => w.woNo === woNo);
        if (!wo) return;
        wo.status = 'done';
        const room = rooms.find(r => r.id === wo.roomId);
        if (room && room.status === 'maintenance') room.status = 'available';
        _save();
        window.AtlasToast?.show(`Work Order ${woNo} ditutup. Fasilitas kembali tersedia.`, 'success');
        _renderScreen('maintenance');
    }

    function closeModule() {
        const screen = document.getElementById('module-facilities');
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

    return { openModule, closeModule, _renderScreen, openBookingForm, openMaintenanceForm, resolveWO };
})();
