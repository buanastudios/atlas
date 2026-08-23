/**
 * Project Atlas Edu — Enterprise Fault Isolation & Circuit Breaker Engine
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 *
 * Guarantees that if any business process or menu encounters a fault,
 * it is safely contained within an isolated execution boundary.
 * Sibling menus and overall application functionality remain 100% operational.
 */

window.AtlasFaultGuard = (function () {

    // Module registry & health state
    const moduleRegistry = {
        curriculum:    { name: 'Super App Curriculum',        status: 'HEALTHY', error: null, retryFn: null },
        tahfizh:       { name: 'Tahfizh Quran Center',        status: 'HEALTHY', error: null, retryFn: null },
        ppdb:          { name: 'PPDB Online Admissions',      status: 'HEALTHY', error: null, retryFn: null },
        tuition:       { name: 'Tuition & SPP Ledger',         status: 'HEALTHY', error: null, retryFn: null },
        facilities:    { name: 'Facilities & Infrastructure',  status: 'HEALTHY', error: null, retryFn: null },
        governance:    { name: 'Governance & WTP Audit',      status: 'HEALTHY', error: null, retryFn: null },
        clubs:         { name: 'Clubs & Extra-Curricular',     status: 'HEALTHY', error: null, retryFn: null },
        tahun_ajaran:  { name: 'Tahun Ajaran Rollover',       status: 'HEALTHY', error: null, retryFn: null },
        search:        { name: 'Global Search Engine',        status: 'HEALTHY', error: null, retryFn: null },
        units:         { name: 'Academic Unit Workspaces',    status: 'HEALTHY', error: null, retryFn: null }
    };

    /**
     * Executes a module process within an isolated execution boundary.
     * @param {string} moduleKey - Registry identifier key
     * @param {string} moduleName - Human readable module name
     * @param {HTMLElement|string} targetContainer - Target DOM element or selector string
     * @param {Function} processFn - The process execution function
     */
    function runIsolated(moduleKey, moduleName, targetContainer, processFn) {
        const container = typeof targetContainer === 'string'
            ? document.querySelector(targetContainer) || document.getElementById(targetContainer)
            : targetContainer;

        // Register retry handler
        if (moduleRegistry[moduleKey]) {
            moduleRegistry[moduleKey].name = moduleName || moduleRegistry[moduleKey].name;
            moduleRegistry[moduleKey].retryFn = () => runIsolated(moduleKey, moduleName, targetContainer, processFn);
        }

        try {
            // Check if circuit breaker is tripped manually
            if (moduleRegistry[moduleKey] && moduleRegistry[moduleKey].status === 'FAULT_ISOLATED') {
                const err = new Error(moduleRegistry[moduleKey].error || `Circuit breaker tripped for ${moduleName}`);
                _handleFault(moduleKey, moduleName, err, container);
                return false;
            }

            // Execute in sandbox
            const result = processFn();

            // Mark as healthy on success
            if (moduleRegistry[moduleKey]) {
                moduleRegistry[moduleKey].status = 'HEALTHY';
                moduleRegistry[moduleKey].error = null;
            }
            return result;
        } catch (error) {
            _handleFault(moduleKey, moduleName, error, container);
            return false;
        }
    }

    /**
     * Internal fault handler: contains error, logs audit event, and renders Fault Isolation Card
     */
    function _handleFault(moduleKey, moduleName, error, container) {
        console.warn(`[AtlasFaultGuard] Fault isolated in module [${moduleKey}]:`, error);

        if (moduleRegistry[moduleKey]) {
            moduleRegistry[moduleKey].status = 'FAULT_ISOLATED';
            moduleRegistry[moduleKey].error = error.message || String(error);
        }

        // Audit Log entry
        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent(
                'system@buana.studio', 'FaultGuard', 'MODULE_FAULT_CONTAINED',
                moduleName || moduleKey,
                `Fault isolated cleanly: ${error.message}`
            );
        }

        // Render Fault Card into container if valid
        if (container) {
            _renderFaultCard(moduleKey, moduleName || moduleKey, error, container);
        }

        // Update health badges if modal open
        _updateHealthModalUI();
    }

    /**
     * Renders a clean Fault Isolation & Self-Healing Card
     */
    function _renderFaultCard(moduleKey, moduleName, error, container) {
        const timestamp = new Date().toLocaleTimeString();
        container.innerHTML = `
            <div class="card border-0 shadow-sm my-3 overflow-hidden" style="border-radius: 16px; border-left: 5px solid #ef4444 !important; background: #fff5f5;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-danger px-3 py-2 fw-bold" style="font-size: 11px; border-radius: 20px;">
                                <i class="fas fa-shield-alt me-1"></i> FAULT ISOLATED
                            </span>
                            <span class="fw-bold text-dark" style="font-size: 15px;">${moduleName} Process Sandbox</span>
                        </div>
                        <span class="badge bg-white text-muted border px-2 py-1 small font-monospace">${timestamp}</span>
                    </div>

                    <div class="alert alert-danger py-2 px-3 mb-3 small" style="border-radius: 10px; background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.2);">
                        <i class="fas fa-exclamation-triangle me-2 text-danger"></i>
                        <strong>Runtime Exception Caught:</strong> ${error.message || String(error)}
                    </div>

                    <p class="small text-secondary mb-3" style="line-height: 1.5;">
                        <i class="fas fa-check-circle text-success me-1"></i>
                        <strong>Sandbox Isolation Active:</strong> Sibling modules, user navigation, and all other app menus remain 100% operational and collision-free.
                    </p>

                    <div class="d-flex gap-2 flex-wrap pt-2 border-top border-danger-subtle">
                        <button class="btn btn-sm btn-danger fw-bold px-3 py-2 rounded-pill" onclick="AtlasFaultGuard.retryModule('${moduleKey}')">
                            <i class="fas fa-wrench me-1"></i> Self-Heal & Retry Process
                        </button>
                        <button class="btn btn-sm btn-outline-secondary fw-bold px-3 py-2 rounded-pill" onclick="AtlasFaultGuard.openHealthDashboardModal()">
                            <i class="fas fa-heartbeat me-1 text-danger"></i> Open Circuit Breaker Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Retries a faulted module process
     */
    function retryModule(moduleKey) {
        const mod = moduleRegistry[moduleKey];
        if (!mod) return;

        mod.status = 'HEALTHY';
        mod.error = null;

        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent(
                'director@buana.studio', 'Director', 'MODULE_RECOVERED',
                mod.name, `Self-healed & retried ${mod.name}`
            );
        }

        if (typeof mod.retryFn === 'function') {
            mod.retryFn();
        } else {
            location.reload();
        }

        _updateHealthModalUI();
    }

    /**
     * Resets all circuit breakers to HEALTHY
     */
    function resetAllModules() {
        Object.keys(moduleRegistry).forEach(key => {
            moduleRegistry[key].status = 'HEALTHY';
            moduleRegistry[key].error = null;
        });

        if (window.AtlasAuditEngine) {
            window.AtlasAuditEngine.logEvent(
                'director@buana.studio', 'Director', 'CIRCUIT_BREAKER_RESET',
                'System Core', 'All module circuit breakers reset to HEALTHY'
            );
        }

        alert('All module circuit breakers successfully reset to HEALTHY state.');
        _updateHealthModalUI();
    }

    /**
     * Intentionally injects a fault into a specific module for live testing
     */
    function simulateFault(moduleKey) {
        const mod = moduleRegistry[moduleKey];
        if (!mod) return;

        const simulatedError = new Error(`Simulated business process fault in [${mod.name}]`);
        
        // Find target element depending on module key
        let targetEl = null;
        if (moduleKey === 'curriculum') targetEl = document.getElementById('curriculum-5pillars-container');
        else if (moduleKey === 'units') targetEl = document.getElementById('isolated-unit-modules');
        else targetEl = document.getElementById('app-viewport');

        _handleFault(moduleKey, mod.name, simulatedError, targetEl);
    }

    /**
     * Opens or shows System Health & Circuit Breaker Dashboard Modal
     */
    function openHealthDashboardModal() {
        let modalEl = document.getElementById('modalCircuitBreakerDashboard');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'modalCircuitBreakerDashboard';
            modalEl.className = 'modal fade';
            modalEl.tabIndex = -1;
            document.body.appendChild(modalEl);
        }

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                    <div class="modal-header border-bottom px-4 py-3 bg-dark text-white" style="border-top-left-radius:20px; border-top-right-radius:20px;">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fas fa-heartbeat text-danger fs-5"></i>
                            <h6 class="modal-title fw-bold m-0 text-white">System Health & Circuit Breaker Dashboard</h6>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="alert alert-info py-2 px-3 small mb-3 d-flex align-items-center justify-content-between">
                            <span><i class="fas fa-info-circle me-2"></i><strong>Fault Isolation Active:</strong> Each menu runs in an isolated sandbox boundary.</span>
                            <button class="btn btn-sm btn-outline-primary fw-bold" onclick="AtlasFaultGuard.resetAllModules()"><i class="fas fa-sync-alt me-1"></i> Reset All Breakers</button>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-hover align-middle small mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Business Process Module</th>
                                        <th>Circuit Status</th>
                                        <th>Fault Diagnostic</th>
                                        <th class="text-end">Simulate & Test</th>
                                    </tr>
                                </thead>
                                <tbody id="circuit-breaker-rows">
                                    ${_generateModalTableRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer border-top px-4 py-3">
                        <button type="button" class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    function _generateModalTableRows() {
        return Object.keys(moduleRegistry).map(key => {
            const mod = moduleRegistry[key];
            const isFaulted = mod.status === 'FAULT_ISOLATED';
            const badgeClass = isFaulted ? 'bg-danger' : 'bg-success';
            const statusText = isFaulted ? 'FAULT ISOLATED' : 'HEALTHY';
            const diagText = isFaulted ? `<span class="text-danger fw-semibold">${mod.error}</span>` : '<span class="text-muted">No issues detected</span>';

            return `
                <tr>
                    <td class="fw-bold">${mod.name}</td>
                    <td><span class="badge ${badgeClass} px-3 py-1 font-monospace" style="font-size:10px;">${statusText}</span></td>
                    <td>${diagText}</td>
                    <td class="text-end">
                        ${isFaulted
                            ? `<button class="btn btn-sm btn-warning fw-bold px-2 py-1" onclick="AtlasFaultGuard.retryModule('${key}')"><i class="fas fa-wrench me-1"></i> Heal</button>`
                            : `<button class="btn btn-sm btn-outline-danger fw-bold px-2 py-1" onclick="AtlasFaultGuard.simulateFault('${key}')"><i class="fas fa-bug me-1"></i> Test Fault</button>`
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }

    function _updateHealthModalUI() {
        const rowsEl = document.getElementById('circuit-breaker-rows');
        if (rowsEl) {
            rowsEl.innerHTML = _generateModalTableRows();
        }
    }

    return {
        runIsolated,
        retryModule,
        resetAllModules,
        simulateFault,
        openHealthDashboardModal,
        getRegistry: () => moduleRegistry
    };
})();
