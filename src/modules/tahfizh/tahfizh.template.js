import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderTahfizhTemplate(records = []) {
  return `
    <div class="space-y-4">
      <!-- Tahfizh Hero Status Banner -->
      <div class="bg-gradient-to-r from-purple-900/70 to-fuchsia-950/70 p-4 rounded-3xl border border-purple-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Halaqah Qurani · Target Juz 30-28</div>
            <h3 class="text-base font-extrabold text-white">Mutaba'ah Tahfizh</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-arabic text-xl font-bold border border-purple-400/30">
            ق
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-700/30 text-center">
          <div>
            <span class="text-[10px] text-slate-300">Total Santri</span>
            <div class="text-sm font-bold text-white">348</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Setoran Hari Ini</span>
            <div class="text-sm font-bold text-emerald-400">${records.length}</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Rata-rata Nilai</span>
            <div class="text-sm font-bold text-purple-300">Mumtaz</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2">
        <button id="btn-tab-tahfizh-list" class="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white transition">Log Setoran</button>
        <button id="btn-tab-tahfizh-form" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">+ Input Setoran</button>
      </div>

      <!-- Form Container (Hidden by default) -->
      <div id="tahfizh-form-container" class="hidden bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <h4 class="text-xs font-bold text-white flex items-center gap-2"><i class="fas fa-quran text-purple-400"></i> Form Setoran Ziyadah / Muroja'ah</h4>
        <form id="tahfizh-form" class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Santri</label>
            <input type="text" id="tahfizh-student" required placeholder="Nama lengkap santri" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Surah</label>
              <input type="text" id="tahfizh-surah" required placeholder="Misal: An-Naba" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Rentang Ayat</label>
              <input type="text" id="tahfizh-ayat" required placeholder="Misal: 1-20" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Predikat Mutu</label>
              <select id="tahfizh-grade" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
                <option>Mumtaz (A+)</option>
                <option>Jayyid Jiddan (A)</option>
                <option>Jayyid (B)</option>
                <option>Maqbul (C)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Penguji / Musyrif</label>
              <input type="text" id="tahfizh-ustadz" value="Ust. Ibrahim" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition">
            Simpan Setoran Ziyadah
          </button>
        </form>
      </div>

      <!-- Setoran List Container -->
      <div id="tahfizh-list-container" class="space-y-2.5">
        ${records.map(rec => `
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-book-open"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(rec.student_name)}</div>
                <div class="text-[10px] text-slate-400">QS. ${sanitizeHtml(rec.surah)}: ${sanitizeHtml(rec.ayat)}</div>
                <div class="text-[9px] text-purple-400 mt-0.5">Musyrif: ${sanitizeHtml(rec.ustadz)}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ${sanitizeHtml(rec.grade)}
              </span>
              <div class="text-[9px] text-slate-500 mt-1">${formatDate(rec.date)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
