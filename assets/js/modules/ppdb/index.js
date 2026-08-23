/**
 * Atlas Edu — PPDB Online (Penerimaan Peserta Didik Baru)
 * Real multi-step admissions workflow with document tracking
 */
window.EduPpdb = (function () {

    let applicants = JSON.parse(sessionStorage.getItem('ppdb_applicants') || 'null') || [
        { id:'APP001', name:'Zaid Ibrahim Al-Hasan',    dob:'2014-03-12', jenjang:'SMP / MTs', status:'interview', docsComplete:true,  score:82, phone:'0812-3456-7890', submittedAt:'2026-08-01' },
        { id:'APP002', name:'Aisyah Nur Fauzia',        dob:'2015-06-22', jenjang:'SD / MI',   status:'verified',  docsComplete:true,  score:null, phone:'0813-2345-6789', submittedAt:'2026-08-03' },
        { id:'APP003', name:'Muhammad Ihsan',           dob:'2013-09-05', jenjang:'SMP / MTs', status:'pending',   docsComplete:false, score:null, phone:'0821-3456-7891', submittedAt:'2026-08-07' },
        { id:'APP004', name:'Layla Fadhilah',           dob:'2009-01-30', jenjang:'SMA / MA',  status:'accepted',  docsComplete:true,  score:91, phone:'0815-6789-0123', submittedAt:'2026-07-28' },
        { id:'APP005', name:'Ibrahim Yusuf Hamdani',    dob:'2011-11-14', jenjang:'SMA / MA',  status:'rejected',  docsComplete:true,  score:55, phone:'0819-2345-6780', submittedAt:'2026-07-25' },
    ];

    const statusConfig = {
        pending:   { label: 'Menunggu Verifikasi', color: '#f59e0b', bg: '#fefce8' },
        verified:  { label: 'Dokumen Terverifikasi', color: '#0891b2', bg: '#eff6ff' },
        interview: { label: 'Dijadwalkan Tes/Wawancara', color: '#9333ea', bg: '#faf5ff' },
        accepted:  { label: 'Diterima', color: '#03ac0e', bg: '#f0fdf4' },
        rejected:  { label: 'Tidak Diterima', color: '#ef4444', bg: '#fff5f5' },
    };

    function _save() { sessionStorage.setItem('ppdb_applicants', JSON.stringify(applicants)); }

    function openModule() { _renderScreen(); }

    function _renderScreen(filter) {
        filter = filter || 'all';
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-ppdb');
        if (!screen) { screen = document.createElement('div'); screen.id = 'module-ppdb'; screen.className = 'px-3 px-md-4 pb-4'; viewport.appendChild(screen); }
        _hideMain(); screen.style.display = 'block';

        const filtered = filter === 'all' ? applicants : applicants.filter(a => a.status === filter);
        const counts = {};
        ['all','pending','verified','interview','accepted','rejected'].forEach(k => {
            counts[k] = k === 'all' ? applicants.length : applicants.filter(a => a.status === k).length;
        });

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <button onclick="EduPpdb.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);flex-shrink:0;">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">PPDB Online ${new Date().getFullYear()}</h5>
                    <div style="font-size:12px;color:var(--muted);">${applicants.length} pelamar terdaftar</div>
                </div>
                <button onclick="EduPpdb.openNewApplicantForm()" style="background:var(--green);color:#fff;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;">
                    <i class="fas fa-plus me-1"></i>Daftar Baru
                </button>
            </div>

            <!-- Status Tabs -->
            <div class="d-flex gap-2 flex-wrap mb-3">
                ${['all','pending','verified','interview','accepted','rejected'].map(k => `
                <button onclick="EduPpdb.filterView('${k}')" style="
                    padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;
                    background:${k===filter ? (k==='all'?'var(--text)':'') : '#fff'};
                    border:1.5px solid ${k==='all'?(k===filter?'var(--text)':'var(--border)'):(statusConfig[k]?.color||'var(--border)')};
                    color:${k==='all'?(k===filter?'#fff':'var(--text-light)') : (k===filter?'#fff':statusConfig[k]?.color)};
                    background:${k===filter ? (k==='all'?'var(--text)':statusConfig[k]?.color) : '#fff'};">
                    ${k==='all'?'Semua':(statusConfig[k]?.label||k)} <span style="margin-left:4px;">${counts[k]}</span>
                </button>`).join('')}
            </div>

            <!-- Applicant Cards -->
            <div class="d-flex flex-column gap-2" id="ppdb-list">
                ${filtered.length === 0 ? '<div class="text-muted text-center py-4">Tidak ada pelamar.</div>' :
                  filtered.map(a => _renderApplicantCard(a)).join('')}
            </div>
        </div>`;
    }

    function _renderApplicantCard(a) {
        const s = statusConfig[a.status] || {};
        return `
        <div class="kit-card p-3 d-flex align-items-start gap-3 flex-wrap">
            <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#9333ea);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;flex-shrink:0;">
                ${a.name.charAt(0)}
            </div>
            <div class="flex-grow-1 min-w-0">
                <div class="fw-bold" style="font-size:14px;">${a.name}</div>
                <div style="font-size:12px;color:var(--muted);">${a.jenjang} · ${a.phone} · Daftar: ${a.submittedAt}</div>
                <div class="d-flex gap-2 mt-2 flex-wrap">
                    <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:${s.bg};color:${s.color};border:1px solid ${s.color}22;">${s.label}</span>
                    ${a.docsComplete ? '<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;">✓ Dokumen Lengkap</span>' :
                      '<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#fff5f5;color:#ef4444;border:1px solid #fecaca;">✗ Dokumen Belum Lengkap</span>'}
                    ${a.score !== null ? `<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;">Skor: ${a.score}</span>` : ''}
                </div>
            </div>
            <div class="d-flex gap-2 flex-wrap">
                ${a.status==='pending' ? `<button onclick="EduPpdb.updateStatus('${a.id}','verified')" style="border:1.5px solid #0891b2;color:#0891b2;background:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Verifikasi Dokumen</button>` : ''}
                ${a.status==='verified' ? `<button onclick="EduPpdb.updateStatus('${a.id}','interview')" style="border:1.5px solid #9333ea;color:#9333ea;background:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Jadwalkan Tes</button>` : ''}
                ${a.status==='interview' ? `
                    <button onclick="EduPpdb.updateStatus('${a.id}','accepted')" style="border:1.5px solid #03ac0e;color:#03ac0e;background:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Terima</button>
                    <button onclick="EduPpdb.updateStatus('${a.id}','rejected')" style="border:1.5px solid #ef4444;color:#ef4444;background:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Tolak</button>
                ` : ''}
                ${a.status==='accepted' ? `<button onclick="EduPpdb.printAcceptanceLetter('${a.id}')" style="border:1.5px solid #03ac0e;color:#03ac0e;background:#f0fdf4;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-print me-1"></i>Surat Terima</button>` : ''}
            </div>
        </div>`;
    }

    function filterView(status) { _renderScreen(status); }

    function updateStatus(id, newStatus) {
        const app = applicants.find(a => a.id === id);
        if (!app) return;
        app.status = newStatus;
        _save();
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','PPDB_STATUS_UPDATE',id,`${app.name} → ${newStatus}`);
        window.AtlasToast?.show(`Status ${app.name} diperbarui: ${statusConfig[newStatus]?.label}`, 'success');
        _renderScreen();
    }

    function openNewApplicantForm() {
        const id = 'APP' + String(Date.now()).slice(-4);
        const name = prompt('Nama lengkap calon santri:');
        if (!name || !name.trim()) return;
        const jenjang = prompt('Jenjang (SD/MI, SMP/MTs, SMA/MA, Kampus):') || 'SMP / MTs';
        const phone = prompt('No. telepon wali:') || '-';
        applicants.unshift({ id, name: name.trim(), dob: '', jenjang, status: 'pending', docsComplete: false, score: null, phone, submittedAt: new Date().toISOString().split('T')[0] });
        _save();
        window.AtlasToast?.show(`Pendaftar baru: ${name.trim()} berhasil didaftarkan.`, 'success');
        _renderScreen();
    }

    function printAcceptanceLetter(id) {
        const app = applicants.find(a => a.id === id);
        if (!app) return;
        window.AtlasToast?.show(`Mencetak Surat Penerimaan untuk ${app.name}…`, 'info');
    }

    function closeModule() {
        const screen = document.getElementById('module-ppdb');
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

    return { openModule, closeModule, filterView, updateStatus, openNewApplicantForm, printAcceptanceLetter };
})();
