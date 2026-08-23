/**
 * Atlas Edu — MBG (Program Makan Bergizi Gratis) Module
 * SD At-Tibyan — Controlled Document Form: FORM-MBG-01 REV-00
 *
 * Business Process Flow:
 *   1. Form Penerimaan Harian (Daily Delivery & Receipt Input):
 *      - Komposisi Menu Detail (Karbohidrat, Lauk Hewani/Nabati, Sayur, Buah/Susu)
 *      - Diet Khusus Bagi Yang Alergi (Substitusi per siswa alergi)
 *      - Penerima (Sekolah) & Pengantar (Vendor/Katering) Verification
 *      - Jumlah Kemasan Normal + Alergi = Total Pax Calculation
 *      - Kondisi Kemasan (Baik/Tersegel Rapat vs Rusak/Terbuka)
 *
 *   2. Pengujian Organoleptik (Food Safety & Quality Inspection):
 *      - Aroma (Segar, Busuk, Apek, Asam)
 *      - Tampilan (Bersih, Gosong, Berlendir, Pucat)
 *      - Rasa (Normal, Terlalu Manis, Hambar, Terlalu Asin, Basi)
 *      - Tekstur (Empuk, Lembek Berair, Keras, Lengket Menggumpal, Mentah)
 *      - Kesimpulan Pengujian: LAYAK EDAR vs TIDAK LAYAK EDAR
 *
 *   3. Sign-off & Verification:
 *      - Penguji (Food Quality Inspector / Tim Gizi)
 *      - Kepala Sekolah / Staff Umum
 *
 *   4. Official Document Print / PDF:
 *      - 1:1 Pixel-perfect printable replica of the official SD At-Tibyan paper form.
 */

window.EduMbg = (function () {

    const API_BASE = '';
    let _activeTab = 'form'; // 'form' | 'history' | 'print'
    let _records = [];
    let _currentRecord = null;

    // ── Predefined Default Menu / Seed ───────────────────────────────────────
    function _getDefaultFormState() {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = days[now.getDay()];
        const curMonth = String(now.getMonth() + 1).padStart(2, '0');
        const curYear = now.getFullYear();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

        return {
            id: null,
            nomor_dokumen: `FRM-MBG-01/SD/${curMonth}/${curYear}/`,
            tanggal: now.toISOString().slice(0, 10),
            hari: dayName,
            waktu: timeStr,
            unit: 'primary',
            
            // Menu Komposisi Detail
            menu_karbohidrat: 'Nasi Putih Pulen',
            menu_lauk: 'Ayam Fillet Saus Tiram + Tempe Goreng',
            menu_sayur: 'Sayur Sop Wortel Buncis',
            menu_buah_susu: 'Pisang Cavendish + Susu UHT 125ml',
            
            // Diet Khusus Alergi
            diet_karbohidrat: 'Nasi Putih',
            diet_lauk: 'Tahu Bacem (Substitusi Telur: Ahmad)',
            diet_sayur: 'Sayur Sop Wortel',
            diet_buah_susu: 'Pisang Cavendish (Substitusi Susu: Nisa)',
            
            // Kemasan
            jumlah_normal: 240,
            jumlah_diet_alergi: 10,
            jumlah_total: 250,
            bentuk_kemasan: 'Box',
            kondisi_kemasan: 'Baik & Tersegel Rapat',
            catatan_penerima: 'Kemasan rapi, tertutup rapat, dan suhu makanan hangat.',
            
            // Penerima
            penerima_nama: 'Ustadzah Fatimah, S.Pd.',
            penerima_kontak: '0812-3456-7890',
            penerima_ttd: 'VERIFIED_SIGN_RECEIVER',
            
            // Pengantar
            pengantar_nama: 'Pak Joko Supriyadi (Katering Berkah)',
            pengantar_kontak: '0857-1122-3344',
            pengantar_plat_no: 'D 1842 ABX',
            pengantar_ttd: 'VERIFIED_SIGN_COURIER',
            catatan_pengantar: 'Diantar pk 10:20 WIB menggunakan armada boks tertutup.',
            
            // Pengujian Organoleptik
            uji_aroma: ['Segar'],
            uji_tampilan: ['Bersih'],
            uji_rasa: ['Normal'],
            uji_tekstur: ['Empuk'],
            uji_catatan: 'Rasa gurih pas, aroma rempah segar, kematangan sempurna.',
            kesimpulan_pengujian: 'Layak Edar',
            
            // Verifikasi
            penguji_nama: 'Ustadz Abdullah, S.Gz (Tim Gizi)',
            penguji_kontak: '0813-9988-7766',
            penguji_ttd: 'VERIFIED_SIGN_INSPECTOR',
            kepala_sekolah_nama: 'Ustadz Ibrahim, M.Pd (Kepala Sekolah)',
            kepala_sekolah_ttd: 'VERIFIED_SIGN_HEADMASTER',
            
            status: 'LAYAK_EDAR'
        };
    }

    // ── Open Module Entry Point ──────────────────────────────────────────────
    async function openModule() {
        const viewport = document.getElementById('app-viewport');
        if (!viewport) return;

        viewport.innerHTML = `
        <div class="container-fluid px-3 px-md-4 py-4 mbg-container">
            
            <!-- Header & Action Bar -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge bg-emerald-subtle text-success fw-bold px-3 py-1 font-monospace" style="font-size:11px;">
                            <i class="fas fa-utensils me-1"></i> CONTROLLED DOCUMENT FORM-MBG-01 REV-00
                        </span>
                        <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-1" style="font-size:11px;">
                            SD At-Tibyan
                        </span>
                    </div>
                    <h3 class="fw-bold text-dark m-0" style="letter-spacing:-.5px;">
                        Penerimaan Harian Program Makan Bergizi Gratis (MBG)
                    </h3>
                    <p class="text-muted small m-0 mt-1">
                        Pencatatan komposisi menu, diet alergi, uji organoleptik, dan verifikasi tanda tangan serah terima.
                    </p>
                </div>
                
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <button class="btn btn-outline-secondary btn-sm fw-bold px-3 py-2" onclick="EduMbg.switchTab('history')">
                        <i class="fas fa-history me-1"></i> Riwayat Penerimaan
                    </button>
                    <button class="btn btn-primary-atlas btn-sm fw-bold px-3 py-2" onclick="EduMbg.newForm()">
                        <i class="fas fa-plus-circle me-1"></i> Input Form Baru
                    </button>
                    <button class="btn btn-light btn-sm fw-bold px-3 py-2 border" onclick="EduMbg.printCurrentDoc()">
                        <i class="fas fa-print me-1 text-teal"></i> Cetak Dokumen Resmi
                    </button>
                </div>
            </div>

            <!-- Top Navigation Tabs -->
            <div class="d-flex gap-2 border-bottom pb-2 mb-4">
                <button id="mbg-tab-form" class="btn btn-sm fw-bold ${ _activeTab === 'form' ? 'btn-primary-atlas' : 'btn-light' }" onclick="EduMbg.switchTab('form')">
                    <i class="fas fa-edit me-1"></i> Form Input Penerimaan
                </button>
                <button id="mbg-tab-history" class="btn btn-sm fw-bold ${ _activeTab === 'history' ? 'btn-primary-atlas' : 'btn-light' }" onclick="EduMbg.switchTab('history')">
                    <i class="fas fa-list-alt me-1"></i> Data & Arsip MBG
                </button>
                <button id="mbg-tab-print" class="btn btn-sm fw-bold ${ _activeTab === 'print' ? 'btn-primary-atlas' : 'btn-light' }" onclick="EduMbg.switchTab('print')">
                    <i class="fas fa-file-invoice me-1"></i> Format Lembar Resmi (1:1 Form)
                </button>
            </div>

            <!-- Dynamic Viewport Area -->
            <div id="mbg-dynamic-view"></div>

        </div>`;

        await _loadRecords();
        if (!_currentRecord) {
            _currentRecord = _records[0] || _getDefaultFormState();
        }
        _renderCurrentTab();
    }

    // ── Tab Switcher ─────────────────────────────────────────────────────────
    function switchTab(tab) {
        _activeTab = tab;
        
        ['form', 'history', 'print'].forEach(t => {
            const btn = document.getElementById(`mbg-tab-${t}`);
            if (btn) {
                if (t === tab) {
                    btn.className = 'btn btn-sm fw-bold btn-primary-atlas';
                } else {
                    btn.className = 'btn btn-sm fw-bold btn-light';
                }
            }
        });

        _renderCurrentTab();
    }

    function _renderCurrentTab() {
        const container = document.getElementById('mbg-dynamic-view');
        if (!container) return;

        if (_activeTab === 'form') {
            _renderFormView(container);
        } else if (_activeTab === 'history') {
            _renderHistoryView(container);
        } else if (_activeTab === 'print') {
            _renderPrintView(container);
        }
    }

    // ── 1. FORM INPUT VIEW ───────────────────────────────────────────────────
    function _renderFormView(container) {
        const r = _currentRecord || _getDefaultFormState();

        container.innerHTML = `
        <form id="mbg-entry-form" onsubmit="EduMbg.handleFormSubmit(event)">
            
            <!-- Quick Summary Bar -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-3">
                    <div class="mbg-stat-card">
                        <div class="text-muted small fw-bold text-uppercase">Total Porsi (Pax)</div>
                        <div class="fs-4 fw-black text-dark mt-1" id="kpi-total-pax">${r.jumlah_total || 250} Pax</div>
                        <div class="small text-muted mt-1">Normal: <strong id="kpi-normal-pax">${r.jumlah_normal || 240}</strong> · Alergi: <strong id="kpi-alergi-pax">${r.jumlah_diet_alergi || 10}</strong></div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="mbg-stat-card">
                        <div class="text-muted small fw-bold text-uppercase">Uji Organoleptik</div>
                        <div class="mt-1">
                            <span id="kpi-kesimpulan-badge" class="${r.kesimpulan_pengujian === 'Layak Edar' ? 'mbg-badge-layak' : 'mbg-badge-tidak-layak'} fs-6">
                                <i class="fas ${r.kesimpulan_pengujian === 'Layak Edar' ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${r.kesimpulan_pengujian || 'Layak Edar'}
                            </span>
                        </div>
                        <div class="small text-muted mt-1">Uji Min. 1 Porsi Sampel</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="mbg-stat-card">
                        <div class="text-muted small fw-bold text-uppercase">Kondisi Kemasan</div>
                        <div class="fs-5 fw-bold text-dark mt-1">${r.kondisi_kemasan || 'Baik & Tersegel Rapat'}</div>
                        <div class="small text-muted mt-1">Wadah: <strong>${r.bentuk_kemasan || 'Box'}</strong></div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="mbg-stat-card">
                        <div class="text-muted small fw-bold text-uppercase">Waktu Serah Terima</div>
                        <div class="fs-5 fw-bold text-dark mt-1">${r.hari}, ${r.tanggal}</div>
                        <div class="small text-muted mt-1"><i class="fas fa-clock me-1 text-teal"></i>${r.waktu}</div>
                    </div>
                </div>
            </div>

            <!-- SECTION A: DOKUMEN & IDENTITAS PENGIRIMAN -->
            <div class="mbg-section-card">
                <div class="mbg-section-title">
                    <i class="fas fa-info-circle text-teal"></i> Identitas & Informasi Penerimaan
                </div>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label small fw-bold text-muted text-uppercase">Nomor Dokumen</label>
                        <input type="text" class="form-control fw-bold font-monospace bg-light" name="nomor_dokumen" value="${r.nomor_dokumen || ''}" placeholder="FRM-MBG-01/SD/08/2026/001" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted text-uppercase">Hari</label>
                        <select class="form-select fw-semibold" name="hari">
                            ${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => `<option value="${d}" ${r.hari === d ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted text-uppercase">Tanggal</label>
                        <input type="date" class="form-control fw-semibold" name="tanggal" value="${r.tanggal}" required>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small fw-bold text-muted text-uppercase">Waktu Tiba</label>
                        <input type="text" class="form-control fw-semibold" name="waktu" value="${r.waktu}" placeholder="10:30 WIB" required>
                    </div>
                </div>
            </div>

            <!-- SECTION B: KOMPOSISI MENU DETAIL & DIET ALERGI (2-COLUMN) -->
            <div class="row g-3 mb-4">
                <!-- Left: Komposisi Menu Detail (General) -->
                <div class="col-lg-6">
                    <div class="mbg-section-card h-100 mb-0">
                        <div class="mbg-section-title text-success">
                            <i class="fas fa-carrot"></i> Komposisi Menu Detail (Porsi Standar)
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">1. Karbohidrat</label>
                            <input type="text" class="form-control" name="menu_karbohidrat" value="${r.menu_karbohidrat || ''}" placeholder="Contoh: Nasi Putih Pulen / Nasi Uduk" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">2. Lauk Hewani / Nabati</label>
                            <input type="text" class="form-control" name="menu_lauk" value="${r.menu_lauk || ''}" placeholder="Contoh: Ayam Fillet Saus Tiram + Tempe Goreng" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">3. Sayur</label>
                            <input type="text" class="form-control" name="menu_sayur" value="${r.menu_sayur || ''}" placeholder="Contoh: Sayur Sop Wortel Buncis" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label small fw-bold text-muted">4. Buah / Susu</label>
                            <input type="text" class="form-control" name="menu_buah_susu" value="${r.menu_buah_susu || ''}" placeholder="Contoh: Pisang Cavendish + Susu UHT 125ml" required>
                        </div>
                    </div>
                </div>

                <!-- Right: Diet Khusus Bagi Yang Alergi -->
                <div class="col-lg-6">
                    <div class="mbg-section-card h-100 mb-0 border-amber" style="background:#fffdfa;">
                        <div class="mbg-section-title text-amber-700">
                            <i class="fas fa-shield-virus"></i> Diet Khusus Bagi Yang Alergi
                        </div>
                        <div class="alert alert-warning py-2 px-3 small mb-3">
                            <i class="fas fa-info-circle me-1"></i> <strong>Format Penulisan:</strong> Nama Santri (Alergi [X] &rarr; Substitusi [Y])<br>
                            <em>Contoh: Nisa (Alergi Nasi &rarr; Jagung), Ahmad (Alergi Telur &rarr; Tahu)</em>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Substitusi Karbohidrat</label>
                            <input type="text" class="form-control" name="diet_karbohidrat" value="${r.diet_karbohidrat || ''}" placeholder="Contoh: Nasi Merah / Kentang Rebus">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Substitusi Lauk Hewani / Nabati</label>
                            <input type="text" class="form-control" name="diet_lauk" value="${r.diet_lauk || ''}" placeholder="Contoh: Tahu Bacem (Substitusi Telur: Ahmad)">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Substitusi Sayur</label>
                            <input type="text" class="form-control" name="diet_sayur" value="${r.diet_sayur || ''}" placeholder="Contoh: Sayur Bening Labu (Alergi Jamur: Budi)">
                        </div>
                        <div class="mb-2">
                            <label class="form-label small fw-bold text-muted">Substitusi Buah / Susu</label>
                            <input type="text" class="form-control" name="diet_buah_susu" value="${r.diet_buah_susu || ''}" placeholder="Contoh: Sari Kedelai (Lactose Intolerant: Siti)">
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION C: PENERIMA, PENGANTAR & JUMLAH KEMASAN -->
            <div class="mbg-section-card">
                <div class="mbg-section-title text-indigo">
                    <i class="fas fa-truck-loading"></i> Serah Terima Kemasan & Pengantar
                </div>
                <div class="row g-3">
                    
                    <!-- Left: Penerima -->
                    <div class="col-md-6 border-end pe-md-4">
                        <h6 class="fw-bold text-dark mb-3"><i class="fas fa-user-check text-success me-1"></i> Data Penerima (Sekolah)</h6>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Nama Penerima</label>
                            <input type="text" class="form-control" name="penerima_nama" value="${r.penerima_nama || ''}" placeholder="Nama Guru / Petugas Penerima" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Kontak / No. HP</label>
                            <input type="text" class="form-control" name="penerima_kontak" value="${r.penerima_kontak || ''}" placeholder="0812-xxxx-xxxx">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Catatan Penerima Kemasan</label>
                            <textarea class="form-control" name="catatan_penerima" rows="2" placeholder="Catatan kondisi saat diterima...">${r.catatan_penerima || ''}</textarea>
                        </div>
                    </div>

                    <!-- Right: Pengantar -->
                    <div class="col-md-6 ps-md-4">
                        <h6 class="fw-bold text-dark mb-3"><i class="fas fa-shipping-fast text-primary me-1"></i> Data Pengantar (Vendor / Katering)</h6>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Nama Pengantar</label>
                            <input type="text" class="form-control" name="pengantar_nama" value="${r.pengantar_nama || ''}" placeholder="Nama Kurir / Driver Katering" required>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small fw-bold text-muted">Kontak Pengantar</label>
                                <input type="text" class="form-control" name="pengantar_kontak" value="${r.pengantar_kontak || ''}" placeholder="0857-xxxx-xxxx">
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-bold text-muted">Plat No. Kendaraan</label>
                                <input type="text" class="form-control font-monospace text-uppercase" name="pengantar_plat_no" value="${r.pengantar_plat_no || ''}" placeholder="D 1234 ABC">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Catatan Pengantar</label>
                            <textarea class="form-control" name="catatan_pengantar" rows="2" placeholder="Catatan dari pihak kurir...">${r.catatan_pengantar || ''}</textarea>
                        </div>
                    </div>

                </div>

                <hr class="my-4">

                <!-- Kemasan Counts & Options -->
                <div class="row g-3 align-items-center">
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted">Jumlah Kemasan Normal (Pax)</label>
                        <div class="input-group">
                            <input type="number" id="input-jml-normal" class="form-control fw-bold" name="jumlah_normal" value="${r.jumlah_normal || 0}" min="0" oninput="EduMbg.calcTotalPax()" required>
                            <span class="input-group-text">PAX</span>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-bold text-muted">Jumlah Diet Alergi (Pax)</label>
                        <div class="input-group">
                            <input type="number" id="input-jml-alergi" class="form-control fw-bold text-amber-700" name="jumlah_diet_alergi" value="${r.jumlah_diet_alergi || 0}" min="0" oninput="EduMbg.calcTotalPax()" required>
                            <span class="input-group-text">PAX</span>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small fw-bold text-success">Jumlah Total Pax</label>
                        <div class="input-group">
                            <input type="number" id="input-jml-total" class="form-control fw-black bg-emerald-subtle text-success" name="jumlah_total" value="${r.jumlah_total || 0}" readonly>
                            <span class="input-group-text fw-bold">PAX</span>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small fw-bold text-muted">Bentuk Kemasan</label>
                        <select class="form-select fw-semibold" name="bentuk_kemasan">
                            <option value="Box" ${r.bentuk_kemasan === 'Box' ? 'selected' : ''}>Box</option>
                            <option value="Tray" ${r.bentuk_kemasan === 'Tray' ? 'selected' : ''}>Tray</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small fw-bold text-muted">Kondisi Kemasan</label>
                        <select class="form-select fw-semibold" name="kondisi_kemasan">
                            <option value="Baik & Tersegel Rapat" ${r.kondisi_kemasan === 'Baik & Tersegel Rapat' ? 'selected' : ''}>Baik & Tersegel Rapat</option>
                            <option value="Rusak / Terbuka" ${r.kondisi_kemasan === 'Rusak / Terbuka' ? 'selected' : ''}>Rusak / Terbuka</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECTION D: PENGUJIAN ORGANOLEPTIK (INTERACTIVE MATRIX) -->
            <div class="mbg-section-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="mbg-section-title m-0 pb-0 border-0 text-dark">
                        <i class="fas fa-vial text-teal"></i> Pengujian Organoleptik (Uji Rasa & Mutu Makanan)
                    </div>
                    <span class="badge bg-light text-muted border px-2 py-1 small">
                        *Dilakukan pada min. 1 porsi sampel sebelum didistribusikan
                    </span>
                </div>

                <div class="table-responsive mb-3">
                    <table class="table table-bordered align-middle organoleptic-table mb-0">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 140px;" class="text-center">Aspek Pengujian</th>
                                <th>Pilihan Parameter Uji</th>
                                <th style="width: 320px;">Catatan Pengujian & Temuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Aroma -->
                            <tr>
                                <td class="fw-bold text-center bg-light">AROMA</td>
                                <td>
                                    <div class="organoleptic-chip-group">
                                        ${_renderChip('aroma', 'Segar', r.uji_aroma, true)}
                                        ${_renderChip('aroma', 'Busuk', r.uji_aroma, false)}
                                        ${_renderChip('aroma', 'Apek', r.uji_aroma, false)}
                                        ${_renderChip('aroma', 'Asam', r.uji_aroma, false)}
                                    </div>
                                </td>
                                <td rowspan="4" class="align-top bg-light">
                                    <label class="form-label small fw-bold text-muted mb-1">Catatan Pengujian Komprehensif:</label>
                                    <textarea class="form-control" name="uji_catatan" rows="8" placeholder="Tuliskan catatan rasa, suhu, konsistensi, atau jika ditemukan ketidaksesuaian...">${r.uji_catatan || ''}</textarea>
                                </td>
                            </tr>
                            <!-- Tampilan -->
                            <tr>
                                <td class="fw-bold text-center bg-light">TAMPILAN</td>
                                <td>
                                    <div class="organoleptic-chip-group">
                                        ${_renderChip('tampilan', 'Bersih', r.uji_tampilan, true)}
                                        ${_renderChip('tampilan', 'Gosong', r.uji_tampilan, false)}
                                        ${_renderChip('tampilan', 'Berlendir', r.uji_tampilan, false)}
                                        ${_renderChip('tampilan', 'Pucat', r.uji_tampilan, false)}
                                    </div>
                                </td>
                            </tr>
                            <!-- Rasa -->
                            <tr>
                                <td class="fw-bold text-center bg-light">RASA</td>
                                <td>
                                    <div class="organoleptic-chip-group">
                                        ${_renderChip('rasa', 'Normal', r.uji_rasa, true)}
                                        ${_renderChip('rasa', 'Terlalu Manis', r.uji_rasa, false)}
                                        ${_renderChip('rasa', 'Hambar', r.uji_rasa, false)}
                                        ${_renderChip('rasa', 'Terlalu Asin', r.uji_rasa, false)}
                                        ${_renderChip('rasa', 'Basi', r.uji_rasa, false)}
                                    </div>
                                </td>
                            </tr>
                            <!-- Tekstur -->
                            <tr>
                                <td class="fw-bold text-center bg-light">TEKSTUR</td>
                                <td>
                                    <div class="organoleptic-chip-group">
                                        ${_renderChip('tekstur', 'Empuk', r.uji_tekstur, true)}
                                        ${_renderChip('tekstur', 'Lembek Berair', r.uji_tekstur, false)}
                                        ${_renderChip('tekstur', 'Keras', r.uji_tekstur, false)}
                                        ${_renderChip('tekstur', 'Lengket Menggumpal', r.uji_tekstur, false)}
                                        ${_renderChip('tekstur', 'Mentah', r.uji_tekstur, false)}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Kesimpulan Pengujian Radio -->
                <div class="p-3 rounded-3 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style="background:#f8fafc;">
                    <div>
                        <span class="fw-bold text-dark fs-6"><i class="fas fa-clipboard-check text-primary me-2"></i>KESIMPULAN PENGUJIAN:</span>
                        <div class="small text-muted mt-1">Makanan hanya boleh diedarkan jika dinyatakan <strong>Layak Edar</strong>.</div>
                    </div>
                    <div class="d-flex gap-3">
                        <label class="btn btn-outline-success fw-bold px-4 py-2 d-flex align-items-center gap-2 cursor-pointer ${r.kesimpulan_pengujian === 'Layak Edar' ? 'active' : ''}">
                            <input type="radio" name="kesimpulan_pengujian" value="Layak Edar" ${r.kesimpulan_pengujian === 'Layak Edar' ? 'checked' : ''} onchange="EduMbg.onKesimpulanChange(this.value)">
                            <i class="fas fa-check-circle"></i> LAYAK EDAR
                        </label>
                        <label class="btn btn-outline-danger fw-bold px-4 py-2 d-flex align-items-center gap-2 cursor-pointer ${r.kesimpulan_pengujian === 'Tidak Layak Edar' ? 'active' : ''}">
                            <input type="radio" name="kesimpulan_pengujian" value="Tidak Layak Edar" ${r.kesimpulan_pengujian === 'Tidak Layak Edar' ? 'checked' : ''} onchange="EduMbg.onKesimpulanChange(this.value)">
                            <i class="fas fa-times-circle"></i> TIDAK LAYAK EDAR
                        </label>
                    </div>
                </div>
            </div>

            <!-- SECTION E: VERIFIKASI PENGUJI & KEPALA SEKOLAH -->
            <div class="mbg-section-card">
                <div class="mbg-section-title text-dark">
                    <i class="fas fa-signature text-teal"></i> Verifikasi Otorisasi & Tanda Tangan
                </div>
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="p-3 border rounded-3 h-100">
                            <h6 class="fw-bold text-primary mb-3"><i class="fas fa-user-shield me-1"></i> Penguji (Tim Gizi / Pemeriksa)</h6>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Nama Penguji</label>
                                <input type="text" class="form-control" name="penguji_nama" value="${r.penguji_nama || ''}" placeholder="Nama Penguji / Ustadz Tim Gizi" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Kontak Penguji</label>
                                <input type="text" class="form-control" name="penguji_kontak" value="${r.penguji_kontak || ''}" placeholder="0813-xxxx-xxxx">
                            </div>
                            <div class="p-3 bg-light rounded text-center border">
                                <i class="fas fa-check-circle text-success fs-5 mb-1"></i>
                                <div class="small fw-bold text-dark">Tanda Tangan Digital Tersimpan</div>
                                <div class="text-muted" style="font-size:11px;">Otorisasi Uji Organoleptik Terverifikasi</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="p-3 border rounded-3 h-100">
                            <h6 class="fw-bold text-success mb-3"><i class="fas fa-stamp me-1"></i> Kepala Sekolah / Staff Umum</h6>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Nama Kepala Sekolah / Pejabat Otoritas</label>
                                <input type="text" class="form-control" name="kepala_sekolah_nama" value="${r.kepala_sekolah_nama || ''}" placeholder="Ustadz Ibrahim, M.Pd" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">Jabatan</label>
                                <input type="text" class="form-control bg-light" value="Kepala Sekolah SD At-Tibyan" readonly>
                            </div>
                            <div class="p-3 bg-light rounded text-center border">
                                <i class="fas fa-check-double text-teal fs-5 mb-1"></i>
                                <div class="small fw-bold text-dark">Persetujuan Distribusi Aktif</div>
                                <div class="text-muted" style="font-size:11px;">Disetujui untuk konsumsi harian santri</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Submit Buttons -->
            <div class="d-flex justify-content-end gap-3 mb-5">
                <button type="button" class="btn btn-light border px-4 py-2 fw-bold" onclick="EduMbg.switchTab('history')">
                    Batal
                </button>
                <button type="submit" id="btn-save-mbg" class="btn btn-primary-atlas px-5 py-3 fw-bold fs-6">
                    <i class="fas fa-save me-2"></i> Simpan Form Penerimaan MBG
                </button>
            </div>

        </form>`;
    }

    function _renderChip(aspect, label, currentValues, isPositive) {
        const values = Array.isArray(currentValues) ? currentValues : [];
        const isChecked = values.includes(label);
        const cssClass = isChecked ? (isPositive ? 'selected-positive' : 'selected-negative') : '';

        return `
        <label class="organoleptic-chip ${cssClass}" onclick="EduMbg.toggleChip(this, '${isPositive ? 'pos' : 'neg'}')">
            <input type="checkbox" name="uji_${aspect}" value="${label}" ${isChecked ? 'checked' : ''}>
            <i class="fas ${isChecked ? 'fa-check-square' : 'fa-square'}"></i> ${label}
        </label>`;
    }

    function toggleChip(labelEl, type) {
        const input = labelEl.querySelector('input');
        input.checked = !input.checked;
        const icon = labelEl.querySelector('i');

        if (input.checked) {
            icon.className = 'fas fa-check-square';
            labelEl.classList.add(type === 'pos' ? 'selected-positive' : 'selected-negative');
        } else {
            icon.className = 'fas fa-square';
            labelEl.classList.remove('selected-positive', 'selected-negative');
        }
    }

    function calcTotalPax() {
        const normal = Number(document.getElementById('input-jml-normal')?.value) || 0;
        const alergi = Number(document.getElementById('input-jml-alergi')?.value) || 0;
        const total = normal + alergi;
        
        const totalInput = document.getElementById('input-jml-total');
        if (totalInput) totalInput.value = total;

        const kpiTotal = document.getElementById('kpi-total-pax');
        if (kpiTotal) kpiTotal.innerText = `${total} Pax`;

        const kpiNormal = document.getElementById('kpi-normal-pax');
        if (kpiNormal) kpiNormal.innerText = normal;

        const kpiAlergi = document.getElementById('kpi-alergi-pax');
        if (kpiAlergi) kpiAlergi.innerText = alergi;
    }

    function onKesimpulanChange(val) {
        const badge = document.getElementById('kpi-kesimpulan-badge');
        if (!badge) return;
        if (val === 'Layak Edar') {
            badge.className = 'mbg-badge-layak fs-6';
            badge.innerHTML = '<i class="fas fa-check-circle"></i> Layak Edar';
        } else {
            badge.className = 'mbg-badge-tidak-layak fs-6';
            badge.innerHTML = '<i class="fas fa-times-circle"></i> Tidak Layak Edar';
        }
    }

    // ── 2. HISTORY / ARCHIVE VIEW ────────────────────────────────────────────
    function _renderHistoryView(container) {
        container.innerHTML = `
        <div class="mbg-section-card">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                <div class="mbg-section-title m-0 pb-0 border-0">
                    <i class="fas fa-history text-teal"></i> Log Riwayat Penerimaan Harian MBG
                </div>
                <div class="d-flex gap-2">
                    <input type="text" id="mbg-search-input" class="form-control form-control-sm" placeholder="Cari nomor dok / menu / kurir..." onkeyup="EduMbg.filterRecords(this.value)">
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small text-uppercase">
                        <tr>
                            <th>No. Dokumen</th>
                            <th>Tanggal & Waktu</th>
                            <th>Menu Utama</th>
                            <th>Porsi Normal / Alergi</th>
                            <th>Pengantar / Kurir</th>
                            <th>Hasil Uji Mutu</th>
                            <th class="text-end">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="mbg-records-tbody">
                        ${_records.map(r => `
                        <tr>
                            <td class="fw-bold font-monospace text-primary">${r.nomor_dokumen}</td>
                            <td>
                                <div class="fw-bold text-dark">${r.hari}, ${r.tanggal}</div>
                                <div class="small text-muted">${r.waktu}</div>
                            </td>
                            <td>
                                <div class="fw-semibold text-dark">${r.menu_karbohidrat} + ${r.menu_lauk}</div>
                                <div class="small text-muted">${r.menu_sayur} · ${r.menu_buah_susu}</div>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark border fw-bold">${r.jumlah_normal || 0} Normal</span>
                                <span class="badge bg-amber-subtle text-amber-800 fw-bold">${r.jumlah_diet_alergi || 0} Alergi</span>
                                <div class="small fw-bold text-success mt-1">Total: ${r.jumlah_total || 0} Pax</div>
                            </td>
                            <td>
                                <div class="fw-bold text-dark">${r.pengantar_nama}</div>
                                <div class="small text-muted font-monospace">${r.pengantar_plat_no || '-'}</div>
                            </td>
                            <td>
                                <span class="${r.kesimpulan_pengujian === 'Layak Edar' ? 'mbg-badge-layak' : 'mbg-badge-tidak-layak'}">
                                    <i class="fas ${r.kesimpulan_pengujian === 'Layak Edar' ? 'fa-check' : 'fa-times'}"></i> ${r.kesimpulan_pengujian}
                                </span>
                            </td>
                            <td class="text-end">
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-light border" title="Lihat / Edit" onclick="EduMbg.loadRecord(${r.id})">
                                        <i class="fas fa-edit text-primary"></i>
                                    </button>
                                    <button class="btn btn-light border" title="Cetak Lembar Resmi" onclick="EduMbg.printRecord(${r.id})">
                                        <i class="fas fa-print text-teal"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    // ── 3. OFFICIAL 1:1 PAPER PRINT VIEW (Pixel-perfect replica of reference image) ──
    function _renderPrintView(container) {
        const r = _currentRecord || _getDefaultFormState();

        const aromaArr = _parseArray(r.uji_aroma);
        const tampilanArr = _parseArray(r.uji_tampilan);
        const rasaArr = _parseArray(r.uji_rasa);
        const teksturArr = _parseArray(r.uji_tekstur);

        container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3 no-print">
            <div>
                <h5 class="fw-bold text-dark m-0">Format Lembar Cetak Dokumen Terkendali (FORM-MBG-01 REV-00)</h5>
                <p class="text-muted small m-0">Tata letak standar formulir fisik SD At-Tibyan siap dicetak / simpan sebagai PDF.</p>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm fw-bold" onclick="EduMbg.switchTab('form')">
                    <i class="fas fa-arrow-left me-1"></i> Kembali ke Form
                </button>
                <button class="btn btn-primary-atlas btn-sm fw-bold px-3" onclick="window.print()">
                    <i class="fas fa-print me-1"></i> Cetak Dokumen Sekarang
                </button>
            </div>
        </div>

        <div class="official-paper-wrapper">
            <div class="official-paper-sheet">
                
                <!-- HEADER TABLE (Logo, Judul, No Dokumen) -->
                <table class="official-doc-table mb-0" style="border-bottom:none;">
                    <tr>
                        <td style="width: 22%; text-align: center; vertical-align: middle; padding: 10px 8px;">
                            <div style="display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                                <div style="width:32px; height:32px; background:linear-gradient(135deg,#0891b2,#059669); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff;">
                                    <i class="fas fa-graduation-cap" style="font-size:16px;"></i>
                                </div>
                                <div style="text-align:left; line-height:1.1;">
                                    <strong style="font-size:14px; color:#03ac0e; font-weight:900; display:block;">SD</strong>
                                    <span style="font-size:11px; font-weight:800; color:#1e293b;">At-Tibyan</span>
                                </div>
                            </div>
                        </td>
                        <td style="width: 53%; vertical-align: middle; padding: 10px 14px;">
                            <div class="official-header-title" style="font-size:14px; font-weight:900; letter-spacing:-0.2px;">
                                FORM PENERIMAAN HARIAN<br>
                                PROGRAM MAKAN BERGIZI GRATIS (MBG)
                            </div>
                            <div style="font-size:11px; font-weight:700; margin-top:4px;">
                                Nomor: ${r.nomor_dokumen || 'FRM-MBG-01/SD/08/2026/001'}
                            </div>
                        </td>
                        <td style="width: 25%; background:#e0f2fe; text-align:center; vertical-align:middle; border-left:1.5px solid #000;">
                            <span style="font-size:10px; font-weight:800; color:#0369a1; text-transform:uppercase; letter-spacing:0.05em;">
                                SD AT-TIBYAN<br>BANDUNG
                            </span>
                        </td>
                    </tr>
                </table>

                <!-- MAIN SPLIT TABLE (Komposisi Menu vs Penerima/Pengantar) -->
                <table class="official-doc-table mb-0" style="border-top:none; border-bottom:none;">
                    <tr>
                        
                        <!-- LEFT COLUMN: KOMPOSISI MENU & DIET ALERGI -->
                        <td style="width: 55%; padding: 0; vertical-align: top;">
                            <table style="width:100%; border-collapse:collapse;">
                                <tr>
                                    <td colspan="2" class="official-section-heading" style="border-top:none; border-left:none; border-right:none; background:#f8fafc;">
                                        KOMPOSISI MENU DETAIL
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:38%; font-weight:700; border-left:none;">KARBOHIDRAT</td>
                                    <td style="border-right:none;">${r.menu_karbohidrat || ''}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">LAUK HEWANI/NABATI</td>
                                    <td style="border-right:none;">${r.menu_lauk || ''}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">SAYUR</td>
                                    <td style="border-right:none;">${r.menu_sayur || ''}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">BUAH/SUSU</td>
                                    <td style="border-right:none;">${r.menu_buah_susu || ''}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="official-section-heading" style="border-left:none; border-right:none; background:#f8fafc;">
                                        DIET KHUSUS BAGI YANG ALERGI
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">KARBOHIDRAT</td>
                                    <td style="border-right:none;">${r.diet_karbohidrat || '-'}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">LAUK HEWANI/NABATI</td>
                                    <td style="border-right:none;">${r.diet_lauk || '-'}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none;">SAYUR</td>
                                    <td style="border-right:none;">${r.diet_sayur || '-'}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700; border-left:none; border-bottom:none;">BUAH/SUSU</td>
                                    <td style="border-right:none; border-bottom:none;">${r.diet_buah_susu || '-'}</td>
                                </tr>
                            </table>
                        </td>

                        <!-- RIGHT COLUMN: PENERIMA & PENGANTAR -->
                        <td style="width: 45%; padding: 0; vertical-align: top;">
                            <table style="width:100%; border-collapse:collapse;">
                                <tr>
                                    <!-- PENERIMA -->
                                    <td style="width:50%; text-align:center; font-weight:800; border-top:none; border-left:none; background:#f8fafc;">PENERIMA</td>
                                    <!-- PENGANTAR -->
                                    <td style="width:50%; text-align:center; font-weight:800; border-top:none; border-right:none; background:#f8fafc;">PENGANTAR</td>
                                </tr>
                                <tr>
                                    <!-- Penerima Info -->
                                    <td style="vertical-align:top; border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700; color:#555;">NAMA:</div>
                                        <div style="font-weight:700; min-height:16px;">${r.penerima_nama || ''}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">KONTAK:</div>
                                        <div>${r.penerima_kontak || '-'}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">TANDA TANGAN:</div>
                                        <div class="sig-zone">[TERVERIFIKASI]</div>
                                    </td>
                                    <!-- Pengantar Info -->
                                    <td style="vertical-align:top; border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700; color:#555;">NAMA:</div>
                                        <div style="font-weight:700; min-height:16px;">${r.pengantar_nama || ''}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">KONTAK:</div>
                                        <div>${r.pengantar_kontak || '-'}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">TANDA TANGAN:</div>
                                        <div class="sig-zone">[TERVERIFIKASI]</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">JUMLAH KEMASAN NORMAL</div>
                                        <div style="font-weight:900; font-size:12px;">${r.jumlah_normal || 0} PAX</div>
                                    </td>
                                    <td style="border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">BENTUK KEMASAN:</div>
                                        <div style="margin-top:2px;">
                                            <span class="official-checkbox-box">${r.bentuk_kemasan === 'Box' ? '✓' : ''}</span> Box
                                            <span class="official-checkbox-box" style="margin-left:8px;">${r.bentuk_kemasan === 'Tray' ? '✓' : ''}</span> Tray
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">JUMLAH KEMASAN DIET ALERGI</div>
                                        <div style="font-weight:900; font-size:12px;">${r.jumlah_diet_alergi || 0} PAX</div>
                                    </td>
                                    <td style="border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">PLAT NO. KENDARAAN:</div>
                                        <div style="font-weight:800; font-family:monospace;">${r.pengantar_plat_no || '-'}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">JUMLAH KEMASAN TOTAL</div>
                                        <div style="font-weight:900; font-size:13px; color:#047857;">${r.jumlah_total || 0} PAX</div>
                                    </td>
                                    <td style="border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">HARI & TANGGAL:</div>
                                        <div><strong>${r.hari}</strong>, ${r.tanggal}</div>
                                        <div style="font-size:9px; font-weight:700; margin-top:2px;">WAKTU: ${r.waktu}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="border-left:none; border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">KONDISI KEMASAN:</div>
                                        <div style="margin-top:2px;">
                                            <span class="official-checkbox-box">${r.kondisi_kemasan === 'Baik & Tersegel Rapat' ? '✓' : ''}</span> Baik & Tersegel Rapat &nbsp;&nbsp;&nbsp;
                                            <span class="official-checkbox-box">${r.kondisi_kemasan === 'Rusak / Terbuka' ? '✓' : ''}</span> Rusak / Terbuka
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">CATATAN PENERIMA KEMASAN:</div>
                                        <div style="font-size:10px; color:#333; min-height:24px;">${r.catatan_penerima || '-'}</div>
                                    </td>
                                    <td style="border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">CATATAN PENGANTAR:</div>
                                        <div style="font-size:10px; color:#333; min-height:24px;">${r.catatan_pengantar || '-'}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>

                    </tr>
                </table>

                <!-- SECTION LOWER: PENGUJIAN ORGANOLEPTIK & SIGN-OFF -->
                <table class="official-doc-table mb-2" style="border-top:none;">
                    <tr>
                        <!-- Organoleptic Sub-table -->
                        <td style="width: 55%; padding: 0; vertical-align: top;">
                            <table style="width:100%; border-collapse:collapse;">
                                <tr>
                                    <td colspan="3" class="official-section-heading" style="border-top:none; border-left:none; border-right:none; background:#f8fafc;">
                                        PENGUJIAN ORGANOLEPTIK
                                    </td>
                                </tr>
                                <tr>
                                    <td rowspan="4" style="width:14%; text-align:center; font-weight:800; border-left:none; font-size:10px; writing-mode:vertical-rl; transform:rotate(180deg); background:#f8fafc;">
                                        ASPEK PENGUJIAN
                                    </td>
                                    <td style="width:20%; font-weight:700;">AROMA</td>
                                    <td style="border-right:none;">
                                        <span class="official-checkbox-box">${aromaArr.includes('Segar') ? '✓' : ''}</span> Segar &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${aromaArr.includes('Busuk') ? '✓' : ''}</span> Busuk &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${aromaArr.includes('Apek') ? '✓' : ''}</span> Apek &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${aromaArr.includes('Asam') ? '✓' : ''}</span> Asam
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700;">TAMPILAN</td>
                                    <td style="border-right:none;">
                                        <span class="official-checkbox-box">${tampilanArr.includes('Bersih') ? '✓' : ''}</span> Bersih &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${tampilanArr.includes('Gosong') ? '✓' : ''}</span> Gosong &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${tampilanArr.includes('Berlendir') ? '✓' : ''}</span> Berlendir &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${tampilanArr.includes('Pucat') ? '✓' : ''}</span> Pucat
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700;">RASA</td>
                                    <td style="border-right:none;">
                                        <span class="official-checkbox-box">${rasaArr.includes('Normal') ? '✓' : ''}</span> Normal &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${rasaArr.includes('Terlalu Manis') ? '✓' : ''}</span> Terlalu Manis &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${rasaArr.includes('Hambar') ? '✓' : ''}</span> Hambar<br>
                                        <span class="official-checkbox-box">${rasaArr.includes('Terlalu Asin') ? '✓' : ''}</span> Terlalu Asin &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${rasaArr.includes('Basi') ? '✓' : ''}</span> Basi
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight:700;">TEKSTUR</td>
                                    <td style="border-right:none;">
                                        <span class="official-checkbox-box">${teksturArr.includes('Empuk') ? '✓' : ''}</span> Empuk &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${teksturArr.includes('Lembek Berair') ? '✓' : ''}</span> Lembek Berair &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${teksturArr.includes('Keras') ? '✓' : ''}</span> Keras<br>
                                        <span class="official-checkbox-box">${teksturArr.includes('Lengket Menggumpal') ? '✓' : ''}</span> Lengket Menggumpal &nbsp;&nbsp;
                                        <span class="official-checkbox-box">${teksturArr.includes('Mentah') ? '✓' : ''}</span> Mentah
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="border-left:none; border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700;">CATATAN PENGUJIAN:</div>
                                        <div style="min-height:24px; font-size:10px;">${r.uji_catatan || '-'}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="border-left:none; border-right:none; border-bottom:none; padding:6px; background:#f8fafc;">
                                        <div style="font-size:10px; font-weight:800; text-transform:uppercase;">KESIMPULAN PENGUJIAN:</div>
                                        <div style="margin-top:3px; font-weight:800;">
                                            <span class="official-checkbox-box">${r.kesimpulan_pengujian === 'Layak Edar' ? '✓' : ''}</span> Layak Edar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span class="official-checkbox-box">${r.kesimpulan_pengujian === 'Tidak Layak Edar' ? '✓' : ''}</span> Tidak Layak Edar
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <!-- Right: Sign-off Penguji & Kepala Sekolah -->
                        <td style="width: 45%; padding: 0; vertical-align: top;">
                            <table style="width:100%; border-collapse:collapse; height:100%;">
                                <tr>
                                    <td style="width:50%; text-align:center; font-weight:800; border-top:none; border-left:none; background:#f8fafc;">PENGUJI</td>
                                    <td style="width:50%; text-align:center; font-weight:800; border-top:none; border-right:none; background:#f8fafc;">KEPALA SEKOLAH/STAFF UMUM</td>
                                </tr>
                                <tr>
                                    <td style="vertical-align:top; border-left:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700; color:#555;">NAMA:</div>
                                        <div style="font-weight:700; min-height:16px;">${r.penguji_nama || ''}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">KONTAK:</div>
                                        <div>${r.penguji_kontak || '-'}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:8px;">TANDA TANGAN:</div>
                                        <div class="sig-zone" style="min-height:76px;">[TERVERIFIKASI]</div>
                                    </td>
                                    <td style="vertical-align:top; border-right:none; padding:4px 6px;">
                                        <div style="font-size:9px; font-weight:700; color:#555;">NAMA:</div>
                                        <div style="font-weight:700; min-height:16px;">${r.kepala_sekolah_nama || ''}</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:4px;">JABATAN:</div>
                                        <div>Kepala Sekolah / Staff</div>
                                        <div style="font-size:9px; font-weight:700; color:#555; margin-top:8px;">TANDA TANGAN:</div>
                                        <div class="sig-zone" style="min-height:76px;">[TERVERIFIKASI]</div>
                                    </td>
                                </tr>
                            </table>
                        </td>

                    </tr>
                </table>

                <!-- FOOTNOTE & CONTROLLED DOCUMENT BADGE -->
                <div class="d-flex justify-content-between align-items-end" style="font-size:9px; line-height:1.3; color:#333; margin-top:4px;">
                    <div>
                        <sup>*1</sup> UJI ORGANOLEPTIK DILAKUKAN PADA MIN. 1 PORSI SAMPEL SEBELUM SELURUH MAKANAN DIDISTRIBUSIKAN<br>
                        <sup>*2</sup> CONTOH PENULISAN: NISA (ALERGI NASI &rarr; JAGUNG), AHMAD (ALERGI TELUR &rarr; TAHU)
                    </div>
                    <table style="border:1px solid #000; border-collapse:collapse; font-size:8px; text-align:center;">
                        <tr>
                            <td colspan="2" style="border:1px solid #000; padding:1px 6px; font-weight:700; background:#f8fafc;">CONTROLLED DOCUMENT</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #000; padding:1px 6px; font-weight:800;">FORM-MBG-01</td>
                            <td style="border:1px solid #000; padding:1px 6px; font-weight:800;">REV-00</td>
                        </tr>
                    </table>
                </div>

            </div>
        </div>`;
    }

    function _parseArray(val) {
        if (Array.isArray(val)) return val;
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return typeof val === 'string' ? val.split(',').map(s => s.trim()) : [];
        }
    }

    // ── 4. DATA OPERATIONS (FETCH / SUBMIT) ───────────────────────────────────
    async function _loadRecords() {
        try {
            const res = await fetch(`${API_BASE}/api/get-mbg`);
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                _records = json.data;
            }
        } catch (e) {
            console.warn('[EduMbg] Local fallback mode:', e);
            if (_records.length === 0) {
                _records = [_getDefaultFormState()];
            }
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const btn = document.getElementById('btn-save-mbg');

        const formData = new FormData(form);
        const payload = {};
        formData.forEach((val, key) => {
            if (!payload[key]) {
                payload[key] = val;
            } else {
                if (!Array.isArray(payload[key])) {
                    payload[key] = [payload[key]];
                }
                payload[key].push(val);
            }
        });

        // Collect arrays for checkboxes
        payload.uji_aroma = formData.getAll('uji_aroma');
        payload.uji_tampilan = formData.getAll('uji_tampilan');
        payload.uji_rasa = formData.getAll('uji_rasa');
        payload.uji_tekstur = formData.getAll('uji_tekstur');

        if (_currentRecord && _currentRecord.id) {
            payload.id = _currentRecord.id;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Menyimpan...';

        try {
            const resp = await fetch(`${API_BASE}/api/submit-mbg`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();

            if (data.success) {
                alert('✅ ' + data.message);
                await _loadRecords();
                _currentRecord = _records.find(x => x.id === data.id) || _records[0] || payload;
                switchTab('print');
            } else {
                alert('❌ Gagal: ' + (data.error || 'Terjadi kesalahan'));
            }
        } catch (err) {
            console.error('[submit-mbg] Error:', err);
            alert('❌ Gagal menghubungi server. Data disimpan secara lokal.');
            _records.unshift(payload);
            _currentRecord = payload;
            switchTab('print');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-save me-2"></i> Simpan Form Penerimaan MBG';
            }
        }
    }

    function newForm() {
        _currentRecord = _getDefaultFormState();
        _currentRecord.id = null;
        switchTab('form');
    }

    function loadRecord(id) {
        const found = _records.find(r => r.id === Number(id));
        if (found) {
            _currentRecord = found;
            switchTab('form');
        }
    }

    function printRecord(id) {
        const found = _records.find(r => r.id === Number(id));
        if (found) {
            _currentRecord = found;
            switchTab('print');
        }
    }

    function printCurrentDoc() {
        switchTab('print');
        setTimeout(() => {
            window.print();
        }, 300);
    }

    function filterRecords(query) {
        const term = query.toLowerCase().trim();
        const tbody = document.getElementById('mbg-records-tbody');
        if (!tbody) return;

        const filtered = _records.filter(r => 
            (r.nomor_dokumen || '').toLowerCase().includes(term) ||
            (r.menu_karbohidrat || '').toLowerCase().includes(term) ||
            (r.menu_lauk || '').toLowerCase().includes(term) ||
            (r.pengantar_nama || '').toLowerCase().includes(term) ||
            (r.penerima_nama || '').toLowerCase().includes(term)
        );

        tbody.innerHTML = filtered.map(r => `
        <tr>
            <td class="fw-bold font-monospace text-primary">${r.nomor_dokumen}</td>
            <td>
                <div class="fw-bold text-dark">${r.hari}, ${r.tanggal}</div>
                <div class="small text-muted">${r.waktu}</div>
            </td>
            <td>
                <div class="fw-semibold text-dark">${r.menu_karbohidrat} + ${r.menu_lauk}</div>
                <div class="small text-muted">${r.menu_sayur} · ${r.menu_buah_susu}</div>
            </td>
            <td>
                <span class="badge bg-light text-dark border fw-bold">${r.jumlah_normal || 0} Normal</span>
                <span class="badge bg-amber-subtle text-amber-800 fw-bold">${r.jumlah_diet_alergi || 0} Alergi</span>
                <div class="small fw-bold text-success mt-1">Total: ${r.jumlah_total || 0} Pax</div>
            </td>
            <td>
                <div class="fw-bold text-dark">${r.pengantar_nama}</div>
                <div class="small text-muted font-monospace">${r.pengantar_plat_no || '-'}</div>
            </td>
            <td>
                <span class="${r.kesimpulan_pengujian === 'Layak Edar' ? 'mbg-badge-layak' : 'mbg-badge-tidak-layak'}">
                    <i class="fas ${r.kesimpulan_pengujian === 'Layak Edar' ? 'fa-check' : 'fa-times'}"></i> ${r.kesimpulan_pengujian}
                </span>
            </td>
            <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-light border" title="Lihat / Edit" onclick="EduMbg.loadRecord(${r.id})">
                        <i class="fas fa-edit text-primary"></i>
                    </button>
                    <button class="btn btn-light border" title="Cetak Lembar Resmi" onclick="EduMbg.printRecord(${r.id})">
                        <i class="fas fa-print text-teal"></i>
                    </button>
                </div>
            </td>
        </tr>
        `).join('');
    }

    return {
        openModule,
        switchTab,
        handleFormSubmit,
        toggleChip,
        calcTotalPax,
        onKesimpulanChange,
        newForm,
        loadRecord,
        printRecord,
        printCurrentDoc,
        filterRecords
    };

})();
