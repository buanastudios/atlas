/**
 * Atlas Edu — Settings View (src/components/SettingsView.js)
 * System preferences, diagnostic check, and launcher customization.
 */

import { store } from '../lib/store.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { showToast } from '../lib/utils.js';

export class SettingsView {
  constructor() {
    this.container = document.getElementById('view-settings');
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => this.render());
  }

  render() {
    if (!this.container) return;
    const { manageMode } = store.state;

    this.container.innerHTML = `
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2 px-1">
          <i class="fas fa-sliders-h text-emerald-400"></i> Pengaturan Sistem & Launcher
        </h3>

        <!-- Launcher Customization -->
        <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
          <h4 class="text-xs font-bold text-white">Tampilan Launcher</h4>
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="text-xs font-semibold text-white">Mode Atur Ikon (Jiggle)</div>
              <div class="text-[10px] text-slate-400">Aktifkan efek goyang untuk penataan</div>
            </div>
            <button id="btn-toggle-jiggle" class="px-3 py-1.5 rounded-xl text-xs font-bold ${manageMode ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'} transition">
              ${manageMode ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>
        </div>

        <!-- Supabase Cloud Diagnostics -->
        <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
          <h4 class="text-xs font-bold text-white flex items-center justify-between">
            <span>Konektivitas Supabase</span>
            <span class="px-2 py-0.5 rounded-md text-[9px] font-bold ${isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
              ${isSupabaseConfigured ? 'CONNECTED' : 'LOCAL CACHE MODE'}
            </span>
          </h4>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            ${isSupabaseConfigured
              ? 'Terhubung dengan Supabase SDK PostgreSQL & RLS Realtime channel.'
              : 'Menggunakan Local Resilience Store engine. Data tersimpan lokal di browser dengan persistensi instan.'}
          </p>
        </div>

        <!-- Data & Cache Reset -->
        <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
          <h4 class="text-xs font-bold text-white">Penyimpanan & Cache</h4>
          <button id="btn-reset-cache" class="w-full py-2.5 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
            <i class="fas fa-trash-alt text-xs"></i>
            Reset Local Cache & Muat Ulang
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnJiggle = this.container.querySelector('#btn-toggle-jiggle');
    const btnReset = this.container.querySelector('#btn-reset-cache');

    if (btnJiggle) {
      btnJiggle.addEventListener('click', () => {
        store.toggleManageMode();
        showToast(store.state.manageMode ? 'Mode penataan ikon diaktifkan' : 'Mode penataan ikon dimatikan', 'info');
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset seluruh cache data lokal dan muat ulang aplikasi?')) {
          localStorage.clear();
          showToast('Cache berhasil dibersihkan!', 'success');
          setTimeout(() => window.location.reload(), 500);
        }
      });
    }
  }
}
