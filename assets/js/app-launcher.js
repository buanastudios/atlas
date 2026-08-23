/**
 * Atlas Edu — App Launcher Manager  v2.0  (app-launcher.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * Smartphone-style pluggable app launcher with 3-layer configuration:
 *
 *  Layer 1 — REGISTRY   (app-registry.js)       Developer registers modules
 *  Layer 2 — ADMIN      (localStorage)           Admin enables / disables system-wide
 *  Layer 3 — USER       (localStorage)           User sorts, hides, renames per-account
 *
 * Key behaviours:
 *  • Only developer-registered modules appear in any UI
 *  • Only admin-enabled modules appear in the user launcher
 *  • User customisations are silently ignored for admin-disabled modules
 *  • Drag-to-reorder (HTML5), jiggle manage mode, App Store reinstall drawer
 *  • Rename app name and category in-line
 *  • Admin Panel: enable/disable, view metadata, reset per-user configs
 *  • All state is fully isolated per layer (no inter-layer mutation)
 *
 * Usage:
 *   AtlasLauncher.render('container-id');          // boot launcher
 *   AtlasLauncher.openAdminPanel();                // open admin modal
 */
window.AtlasLauncher = (function () {

    const ADMIN_KEY  = 'atlas_admin_modules';   // Layer 2
    const USER_KEY   = 'atlas_launcher_config'; // Layer 3

    // ─────────────────────────────────────────────────────────────────────────
    //  LAYER 1 — REGISTRY READS
    // ─────────────────────────────────────────────────────────────────────────
    function _reg() {
        return (window.AtlasRegistry && window.AtlasRegistry.getAll()) || [];
    }
    function _regById(id) {
        return _reg().find(m => m.id === id) || null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LAYER 2 — ADMIN CONFIG
    // ─────────────────────────────────────────────────────────────────────────
    function _adminLoad() {
        try {
            const saved = localStorage.getItem(ADMIN_KEY);
            if (saved) return JSON.parse(saved);
        } catch (_) {}
        // Default: enable everything marked enabledByDefault in registry
        const defaults = {};
        _reg().forEach(m => { defaults[m.id] = m.enabledByDefault !== false; });
        return { enabled: defaults, updatedAt: new Date().toISOString() };
    }

    function _adminSave(cfg) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify({ ...cfg, updatedAt: new Date().toISOString() }));
    }

    function _isAdminEnabled(id) {
        const cfg = _adminLoad();
        const m   = _regById(id);
        if (!m) return false;
        if (m.systemRequired) return true; // cannot be disabled
        return cfg.enabled?.[id] !== false; // default true if not explicitly set
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LAYER 3 — USER CONFIG
    // ─────────────────────────────────────────────────────────────────────────
    function _userLoad() {
        try {
            const saved = localStorage.getItem(USER_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge in any new admin-enabled apps not yet in user config
                _reg().forEach(m => {
                    if (_isAdminEnabled(m.id)) {
                        if (!parsed.order.includes(m.id) && !parsed.hidden.includes(m.id)) {
                            parsed.order.push(m.id);
                        }
                    }
                });
                return parsed;
            }
        } catch (_) {}
        return _userDefault();
    }

    function _userDefault() {
        return {
            order:      _reg().filter(m => _isAdminEnabled(m.id)).map(m => m.id),
            hidden:     [],   // user-hidden (but admin-enabled) apps
            labels:     {},   // { id: customLabel }
            categories: {},   // { id: customCategory }
        };
    }

    function _userSave(cfg) { localStorage.setItem(USER_KEY, JSON.stringify(cfg)); }

    // ─────────────────────────────────────────────────────────────────────────
    //  STATE
    // ─────────────────────────────────────────────────────────────────────────
    let _manageMode  = false;
    let _dragSrcId   = null;
    let _containerId = null;

    // ─────────────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────────────
    function _label(id) {
        const cfg = _userLoad();
        const m   = _regById(id);
        return cfg.labels[id] || (m ? m.name : id);
    }

    function _category(id) {
        const cfg = _userLoad();
        const m   = _regById(id);
        return cfg.categories[id] || (m ? m.category : 'Other');
    }

    function _slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────────
    function render(containerId) {
        _containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) return;

        const userCfg = _userLoad();

        // Visible apps = admin-enabled AND not user-hidden, in user order
        const visible = userCfg.order.filter(id =>
            _isAdminEnabled(id) && !userCfg.hidden.includes(id)
        );

        // Group by category
        const groups = {};
        visible.forEach(id => {
            const cat = _category(id);
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(id);
        });

        // Count hidden user apps (among admin-enabled)
        const hiddenCount = userCfg.hidden.filter(id => _isAdminEnabled(id)).length;

        container.innerHTML = `
        <div id="launcher-wrapper" style="padding-bottom:8px;">

          <!-- Toolbar -->
          <div style="display:flex;align-items:center;justify-content:space-between;
              margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <i class="fas fa-th-large" style="color:var(--teal);font-size:14px;"></i>
              <span style="font-weight:800;font-size:14px;">Directorate Apps Suite</span>
              <span style="background:#f1f5f9;color:var(--muted);border-radius:20px;
                  padding:2px 9px;font-size:11px;font-weight:700;">
                ${visible.length} app aktif
              </span>
            </div>
            <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;">
              ${_manageMode ? `
              <button onclick="AtlasLauncher.openStore()"
                style="background:#059669;color:#fff;border:none;border-radius:9px;
                  padding:6px 13px;font-size:11px;font-weight:700;cursor:pointer;
                  display:flex;align-items:center;gap:5px;">
                <i class="fas fa-plus-circle"></i>
                App Store${hiddenCount > 0 ? ` <span style="background:rgba(255,255,255,.3);border-radius:10px;padding:1px 6px;">${hiddenCount}</span>` : ''}
              </button>
              <button onclick="AtlasLauncher.openAdminPanel()"
                style="background:#1e293b;color:#fff;border:none;border-radius:9px;
                  padding:6px 13px;font-size:11px;font-weight:700;cursor:pointer;
                  display:flex;align-items:center;gap:5px;">
                <i class="fas fa-shield-alt"></i>Admin Panel
              </button>` : ''}
              <button id="btn-manage-launcher" onclick="AtlasLauncher.toggleManageMode()"
                style="background:${_manageMode ? 'var(--text)' : 'transparent'};
                  color:${_manageMode ? '#fff' : 'var(--text-light)'};
                  border:1.5px solid ${_manageMode ? 'var(--text)' : 'var(--border)'};
                  border-radius:9px;padding:6px 13px;font-size:11px;font-weight:700;
                  cursor:pointer;display:flex;align-items:center;gap:5px;">
                <i class="fas fa-${_manageMode ? 'check' : 'sliders-h'}"></i>
                ${_manageMode ? 'Selesai' : 'Kelola App'}
              </button>
            </div>
          </div>

          ${_manageMode ? `
          <div style="background:#fffbe0;border:1.5px solid #f59e0b;border-radius:10px;
              padding:10px 14px;margin-bottom:14px;font-size:12px;font-weight:600;color:#92400e;">
            <i class="fas fa-hand-pointer me-1"></i>
            <strong>Mode Kelola:</strong>
            Seret untuk susun · Tekan × untuk sembunyikan · Ketuk nama/kategori untuk ganti
          </div>` : ''}

          <!-- Category groups -->
          ${Object.entries(groups).map(([cat, ids]) => `
          <div class="launcher-category-group" style="margin-bottom:22px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
              ${_manageMode ? `
              <span onclick="AtlasLauncher.renameCategory('${cat}')"
                title="Ketuk untuk ganti nama kategori"
                style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
                  color:var(--muted);cursor:pointer;
                  border-bottom:1.5px dashed var(--muted);padding-bottom:1px;">
                ${cat}
              </span>
              <i class="fas fa-pen" style="font-size:8px;color:var(--muted);"></i>` :
              `<span style="font-size:10px;font-weight:800;text-transform:uppercase;
                  letter-spacing:.08em;color:var(--muted);">${cat}</span>`}
              <div style="flex:1;height:1px;background:var(--border);"></div>
            </div>
            <div class="pwa-app-grid" id="grid-${_slugify(cat)}"
              style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;">
              ${ids.map(id => _renderTile(id)).join('')}
            </div>
          </div>`).join('')}

          ${Object.keys(groups).length === 0 ? `
          <div style="text-align:center;padding:40px 20px;color:var(--muted);">
            <i class="fas fa-box-open" style="font-size:32px;opacity:.3;margin-bottom:12px;display:block;"></i>
            <div style="font-size:13px;font-weight:600;">Tidak ada app aktif.</div>
            <div style="font-size:12px;margin-top:4px;">Buka Admin Panel untuk mengaktifkan modul.</div>
          </div>` : ''}
        </div>`;

        if (_manageMode) _bindDrag(container);
    }

    // ─── Single tile ──────────────────────────────────────────────────────────
    function _renderTile(id) {
        const m = _regById(id);
        if (!m) return '';

        const label  = _label(id);
        const isLink = !!m.page;
        const tag    = isLink ? 'a' : 'div';
        const nav    = isLink ? `href="${m.page}"` : (m.onClick ? `onclick="${m.onClick}"` : '');

        return `
        <${tag} ${nav}
          class="pwa-app-tile${_manageMode ? ' app-tile-jiggle' : ''}"
          draggable="${_manageMode}"
          data-app-id="${id}"
          title="${m.description || label}"
          style="position:relative;text-decoration:none;cursor:${_manageMode ? 'grab' : 'pointer'};
            display:flex;flex-direction:column;align-items:center;gap:6px;
            padding:12px 6px 10px;border-radius:14px;
            background:${_manageMode ? '#f8fafc' : 'transparent'};
            border:${_manageMode ? '1.5px dashed var(--border)' : '1.5px solid transparent'};
            transition:background .15s,border .15s;
            animation:${_manageMode ? 'jiggle .4s ease-in-out infinite alternate' : 'none'};"
          onmouseenter="${!_manageMode ? "this.style.background='var(--bg)'" : ''}"
          onmouseleave="${!_manageMode ? "this.style.background='transparent'" : ''}">

          ${_manageMode ? `
          <button class="app-uninstall-btn"
            onclick="event.preventDefault();event.stopPropagation();AtlasLauncher.uninstall('${id}')"
            title="Sembunyikan dari launcher"
            style="position:absolute;top:-7px;left:-7px;width:22px;height:22px;
              border-radius:50%;background:#ef4444;color:#fff;border:2.5px solid #fff;
              font-size:10px;font-weight:900;cursor:pointer;z-index:10;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 2px 8px rgba(0,0,0,.25);line-height:1;">×</button>` : ''}

          <div class="pwa-app-icon ${m.color}"
            style="width:54px;height:54px;font-size:20px;flex-shrink:0;border-radius:14px;">
            <i class="fas ${m.icon}"></i>
          </div>

          ${_manageMode ? `
          <div onclick="event.preventDefault();event.stopPropagation();AtlasLauncher.renameApp('${id}')"
            title="Ketuk untuk ganti nama"
            style="font-size:11px;font-weight:700;text-align:center;color:var(--text);
              cursor:pointer;line-height:1.3;width:100%;word-break:break-word;
              border-bottom:1.5px dashed rgba(0,0,0,.2);padding-bottom:2px;">
            ${label}
          </div>` :
          `<div class="pwa-app-label"
            style="font-size:11px;font-weight:700;text-align:center;color:var(--text);
              line-height:1.3;width:100%;word-break:break-word;">
            ${label}
          </div>`}
        </${tag}>`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DRAG & DROP
    // ─────────────────────────────────────────────────────────────────────────
    function _bindDrag(container) {
        container.querySelectorAll('[data-app-id]').forEach(tile => {
            tile.addEventListener('dragstart', e => {
                _dragSrcId = tile.dataset.appId;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => { tile.style.opacity = '.35'; tile.style.transform = 'scale(.95)'; }, 0);
            });
            tile.addEventListener('dragend', () => {
                tile.style.opacity = ''; tile.style.transform = '';
            });
            tile.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                tile.style.outline = '2.5px dashed var(--teal)';
                tile.style.outlineOffset = '2px';
            });
            tile.addEventListener('dragleave', () => { tile.style.outline = ''; tile.style.outlineOffset = ''; });
            tile.addEventListener('drop', e => {
                e.preventDefault();
                tile.style.outline = ''; tile.style.outlineOffset = '';
                const targetId = tile.dataset.appId;
                if (!_dragSrcId || !targetId || _dragSrcId === targetId) return;
                const cfg = _userLoad();
                const si  = cfg.order.indexOf(_dragSrcId);
                const ti  = cfg.order.indexOf(targetId);
                if (si > -1 && ti > -1) {
                    cfg.order.splice(si, 1);
                    cfg.order.splice(ti, 0, _dragSrcId);
                    _userSave(cfg);
                    render(_containerId);
                }
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MANAGE MODE
    // ─────────────────────────────────────────────────────────────────────────
    function toggleManageMode() {
        _manageMode = !_manageMode;
        render(_containerId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  USER INSTALL / UNINSTALL  (Layer 3 only)
    // ─────────────────────────────────────────────────────────────────────────
    function uninstall(id) {
        const cfg = _userLoad();
        if (!cfg.hidden.includes(id)) cfg.hidden.push(id);
        cfg.order = cfg.order.filter(i => i !== id);
        _userSave(cfg);
        render(_containerId);
        _toast('info', `"${_label(id)}" disembunyikan. Buka App Store untuk memulihkan.`);
    }

    function install(id) {
        const cfg = _userLoad();
        cfg.hidden = cfg.hidden.filter(i => i !== id);
        if (!cfg.order.includes(id)) cfg.order.push(id);
        _userSave(cfg);
        // Close store and re-render
        bootstrap.Modal.getInstance(document.getElementById('launcher-store-modal'))?.hide();
        render(_containerId);
        _toast('success', `"${_label(id)}" dipasang kembali.`);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  APP STORE  (user reinstall hidden apps)
    // ─────────────────────────────────────────────────────────────────────────
    function openStore() {
        const cfg    = _userLoad();
        const hidden = cfg.hidden.filter(id => _isAdminEnabled(id));

        let el = document.getElementById('launcher-store-modal');
        if (!el) { el = document.createElement('div'); el.id = 'launcher-store-modal'; el.className = 'modal fade'; el.tabIndex = -1; document.body.appendChild(el); }

        el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-md">
          <div class="modal-content border-0 shadow-lg" style="border-radius:20px;">
            <div class="modal-header border-0 px-4 py-3"
              style="background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:20px 20px 0 0;">
              <div style="display:flex;align-items:center;gap:10px;flex:1;">
                <i class="fas fa-store" style="color:#f59e0b;font-size:18px;"></i>
                <div>
                  <div style="font-weight:800;color:#fff;font-size:14px;">App Store</div>
                  <div style="font-size:11px;color:#94a3b8;">
                    ${hidden.length} app tersembunyi · klik Pasang untuk tampilkan
                  </div>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              ${hidden.length === 0 ? `
              <div style="text-align:center;padding:32px 0;color:var(--muted);">
                <i class="fas fa-check-circle" style="font-size:28px;color:#059669;margin-bottom:10px;display:block;"></i>
                <div style="font-weight:700;">Semua app sudah dipasang</div>
              </div>` :
              `<div style="display:flex;flex-direction:column;gap:10px;">
                ${hidden.map(id => {
                  const m = _regById(id);
                  if (!m) return '';
                  return `
                  <div style="display:flex;align-items:center;justify-content:space-between;
                      padding:12px 14px;background:#f8fafc;border:1.5px solid var(--border);
                      border-radius:12px;gap:12px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                      <div class="pwa-app-icon ${m.color}" style="width:40px;height:40px;font-size:16px;flex-shrink:0;border-radius:11px;">
                        <i class="fas ${m.icon}"></i>
                      </div>
                      <div>
                        <div style="font-weight:700;font-size:13px;">${_label(id)}</div>
                        <div style="font-size:10px;color:var(--muted);">${_category(id)} · v${m.version}</div>
                      </div>
                    </div>
                    <button onclick="AtlasLauncher.install('${id}')"
                      style="background:#059669;color:#fff;border:none;border-radius:9px;
                        padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">
                      <i class="fas fa-plus me-1"></i>Pasang
                    </button>
                  </div>`;
                }).join('')}
              </div>`}
            </div>
          </div>
        </div>`;

        new bootstrap.Modal(el).show();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ADMIN PANEL  (Layer 2 — enable/disable system-wide)
    // ─────────────────────────────────────────────────────────────────────────
    function openAdminPanel() {
        const adminCfg = _adminLoad();
        const all = _reg();

        // Group by category
        const groups = {};
        all.forEach(m => {
            if (!groups[m.category]) groups[m.category] = [];
            groups[m.category].push(m);
        });

        let el = document.getElementById('launcher-admin-modal');
        if (!el) { el = document.createElement('div'); el.id = 'launcher-admin-modal'; el.className = 'modal fade'; el.tabIndex = -1; document.body.appendChild(el); }

        el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div class="modal-content border-0 shadow-lg" style="border-radius:20px;">

            <!-- Header -->
            <div class="modal-header border-0 px-4 py-3"
              style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px 20px 0 0;">
              <div style="display:flex;align-items:center;gap:12px;flex:1;">
                <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.1);
                    display:flex;align-items:center;justify-content:center;font-size:18px;">
                  <i class="fas fa-shield-alt" style="color:#f59e0b;"></i>
                </div>
                <div>
                  <div style="font-weight:800;color:#fff;font-size:15px;">Admin Panel — Module Manager</div>
                  <div style="font-size:11px;color:#64748b;">
                    ${all.length} modul terdaftar · Atlas Registry v${window.AtlasRegistry?.getVersion() || '—'}
                  </div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <button onclick="AtlasLauncher._adminResetAll()"
                  style="background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.3);
                    border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;">
                  <i class="fas fa-rotate-left me-1"></i>Reset Semua
                </button>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
            </div>

            <!-- Developer guide banner -->
            <div style="background:#fffbe0;border-bottom:1px solid #fde68a;padding:10px 20px;
                display:flex;align-items:center;gap:10px;font-size:11px;color:#92400e;">
              <i class="fas fa-code" style="font-size:14px;"></i>
              <span>
                <strong>Developer:</strong> Tambah modul baru cukup dengan menambah entri di
                <code style="background:rgba(0,0,0,.07);padding:1px 5px;border-radius:4px;">assets/js/app-registry.js</code>
                dan membuat folder + halaman HTML-nya. Tidak perlu mengubah file lain.
              </span>
            </div>

            <div class="modal-body p-0">
              <!-- Module list by category -->
              ${Object.entries(groups).map(([cat, mods]) => `
              <div style="border-bottom:1px solid var(--border);">
                <div style="padding:12px 20px 6px;font-size:10px;font-weight:800;text-transform:uppercase;
                    letter-spacing:.08em;color:var(--muted);background:#fafafa;">
                  ${cat}
                  <span style="background:#e2e8f0;border-radius:10px;padding:1px 7px;font-size:9px;font-weight:700;margin-left:6px;">
                    ${mods.length}
                  </span>
                </div>
                ${mods.map(m => {
                  const isEnabled = adminCfg.enabled?.[m.id] !== false;
                  const isSystem  = m.systemRequired;
                  return `
                  <div style="display:flex;align-items:center;gap:14px;padding:14px 20px;
                      border-top:1px solid var(--border);
                      background:${isEnabled ? '#fff' : '#f8fafc'};"
                      id="admin-row-${m.id}">

                    <!-- Icon -->
                    <div class="pwa-app-icon ${m.color}"
                      style="width:40px;height:40px;font-size:16px;flex-shrink:0;border-radius:11px;
                        opacity:${isEnabled ? '1' : '.4'};">
                      <i class="fas ${m.icon}"></i>
                    </div>

                    <!-- Info -->
                    <div style="flex:1;min-width:0;">
                      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
                        <span style="font-weight:700;font-size:13px;color:${isEnabled ? 'var(--text)' : 'var(--muted)'};">
                          ${m.name}
                        </span>
                        <span style="font-size:9px;background:#f1f5f9;color:var(--muted);
                            border-radius:6px;padding:1px 6px;font-weight:700;">v${m.version}</span>
                        ${isSystem ? `<span style="font-size:9px;background:#fef3c7;color:#92400e;
                            border-radius:6px;padding:1px 6px;font-weight:700;">SYSTEM</span>` : ''}
                        ${m.page ? `<span style="font-size:9px;background:#eff6ff;color:#1d4ed8;
                            border-radius:6px;padding:1px 6px;font-weight:700;font-family:monospace;">${m.page}</span>` : ''}
                      </div>
                      <div style="font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        ${m.description}
                      </div>
                      <div style="font-size:10px;color:#94a3b8;margin-top:2px;">
                        <i class="fas fa-user me-1"></i>${m.author} · ${m.contact}
                      </div>
                    </div>

                    <!-- Actions -->
                    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                      ${m.page ? `
                      <a href="${m.page}" target="_blank"
                        style="background:transparent;color:var(--muted);border:1.5px solid var(--border);
                          border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;
                          text-decoration:none;white-space:nowrap;
                          ${isEnabled ? '' : 'opacity:.4;pointer-events:none;'}">
                        <i class="fas fa-external-link-alt me-1"></i>Buka
                      </a>` : ''}

                      <!-- Toggle switch -->
                      <label style="display:flex;align-items:center;gap:6px;cursor:${isSystem ? 'not-allowed' : 'pointer'};"
                        title="${isSystem ? 'Modul sistem tidak dapat dinonaktifkan' : (isEnabled ? 'Nonaktifkan' : 'Aktifkan')}">
                        <div class="admin-toggle${isEnabled ? ' on' : ''}" id="toggle-${m.id}"
                          onclick="${isSystem ? '' : `AtlasLauncher._adminToggle('${m.id}')`}"
                          style="width:44px;height:24px;border-radius:12px;cursor:${isSystem ? 'not-allowed' : 'pointer'};
                            background:${isEnabled ? '#059669' : '#cbd5e1'};
                            display:flex;align-items:center;padding:3px;transition:background .2s;
                            opacity:${isSystem ? '.5' : '1'};">
                          <div style="width:18px;height:18px;border-radius:50%;background:#fff;
                              box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .2s;
                              transform:${isEnabled ? 'translateX(20px)' : 'translateX(0)'};"></div>
                        </div>
                        <span style="font-size:11px;font-weight:700;color:${isEnabled ? '#059669' : 'var(--muted)'};">
                          ${isEnabled ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </label>
                    </div>
                  </div>`;
                }).join('')}
              </div>`).join('')}
            </div>

            <div class="modal-footer px-4 py-3 border-top"
              style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
              <div style="font-size:11px;color:var(--muted);">
                <i class="fas fa-info-circle me-1"></i>
                Perubahan langsung berlaku. User yang sudah login perlu refresh halaman.
              </div>
              <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>`;

        new bootstrap.Modal(el).show();
    }

    // Toggle admin enable/disable for a single module
    function _adminToggle(id) {
        const m = _regById(id);
        if (!m || m.systemRequired) return;

        const cfg = _adminLoad();
        if (!cfg.enabled) cfg.enabled = {};
        cfg.enabled[id] = !_isAdminEnabled(id);
        _adminSave(cfg);

        // Re-render the toggle row live without full modal rebuild
        const row    = document.getElementById(`admin-row-${id}`);
        const toggle = document.getElementById(`toggle-${id}`);
        const isNowOn = cfg.enabled[id];

        if (toggle) {
            toggle.style.background = isNowOn ? '#059669' : '#cbd5e1';
            toggle.querySelector('div').style.transform = isNowOn ? 'translateX(20px)' : 'translateX(0)';
            toggle.nextElementSibling.textContent = isNowOn ? 'Aktif' : 'Nonaktif';
            toggle.nextElementSibling.style.color = isNowOn ? '#059669' : 'var(--muted)';
        }
        if (row) {
            row.style.background = isNowOn ? '#fff' : '#f8fafc';
            const icon = row.querySelector('.pwa-app-icon');
            if (icon) icon.style.opacity = isNowOn ? '1' : '.4';
        }

        // Re-render launcher in background
        if (_containerId) render(_containerId);
    }

    // Reset all admin configs to registry defaults
    function _adminResetAll() {
        if (!confirm('Reset semua pengaturan admin ke default registry?\n\nIni akan mengaktifkan ulang semua modul yang dinonaktifkan.')) return;
        localStorage.removeItem(ADMIN_KEY);
        bootstrap.Modal.getInstance(document.getElementById('launcher-admin-modal'))?.hide();
        setTimeout(() => { openAdminPanel(); render(_containerId); }, 350);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RENAME  (Layer 3)
    // ─────────────────────────────────────────────────────────────────────────
    function renameApp(id) {
        const cur = _label(id);
        const m   = _regById(id);
        const nw  = prompt(`Ganti nama "${cur}":\n(kosongkan untuk reset ke default)`, cur);
        if (nw === null) return;
        const cfg = _userLoad();
        if (nw.trim() === '' || nw.trim() === (m?.name || '')) {
            delete cfg.labels[id];
        } else {
            cfg.labels[id] = nw.trim();
        }
        _userSave(cfg);
        render(_containerId);
    }

    function renameCategory(oldCat) {
        const nw = prompt(`Ganti nama kategori "${oldCat}":\n(kosongkan untuk reset ke default)`, oldCat);
        if (nw === null) return;
        const cfg = _userLoad();
        // Find all apps currently in this category (by user config or registry default)
        _reg().forEach(m => {
            const cur = cfg.categories[m.id] || m.category;
            if (cur === oldCat) {
                if (nw.trim() === '' || nw.trim() === m.category) {
                    delete cfg.categories[m.id];
                } else {
                    cfg.categories[m.id] = nw.trim();
                }
            }
        });
        _userSave(cfg);
        render(_containerId);
    }

    // Reset user config only
    function resetUserConfig() {
        if (!confirm('Reset semua pengaturan launcher Anda ke default?\n(Urutan, nama, dan kategori custom akan dihapus)')) return;
        localStorage.removeItem(USER_KEY);
        _manageMode = false;
        render(_containerId);
        _toast('success', 'Launcher direset ke pengaturan default.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  TOAST
    // ─────────────────────────────────────────────────────────────────────────
    function _toast(type, msg) {
        const colors = { success:'#059669', info:'#0891b2', warning:'#d97706', error:'#dc2626' };
        const t = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(10px);
            background:${colors[type]||colors.info};color:#fff;border-radius:12px;
            padding:10px 20px;font-size:12px;font-weight:700;z-index:9999;
            white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,.2);
            opacity:0;transition:opacity .2s,transform .2s;`;
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
        setTimeout(() => {
            t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(10px)';
            setTimeout(() => t.remove(), 300);
        }, 3500);
    }

    // ─── Jiggle keyframe (injected once) ─────────────────────────────────────
    (function () {
        if (document.getElementById('atlas-launcher-styles')) return;
        const s = document.createElement('style');
        s.id = 'atlas-launcher-styles';
        s.textContent = `
          @keyframes jiggle {
            0%   { transform: rotate(-1.8deg) scale(1.02); }
            100% { transform: rotate(1.8deg)  scale(1.02); }
          }
          .app-tile-jiggle { animation: jiggle .4s ease-in-out infinite alternate !important; }
          .pwa-app-tile    { user-select: none; }
        `;
        document.head.appendChild(s);
    })();

    // ─────────────────────────────────────────────────────────────────────────
    //  PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────
    return {
        render,
        toggleManageMode,
        uninstall,
        install,
        openStore,
        openAdminPanel,
        renameApp,
        renameCategory,
        resetUserConfig,
        // Exposed for inline onclick in admin panel
        _adminToggle,
        _adminResetAll,
        _toast,
    };
})();
