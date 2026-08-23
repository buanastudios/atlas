import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderPpdbTemplate(registrations = []) {
  return `
    <div class="space-y-4">
      <!-- Quick Stats Card -->
      <div class="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 p-4 rounded-3xl border border-blue-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-blue-400 uppercase tracking-wider">PPDB T.A. 2026/2027</div>
            <h3 class="text-base font-extrabold text-white">Penerimaan Santri Baru</h3>
          </div>
          <span class="px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold rounded-full">Gelombang 1</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Kuota Diterima</span>
            <div class="text-sm font-bold text-white">48 / 60 Santri</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Sisa Kursi</span>
            <div class="text-sm font-bold text-emerald-400">12 Kursi</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Tab buttons -->
      <div class="flex gap-2">
        <button id="btn-tab-ppdb-list" class="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white transition">Daftar Pendaftar</button>
        <button id="btn-tab-ppdb-form" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">+ Formulir Baru</button>
      </div>

      <!-- Form Container (Hidden by default) -->
      <div id="ppdb-form-container" class="hidden bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <h4 class="text-xs font-bold text-white flex items-center gap-2"><i class="fas fa-edit text-blue-400"></i> Form Registrasi Santri Baru</h4>
        <form id="ppdb-form" class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Lengkap Santri</label>
            <input type="text" id="ppdb-fullname" required placeholder="Contoh: Muhammad Rayhan" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Jenjang Tujuan</label>
              <select id="ppdb-grade" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                <option>SD Kelas 1</option>
                <option>SMP Kelas 7</option>
                <option>SMA Kelas 10</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Orang Tua</label>
              <input type="text" id="ppdb-parent" required placeholder="Nama Ayah/Ibu" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
            <input type="tel" id="ppdb-phone" required placeholder="08xxxxxxxxxx" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition">
            Kirim Formulir Pendaftaran
          </button>
        </form>
      </div>

      <!-- Registration List Container -->
      <div id="ppdb-list-container" class="space-y-2.5">
        ${registrations.map(reg => `
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-user-check"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(reg.full_name)}</div>
                <div class="text-[10px] text-slate-400">${sanitizeHtml(reg.target_grade)} · Wali: ${sanitizeHtml(reg.parent_name)}</div>
                <div class="text-[9px] text-blue-400 font-mono mt-0.5">${sanitizeHtml(reg.reg_number)}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${reg.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${sanitizeHtml(reg.status)}
              </span>
              <div class="text-[9px] text-slate-500 mt-1">${formatDate(reg.created_at)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
