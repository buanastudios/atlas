import { TahfizhService } from './tahfizh.service.js';
import { renderTahfizhTemplate } from './tahfizh.template.js';
import { showToast } from '../../lib/utils.js';
import { store } from '../../lib/store.js';

export class TahfizhModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-purple-400 mb-2"></i><br/>Memuat data Tahfizh...</div>`;
    const records = await TahfizhService.getRecords();
    this.render(records);
  }

  render(records) {
    this.container.innerHTML = renderTahfizhTemplate(records);
    this.bindEvents();
  }

  bindEvents() {
    const btnTabList = this.container.querySelector('#btn-tab-tahfizh-list');
    const btnTabForm = this.container.querySelector('#btn-tab-tahfizh-form');
    const formContainer = this.container.querySelector('#tahfizh-form-container');
    const listContainer = this.container.querySelector('#tahfizh-list-container');
    const form = this.container.querySelector('#tahfizh-form');

    if (btnTabList && btnTabForm) {
      btnTabList.addEventListener('click', () => {
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white transition';
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      });

      btnTabForm.addEventListener('click', () => {
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white transition';
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          student_name: form.querySelector('#tahfizh-student').value.trim(),
          surah: form.querySelector('#tahfizh-surah').value.trim(),
          ayat: form.querySelector('#tahfizh-ayat').value.trim(),
          grade: form.querySelector('#tahfizh-grade').value,
          ustadz: form.querySelector('#tahfizh-ustadz').value.trim(),
        };

        try {
          await TahfizhService.submitSetoran(payload);
          showToast(`Setoran ${payload.student_name} tersimpan!`, 'success');
          store.addActivity({
            type: 'tahfizh',
            text: `Setoran baru ${payload.student_name} - QS. ${payload.surah}:${payload.ayat} (${payload.grade})`,
            icon: 'fa-quran',
            color: 'text-purple-400'
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
