/**
 * Project Atlas Edu — Governance, COBIT 2019, ISO 9001 & WTP Audit UI Module
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduGovernanceAudit = (function() {
    function openGovernanceModal() {
        const modal = new bootstrap.Modal(document.getElementById('modalGovernanceAudit'));
        renderDashboard();
        modal.show();
    }

    function renderDashboard() {
        const container = document.getElementById('governance_dashboard_content');
        if (!container || !window.AtlasAuditEngine) return;

        const cobit = window.AtlasAuditEngine.COBIT_DOMAINS;
        const iso = window.AtlasAuditEngine.ISO_9001_METRICS;
        const wtp = window.AtlasAuditEngine.WTP_FINANCIAL_AUDIT;
        const logs = window.AtlasAuditEngine.getAuditLogs();

        let html = `
            <!-- WTP AUDIT OPINION BANNER -->
            <div class="alert alert-success d-flex align-items-center justify-content-between p-3 mb-4" style="border-radius: 14px;">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 22px;">
                        <i class="fas fa-award"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold m-0 text-success-emphasis">AUDIT OPINION: ${wtp.opinionTarget}</h6>
                        <small class="text-muted">${wtp.bpkStandard} — SHA-256 Ledger Chain: <strong>${wtp.sha256HashChainIntegrity}</strong></small>
                    </div>
                </div>
                <span class="badge bg-success px-3 py-2 fs-6">100% WTP VERIFIED</span>
            </div>

            <!-- GOVERNANCE & QUALITY STANDARDS GRID -->
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <div class="card border-0 bg-light p-3 h-100" style="border-radius: 14px;">
                        <h6 class="fw-bold text-dark mb-3"><i class="fas fa-shield-alt text-teal me-2"></i>COBIT 2019 IT Governance Framework</h6>
                        <div class="table-responsive">
                            <table class="table table-sm align-middle small mb-0">
                                <thead>
                                    <tr><th>Domain</th><th>Code</th><th>Score</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    ${Object.keys(cobit).map(k => `
                                        <tr>
                                            <td class="fw-bold">${cobit[k].name}</td>
                                            <td class="font-monospace text-muted">${cobit[k].code}</td>
                                            <td class="fw-bold text-teal">${cobit[k].score}%</td>
                                            <td><span class="badge bg-teal-subtle text-teal">${cobit[k].status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card border-0 bg-light p-3 h-100" style="border-radius: 14px;">
                        <h6 class="fw-bold text-dark mb-3"><i class="fas fa-certificate text-indigo me-2"></i>ISO 9001:2015 Quality Management System (QMS)</h6>
                        <ul class="list-group list-group-flush bg-transparent small mb-0">
                            <li class="list-group-item bg-transparent d-flex justify-content-between">
                                <span>Quality Policy Score:</span>
                                <strong class="text-indigo">${iso.qualityPolicyScore}%</strong>
                            </li>
                            <li class="list-group-item bg-transparent d-flex justify-content-between">
                                <span>PDCA Plan-Do-Check-Act Engine:</span>
                                <span class="badge bg-success-subtle text-success">Plan OK | Do OK | Check OK | Act OK</span>
                            </li>
                            <li class="list-group-item bg-transparent d-flex justify-content-between">
                                <span>Risk-Based Thinking Index:</span>
                                <strong class="text-success">${iso.riskBasedThinkingIndex}</strong>
                            </li>
                            <li class="list-group-item bg-transparent d-flex justify-content-between">
                                <span>Open CAPA Non-Conformities:</span>
                                <strong class="text-teal">${iso.capaOpenCount} Open Items</strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- IMMUTABLE AUDIT TRAIL LOGS -->
            <div class="card border-0 bg-light p-3" style="border-radius: 14px;">
                <h6 class="fw-bold text-dark mb-3"><i class="fas fa-history text-purple me-2"></i>Immutable Tamper-Evident SHA-256 Audit Trail Logs</h6>
                <div class="table-responsive">
                    <table class="table table-bordered table-sm small align-middle bg-white mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Timestamp</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>SHA-256 Hash</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.map(log => `
                                <tr>
                                    <td class="font-monospace">${log.timestamp.substring(11,19)}</td>
                                    <td class="fw-bold">${log.actorId}</td>
                                    <td><span class="badge bg-purple-subtle text-purple">${log.actionType}</span></td>
                                    <td>${log.resourceTarget}</td>
                                    <td class="font-monospace text-muted small">${log.hash.substring(0,22)}...</td>
                                    <td><span class="badge bg-success">${log.auditStatus}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    return {
        openGovernanceModal,
        renderDashboard
    };
})();
