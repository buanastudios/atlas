/**
 * Atlas Edu — Module Sheet Container (src/components/ModuleSheet.js)
 * Hosts active self-contained business modules inside the smartphone viewport.
 */

import { getModuleById } from '../modules/registry.js';
import { store } from '../lib/store.js';
import { router } from '../lib/router.js';

export class ModuleSheet {
  constructor() {
    this.sheetEl = document.getElementById('module-container');
    this.titleEl = document.getElementById('module-title');
    this.categoryEl = document.getElementById('module-category');
    this.bodyEl = document.getElementById('module-body');
    this.btnClose = document.getElementById('btn-close-module');
    this.btnRefresh = document.getElementById('btn-module-refresh');
    this.activeModuleInstance = null;
    this.init();
  }

  init() {
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => {
        router.closeModule();
      });
    }

    if (this.btnRefresh) {
      this.btnRefresh.addEventListener('click', () => {
        if (store.state.activeModuleId) {
          this.loadModule(store.state.activeModuleId);
        }
      });
    }

    store.subscribe((state) => {
      if (state.activeModuleId) {
        this.open(state.activeModuleId);
      } else {
        this.close();
      }
    });
  }

  async open(moduleId) {
    const meta = getModuleById(moduleId);
    if (!meta) {
      router.closeModule();
      return;
    }

    this.titleEl.textContent = meta.name;
    this.categoryEl.textContent = meta.category;
    
    // Slide container into viewport
    this.sheetEl.classList.remove('translate-y-full');
    this.sheetEl.classList.add('translate-y-0');

    await this.loadModule(moduleId);
  }

  async loadModule(moduleId) {
    const meta = getModuleById(moduleId);
    if (!meta) return;

    if (this.activeModuleInstance && typeof this.activeModuleInstance.destroy === 'function') {
      this.activeModuleInstance.destroy();
      this.activeModuleInstance = null;
    }

    this.bodyEl.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-slate-400 text-xs">
        <i class="fas fa-circle-notch fa-spin text-2xl text-emerald-400 mb-3"></i>
        <span>Memuat modul ${meta.name}...</span>
      </div>
    `;

    try {
      const moduleExports = await meta.load();
      if (typeof moduleExports.mount === 'function') {
        this.activeModuleInstance = moduleExports.mount(this.bodyEl);
      }
    } catch (err) {
      console.error('[Module load error]:', err);
      this.bodyEl.innerHTML = `
        <div class="p-6 bg-rose-950/40 border border-rose-800/50 rounded-3xl text-center space-y-3">
          <i class="fas fa-exclamation-triangle text-2xl text-rose-400"></i>
          <h4 class="text-xs font-bold text-white">Gagal Memuat Modul</h4>
          <p class="text-[11px] text-slate-300">${err.message}</p>
          <button onclick="window.location.hash='#/'" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition">
            Kembali ke Beranda
          </button>
        </div>
      `;
    }
  }

  close() {
    this.sheetEl.classList.remove('translate-y-0');
    this.sheetEl.classList.add('translate-y-full');

    if (this.activeModuleInstance && typeof this.activeModuleInstance.destroy === 'function') {
      this.activeModuleInstance.destroy();
      this.activeModuleInstance = null;
    }
  }
}
