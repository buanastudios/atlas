import { MbgService } from './mbg.service.js';
import { renderMbgTemplate } from './mbg.template.js';
import { showToast } from '../../lib/utils.js';
import { store } from '../../lib/store.js';

export class MbgModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-emerald-400 mb-2"></i><br/>Memuat data MBG...</div>`;
    const logs = await MbgService.getLogs();
    this.render(logs);
  }

  render(logs) {
    this.container.innerHTML = renderMbgTemplate(logs);
    this.bindEvents();
  }

  bindEvents() {
    const btnTabList = this.container.querySelector('#btn-tab-mbg-list');
    const btnTabForm = this.container.querySelector('#btn-tab-mbg-form');
    const formContainer = this.container.querySelector('#mbg-form-container');
    const listContainer = this.container.querySelector('#mbg-list-container');
    const form = this.container.querySelector('#mbg-form');

    if (btnTabList && btnTabForm) {
      btnTabList.addEventListener('click', () => {
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white transition';
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      });

      btnTabForm.addEventListener('click', () => {
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white transition';
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          menu_name: form.querySelector('#mbg-menu').value.trim(),
          portion_received: Number(form.querySelector('#mbg-portion').value),
          courier_name: form.querySelector('#mbg-courier').value.trim(),
          receiver_name: form.querySelector('#mbg-receiver').value.trim(),
        };

        try {
          await MbgService.submitReceipt(payload);
          showToast(`Berita acara MBG ${payload.portion_received} porsi berhasil disimpan!`, 'success');
          store.addActivity({
            type: 'mbg',
            text: `Serah terima MBG ${payload.portion_received} porsi diverifikasi oleh ${payload.receiver_name}`,
            icon: 'fa-utensils',
            color: 'text-emerald-400'
          });
          this.mount();
        } catch (err) {
          showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
