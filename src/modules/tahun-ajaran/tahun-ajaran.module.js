import { TahunAjaranService } from './tahun-ajaran.service.js';
import { renderTahunAjaranTemplate } from './tahun-ajaran.template.js';

export class TahunAjaranModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-rose-400 mb-2"></i><br/>Memuat kalender akademik...</div>`;
    const years = await TahunAjaranService.getAcademicYears();
    this.render(years);
  }

  render(years) {
    this.container.innerHTML = renderTahunAjaranTemplate(years);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
