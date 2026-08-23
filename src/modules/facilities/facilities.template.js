import { sanitizeHtml } from '../../lib/utils.js';

export function renderFacilitiesTemplate(facilities = []) {
  return `
    <div class="space-y-4">
      <!-- Facilities Hero Banner -->
      <div class="bg-gradient-to-r from-amber-900/70 to-yellow-950/70 p-4 rounded-3xl border border-amber-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Sarana & Prasarana Kampus</div>
            <h3 class="text-base font-extrabold text-white">Manajemen Fasilitas</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base border border-amber-400/30">
            <i class="fas fa-building"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Total Ruangan</span>
            <div class="text-sm font-bold text-white">24 Unit</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Status Pemeliharaan</span>
            <div class="text-sm font-bold text-emerald-400">Optimal (100%)</div>
          </div>
        </div>
      </div>

      <!-- Facilities List -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-white px-1">Daftar Sarana & Ketersediaan</h4>
        ${facilities.map(fac => `
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-door-open"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(fac.room_name)}</div>
                <div class="text-[10px] text-slate-400">Kapasitas: ${fac.capacity} Orang</div>
                <div class="text-[9px] text-amber-400 mt-0.5">Jadwal: ${sanitizeHtml(fac.current_booking)}</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${fac.status === 'Tersedia' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}">
              ${sanitizeHtml(fac.status)}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
