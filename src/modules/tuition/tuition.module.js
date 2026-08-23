import { TuitionService } from './tuition.service.js';
import { renderTuitionTemplate } from './tuition.template.js';
import { showToast, formatIDR } from '../../lib/utils.js';
import { store } from '../../lib/store.js';

export class TuitionModule {
  constructor(container) {
    this.container = container;
  }

  async mount() {
    this.container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-teal-400 mb-2"></i><br/>Memuat data SPP...</div>`;
    const invoices = await TuitionService.getInvoices();
    this.render(invoices);
  }

  render(invoices) {
    this.container.innerHTML = renderTuitionTemplate(invoices);
    this.bindEvents();
  }

  bindEvents() {
    const btnTabList = this.container.querySelector('#btn-tab-tuition-list');
    const btnTabForm = this.container.querySelector('#btn-tab-tuition-form');
    const formContainer = this.container.querySelector('#tuition-form-container');
    const listContainer = this.container.querySelector('#tuition-list-container');
    const form = this.container.querySelector('#tuition-form');

    if (btnTabList && btnTabForm) {
      btnTabList.addEventListener('click', () => {
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white transition';
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.add('hidden');
        listContainer.classList.remove('hidden');
      });

      btnTabForm.addEventListener('click', () => {
        btnTabForm.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white transition';
        btnTabList.className = 'flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
        formContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
      });
    }

    // Pay now buttons
    this.container.querySelectorAll('.btn-pay-now').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.currentTarget.getAttribute('data-pay-id'));
        await TuitionService.payInvoice(id);
        showToast('Pembayaran SPP berhasil dikonfirmasi!', 'success');
        store.addActivity({
          type: 'tuition',
          text: `Pembayaran SPP Santri ID #${id} telah dikonfirmasi lunas`,
          icon: 'fa-receipt',
          color: 'text-teal-400'
        });
        this.mount();
      });
    });

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          student_name: form.querySelector('#tuition-student').value.trim(),
          month: form.querySelector('#tuition-month').value,
          amount: Number(form.querySelector('#tuition-amount').value),
        };

        try {
          await TuitionService.createInvoice(payload);
          showToast(`Tagihan SPP ${payload.student_name} (${formatIDR(payload.amount)}) diterbitkan!`, 'success');
          store.addActivity({
            type: 'tuition',
            text: `Tagihan SPP baru diterbitkan untuk ${payload.student_name} periode ${payload.month}`,
            icon: 'fa-credit-card',
            color: 'text-teal-400'
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
