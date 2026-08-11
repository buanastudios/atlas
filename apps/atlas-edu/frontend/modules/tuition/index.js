/**
 * Atlas Edu — SPP & Tuition Billing Ledger
 * Real monthly billing, payment confirmation, receipt generation
 */
window.EduTuition = (function () {

    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const currentMonth = new Date().getMonth();
    const currentYear  = new Date().getFullYear();

    const initLedger = () => [
        { id:'STD001', name:'Ahmad Fauzi',          kelas:'VIII A', amount:350000, months: [0,0,0,0,1,1,1,0,0,0,0,0] },
        { id:'STD002', name:'Bilal Hamdani',         kelas:'VIII A', amount:350000, months: [0,0,0,0,1,1,1,1,0,0,0,0] },
        { id:'STD003', name:'Fatimah Az-Zahra',      kelas:'IX B',   amount:350000, months: [0,0,0,0,1,1,0,0,0,0,0,0] },
        { id:'STD004', name:'Hasan Mubarok',         kelas:'VII C',  amount:350000, months: [0,0,0,0,1,1,1,1,0,0,0,0] },
        { id:'STD005', name:'Khadijah Nuraini',      kelas:'IX B',   amount:350000, months: [0,0,0,0,0,1,1,0,0,0,0,0] },
        { id:'STD006', name:'Muhammad Ali Ridha',    kelas:'VII A',  amount:350000, months: [0,0,0,0,1,0,0,0,0,0,0,0] },
    ];

    let ledger = JSON.parse(sessionStorage.getItem('spp_ledger') || 'null') || initLedger();
    function _save() { sessionStorage.setItem('spp_ledger', JSON.stringify(ledger)); }

    let receipts = JSON.parse(sessionStorage.getItem('spp_receipts') || '[]');
    function _saveReceipts() { sessionStorage.setItem('spp_receipts', JSON.stringify(receipts)); }

    function openModule() { _renderScreen(); }

    function _renderScreen(viewMonth) {
        viewMonth = viewMonth !== undefined ? viewMonth : currentMonth;
        const viewport = document.getElementById('app-viewport');
        let screen = document.getElementById('module-tuition');
        if (!screen) { screen = document.createElement('div'); screen.id = 'module-tuition'; screen.className = 'px-3 px-md-4 pb-4'; viewport.appendChild(screen); }
        _hideMain(); screen.style.display = 'block';

        const totalStudents = ledger.length;
        const paid   = ledger.filter(s => s.months[viewMonth] === 1).length;
        const unpaid = totalStudents - paid;
        const totalRevenue = ledger.filter(s => s.months[viewMonth]===1).reduce((sum,s)=>sum+s.amount, 0);
        const outstanding  = ledger.filter(s => s.months[viewMonth]===0).reduce((sum,s)=>sum+s.amount, 0);

        screen.innerHTML = `
        <div class="mt-3">
            <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <button onclick="EduTuition.closeModule()" style="background:transparent;border:1.5px solid var(--border);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-light);">
                    <i class="fas fa-arrow-left me-1"></i>Kembali
                </button>
                <div class="flex-grow-1">
                    <h5 class="fw-bold mb-0">SPP & Iuran Bulanan</h5>
                    <div style="font-size:12px;color:var(--muted);">Bulan: ${months[viewMonth]} ${currentYear}</div>
                </div>
            </div>

            <!-- Month Selector -->
            <div class="d-flex gap-1 flex-wrap mb-3" style="overflow-x:auto;">
                ${months.map((m,i) => `
                <button onclick="EduTuition.viewMonth(${i})"
                    style="padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;
                           background:${i===viewMonth?'var(--green)':'#fff'};
                           color:${i===viewMonth?'#fff':'var(--muted)'};
                           border:1.5px solid ${i===viewMonth?'var(--green)':'var(--border)'};">${m}</button>
                `).join('')}
            </div>

            <!-- Summary Stats -->
            <div class="row g-2 mb-3">
                <div class="col-6 col-md-3">
                    <div class="kit-card p-3 text-center">
                        <div style="font-size:22px;font-weight:800;color:var(--green);">${paid}</div>
                        <div style="font-size:11px;color:var(--muted);">Lunas</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="kit-card p-3 text-center">
                        <div style="font-size:22px;font-weight:800;color:#ef4444;">${unpaid}</div>
                        <div style="font-size:11px;color:var(--muted);">Belum Bayar</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="kit-card p-3 text-center">
                        <div style="font-size:16px;font-weight:800;color:var(--text);">Rp ${(totalRevenue/1000).toFixed(0)}rb</div>
                        <div style="font-size:11px;color:var(--muted);">Terkumpul</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="kit-card p-3 text-center">
                        <div style="font-size:16px;font-weight:800;color:#f59e0b;">Rp ${(outstanding/1000).toFixed(0)}rb</div>
                        <div style="font-size:11px;color:var(--muted);">Tunggakan</div>
                    </div>
                </div>
            </div>

            <!-- Billing Table -->
            <div class="kit-card" style="overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table class="table table-hover mb-0">
                        <thead style="background:#f8fafc;">
                            <tr>
                                <th>Nama Santri</th>
                                <th>Kelas</th>
                                <th>Tagihan</th>
                                <th>Status</th>
                                <th class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ledger.map(s => `
                            <tr>
                                <td class="fw-semibold" style="font-size:13px;">${s.name}</td>
                                <td style="font-size:12px;color:var(--muted);">${s.kelas}</td>
                                <td style="font-size:13px;font-weight:700;">Rp ${s.amount.toLocaleString('id-ID')}</td>
                                <td>
                                    ${s.months[viewMonth]===1
                                        ? '<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;">✓ Lunas</span>'
                                        : '<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:#fff5f5;color:#ef4444;border:1px solid #fecaca;">Belum Bayar</span>'}
                                </td>
                                <td class="text-center">
                                    ${s.months[viewMonth]===0
                                        ? `<button onclick="EduTuition.confirmPayment('${s.id}',${viewMonth})" style="background:var(--green);color:#fff;border:none;border-radius:8px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">Bayar Sekarang</button>`
                                        : `<button onclick="EduTuition.printReceipt('${s.id}',${viewMonth})" style="border:1.5px solid var(--border);color:var(--text-light);background:#fff;border-radius:8px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-receipt me-1"></i>Kwitansi</button>`
                                    }
                                </td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Receipts -->
            ${receipts.length > 0 ? `
            <div class="kit-card p-3 mt-3">
                <div class="fw-bold mb-2" style="font-size:13px;">Riwayat Pembayaran Terakhir</div>
                ${receipts.slice(-5).reverse().map(r => `
                <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div>
                        <div class="fw-semibold" style="font-size:13px;">${r.name}</div>
                        <div style="font-size:11px;color:var(--muted);">${r.receiptNo} · ${r.paidAt}</div>
                    </div>
                    <span style="font-weight:800;color:var(--green);font-size:13px;">Rp ${r.amount.toLocaleString('id-ID')}</span>
                </div>`).join('')}
            </div>` : ''}
        </div>`;
    }

    function confirmPayment(studentId, monthIdx) {
        const student = ledger.find(s => s.id === studentId);
        if (!student) return;
        if (!confirm(`Konfirmasi pembayaran SPP ${months[monthIdx]} ${currentYear} untuk ${student.name} sebesar Rp ${student.amount.toLocaleString('id-ID')}?`)) return;
        student.months[monthIdx] = 1;
        _save();
        const receiptNo = 'RCP-' + Date.now().toString().slice(-8);
        receipts.push({ receiptNo, name: student.name, amount: student.amount, month: months[monthIdx], paidAt: new Date().toLocaleDateString('id-ID') });
        _saveReceipts();
        if (window.AtlasAuditEngine) AtlasAuditEngine.logEvent('current-user','admin','SPP_PAYMENT',studentId,`${student.name} paid ${months[monthIdx]}`);
        window.AtlasToast?.show(`Pembayaran ${student.name} berhasil dicatat. No. Kwitansi: ${receiptNo}`, 'success');
        _renderScreen(monthIdx);
    }

    function printReceipt(studentId, monthIdx) {
        const student = ledger.find(s => s.id === studentId);
        const receipt = receipts.find(r => r.name === student?.name && r.month === months[monthIdx]);
        const receiptNo = receipt?.receiptNo || 'RCP-LEGACY';
        window.AtlasToast?.show(`Mencetak kwitansi ${receiptNo} untuk ${student?.name}…`, 'info');
    }

    function viewMonth(m) { _renderScreen(m); }

    function closeModule() {
        const screen = document.getElementById('module-tuition');
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

    return { openModule, closeModule, confirmPayment, printReceipt, viewMonth };
})();
