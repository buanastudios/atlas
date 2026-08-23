import { GraduationService } from './graduation.service.js';
import { renderGraduationTemplate } from './graduation.template.js';

export class GraduationModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-amber-400 mb-2"></i><br/>Memuat data kelulusan...</div>`;
    const students = await GraduationService.getStudents();
    this.render(students);
  }

  render(students) {
    this.container.innerHTML = renderGraduationTemplate(students);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
