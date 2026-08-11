/**
 * Project Atlas — Client-Side Micro Component & Template Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.AtlasTemplate = (function() {
    const templates = {};

    function register(name, templateFn) {
        templates[name] = templateFn;
    }

    function render(name, data = {}) {
        if (!templates[name]) {
            console.error(`Template '${name}' not found.`);
            return `<div class="text-danger small">Template error: '${name}' missing</div>`;
        }
        return templates[name](data);
    }

    // Built-in Super App Component Templates
    register('Header', function(data) {
        return `
            <header id="edu-main-header" class="tokopedia-super-header py-2 px-3 px-md-4">
                <div class="container-fluid d-flex align-items-center justify-content-between gap-3">
                    <a href="index.html" class="d-flex align-items-center gap-2 text-decoration-none me-2">
                        <img src="${data.logo || 'assets/images/atlas-logo.svg'}" alt="Atlas Logo" style="height: 32px; width: auto;">
                        <span class="fw-bold fs-5 text-dark tracking-tight">${data.title || 'Atlas Super App'}</span>
                    </a>
                    <div class="flex-grow-1 max-w-700 d-none d-md-block">
                        <div class="input-group tokopedia-search-box">
                            <span class="input-group-text bg-white border-0 text-muted px-3"><i class="fas fa-search text-success"></i></span>
                            <input type="text" class="form-control tokopedia-search-input" 
                                   placeholder="${data.searchPlaceholder || 'Cari...'}" 
                                   onkeyup="${data.onSearch || ''}">
                            <button class="btn btn-success px-4 fw-bold" style="background-color: var(--tokopedia-green); border: none;">Cari</button>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        ${data.extraButtons || ''}
                        <span class="small text-muted d-none d-lg-inline" id="user-email-display">${data.userEmail || ''}</span>
                        <button class="btn btn-outline-danger btn-sm px-3 py-1 fw-bold" style="border-radius: 8px;" onclick="${data.onLogout || 'EduLogin.logout()'}">
                            <i class="fas fa-sign-out-alt me-1"></i> Log Out
                        </button>
                    </div>
                </div>
            </header>
        `;
    });

    register('HeroBanner', function(data) {
        return `
            <div class="tokopedia-hero-carousel p-4 p-md-5 mb-4 position-relative">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <span class="badge bg-white text-success font-monospace px-3 py-1 mb-2 fw-bold">${data.badge || 'Anno 2026'}</span>
                        <h3 class="fw-bold text-white mb-2">${data.title}</h3>
                        <p class="text-white-50 m-0">${data.subtitle}</p>
                    </div>
                    <div class="col-md-4 text-end d-none d-md-block">
                        ${data.ctaButton ? `<button class="btn btn-light text-success fw-bold px-4 py-2" style="border-radius: 10px;" onclick="${data.ctaButton.onClick}"><i class="${data.ctaButton.icon} me-1"></i> ${data.ctaButton.label}</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    register('CardGrid', function(cards) {
        return `
            <div class="tokopedia-card-grid mb-3">
                ${cards.map(card => `
                    <div class="tokopedia-card" onclick="${card.onClick}">
                        <div class="tokopedia-card-thumb ${card.color || 'icon-gradient-teal'}">
                            <span class="tokopedia-badge-top">${card.category}</span>
                            <i class="${card.icon}"></i>
                        </div>
                        <div class="tokopedia-card-body">
                            <div class="tokopedia-card-title">${card.title}</div>
                            <div class="tokopedia-card-meta"><span class="badge bg-${card.badgeColor || 'success'}-subtle text-${card.badgeColor || 'success'}">${card.status}</span></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });

    return {
        register,
        render
    };
})();
