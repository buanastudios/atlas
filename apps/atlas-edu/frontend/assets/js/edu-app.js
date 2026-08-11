/**
 * Project Atlas Edu — Academic Unit Workspace Engine
 * Unit is driven by session (set at login) — no manual tab bar
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.AtlasEdu = (function() {
    let currentUnit = 'idad_prep';
    let currentSession = null;

    // Tahfizh is cross-level: present in every unit regardless of academic tier
    const _TAHFIZH_TILE = { name: 'Tahfizh Center', icon: 'fas fa-quran', color: 'icon-gradient-indigo', action: 'EduTahfizh.openModule()' };

    const unitModuleConfig = {
        preschool:  [
            _TAHFIZH_TILE,
            { name: 'RKH & Tematik Harian',           icon: 'fas fa-calendar-day',          color: 'icon-gradient-teal'    },
            { name: 'Perkembangan & Milestone',        icon: 'fas fa-child',                 color: 'icon-gradient-emerald' },
            { name: 'Adab & Karakter PAUD',            icon: 'fas fa-heart',                 color: 'icon-gradient-rose'    },
            { name: 'Pickup Verification Log',         icon: 'fas fa-user-check',            color: 'icon-gradient-blue'    },
        ],
        primary:    [
            _TAHFIZH_TILE,
            { name: 'RPP & Tematik SD/MI',             icon: 'fas fa-file-alt',              color: 'icon-gradient-blue'    },
            { name: 'Character Building Log',          icon: 'fas fa-star',                  color: 'icon-gradient-purple'  },
            { name: 'Homework & Daily Log',            icon: 'fas fa-pen-alt',               color: 'icon-gradient-teal'    },
        ],
        junior:     [
            _TAHFIZH_TILE,
            { name: 'Jadwal Mata Pelajaran SMP',       icon: 'fas fa-clock',                 color: 'icon-gradient-teal'    },
            { name: 'Olympiad & Clubs Roster',         icon: 'fas fa-trophy',                color: 'icon-gradient-emerald' },
            { name: 'P5 Projects SMP',                 icon: 'fas fa-flag',                  color: 'icon-gradient-indigo'  },
        ],
        senior:     [
            _TAHFIZH_TILE,
            { name: 'UTBK / SNBP Prep',               icon: 'fas fa-graduation-cap',        color: 'icon-gradient-purple'  },
            { name: 'Vocational Skills & SMK',         icon: 'fas fa-tools',                 color: 'icon-gradient-amber'   },
            { name: 'KTI & Research Paper',            icon: 'fas fa-newspaper',             color: 'icon-gradient-blue'    },
            { name: 'OSIS & Student Council',          icon: 'fas fa-users',                 color: 'icon-gradient-teal'    },
        ],
        diploma2:   [
            _TAHFIZH_TILE,
            { name: 'Nahwu & Shorof Advanced',         icon: 'fas fa-language',              color: 'icon-gradient-rose'    },
            { name: 'Balaghah & Arabic Literature',    icon: 'fas fa-book-open',             color: 'icon-gradient-amber'   },
            { name: 'Micro-Teaching Practicum',        icon: 'fas fa-chalkboard-teacher',    color: 'icon-gradient-teal'    },
            { name: "Mu'adalah Certification",         icon: 'fas fa-award',                 color: 'icon-gradient-emerald' },
        ],
        idad_prep:  [
            _TAHFIZH_TILE,
            { name: 'TOAFL Arabic Proficiency',        icon: 'fas fa-award',                 color: 'icon-gradient-amber'   },
            { name: "'Idad Al-Azhar Placement",        icon: 'fas fa-mosque',                color: 'icon-gradient-rose'    },
            { name: 'IELTS Band 7.5+ Intensive',       icon: 'fas fa-globe',                 color: 'icon-gradient-blue'    },
            { name: 'Embassy & Visa Dossier',          icon: 'fas fa-passport',              color: 'icon-gradient-indigo'  },
            { name: 'Hiwar Conversation Lab',          icon: 'fas fa-comments',              color: 'icon-gradient-teal'    },
        ],
        university: [
            _TAHFIZH_TILE,
            { name: 'SKS / KRS Registration',          icon: 'fas fa-list-check',            color: 'icon-gradient-teal'    },
            { name: 'Skripsi Bimbingan Portal',        icon: 'fas fa-user-graduate',         color: 'icon-gradient-indigo'  },
            { name: 'Disertasi & Scopus Publishing',   icon: 'fas fa-newspaper',             color: 'icon-gradient-purple'  },
            { name: 'MBKM SKS Conversion',             icon: 'fas fa-exchange-alt',          color: 'icon-gradient-emerald' },
        ],
    };

    const unitMeta = {
        preschool:  { name: 'Preschool & Kindergarten (TK / PAUD)',                    icon: 'fas fa-baby',           color: 'icon-gradient-teal'   },
        primary:    { name: 'Primary School (SD / MI)',                                  icon: 'fas fa-shapes',         color: 'icon-gradient-blue'   },
        junior:     { name: 'Junior High School (SMP / MTs)',                            icon: 'fas fa-book-open',      color: 'icon-gradient-indigo' },
        senior:     { name: 'Senior High School (SMA / MA / SMK)',                       icon: 'fas fa-graduation-cap', color: 'icon-gradient-purple' },
        diploma2:   { name: "Diploma 2 Arabic & Sharia (Ma'had Aly D2)",                 icon: 'fas fa-certificate',    color: 'icon-gradient-amber'  },
        idad_prep:  { name: "'Idad Lughawi, TOAFL & Overseas University Prep",           icon: 'fas fa-globe',          color: 'icon-gradient-rose'   },
        university: { name: 'University & Higher Education (STAI / Kampus)',             icon: 'fas fa-university',     color: 'icon-gradient-teal'   },
    };

    function applySessionUnit(unitKey, session) {
        currentUnit  = unitKey  || 'idad_prep';
        currentSession = session || null;

        const meta = unitMeta[currentUnit] || unitMeta.idad_prep;

        // Set workspace title
        const titleEl = document.getElementById('active-unit-title');
        if (titleEl) titleEl.innerText = meta.name;

        // Set workspace subtitle (clean, no verbose copy)
        const subtitleEl = document.getElementById('active-unit-subtitle');
        if (subtitleEl) subtitleEl.innerText = '';

        // Set hero banner context
        const heroCtx = document.getElementById('hero-unit-context');
        if (heroCtx) heroCtx.innerText = meta.name;

        // Set hero user info
        const heroUser = document.getElementById('hero-user-info');
        if (heroUser && session) heroUser.innerText = session.email;

        // Render workspace module tiles
        _renderWorkspaceTiles(currentUnit, meta.name);
    }

    function _tileOnclick(mod, unitName) {
        return mod.action
            ? mod.action
            : `AtlasEdu.openModuleDetail('${mod.name.replace(/'/g,"\\'")}', '${unitName.replace(/'/g,"\\'")}')`;
    }

    function _renderWorkspaceTiles(unitKey, unitName) {
        const modules = unitModuleConfig[unitKey] || [];
        const moduleContainer = document.getElementById('isolated-unit-modules');
        if (!moduleContainer) return;

        moduleContainer.innerHTML = modules.map(mod => {
            const onclick = _tileOnclick(mod, unitName);
            return `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="workspace-touch-tile" onclick="${onclick}">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <div class="pwa-app-icon ${mod.color}" style="width:44px;height:44px;font-size:19px;border-radius:12px;flex-shrink:0;">
                            <i class="${mod.icon}"></i>
                        </div>
                    </div>
                    <div class="fw-bold" style="font-size:13px;line-height:1.35;flex-grow:1;">${mod.name}</div>
                    <div class="mt-auto pt-2">
                        <i class="fas fa-chevron-right" style="font-size:10px;color:#9ca3af;"></i>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function openModuleDetail(moduleName, unitName) {
        const viewport = document.getElementById('app-viewport');
        let moduleScreen = document.getElementById('screen-unit-detail');
        if (!moduleScreen) {
            moduleScreen = document.createElement('div');
            moduleScreen.id = 'screen-unit-detail';
            moduleScreen.className = 'module-screen px-3 px-md-4 pb-3';
            viewport.appendChild(moduleScreen);
        }

        // Hide main screens, show detail
        document.getElementById('screen-director')?.style && (document.getElementById('screen-director').style.display = 'none');
        document.getElementById('mgmt-screen-curriculum')?.style && (document.getElementById('mgmt-screen-curriculum').style.display = 'none');
        document.querySelectorAll('.module-screen:not(#screen-unit-detail)').forEach(s => s.style.display = 'none');

        moduleScreen.innerHTML = `
            <div class="module-detail-card mt-3">
                <div class="module-detail-header">
                    <button class="btn btn-sm btn-light fw-bold mb-3 px-3 rounded-pill" style="font-size:12px;" onclick="AtlasEdu.closeModuleDetail()">
                        <i class="fas fa-arrow-left me-1"></i> Back
                    </button>
                    <h4 class="fw-bold mb-1">${moduleName}</h4>
                    <small class="opacity-75">${unitName} · Isolated Domain Procedure</small>
                </div>
                <div class="module-detail-body">
                    <div class="d-flex gap-2 flex-wrap mb-4">
                        <span class="badge px-3 py-2 fw-semibold" style="background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;font-size:11px;">✓ Akreditasi Unggul</span>
                        <span class="badge px-3 py-2 fw-semibold" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;font-size:11px;">ISO 9001:2015</span>
                        <span class="badge px-3 py-2 fw-semibold" style="background:#fefce8;color:#b45309;border:1px solid #fde68a;font-size:11px;">WTP Verified</span>
                    </div>

                    <h6 class="fw-bold text-muted mb-3" style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;">Procedure Workflow</h6>
                    <div class="d-flex flex-column gap-2 mb-4">
                        ${['Penyusunan Capaian & Indikator','Validasi Rubrik & Instrumen','Implementasi & Monitoring KBM','Evaluasi & Pelaporan Berkala'].map((step, i) => `
                        <div class="d-flex align-items-center gap-3 p-3" style="background:#f8fafc;border-radius:12px;border:1px solid #e8eaed;">
                            <div class="fw-bold rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width:28px;height:28px;background:#03ac0e;color:#fff;font-size:12px;">${i+1}</div>
                            <div style="font-size:13px;font-weight:600;">${step}</div>
                            <span class="ms-auto" style="background:#f0fdf4;color:#03ac0e;border:1px solid #bbf7d0;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;white-space:nowrap;">Done ✓</span>
                        </div>`).join('')}
                    </div>

                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn-primary-atlas px-4 rounded-pill" style="font-size:13px;" onclick="alert('Running live procedure for ${moduleName}')">
                            <i class="fas fa-play me-1"></i> Jalankan Prosedur
                        </button>
                        <button class="btn btn-light fw-bold px-4 rounded-pill" style="font-size:13px;border:1.5px solid #e8eaed;" onclick="alert('Exporting WTP audit PDF for ${moduleName}')">
                            <i class="fas fa-file-pdf me-1 text-danger"></i> Export PDF
                        </button>
                    </div>
                </div>
            </div>
        `;

        moduleScreen.style.display = 'block';
        setTimeout(() => moduleScreen.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent('director@buana.studio', 'Director', 'MODULE_OPEN', moduleName, `Opened ${moduleName}`);
        }
    }

    function closeModuleDetail() {
        const d = document.getElementById('screen-unit-detail');
        if (d) d.style.display = 'none';
        const s = document.getElementById('screen-director');
        if (s) { s.style.display = 'block'; s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        const c = document.getElementById('mgmt-screen-curriculum');
        if (c) c.style.display = 'block';
    }

    function openLevelVisibilityModal() {
        new bootstrap.Modal(document.getElementById('modalLevelVisibility')).show();
    }

    function saveLevelVisibilitySettings(e) {
        if (e) e.preventDefault();
        bootstrap.Modal.getInstance(document.getElementById('modalLevelVisibility')).hide();
    }

    function openAddCustomMenuModal() {
        new bootstrap.Modal(document.getElementById('modalAddCustomApp')).show();
    }

    function saveCustomMenuForm(e) {
        if (e) e.preventDefault();
        const title = document.getElementById('custom_app_title')?.value || 'New App';
        alert(`Custom App "${title}" added!`);
        bootstrap.Modal.getInstance(document.getElementById('modalAddCustomApp')).hide();
    }

    return {
        applySessionUnit,
        openModuleDetail,
        closeModuleDetail,
        openLevelVisibilityModal,
        saveLevelVisibilitySettings,
        openAddCustomMenuModal,
        saveCustomMenuForm,
    };
})();
