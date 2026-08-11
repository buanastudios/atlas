/**
 * Project Atlas — Client-Side SPA Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 * Enables 100% full-feature execution on static servers (python -m http.server, npx serve, Vercel, Netlify)
 */

window.AtlasSPA = (function() {
    let settings = {};
    let ekskulList = [];

    const defaultSettings = {
        brand_name: "Atlas",
        sub_brand: "Buana Studios",
        hero_image: "assets/images/hero_1.jpg",
        tab_login_text: "Log in",
        tab_register_text: "Create account",
        email_label: "Email",
        email_placeholder: "E.g; sakti@buana.studio",
        password_label: "Password",
        password_placeholder: "••••••••••••",
        remember_text: "Keep me logged in on this device",
        button_text: "Log in",
        button_color: "#38bdf8",
        forgot_password_text: "I forgot my password",
        spotlight_name: "Hikmatullah Sakti Buana",
        spotlight_role: "Founder & Lead Architect @ Buana Studios",
        spotlight_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hikmatullah"
    };

    const defaultEkskul = [
        { id: 1, nama: 'Aikido', nama_arab: 'أيكيدو', deskripsi: 'Seni bela diri Aikido', nilai_count: 0, status: 'Aktif' },
        { id: 2, nama: 'Archery', nama_arab: 'الرماية', deskripsi: 'Olahraga panahan', nilai_count: 0, status: 'Aktif' },
        { id: 3, nama: 'Badminton', nama_arab: 'كرة الريشة', deskripsi: 'Klub bulutangkis', nilai_count: 0, status: 'Aktif' },
        { id: 4, nama: 'Basket', nama_arab: 'كرة السلة', deskripsi: 'Tim basket', nilai_count: 0, status: 'Aktif' },
        { id: 5, nama: 'Brazilian Jiu Jitsu', nama_arab: 'جيو جيتسو', deskripsi: 'Bela diri ground fighting', nilai_count: 0, status: 'Aktif' },
        { id: 6, nama: 'Calligraphy', nama_arab: 'الخط العربي', deskripsi: 'Seni khat & kaligrafi', nilai_count: 5, status: 'Aktif' },
        { id: 7, nama: 'Horse Riding', nama_arab: 'ركوب الخيل', deskripsi: 'Keterampilan berkuda', nilai_count: 0, status: 'Aktif' },
        { id: 8, nama: 'Swimming', nama_arab: 'السباحة', deskripsi: 'Olahraga renang', nilai_count: 12, status: 'Aktif' },
        { id: 9, nama: 'Taekwondo', nama_arab: 'التايكوندو', deskripsi: 'Seni bela diri Taekwondo', nilai_count: 0, status: 'Aktif' },
        { id: 10, nama: 'Volley', nama_arab: 'كرة الطائرة', deskripsi: 'Klub voli', nilai_count: 0, status: 'Aktif' }
    ];

    async function init() {
        loadSettings();
        loadEkskul();
        window.addEventListener('hashchange', renderPage);
        renderPage();
    }

    function loadSettings() {
        const local = localStorage.getItem('atlas_settings');
        if (local) {
            try { settings = JSON.parse(local); return; } catch(e){}
        }
        fetch('config/settings.json')
            .then(res => res.json())
            .then(data => {
                settings = Object.assign({}, defaultSettings, data);
                localStorage.setItem('atlas_settings', JSON.stringify(settings));
                renderPage();
            })
            .catch(() => {
                settings = defaultSettings;
            });
    }

    function saveSettings(newSettings) {
        settings = Object.assign({}, settings, newSettings);
        localStorage.setItem('atlas_settings', JSON.stringify(settings));
        renderPage();
    }

    function loadEkskul() {
        const local = localStorage.getItem('atlas_ekskul');
        if (local) {
            try { ekskulList = JSON.parse(local); return; } catch(e){}
        }
        ekskulList = defaultEkskul;
        localStorage.setItem('atlas_ekskul', JSON.stringify(ekskulList));
    }

    function saveEkskul(list) {
        ekskulList = list;
        localStorage.setItem('atlas_ekskul', JSON.stringify(ekskulList));
    }

    function getRoute() {
        const hash = window.location.hash.replace('#', '') || 'login';
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('page') || hash || 'login';
    }

    function renderPage() {
        const route = getRoute();
        const appContainer = document.getElementById('spa-app');
        if (!appContainer) return;

        if (route === 'login') {
            appContainer.innerHTML = renderLoginView();
            initAuthListeners();
        } else if (route === 'signup') {
            appContainer.innerHTML = renderSignupView();
            initAuthListeners();
        } else {
            appContainer.innerHTML = renderLayoutWrapper(route);
            initLayoutListeners(route);
        }
    }

    // --- VIEW RENDERERS ---

    function renderLoginView() {
        const s = settings;
        return `
        <div class="kit-login-wrapper">
            <div class="container-fluid p-0">
                <div class="row g-0 min-vh-100">
                    <div class="col-12 col-lg-5 col-xl-5 d-flex align-items-center justify-content-center bg-white">
                        <div class="kit-login-left">
                            <div class="kit-logo-brand d-flex align-items-center gap-2 mb-4">
                                <img src="assets/images/atlas-logo.svg" alt="Atlas Logo" style="height: 48px; width: auto;">
                                <span class="text-dark fw-bold" style="font-size: 30px; font-family: 'Inter', sans-serif; letter-spacing: -1.5px;">${escapeHtml(s.brand_name)}</span>
                                ${s.sub_brand ? `<span class="badge bg-teal-subtle text-teal fs-6 font-monospace ms-1">${escapeHtml(s.sub_brand)}</span>` : ''}
                            </div>
                            <div class="kit-tabs-nav">
                                <a href="#login" class="kit-tab-item active">${escapeHtml(s.tab_login_text)}</a>
                                <a href="#signup" class="kit-tab-item text-muted">${escapeHtml(s.tab_register_text)}</a>
                            </div>
                            <form id="spa-login-form" onsubmit="event.preventDefault(); window.location.hash='dashboard';">
                                <div class="mb-4">
                                    <label class="kit-label d-block mb-1">${escapeHtml(s.email_label)} <span class="req">*</span></label>
                                    <input type="email" class="kit-input" placeholder="${escapeHtml(s.email_placeholder)}" value="sakti@buana.studio" required autofocus>
                                </div>
                                <div class="mb-4">
                                    <label class="kit-label d-block mb-1">${escapeHtml(s.password_label)} <span class="req">*</span></label>
                                    <div class="position-relative">
                                        <input type="password" id="spa-password" class="kit-input pe-5" placeholder="${escapeHtml(s.password_placeholder)}" value="password" required>
                                        <button type="button" id="spa-toggle-pwd" class="btn border-0 text-muted position-absolute end-0 top-50 translate-middle-y me-2 p-1">
                                            <i class="far fa-eye" id="spa-eye-icon"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-check mb-4">
                                    <input class="form-check-input" type="checkbox" id="spa-remember" checked>
                                    <label class="form-check-label text-muted small ms-1" for="spa-remember">${escapeHtml(s.remember_text)}</label>
                                </div>
                                <button type="submit" class="btn-kit-action py-3 mb-4" style="background-color: ${s.button_color};">
                                    ${escapeHtml(s.button_text)}
                                </button>
                                <div class="text-center">
                                    <a href="#" class="text-muted small text-decoration-none">${escapeHtml(s.forgot_password_text)}</a>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-lg-7 col-xl-7 d-none d-lg-block kit-login-right" style="background-image: url('${escapeHtml(s.hero_image)}');">
                        <div class="kit-spotlight-card">
                            ${s.spotlight_avatar ? `<img src="${escapeHtml(s.spotlight_avatar)}" class="kit-spotlight-avatar">` : `<div class="kit-spotlight-avatar d-flex align-items-center justify-content-center bg-teal text-white fw-bold">${s.spotlight_name.charAt(0)}</div>`}
                            <div>
                                <div class="kit-spotlight-name">${escapeHtml(s.spotlight_name)}</div>
                                <div class="kit-spotlight-role">${escapeHtml(s.spotlight_role)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderSignupView() {
        const s = settings;
        return `
        <div class="kit-login-wrapper">
            <div class="container-fluid p-0">
                <div class="row g-0 min-vh-100">
                    <div class="col-12 col-lg-5 col-xl-5 d-flex align-items-center justify-content-center bg-white">
                        <div class="kit-login-left">
                            <div class="kit-logo-brand d-flex align-items-center gap-2 mb-4">
                                <img src="assets/images/atlas-logo.svg" alt="Atlas Logo" style="height: 48px; width: auto;">
                                <span class="text-dark fw-bold" style="font-size: 30px; font-family: 'Inter', sans-serif; letter-spacing: -1.5px;">${escapeHtml(s.brand_name)}</span>
                                ${s.sub_brand ? `<span class="badge bg-teal-subtle text-teal fs-6 font-monospace ms-1">${escapeHtml(s.sub_brand)}</span>` : ''}
                            </div>
                            <div class="kit-tabs-nav">
                                <a href="#login" class="kit-tab-item text-muted">${escapeHtml(s.tab_login_text)}</a>
                                <a href="#signup" class="kit-tab-item active">${escapeHtml(s.tab_register_text)}</a>
                            </div>
                            <form id="spa-signup-form" onsubmit="event.preventDefault(); alert('Akun berhasil dibuat!'); window.location.hash='dashboard';">
                                <div class="mb-3">
                                    <label class="kit-label d-block mb-1">Nama Lengkap / First Name <span class="req">*</span></label>
                                    <input type="text" class="kit-input" placeholder="E.g; Jane" required autofocus>
                                </div>
                                <div class="mb-3">
                                    <label class="kit-label d-block mb-1">${escapeHtml(s.email_label)} <span class="req">*</span></label>
                                    <input type="email" class="kit-input" placeholder="${escapeHtml(s.email_placeholder)}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="kit-label d-block mb-1">${escapeHtml(s.password_label)} <span class="req">*</span></label>
                                    <div class="position-relative">
                                        <input type="password" id="spa-password" class="kit-input pe-5" placeholder="Minimal 8 karakter" required>
                                        <button type="button" id="spa-toggle-pwd" class="btn border-0 text-muted position-absolute end-0 top-50 translate-middle-y me-2 p-1">
                                            <i class="far fa-eye" id="spa-eye-icon"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="form-check mb-4">
                                    <input class="form-check-input" type="checkbox" id="spa-terms" required checked>
                                    <label class="form-check-label text-muted small ms-1" for="spa-terms">
                                        Saya menyetujui Syarat & Ketentuan Layanan
                                    </label>
                                </div>
                                <button type="submit" class="btn-kit-action py-3 mb-4" style="background-color: ${s.button_color};">
                                    ${escapeHtml(s.tab_register_text)}
                                </button>
                                <div class="text-center">
                                    <span class="text-muted small">Sudah punya akun? </span>
                                    <a href="#login" class="fw-semibold text-decoration-none">Masuk sekarang</a>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-lg-7 col-xl-7 d-none d-lg-block kit-login-right" style="background-image: url('${escapeHtml(s.hero_image)}');">
                        <div class="kit-spotlight-card">
                            ${s.spotlight_avatar ? `<img src="${escapeHtml(s.spotlight_avatar)}" class="kit-spotlight-avatar">` : `<div class="kit-spotlight-avatar d-flex align-items-center justify-content-center bg-teal text-white fw-bold">${s.spotlight_name.charAt(0)}</div>`}
                            <div>
                                <div class="kit-spotlight-name">${escapeHtml(s.spotlight_name)}</div>
                                <div class="kit-spotlight-role">${escapeHtml(s.spotlight_role)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderLayoutWrapper(route) {
        return `
        <header class="kit-header d-flex align-items-center justify-content-between px-4">
            <div class="d-flex align-items-center gap-3">
                <a href="#dashboard" class="d-flex align-items-center gap-2 text-decoration-none">
                    <img src="assets/images/atlas-logo.svg" alt="Atlas Logo" style="height: 32px; width: auto;">
                    <span class="fw-bold fs-5 text-dark tracking-tight">${escapeHtml(settings.brand_name)}</span>
                </a>
            </div>
            <div class="d-flex align-items-center gap-4">
                <div class="d-none d-md-block text-muted small" id="liveDateTime"></div>
                <div class="dropdown">
                    <button class="btn btn-kit-secondary d-flex align-items-center gap-2 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle fs-5 text-primary"></i>
                        <span class="d-none d-sm-inline fw-semibold">Administrator</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                        <li><a class="dropdown-item small" href="#settings"><i class="fas fa-sliders-h me-2 text-muted"></i> Pengaturan White Label</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item small text-danger" href="#login"><i class="fas fa-sign-out-alt me-2"></i> Keluar</a></li>
                    </ul>
                </div>
            </div>
        </header>

        <div class="container-fluid p-0">
            <div class="d-flex">
                <aside class="kit-sidebar">
                    <div class="small fw-semibold text-muted text-uppercase px-3 mb-2 tracking-wider" style="font-size: 11px;">Menu Utama</div>
                    <nav class="nav flex-column">
                        <a class="nav-link ${route === 'dashboard' ? 'active' : ''}" href="#dashboard"><i class="fas fa-th-large width-20"></i><span>Dashboard</span></a>
                        <a class="nav-link ${route === 'ekstrakurikuler' ? 'active' : ''}" href="#ekstrakurikuler"><i class="fas fa-running width-20"></i><span>Ekstrakurikuler</span></a>
                        <a class="nav-link" href="#"><i class="fas fa-graduation-cap width-20"></i><span>Akademik</span></a>
                        <a class="nav-link" href="#"><i class="fas fa-user-graduate width-20"></i><span>Data Santri</span></a>
                    </nav>
                    <div class="small fw-semibold text-muted text-uppercase px-3 mt-4 mb-2 tracking-wider" style="font-size: 11px;">Sistem</div>
                    <nav class="nav flex-column">
                        <a class="nav-link ${route === 'settings' ? 'active' : ''}" href="#settings"><i class="fas fa-sliders-h width-20"></i><span>Pengaturan Login</span></a>
                        <a class="nav-link text-danger" href="#login"><i class="fas fa-sign-out-alt width-20"></i><span>Keluar</span></a>
                    </nav>
                </aside>

                <main class="flex-grow-1 p-3 p-md-4" style="min-height: calc(100vh - 64px); background-color: var(--kit-bg-body);">
                    ${route === 'settings' ? renderSettingsPage() : (route === 'ekstrakurikuler' ? renderEkskulPage() : renderDashboardPage())}
                </main>
            </div>
        </div>

        <nav class="mobile-bottom-nav">
            <a href="#dashboard" class="mobile-nav-item ${route === 'dashboard' ? 'active' : ''}"><i class="fas fa-th-large"></i><span>Home</span></a>
            <a href="#ekstrakurikuler" class="mobile-nav-item ${route === 'ekstrakurikuler' ? 'active' : ''}"><i class="fas fa-running"></i><span>Ekskul</span></a>
            <a href="#settings" class="mobile-nav-item ${route === 'settings' ? 'active' : ''}"><i class="fas fa-sliders-h"></i><span>Settings</span></a>
            <a href="#login" class="mobile-nav-item"><i class="fas fa-user-circle"></i><span>Akun</span></a>
        </nav>

        <footer class="text-center text-muted py-3 border-top small" style="font-size: 12px; background-color: #ffffff;">
            <div class="container">
                <div><strong>Project ${escapeHtml(settings.brand_name)} v1.0.0</strong> &bull; White-Labeled Suite by <strong>Buana Studios</strong></div>
                <div class="mt-1 opacity-75">Engineered by <strong>Hikmatullah Sakti Buana</strong> (Telegram: <code>@thesaktibuana</code> &bull; Email: <code>sakti@buana.studio</code>)</div>
            </div>
        </footer>`;
    }

    function renderDashboardPage() {
        const total = ekskulList.length;
        const active = ekskulList.filter(i => i.status === 'Aktif').length;
        return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark mb-1">Dashboard ${escapeHtml(settings.brand_name)}</h4>
                <p class="text-muted small m-0">Ringkasan aktivitas & modul aplikasi white-label (SPA Client Engine)</p>
            </div>
            <div><a href="#ekstrakurikuler" class="btn-kit-primary btn-sm"><i class="fas fa-plus me-1"></i> Kelola Kegiatan</a></div>
        </div>
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="kit-card p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">Master Kegiatan</span>
                        <span class="badge bg-teal-subtle text-teal rounded-pill"><i class="fas fa-running"></i></span>
                    </div>
                    <h3 class="fw-bold text-dark m-0">${total}</h3>
                    <span class="text-success small fw-medium"><i class="fas fa-check-circle me-1"></i>${active} Aktif</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="kit-card p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">Total Pengguna</span>
                        <span class="badge bg-indigo-subtle text-indigo rounded-pill"><i class="fas fa-users"></i></span>
                    </div>
                    <h3 class="fw-bold text-dark m-0">342</h3>
                    <span class="text-muted small">Aktif Bulan Ini</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="kit-card p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">Administrator</span>
                        <span class="badge bg-warning-subtle text-warning rounded-pill"><i class="fas fa-user-shield"></i></span>
                    </div>
                    <h3 class="fw-bold text-dark m-0">18</h3>
                    <span class="text-muted small">Super Admin & Staff</span>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="kit-card p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">Status SPA</span>
                        <span class="badge bg-info-subtle text-info rounded-pill"><i class="fas fa-bolt"></i></span>
                    </div>
                    <h3 class="fw-bold text-dark m-0">Fast</h3>
                    <span class="text-success small"><i class="fas fa-check me-1"></i>Static Server Ready</span>
                </div>
            </div>
        </div>`;
    }

    function renderEkskulPage() {
        return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark mb-1">Master Ekstrakurikuler</h4>
                <p class="text-muted small m-0">Kelola daftar kegiatan (SPA Local Data)</p>
            </div>
            <div>
                <button class="btn-kit-primary btn-sm" onclick="AtlasSPA.addEkskulPrompt()">
                    <i class="fas fa-plus me-1"></i> Tambah Ekskul
                </button>
            </div>
        </div>
        <div class="kit-card">
            <div class="kit-card-header">
                <h6 class="fw-bold m-0"><i class="fas fa-running text-teal me-2"></i>Daftar Ekstrakurikuler</h6>
                <span class="badge bg-primary-subtle text-teal rounded-pill px-3 py-1">${ekskulList.length} ekskul</span>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small">
                        <tr>
                            <th class="ps-4">#</th>
                            <th>Nama Ekstrakurikuler</th>
                            <th>Nama Arab</th>
                            <th class="text-center">Status</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="small">
                        ${ekskulList.map((item, idx) => `
                        <tr>
                            <td class="ps-4 text-muted">${idx + 1}</td>
                            <td class="fw-semibold">${escapeHtml(item.nama)}</td>
                            <td class="text-muted" dir="rtl" style="font-family:'Amiri',serif; font-size:15px;">${escapeHtml(item.nama_arab)}</td>
                            <td class="text-center">
                                <button onclick="AtlasSPA.toggleEkskul(${item.id})" class="btn btn-sm border-0 badge ${item.status === 'Aktif' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                                    ${item.status}
                                </button>
                            </td>
                            <td class="text-center">
                                <button onclick="AtlasSPA.deleteEkskul(${item.id})" class="btn btn-sm btn-outline-danger py-1 px-2"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    function renderSettingsPage() {
        const s = settings;
        return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark mb-1">Pengaturan White Label & Login (SPA Mode)</h4>
                <p class="text-muted small m-0">Kustomisasi brand, teks, gambar background hero, dan kartu spotlight</p>
            </div>
            <div>
                <a href="#login" class="btn-kit-secondary btn-sm"><i class="fas fa-external-link-alt me-1"></i> Preview Login</a>
            </div>
        </div>
        <form id="spa-settings-form" onsubmit="AtlasSPA.handleSaveSettings(event)">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="kit-card mb-4">
                        <div class="kit-card-header"><h6 class="fw-bold m-0"><i class="fas fa-image text-teal me-2"></i>Gambar Hero Background</h6></div>
                        <div class="kit-card-body">
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Path / URL Gambar Custom</label>
                                <input type="text" id="spa_hero_image" class="form-control" value="${escapeHtml(s.hero_image)}" required>
                            </div>
                        </div>
                    </div>
                    <div class="kit-card">
                        <div class="kit-card-header"><h6 class="fw-bold m-0"><i class="fas fa-id-card text-indigo me-2"></i>Kartu Spotlight</h6></div>
                        <div class="kit-card-body">
                            <div class="mb-3">
                                <label class="form-label">Nama Figur</label>
                                <input type="text" id="spa_spotlight_name" class="form-control" value="${escapeHtml(s.spotlight_name)}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Peran / Subtitle</label>
                                <input type="text" id="spa_spotlight_role" class="form-control" value="${escapeHtml(s.spotlight_role)}" required>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="kit-card">
                        <div class="kit-card-header"><h6 class="fw-bold m-0"><i class="fas fa-pen-fancy text-primary me-2"></i>Teks & Label Login</h6></div>
                        <div class="kit-card-body">
                            <div class="mb-3">
                                <label class="form-label">Nama Brand Logo</label>
                                <input type="text" id="spa_brand_name" class="form-control" value="${escapeHtml(s.brand_name)}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Sub Brand Badge</label>
                                <input type="text" id="spa_sub_brand" class="form-control" value="${escapeHtml(s.sub_brand)}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Placeholder Email</label>
                                <input type="text" id="spa_email_placeholder" class="form-control" value="${escapeHtml(s.email_placeholder)}" required>
                            </div>
                            <button type="submit" class="btn-kit-primary w-100 py-2 mt-3"><i class="fas fa-save me-1"></i> Simpan Perubahan SPA</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>`;
    }

    function initAuthListeners() {
        const toggleBtn = document.getElementById('spa-toggle-pwd');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const pwd = document.getElementById('spa-password');
                const icon = document.getElementById('spa-eye-icon');
                if (pwd.type === 'password') {
                    pwd.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    pwd.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }
    }

    function initLayoutListeners(route) {}

    function handleSaveSettings(e) {
        e.preventDefault();
        saveSettings({
            hero_image: document.getElementById('spa_hero_image').value,
            spotlight_name: document.getElementById('spa_spotlight_name').value,
            spotlight_role: document.getElementById('spa_spotlight_role').value,
            brand_name: document.getElementById('spa_brand_name').value,
            sub_brand: document.getElementById('spa_sub_brand').value,
            email_placeholder: document.getElementById('spa_email_placeholder').value
        });
        alert('Pengaturan SPA berhasil disimpan!');
    }

    function addEkskulPrompt() {
        const nama = prompt('Nama Ekstrakurikuler Baru:');
        if (nama) {
            const list = ekskulList.slice();
            list.push({ id: Date.now(), nama, nama_arab: '-', deskripsi: '-', nilai_count: 0, status: 'Aktif' });
            saveEkskul(list);
            renderPage();
        }
    }

    function toggleEkskul(id) {
        const list = ekskulList.map(item => {
            if (item.id === id) item.status = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
            return item;
        });
        saveEkskul(list);
        renderPage();
    }

    function deleteEkskul(id) {
        if (confirm('Hapus kegiatan ini?')) {
            const list = ekskulList.filter(i => i.id !== id);
            saveEkskul(list);
            renderPage();
        }
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        handleSaveSettings,
        addEkskulPrompt,
        toggleEkskul,
        deleteEkskul
    };
})();
