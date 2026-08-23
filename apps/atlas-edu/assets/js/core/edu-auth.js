/**
 * Project Atlas Edu — Role Authorization & Persona Guard Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduAuth = (function() {
    let currentUser = null;
    let currentRole = null;

    function setCurrentUser(userSession) {
        currentUser = userSession;
        currentRole = userSession ? userSession.role : null;
    }

    function switchRole(role) {
        if (currentUser && !currentUser.isSuperadmin && role !== currentUser.role) {
            alert('Access Denied: Persona Switcher is exclusively available to Superadmin / Director accounts.');
            return;
        }

        currentRole = role;

        document.querySelectorAll('.role-nav-btn').forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-light');
        });

        const activeBtn = document.getElementById(`btn-role-${role}`);
        if (activeBtn) {
            activeBtn.classList.remove('btn-light');
            activeBtn.classList.add('active', 'btn-primary');
        }

        document.querySelectorAll('.role-dashboard-screen').forEach(screen => {
            screen.style.display = 'none';
        });

        const targetScreen = document.getElementById(`screen-${role}`);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }

    function showLoginScreen() {
        if (window.EduLogin) window.EduLogin.showLoginScreen();
    }

    return {
        setCurrentUser,
        switchRole,
        showLoginScreen,
        getCurrentUser: () => currentUser
    };
})();
