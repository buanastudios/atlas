import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderHalaqahTemplate(logs = []) {
  return `
    <div class="space-y-4">
      <!-- Attendance Header -->
      <div class="bg-gradient-to-r from-indigo-900/70 to-blue-950/70 p-4 rounded-3xl border border-indigo-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Presensi Terpadu & Mutaba'ah</div>
            <h3 class="text-base font-extrabold text-white">Absensi KBM & Halaqah</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-base border border-indigo-400/30">
            <i class="fas fa-calendar-check"></i>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-700/30 text-center">
          <div>
            <span class="text-[10px] text-slate-300">Hadir</span>
            <div class="text-sm font-bold text-emerald-400">98.5%</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Sakit / Izin</span>
            <div class="text-sm font-bold text-amber-400">4 Santri</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Alpa</span>
            <div class="text-sm font-bold text-rose-400">0</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2">
        <button id="btn-tab-halaqah-list" class="flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white transition">Daftar Kehadiran</button>
        <button id="btn-tab-halaqah-form" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">+ Catat Presensi</button>
      </div>

      <!-- Form Container (Hidden by default) -->
      <div id="halaqah-form-container" class="hidden bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <h4 class="text-xs font-bold text-white flex items-center gap-2"><i class="fas fa-user-clock text-indigo-400"></i> Form Presensi Santri</h4>
        <form id="halaqah-form" class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Santri</label>
            <input type="text" id="halaqah-student" required placeholder="Nama lengkap santri" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Sesi KBM / Shalat</label>
              <select id="halaqah-session" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                <option>Shubuh & Halaqah Pagi</option>
                <option>KBM Pagi (07:30 - 12:00)</option>
                <option>Dzuhur Berjamaah</option>
                <option>Ashar & Halaqah Sore</option>
                <option>Maghrib & Isya</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Status Kehadiran</label>
              <select id="halaqah-status" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                <option value="Hadir">Hadir (Tepat Waktu)</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin Pulang</option>
                <option value="Alpa">Alpa</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Mutaba'ah / Catatan Disiplin</label>
            <input type="text" id="halaqah-mutabaah" placeholder="Misal: Tertib, membaca dzikir pagi" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition">
            Simpan Presensi
          </button>
        </form>
      </div>

      <!-- Attendance List Container -->
      <div id="halaqah-list-container" class="space-y-2.5">
        ${logs.map(log => `
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl ${log.status === 'Hadir' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} flex items-center justify-center font-bold text-xs">
                <i class="fas ${log.status === 'Hadir' ? 'fa-check' : 'fa-info'}"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(log.student_name)}</div>
                <div class="text-[10px] text-slate-400">${sanitizeHtml(log.session)}</div>
                <div class="text-[9px] text-indigo-400 mt-0.5">${sanitizeHtml(log.mutabaah || log.notes || 'Hadir')}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${log.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${sanitizeHtml(log.status)}
              </span>
              <div class="text-[9px] text-slate-500 mt-1">${formatDate(log.date)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
