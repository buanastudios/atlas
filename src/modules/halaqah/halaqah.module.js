import { HalaqahService } from './halaqah.service.js';
import { renderHalaqahTemplate } from './halaqah.template.js';
import { showToast } from '../../lib/utils.js';
import { store } from '../../lib/store.js';

export class HalaqahModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-indigo-400 mb-2"></i><br/>Memuat presensi...</div>`;
    const logs = await HalaqahService.getLogs();
    this.render(logs);
  }

  render(logs) {
    this.container.innerHTML = renderHalaqahTemplate(logs);
    this.bindEvents();
  }

  bindEvents() {
    const btnTabList = this.container.querySelector('#btn-tab-halaqah-list');
    const btnTabForm = this.container.querySelector('#btn-tab-halaqah-form');
    const formContainer = this.container.querySelector('#halaqah-form-container');
    const listContainer = this.container.querySelector('#halaqah-list-container');
    const form = this.container.querySelector('#halaqah-form');

    if (btnTabList && btnTabForm) {
      btnTabList.addEventListener('click', () => {
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white transition';
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      });

      btnTabForm.addEventListener('click', () => {
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white transition';
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          student_name: form.querySelector('#halaqah-student').value.trim(),
          session: form.querySelector('#halaqah-session').value,
          status: form.querySelector('#halaqah-status').value,
          mutabaah: form.querySelector('#halaqah-mutabaah').value.trim() || 'Hadir',
        };

        try {
          await HalaqahService.submitAttendance(payload);
          showToast(`Presensi ${payload.student_name} (${payload.status}) berhasil disimpan!`, 'success');
          store.addActivity({
            type: 'halaqah',
            text: `Presensi: ${payload.student_name} tercatat ${payload.status} pada ${payload.session}`,
            icon: 'fa-calendar-check',
            color: 'text-indigo-400'
          });
          this.mount();
        } catch (err) {
          showToast(`Gagal menyimpan: ${err.message}`, 'error');
        }
      });
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
