/**
 * Atlas Edu — Profile & Digital ID View (src/components/ProfileView.js)
 * Digital Islamic Education Directorate Credential Card.
 */

import { store } from '../lib/store.js';
import { sanitizeHtml } from '../lib/utils.js';

export class ProfileView {
  constructor() {
    this.container = document.getElementById('view-profile');
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => this.render());
  }

  render() {
    if (!this.container) return;
    const session = store.state.session;

    this.container.innerHTML = `
      <div class="space-y-4">
        <!-- Digital ID Smart Card -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-slate-900 to-teal-950 p-5 text-white shadow-2xl border border-emerald-500/40">
          <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="fas fa-graduation-cap text-emerald-400 text-lg"></i>
              <span class="text-xs font-extrabold tracking-wider uppercase text-emerald-300">Atlas Edu Digital ID</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              VERIFIED
            </span>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-emerald-700/50 border-2 border-emerald-400/60 overflow-hidden flex items-center justify-center text-white text-xl font-bold">
              <i class="fas fa-user-tie text-2xl text-emerald-200"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white leading-tight">${sanitizeHtml(session.nama)}</h3>
              <p class="text-[11px] text-emerald-300 font-medium">${sanitizeHtml(session.role)}</p>
              <p class="text-[10px] text-slate-300">${sanitizeHtml(session.unit)}</p>
            </div>
          </div>

          <div class="pt-3 border-t border-emerald-600/30 flex items-center justify-between text-[10px]">
            <div>
              <span class="text-slate-400 block text-[9px]">ID Pegawai</span>
              <span class="font-mono font-bold text-slate-200">EDU-2026-0042</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px]">Akses Sistem</span>
              <span class="font-bold text-emerald-400">Super Administrator</span>
            </div>
            <div class="text-right">
              <i class="fas fa-qrcode text-xl text-emerald-300"></i>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-2">
          <h4 class="text-xs font-bold text-white mb-2">Informasi Akun</h4>
          <div class="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
            <span class="text-slate-400">Email</span>
            <span class="text-white font-medium">${sanitizeHtml(session.email)}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
            <span class="text-slate-400">Otorisasi RLS</span>
            <span class="text-emerald-400 font-medium">Full Access (Superadmin)</span>
          </div>
          <div class="flex items-center justify-between py-2 text-xs">
            <span class="text-slate-400">Host Target</span>
            <span class="text-slate-300 font-mono text-[10px]">buanastudios.github.io/atlas/</span>
          </div>
        </div>
      </div>
    `;
  }
}
