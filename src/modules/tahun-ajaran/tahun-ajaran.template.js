import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderTahunAjaranTemplate(years = []) {
  return `
    <div class="space-y-4">
      <!-- Academic Year Hero Banner -->
      <div class="bg-gradient-to-r from-rose-900/70 to-red-950/70 p-4 rounded-3xl border border-rose-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Kalender Akademik & Semester</div>
            <h3 class="text-base font-extrabold text-white">Tahun Ajaran 2026/2027</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-base border border-rose-400/30">
            <i class="fas fa-calendar-alt"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-rose-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Semester Aktif</span>
            <div class="text-sm font-bold text-emerald-400">Ganjil 2026/2027</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Pekan Efektif KBM</span>
            <div class="text-sm font-bold text-white">18 Pekan</div>
          </div>
        </div>
      </div>

      <!-- Academic Years List -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-white px-1">Periode Pembelajaran</h4>
        ${years.map(yr => `
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">T.A. ${sanitizeHtml(yr.year)} · Semester ${sanitizeHtml(yr.semester)}</div>
                <div class="text-[10px] text-slate-400">${formatDate(yr.start_date)} s/d ${formatDate(yr.end_date)}</div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${yr.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                ${yr.is_active ? 'SEMESTER AKTIF' : 'TERJADWAL'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
