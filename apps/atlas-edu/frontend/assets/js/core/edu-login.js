/**
 * Project Atlas Edu — Session-Gated Login Engine with Router Guard
 *
 * Guard flow on every page load:
 *   1. Version check  → stale build? clear SW caches + hard reload
 *   2. Session check  → valid session? render app; else show login
 *
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduLogin = (function () {

    // ── Bump this string on every deployment to invalidate all caches ──────
    const APP_VERSION = '1.0.3';
    const VERSION_KEY = 'atlas_app_version';
    const SESSION_KEY = 'atlas_edu_session';

    // ─────────────────────────────────────────────────────────────────────
    //  ROUTER GUARD  (runs synchronously before anything else on DOMContentLoaded)
    // ─────────────────────────────────────────────────────────────────────
    function _routerGuard() {
        const storedVersion = localStorage.getItem(VERSION_KEY);

        if (storedVersion !== APP_VERSION) {
            // Version mismatch → evict all SW caches then hard-reload
            _clearCachesAndReload();
            return false; // tell init() to halt — reload is pending
        }

        return true; // version OK, proceed normally
    }

    /**
     * Clears every Cache Storage bucket (Service Worker caches) and any
     * stale session data, then performs a hard reload that bypasses the
     * browser's HTTP cache (location.reload(true) is the standard mechanism;
     * the deprecated flag still works universally in all targets).
     */
    function _clearCachesAndReload() {
        // 1. Mark new version FIRST so the guard passes after reload
        localStorage.setItem(VERSION_KEY, APP_VERSION);

        // 2. Drop stale session — force re-login after a version bump
        sessionStorage.removeItem(SESSION_KEY);

        // 3. Evict Service Worker Cache Storage buckets
        if ('caches' in window) {
            caches.keys()
                .then(names => Promise.all(names.map(n => caches.delete(n))))
                .catch(() => {}) // non-fatal; proceed to reload anyway
                .finally(() => _hardReload());
        } else {
            _hardReload();
        }
    }

    /**
     * Hard reload — skips browser HTTP cache.
     * Falls back to cache-busting query string if the API isn't available.
     */
    function _hardReload() {
        try {
            // Standard hard reload (bypasses browser HTTP cache)
            location.reload(true);
        } catch (_) {
            // Fallback: navigate with a unique cache-bust timestamp
            const sep = location.search ? '&' : '?';
            location.href = location.pathname + location.search + sep + '_cb=' + Date.now();
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  PERSONA & UNIT CONFIG
    // ─────────────────────────────────────────────────────────────────────
    const personaUnitMap = {
        superadmin: null,
        principal:  null,
        teacher:    null,
        parent:     ['primary', 'junior', 'senior', 'preschool'],
        student:    ['primary', 'junior', 'senior', 'diploma2', 'idad_prep', 'university'],
        vendor:     null,
        support:    null,
        admin:      null,
    };

    const personaEmails = {
        superadmin: 'superadmin@buana.studio',
        principal:  'principal@buana.studio',
        teacher:    'ustadz@buana.studio',
        parent:     'wali@buana.studio',
        student:    'santri@buana.studio',
        vendor:     'vendor@buana.studio',
        support:    'support@buana.studio',
        admin:      'admin@buana.studio',
    };

    // ─────────────────────────────────────────────────────────────────────
    //  INIT  (DOMContentLoaded entry point)
    // ─────────────────────────────────────────────────────────────────────
    function init() {
        // Step 1 — run the router guard; halt if a reload was triggered
        if (!_routerGuard()) return;

        // Step 2 — session check
        const saved = getStoredSession();
        if (saved) {
            renderAuthenticatedApp(saved);
        } else {
            showLoginScreen();
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  SESSION HELPERS
    // ─────────────────────────────────────────────────────────────────────
    function getStoredSession() {
        try {
            const data = sessionStorage.getItem(SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  LOGIN SCREEN
    // ─────────────────────────────────────────────────────────────────────
    function showLoginScreen() {
        sessionStorage.removeItem(SESSION_KEY);
        _hideApp();
        const loginScreen = document.getElementById('screen-login');
        if (loginScreen) loginScreen.style.display = 'flex';
        window.scrollTo(0, 0);

        const personaSelect = document.getElementById('kit_persona_select');
        if (personaSelect) {
            personaSelect.addEventListener('change', _updateUnitOptions);
            _updateUnitOptions();
        }
    }

    function _updateUnitOptions() {
        const persona    = document.getElementById('kit_persona_select')?.value || 'superadmin';
        const unitSelect = document.getElementById('kit_unit_select');
        if (!unitSelect) return;

        const allUnits = [
            { value: 'preschool',  label: '🌱 Preschool & Kindergarten (TK / PAUD)' },
            { value: 'primary',    label: '📚 Primary School (SD / MI)' },
            { value: 'junior',     label: '📖 Junior High School (SMP / MTs)' },
            { value: 'senior',     label: '🎓 Senior High School (SMA / MA / SMK)' },
            { value: 'diploma2',   label: "🕌 Diploma 2 Arabic (Ma'had Aly)" },
            { value: 'idad_prep',  label: "🌍 'Idad Lughawi & TOAFL Overseas Prep" },
            { value: 'university', label: '🏛️ University & Higher Education (Kampus)' },
        ];

        const allowed  = personaUnitMap[persona];
        const filtered = allowed ? allUnits.filter(u => allowed.includes(u.value)) : allUnits;
        unitSelect.innerHTML = filtered.map(u => `<option value="${u.value}">${u.label}</option>`).join('');
    }

    // Expose so the inline onchange in HTML can call it
    function onPersonaChange() { _updateUnitOptions(); }

    // ─────────────────────────────────────────────────────────────────────
    //  LOGIN SUBMIT
    // ─────────────────────────────────────────────────────────────────────
    function handleKitLoginSubmit(e) {
        if (e) e.preventDefault();

        const persona = document.getElementById('kit_persona_select')?.value || 'superadmin';
        const unit    = document.getElementById('kit_unit_select')?.value    || 'idad_prep';
        const email   = personaEmails[persona] || `${persona}@buana.studio`;

        const session = {
            role:         persona === 'superadmin' ? 'director' : persona,
            isSuperadmin: persona === 'superadmin',
            email,
            unit,
            loginTime:    new Date().toISOString(),
            appVersion:   APP_VERSION,
        };

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        if (window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent(
                email, session.role, 'LOGIN', 'Atlas Edu',
                `Signed in as ${session.role} → unit: ${unit} (v${APP_VERSION})`
            );
        }

        renderAuthenticatedApp(session);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  RENDER AUTHENTICATED APP
    // ─────────────────────────────────────────────────────────────────────
    function renderAuthenticatedApp(session) {
        document.getElementById('screen-login')?.style && (document.getElementById('screen-login').style.display = 'none');

        const header = document.getElementById('edu-main-header');
        if (header) header.style.display = 'block';

        const emailEl = document.getElementById('user-email-display');
        if (emailEl) emailEl.innerText = session.email;

        const viewport = document.getElementById('app-viewport');
        if (viewport) viewport.style.display = 'block';

        const dock = document.querySelector('.persistent-bottom-dock');
        if (dock) dock.style.display = 'flex';

        const switcherBar = document.getElementById('persona-switcher-bar');
        if (switcherBar) switcherBar.style.display = session.isSuperadmin ? 'block' : 'none';

        if (window.EduAuth)  EduAuth.setCurrentUser(session);
        if (window.AtlasEdu) AtlasEdu.applySessionUnit(session.unit, session);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  LOGOUT  — clears session then sends user back to login (no reload)
    //  To also hard-reload on logout (e.g. for shared devices), set
    //  HARD_RELOAD_ON_LOGOUT = true below.
    // ─────────────────────────────────────────────────────────────────────
    const HARD_RELOAD_ON_LOGOUT = false;

    function logout() {
        const session = getStoredSession();
        if (session && window.AtlasAuditEngine) {
            AtlasAuditEngine.logEvent(session.email, session.role, 'LOGOUT', 'Atlas Edu', 'Session ended');
        }

        if (HARD_RELOAD_ON_LOGOUT) {
            sessionStorage.removeItem(SESSION_KEY);
            _hardReload();
        } else {
            showLoginScreen();
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    //  HIDE APP CHROME
    // ─────────────────────────────────────────────────────────────────────
    function _hideApp() {
        const header   = document.getElementById('edu-main-header');
        const viewport = document.getElementById('app-viewport');
        const dock     = document.querySelector('.persistent-bottom-dock');
        if (header)   header.style.display   = 'none';
        if (viewport) viewport.style.display = 'none';
        if (dock)     dock.style.display     = 'none';
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        showLoginScreen,
        handleKitLoginSubmit,
        onPersonaChange,
        logout,
        getStoredSession,
        // Expose for DevTools / admin tooling
        forceRefresh: _clearCachesAndReload,
        APP_VERSION,
    };
})();
