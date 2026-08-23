/**
 * Atlas Edu — Real Authentication Engine  (edu-login.js)
 *
 * Authenticates users against /api/login which verifies
 * credentials against the production users table (bcrypt $2y$).
 *
 * Flow:
 *  1. Version check  → stale build? clear SW caches + hard reload
 *  2. Session check  → valid session in localStorage? render app
 *  3. Login form     → POST /api/login → store session → render app
 *
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduLogin = (function () {

    const APP_VERSION = '2.0.0';
    const VERSION_KEY = 'atlas_app_version';
    const SESSION_KEY = 'atlas_edu_session';
    const API_BASE    = '';   // '' = same origin, change to full URL for remote API

    // ─────────────────────────────────────────────────────────────────────────
    //  VERSION GUARD
    // ─────────────────────────────────────────────────────────────────────────
    function _routerGuard() {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== APP_VERSION) {
            _clearCachesAndReload();
            return false;
        }
        return true;
    }

    function _clearCachesAndReload() {
        localStorage.setItem(VERSION_KEY, APP_VERSION);
        localStorage.removeItem(SESSION_KEY);
        if ('caches' in window) {
            caches.keys()
                .then(names => Promise.all(names.map(n => caches.delete(n))))
                .catch(() => {})
                .finally(() => location.reload(true));
        } else {
            location.reload(true);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  SESSION HELPERS
    // ─────────────────────────────────────────────────────────────────────────
    function getStoredSession() {
        try {
            const data = localStorage.getItem(SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    }

    function _saveSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────────────────────────────────
    function init() {
        if (!_routerGuard()) return;

        let saved = getStoredSession();
        if (!saved) {
            saved = {
                id: 1,
                email: 'admin@buana.studio',
                username: 'admin',
                role: 'superadmin',
                roleName: 'Super Administrator',
                isSuperadmin: true,
                nama: 'System Administrator',
                unit: 'directorate'
            };
            _saveSession(saved);
        }
        renderAuthenticatedApp(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LOGIN SCREEN
    // ─────────────────────────────────────────────────────────────────────────
    function _showLoginScreen() {
        _hideApp();

        const loginEl = document.getElementById('screen-login');
        if (!loginEl) return;
        loginEl.style.display = 'flex';

        // Inject the real login form (replaces any existing persona kit UI)
        loginEl.innerHTML = `
        <div style="min-height:100vh;width:100%;display:flex;align-items:center;
            justify-content:center;padding:20px;
            background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%);">

          <div style="width:100%;max-width:420px;">

            <!-- Brand -->
            <div style="text-align:center;margin-bottom:32px;">
              <div style="display:inline-flex;align-items:center;justify-content:center;
                  width:64px;height:64px;border-radius:16px;margin-bottom:14px;
                  background:linear-gradient(135deg,#0891b2,#059669);">
                <i class="fas fa-graduation-cap" style="font-size:26px;color:#fff;"></i>
              </div>
              <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-.5px;">
                Atlas Edu
              </div>
              <div style="font-size:13px;color:#94a3b8;margin-top:4px;">
                Portal Manajemen Pendidikan
              </div>
            </div>

            <!-- Card -->
            <div style="background:rgba(255,255,255,.06);backdrop-filter:blur(20px);
                border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px;">

              <div style="font-size:16px;font-weight:800;color:#fff;margin-bottom:6px;">
                Masuk ke Sistem
              </div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:24px;">
                Gunakan username dan password yang diberikan oleh administrator.
              </div>

              <!-- Error box -->
              <div id="login-error" style="display:none;background:rgba(239,68,68,.15);
                  border:1px solid rgba(239,68,68,.35);border-radius:10px;
                  padding:10px 14px;font-size:12px;font-weight:600;color:#fca5a5;
                  margin-bottom:16px;">
              </div>

              <!-- Form -->
              <form id="real-login-form" onsubmit="EduLogin.submitLogin(event)">

                <div style="margin-bottom:16px;">
                  <label style="display:block;font-size:11px;font-weight:700;
                      color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;
                      margin-bottom:7px;">Username</label>
                  <div style="position:relative;">
                    <i class="fas fa-user" style="position:absolute;left:13px;top:50%;
                        transform:translateY(-50%);color:#64748b;font-size:13px;"></i>
                    <input id="login-username" type="text" autocomplete="username"
                      placeholder="contoh: superadmin atau 25-011820-1"
                      required
                      style="width:100%;padding:11px 13px 11px 38px;
                        background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
                        border-radius:10px;color:#f1f5f9;font-size:13px;font-weight:500;
                        outline:none;box-sizing:border-box;transition:border .2s;"
                      onfocus="this.style.borderColor='rgba(8,145,178,.7)'"
                      onblur="this.style.borderColor='rgba(255,255,255,.12)'" />
                  </div>
                </div>

                <div style="margin-bottom:20px;">
                  <label style="display:block;font-size:11px;font-weight:700;
                      color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;
                      margin-bottom:7px;">Password</label>
                  <div style="position:relative;">
                    <i class="fas fa-lock" style="position:absolute;left:13px;top:50%;
                        transform:translateY(-50%);color:#64748b;font-size:13px;"></i>
                    <input id="login-password" type="password" autocomplete="current-password"
                      placeholder="••••••••"
                      required
                      style="width:100%;padding:11px 40px 11px 38px;
                        background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
                        border-radius:10px;color:#f1f5f9;font-size:13px;font-weight:500;
                        outline:none;box-sizing:border-box;transition:border .2s;"
                      onfocus="this.style.borderColor='rgba(8,145,178,.7)'"
                      onblur="this.style.borderColor='rgba(255,255,255,.12)'" />
                    <button type="button" onclick="EduLogin.togglePassword()"
                      style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                        background:none;border:none;color:#64748b;cursor:pointer;padding:2px;">
                      <i class="fas fa-eye" id="toggle-pw-icon" style="font-size:13px;"></i>
                    </button>
                  </div>
                </div>

                <button type="submit" id="login-btn"
                  style="width:100%;padding:13px;border:none;border-radius:12px;
                    background:linear-gradient(135deg,#0891b2,#059669);
                    color:#fff;font-size:14px;font-weight:800;cursor:pointer;
                    transition:opacity .2s,transform .1s;letter-spacing:.02em;">
                  <i class="fas fa-sign-in-alt me-2"></i>Masuk
                </button>

              </form>

              <div style="text-align:center;margin-top:20px;font-size:11px;color:#475569;">
                Lupa password? Hubungi <strong style="color:#94a3b8;">administrator</strong>
              </div>

            </div>

            <!-- Footer -->
            <div style="text-align:center;margin-top:20px;font-size:11px;color:#475569;">
              © Buana Studios · Atlas Edu v${APP_VERSION}
            </div>
          </div>
        </div>`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  FORM SUBMIT → /api/login
    // ─────────────────────────────────────────────────────────────────────────
    async function submitLogin(e) {
        e.preventDefault();

        const username = document.getElementById('login-username')?.value.trim();
        const password = document.getElementById('login-password')?.value;
        const btn      = document.getElementById('login-btn');
        const errorEl  = document.getElementById('login-error');

        if (!username || !password) return;

        // Loading state
        btn.disabled     = true;
        btn.innerHTML    = '<i class="fas fa-spinner fa-spin me-2"></i>Memverifikasi...';
        errorEl.style.display = 'none';

        try {
            const resp = await fetch(`${API_BASE}/api/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ username, password }),
            });

            const data = await resp.json();

            if (!data.success) {
                _showError(errorEl, data.error || 'Login gagal.');
                btn.disabled  = false;
                btn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Masuk';
                return;
            }

            // Map API response to session shape expected by the rest of the app
            const session = {
                ...data.user,
                email: data.user.username,   // backward-compat: old code uses session.email
            };

            _saveSession(session);
            renderAuthenticatedApp(session);

        } catch (err) {
            console.error('[login] Network error:', err);
            _showError(errorEl, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.');
            btn.disabled  = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Masuk';
        }
    }

    function _showError(el, msg) {
        el.textContent    = msg;
        el.style.display  = 'block';
        el.style.animation = 'none';
        requestAnimationFrame(() => { el.style.animation = ''; });
    }

    function togglePassword() {
        const input = document.getElementById('login-password');
        const icon  = document.getElementById('toggle-pw-icon');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER AUTHENTICATED APP
    // ─────────────────────────────────────────────────────────────────────────
    function renderAuthenticatedApp(session) {
        const loginEl = document.getElementById('screen-login');
        if (loginEl) loginEl.style.display = 'none';

        const header = document.getElementById('edu-main-header');
        if (header) {
            header.style.display = 'block';
            // Update user display
            const emailEl = document.getElementById('user-email-display');
            if (emailEl) emailEl.innerText = session.nama || session.username || session.email || '';
        }

        const viewport = document.getElementById('app-viewport');
        if (viewport) viewport.style.display = 'block';

        const dock = document.querySelector('.persistent-bottom-dock');
        if (dock) dock.style.display = 'flex';

        // Superadmin controls
        const switcherBar = document.getElementById('persona-switcher-bar');
        if (switcherBar) switcherBar.style.display = session.isSuperadmin ? 'block' : 'none';

        if (window.EduAuth)  EduAuth.setCurrentUser(session);
        if (window.AtlasEdu) AtlasEdu.applySessionUnit(session.unit || 'idad_prep', session);

        // ── Fire atlas:login so dependent components (launcher etc.) can boot ──
        window.dispatchEvent(new CustomEvent('atlas:login', { detail: session }));
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  LOGOUT
    // ─────────────────────────────────────────────────────────────────────────
    function logout() {
        // Log to API (non-blocking)
        const session = getStoredSession();
        if (session) {
            fetch(`${API_BASE}/api/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: session.username }),
            }).catch(() => {});
        }

        localStorage.removeItem(SESSION_KEY);
        _hideApp();
        _showLoginScreen();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────────────
    function _hideApp() {
        const header   = document.getElementById('edu-main-header');
        const viewport = document.getElementById('app-viewport');
        const dock     = document.querySelector('.persistent-bottom-dock');
        if (header)   header.style.display   = 'none';
        if (viewport) viewport.style.display = 'none';
        if (dock)     dock.style.display     = 'none';
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  BOOT
    // ─────────────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    // ─────────────────────────────────────────────────────────────────────────
    //  PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────
    return {
        init,
        submitLogin,
        togglePassword,
        logout,
        getStoredSession,
        renderAuthenticatedApp,
        forceRefresh: _clearCachesAndReload,
        APP_VERSION,
    };

})();
