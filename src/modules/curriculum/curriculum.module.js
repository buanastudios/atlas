import { CurriculumService } from './curriculum.service.js';
import { renderCurriculumTemplate } from './curriculum.template.js';

export class CurriculumModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-teal-400 mb-2"></i><br/>Memuat data kurikulum...</div>`;
    const pillars = await CurriculumService.getPillars();
    this.render(pillars);
  }

  render(pillars) {
    this.container.innerHTML = renderCurriculumTemplate(pillars);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
