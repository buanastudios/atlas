import { FacilitiesService } from './facilities.service.js';
import { renderFacilitiesTemplate } from './facilities.template.js';

export class FacilitiesModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-amber-400 mb-2"></i><br/>Memuat data fasilitas...</div>`;
    const facilities = await FacilitiesService.getFacilities();
    this.render(facilities);
  }

  render(facilities) {
    this.container.innerHTML = renderFacilitiesTemplate(facilities);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
