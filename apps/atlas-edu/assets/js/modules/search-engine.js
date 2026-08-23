/**
 * Atlas Edu — Global Search Engine
 * Category-aware search across all module data
 */
window.EduSearch = (function () {

    const searchableData = {
        student: [
            { label: 'Ahmad Fauzi',         sub: 'Santri · Kelompok A · Juz 3',        action: () => EduHalaqah.openModule() },
            { label: 'Bilal Hamdani',        sub: 'Santri · Kelompok A · Juz 5',        action: () => EduHalaqah.openModule() },
            { label: 'Fatimah Az-Zahra',     sub: 'Santri · Kelompok B · Juz 8',        action: () => EduHalaqah.openModule() },
            { label: 'Hasan Mubarok',        sub: 'Santri · Kelompok A · Juz 2',        action: () => EduHalaqah.openModule() },
            { label: 'Khadijah Nuraini',     sub: 'Santri · Kelompok B · Juz 12',       action: () => EduHalaqah.openModule() },
            { label: 'Layla Fadhilah',       sub: 'PPDB · SMA/MA · Diterima',           action: () => EduPpdb.openModule() },
            { label: 'Zaid Ibrahim Al-Hasan',sub: 'PPDB · SMP/MTs · Wawancara',         action: () => EduPpdb.openModule() },
        ],
        teacher: [
            { label: 'Ust. Ahmad',           sub: 'Pembimbing Tahfidz Qur\'an Club',    action: () => EduClubs.openModule() },
            { label: 'Ust. Farid',           sub: 'Pembimbing Robotics Club',            action: () => EduClubs.openModule() },
            { label: 'Ust. Hakim',           sub: 'Pembimbing English Debate',           action: () => EduClubs.openModule() },
            { label: 'Ust. Salim',           sub: 'Pembimbing Panahan',                  action: () => EduClubs.openModule() },
        ],
        module: [
            { label: 'Absensi Halaqah',      sub: 'Modul · Qur\'an Circle Attendance',  action: () => EduHalaqah.openModule() },
            { label: 'PPDB Online',          sub: 'Modul · Penerimaan Peserta Didik',    action: () => EduPpdb.openModule() },
            { label: 'SPP & Tuition',        sub: 'Modul · Pembayaran Bulanan',          action: () => EduTuition.openModule() },
            { label: 'Facilities & Aset',    sub: 'Modul · Pemesanan Ruang',             action: () => EduFacilities.openModule() },
            { label: 'Clubs & Ekskul',       sub: 'Modul · Manajemen Ekstrakurikuler',   action: () => EduClubs.openModule() },
            { label: 'TOAFL Arabic Proficiency', sub: 'Kurikulum · Bahasa Arab',         action: () => AtlasEdu.openModuleDetail('TOAFL Arabic Proficiency', "'Idad Lughawi") },
        ],
        attendance: [
            { label: 'Rekap Absensi Hari Ini', sub: 'Lihat catatan kehadiran halaqah',   action: () => EduHalaqah.openModule() },
            { label: 'Absensi Kelompok A',     sub: 'Filter by kelompok di halaqah',     action: () => EduHalaqah.openModule() },
        ],
        invoice: [
            { label: 'Tunggakan SPP Agustus', sub: 'Laporan tagihan bulan ini',          action: () => EduTuition.openModule() },
            { label: 'Kwitansi Pembayaran',   sub: 'Riwayat kwitansi yang diterbitkan',  action: () => EduTuition.openModule() },
        ],
        asset: [
            { label: 'Aula Utama',            sub: 'Fasilitas · GF · Kapasitas 200',     action: () => EduFacilities.openModule() },
            { label: 'Lab Komputer A',         sub: 'Fasilitas · L1 · Kapasitas 40',      action: () => EduFacilities.openModule() },
            { label: 'Masjid / Musholla',     sub: 'Fasilitas · GF · Kapasitas 300',     action: () => EduFacilities.openModule() },
        ],
    };

    let resultsPanel = null;

    function run(query, category) {
        query = (query || '').trim().toLowerCase();
        if (!query) { _clearPanel(); return; }

        const pool = category === 'all'
            ? Object.values(searchableData).flat()
            : (searchableData[category] || []);

        const results = pool.filter(item =>
            item.label.toLowerCase().includes(query) ||
            item.sub.toLowerCase().includes(query)
        );

        _showPanel(results, query, category);
    }

    function _showPanel(results, query, category) {
        if (!resultsPanel) {
            resultsPanel = document.createElement('div');
            resultsPanel.id = 'search-results-panel';
            resultsPanel.style.cssText = `
                position:fixed;top:62px;left:0;right:0;z-index:2000;
                background:#fff;border-bottom:1px solid var(--border);
                box-shadow:0 8px 32px rgba(0,0,0,0.12);
                max-height:60vh;overflow-y:auto;
            `;
            document.body.appendChild(resultsPanel);
        }

        if (results.length === 0) {
            resultsPanel.innerHTML = `<div class="px-4 py-4 text-center text-muted" style="font-size:13px;">Tidak ditemukan hasil untuk "<strong>${query}</strong>" di kategori <em>${category}</em>.</div>`;
            return;
        }

        resultsPanel.innerHTML = `
            <div class="d-flex align-items-center justify-content-between px-4 py-2" style="border-bottom:1px solid var(--border);background:#f8fafc;">
                <span style="font-size:12px;font-weight:700;color:var(--muted);">${results.length} hasil ditemukan</span>
                <button onclick="EduSearch._clearPanel()" style="border:none;background:transparent;font-size:12px;color:var(--muted);cursor:pointer;font-weight:600;">✕ Tutup</button>
            </div>
            ${results.map((r, i) => `
            <div class="d-flex align-items-center gap-3 px-4 py-3" style="cursor:pointer;transition:background .15s;border-bottom:1px solid #f4f6f8;"
                 onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''"
                 onclick="EduSearch._executeResult(${i})">
                <div style="width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;"></div>
                <div>
                    <div class="fw-bold" style="font-size:13px;">${r.label}</div>
                    <div style="font-size:11px;color:var(--muted);">${r.sub}</div>
                </div>
                <i class="fas fa-chevron-right ms-auto" style="font-size:11px;color:var(--muted);"></i>
            </div>`).join('')}
        `;

        // Store results for click handler
        resultsPanel._results = results;
    }

    function _executeResult(index) {
        if (!resultsPanel || !resultsPanel._results) return;
        const result = resultsPanel._results[index];
        _clearPanel();
        // Clear search input
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        // Execute the action
        if (result && result.action) result.action();
    }

    function _clearPanel() {
        if (resultsPanel) {
            resultsPanel.innerHTML = '';
            resultsPanel.style.display = 'none';
        }
    }

    // Close panel on click outside
    document.addEventListener('click', (e) => {
        if (resultsPanel && !resultsPanel.contains(e.target) && e.target.id !== 'global-search-input') {
            _clearPanel();
        }
    });

    // Re-show panel on focus if has query
    document.addEventListener('focusin', (e) => {
        if (e.target.id === 'global-search-input' && e.target.value.trim()) {
            if (resultsPanel) resultsPanel.style.display = 'block';
        }
    });

    return { run, _clearPanel, _executeResult };
})();
