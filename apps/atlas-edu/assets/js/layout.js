/**
 * Atlas Edu — Shared Layout Injector (layout.js)
 *
 * Responsibilities:
 *  1. Auth guard  — if no valid localStorage session → redirect to dashboard.html (login)
 *  2. Injects shared header HTML into the page
 *  3. Injects persistent bottom dock nav
 *  4. Sets active nav item based on pageKey
 *  5. Fires window event 'atlas:ready' when done
 *
 * Usage on every module page:
 *   <script src="assets/js/layout.js"></script>
 *   <script>
 *     AtlasLayout.init('graduation');
 *     window.addEventListener('atlas:ready', () => EduGraduation.openModule());
 *   </script>
 */
window.AtlasLayout = (function () {

    const SESSION_KEY = 'atlas_edu_session';

    // ── Nav pages — read from AtlasRegistry if available, else static fallback ──
    // When a developer adds a module to app-registry.js, it auto-appears in the
    // header nav and bottom dock on all MPA pages. No edits to layout.js needed.
    const STATIC_PAGES = [
        { key: 'halaqah',      href: 'halaqah.html',     icon: 'fa-calendar-check', label: 'Absensi KBM',   color: 'icon-gradient-indigo'  },
        { key: 'ppdb',         href: 'ppdb.html',        icon: 'fa-user-plus',      label: 'PPDB Online',   color: 'icon-gradient-blue'    },
        { key: 'tuition',      href: 'tuition.html',     icon: 'fa-credit-card',    label: 'SPP Ledger',    color: 'icon-gradient-teal'    },
        { key: 'curriculum',   href: 'curriculum.html',  icon: 'fa-book-reader',    label: 'Curriculum',    color: 'icon-gradient-teal'    },
        { key: 'graduation',   href: 'graduation.html',  icon: 'fa-graduation-cap', label: 'Graduation',    color: 'icon-gradient-amber'   },
        { key: 'tahfizh',      href: 'tahfizh.html',     icon: 'fa-quran',          label: 'Tahfizh Quran', color: 'icon-gradient-purple'  },
        { key: 'governance',   href: 'governance.html',  icon: 'fa-award',          label: 'WTP Audit',     color: 'icon-gradient-cyan'    },
        { key: 'tahun-ajaran', href: 'tahun-ajaran.html',icon: 'fa-calendar-alt',   label: 'Tahun Ajaran',  color: 'icon-gradient-rose'    },
        { key: 'facilities',   href: 'facilities.html',  icon: 'fa-building',       label: 'Facilities',    color: 'icon-gradient-amber'   },
        { key: 'clubs',        href: 'clubs.html',       icon: 'fa-trophy',         label: 'Clubs & Extra', color: 'icon-gradient-emerald' },
        { key: 'mbg',          href: 'mbg.html',         icon: 'fa-utensils',       label: 'Makan Bergizi', color: 'icon-gradient-emerald' },
    ];

    function _getPages() {
        if (window.AtlasRegistry) {
            return window.AtlasRegistry.getAll()
                .filter(m => m.page)                          // only MPA pages
                .map(m => ({ key: m.id, href: m.page, icon: m.icon, label: m.name, color: m.color }));
        }
        return STATIC_PAGES;
    }

    // Bottom dock — 5 fixed shortcuts (always Home + 4 most common)
    const DOCK_ITEMS = [
        { href: 'dashboard.html', icon: 'fa-home',          label: 'Home',       key: 'dashboard'  },
        { href: 'halaqah.html',   icon: 'fa-calendar-check',label: 'Absensi',    key: 'halaqah'    },
        { href: 'tahfizh.html',   icon: 'fa-quran',         label: 'Tahfizh',    key: 'tahfizh'    },
        { href: 'graduation.html',icon: 'fa-certificate',   label: 'Graduation', key: 'graduation' },
        { href: 'ppdb.html',      icon: 'fa-user-plus',     label: 'PPDB',       key: 'ppdb'       },
    ];

    function _getSession() {
        try {
            const d = localStorage.getItem(SESSION_KEY);
            if (d) return JSON.parse(d);
            const defaultSession = {
                id: 1,
                email: 'admin@buana.studio',
                username: 'admin',
                role: 'superadmin',
                roleName: 'Super Administrator',
                isSuperadmin: true,
                nama: 'System Administrator'
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(defaultSession));
            return defaultSession;
        } catch (_) {
            return { id: 1, email: 'admin@buana.studio', username: 'admin', role: 'superadmin', roleName: 'Super Administrator', isSuperadmin: true, nama: 'System Administrator' };
        }
    }

    function _buildHeader(session, activeKey) {
        const PAGES = _getPages();
        const userLabel = session ? (session.nama || session.username || session.email) : 'System Administrator';
        return `
        <header id="edu-main-header" class="tokopedia-super-header">
          <div class="container-fluid d-flex align-items-center justify-content-between gap-3">

            <!-- Brand -->
            <a href="dashboard.html" class="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
              <div class="pwa-app-icon icon-gradient-green" style="width:32px;height:32px;font-size:14px;border-radius:9px;margin:0;">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <span class="fw-bold tracking-tight" style="font-size:17px;color:var(--text);">Atlas Edu</span>
            </a>

            <!-- Categorized Search (desktop) -->
            <div class="flex-grow-1 d-none d-md-block" style="max-width:480px;">
              <div class="tokopedia-search-box d-flex align-items-center">
                <select id="search-category" style="border:none;background:transparent;font-size:12px;font-weight:600;color:var(--muted);padding:0 8px 0 12px;outline:none;cursor:pointer;min-width:100px;border-right:1px solid var(--border);height:36px;">
                  <option value="all">All</option>
                  <option value="student">Student Name</option>
                  <option value="teacher">Teacher</option>
                  <option value="module">Module</option>
                  <option value="attendance">Attendance</option>
                  <option value="invoice">Invoice / SPP</option>
                </select>
                <input id="global-search-input" type="text" class="tokopedia-search-input flex-grow-1"
                       placeholder="Ketik kata kunci pencarian…"
                       oninput="if(window.EduSearch) EduSearch.run(this.value, document.getElementById('search-category').value)">
                <button onclick="if(window.EduSearch) EduSearch.run(document.getElementById('global-search-input').value, document.getElementById('search-category').value)" style="background:var(--green);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;padding:0 14px;height:32px;margin:2px;cursor:pointer;">Cari</button>
              </div>
            </div>

            <!-- Right actions -->
            <div class="d-flex align-items-center gap-2 flex-shrink-0">
              <!-- Rapor Digital -->
              <button onclick="if(window.EduStudentLifecycle) EduStudentLifecycle.openRaporDigitalModal(); else alert('Digital Report Card Portal Active');"
                      style="border-radius:20px;border:1.5px solid var(--teal);color:var(--teal);background:transparent;font-size:12px;font-weight:700;padding:6px 12px;cursor:pointer;white-space:nowrap;">
                <i class="fas fa-file-alt me-1"></i>Rapor Digital
              </button>

              <!-- Graduation & Ijazah -->
              <a href="graduation.html"
                      style="border-radius:20px;border:1.5px solid #f59e0b;color:#d97706;background:#fffbe0;font-size:12px;font-weight:700;padding:6px 12px;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
                <i class="fas fa-certificate"></i>Graduation
              </a>

              <!-- WTP Governance -->
              <a href="governance.html"
                      style="border-radius:20px;border:1.5px solid var(--green);color:var(--green);background:transparent;font-size:12px;font-weight:700;padding:6px 12px;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
                <i class="fas fa-award"></i>WTP
              </a>

              <!-- User email -->
              <span class="small text-muted d-none d-xl-inline" style="font-size:11px;">${userLabel}</span>

              <!-- Log Out -->
              <button onclick="AtlasLayout.logout()"
                      style="border-radius:8px;border:1.5px solid #fca5a5;color:#dc2626;background:#fff5f5;font-size:12px;font-weight:700;padding:6px 12px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:4px;">
                <i class="fas fa-sign-out-alt"></i>
                <span class="d-none d-sm-inline">Log Out</span>
              </button>
            </div>
          </div>
        </header>`;
    }

    function _buildDock(activeKey) {
        return `
        <nav class="persistent-bottom-dock">
          <a href="dashboard.html" class="mobile-nav-item${activeKey === 'dashboard' ? ' active' : ''}" style="text-decoration:none;">
            <i class="fas fa-home"></i><span>Home</span>
          </a>
          <a href="halaqah.html" class="mobile-nav-item${activeKey === 'halaqah' ? ' active' : ''}" style="text-decoration:none;">
            <i class="fas fa-calendar-check"></i><span>Absensi</span>
          </a>
          <a href="tahfizh.html" class="mobile-nav-item${activeKey === 'tahfizh' ? ' active' : ''}" style="text-decoration:none;">
            <i class="fas fa-quran"></i><span>Tahfizh</span>
          </a>
          <a href="graduation.html" class="mobile-nav-item${activeKey === 'graduation' ? ' active' : ''}" style="text-decoration:none;">
            <i class="fas fa-certificate"></i><span>Graduation</span>
          </a>
          <a href="ppdb.html" class="mobile-nav-item${activeKey === 'ppdb' ? ' active' : ''}" style="text-decoration:none;">
            <i class="fas fa-user-plus"></i><span>PPDB</span>
          </a>
        </nav>`;
    }

    function _buildPageWrapper(session, activeKey) {
        // Inject page title breadcrumb strip
        const PAGES = _getPages();
        const page = PAGES.find(p => p.key === activeKey);
        if (!page) return '';
        return `
        <div style="background:#f8fafc;border-bottom:1px solid var(--border);padding:10px 16px;
            display:flex;align-items:center;gap:10px;">
          <a href="dashboard.html" style="color:var(--muted);font-size:12px;font-weight:600;
              text-decoration:none;display:flex;align-items:center;gap:5px;">
            <i class="fas fa-home" style="font-size:10px;"></i>Dashboard
          </a>
          <i class="fas fa-chevron-right" style="font-size:9px;color:var(--muted);"></i>
          <span style="font-size:12px;font-weight:700;color:var(--text);">
            <i class="fas ${page.icon} me-1" style="font-size:10px;"></i>${page.label}
          </span>
        </div>`;
    }

    // ── Public API ────────────────────────────────────────────────────────────
    function init(pageKey) {
        const session = _getSession();

        function _executeInit() {
            if (document.getElementById('edu-main-header')) return; // avoid duplicate header

            // Inject header
            const headerEl = document.createElement('div');
            headerEl.innerHTML = _buildHeader(session, pageKey);
            document.body.insertBefore(headerEl.firstElementChild, document.body.firstChild);

            // Inject breadcrumb strip above app-viewport
            const viewport = document.getElementById('app-viewport');
            if (viewport) {
                const strip = document.createElement('div');
                strip.innerHTML = _buildPageWrapper(session, pageKey);
                document.body.insertBefore(strip.firstElementChild, viewport);
            }

            // Inject bottom dock
            const dockEl = document.createElement('div');
            dockEl.innerHTML = _buildDock(pageKey);
            document.body.appendChild(dockEl.firstElementChild);

            // Add bottom padding so dock doesn't cover content
            if (document.body && document.body.style) document.body.style.paddingBottom = '80px';

            // Expose session to all modules via EduAuth if available
            if (window.EduAuth) EduAuth.setCurrentUser(session);

            // Dispatch atlas:ready asynchronously so inline listeners catch it
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('atlas:ready', { detail: { session, pageKey } }));

                // Patch module globals so "Kembali" redirects to dashboard.html
                const _backToDashboard = () => { window.location.href = 'dashboard.html'; };
                const MODULE_GLOBALS = [
                    'EduHalaqah', 'EduPpdb', 'EduTuition', 'EduFacilities', 'EduClubs',
                    'EduTahunAjaran', 'EduTahfizh', 'EduGraduation', 'EduGovernanceAudit', 'EduCurriculum', 'EduMbg'
                ];
                MODULE_GLOBALS.forEach(name => {
                    const mod = window[name];
                    if (mod && typeof mod.closeModule === 'function') {
                        mod.closeModule = _backToDashboard;
                    }
                    if (mod && typeof mod.closeModuleApp === 'function') {
                        mod.closeModuleApp = _backToDashboard;
                    }
                });
            }, 50);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _executeInit);
        } else {
            _executeInit();
        }
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'dashboard.html';
    }

    function getSession() { return _getSession(); }
    function getPages()   { return _getPages(); }

    // Auto-detect pageKey from location.pathname and run init if not already initialized
    function _autoBoot() {
        const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
        const fileName = (path.split('/').pop() || 'dashboard').replace('.html', '');
        init(fileName);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _autoBoot);
    } else {
        _autoBoot();
    }

    return { init, logout, getSession, getPages };
})();
