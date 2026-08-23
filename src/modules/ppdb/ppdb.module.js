import { PpdbService } from './ppdb.service.js';
import { renderPpdbTemplate } from './ppdb.template.js';
import { showToast } from '../../lib/utils.js';
import { store } from '../../lib/store.js';

export class PpdbModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-blue-400 mb-2"></i><br/>Memuat data PPDB...</div>`;
    const registrations = await PpdbService.getRegistrations();
    this.render(registrations);
  }

  render(registrations) {
    this.container.innerHTML = renderPpdbTemplate(registrations);
    this.bindEvents();
  }

  bindEvents() {
    const btnTabList = this.container.querySelector('#btn-tab-ppdb-list');
    const btnTabForm = this.container.querySelector('#btn-tab-ppdb-form');
    const formContainer = this.container.querySelector('#ppdb-form-container');
    const listContainer = this.container.querySelector('#ppdb-list-container');
    const form = this.container.querySelector('#ppdb-form');

    if (btnTabList && btnTabForm) {
      btnTabList.addEventListener('click', () => {
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white transition';
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      });

      btnTabForm.addEventListener('click', () => {
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white transition';
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          full_name: form.querySelector('#ppdb-fullname').value.trim(),
          target_grade: form.querySelector('#ppdb-grade').value,
          parent_name: form.querySelector('#ppdb-parent').value.trim(),
          phone: form.querySelector('#ppdb-phone').value.trim(),
        };

        try {
          await PpdbService.submitRegistration(payload);
          showToast('Pendaftaran santri baru berhasil disimpan!', 'success');
          store.addActivity({
            type: 'ppdb',
            text: `Pendaftaran santri baru ${payload.full_name} (${payload.target_grade}) berhasil`,
            icon: 'fa-user-plus',
            color: 'text-blue-400'
          });
          this.mount();
        } catch (err) {
          showToast(`Gagal menyimpan pendaftaran: ${err.message}`, 'error');
        }
      });
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
