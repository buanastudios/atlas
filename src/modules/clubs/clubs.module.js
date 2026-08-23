import { ClubsService } from './clubs.service.js';
import { renderClubsTemplate } from './clubs.template.js';

export class ClubsModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-emerald-400 mb-2"></i><br/>Memuat data ekstrakurikuler...</div>`;
    const clubs = await ClubsService.getClubs();
    this.render(clubs);
  }

  render(clubs) {
    this.container.innerHTML = renderClubsTemplate(clubs);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
