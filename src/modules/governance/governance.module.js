import { GovernanceService } from './governance.service.js';
import { renderGovernanceTemplate } from './governance.template.js';

export class GovernanceModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-cyan-400 mb-2"></i><br/>Memuat data audit WTP...</div>`;
    const audits = await GovernanceService.getAudits();
    this.render(audits);
  }

  render(audits) {
    this.container.innerHTML = renderGovernanceTemplate(audits);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
