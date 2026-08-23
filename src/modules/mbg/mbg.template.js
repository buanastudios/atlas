import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderMbgTemplate(logs = []) {
  return `
    <div class="space-y-4">
      <!-- Nutrition Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-900/70 to-teal-950/70 p-4 rounded-3xl border border-emerald-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Program Nasional Makan Bergizi Gratis</div>
            <h3 class="text-base font-extrabold text-white">Logistik MBG & Organoleptik</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-base border border-emerald-400/30">
            <i class="fas fa-utensils"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Porsi Hari Ini</span>
            <div class="text-sm font-bold text-white">350 Porsi Diterima</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Uji Organoleptik</span>
            <div class="text-sm font-bold text-emerald-400">Layak & Higienis ✓</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2">
        <button id="btn-tab-mbg-list" class="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white transition">Riwayat Penerimaan</button>
        <button id="btn-tab-mbg-form" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">+ Form Serah Terima</button>
      </div>

      <!-- Form Container (Hidden by default) -->
      <div id="mbg-form-container" class="hidden bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <h4 class="text-xs font-bold text-white flex items-center gap-2"><i class="fas fa-clipboard-check text-emerald-400"></i> Serah Terima & Uji Organoleptik</h4>
        <form id="mbg-form" class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Rincian Menu Makanan</label>
            <input type="text" id="mbg-menu" required placeholder="Contoh: Nasi, Ayam Bakar, Sayur Sop, Buah" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Porsi Diterima</label>
              <input type="number" id="mbg-portion" value="350" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Kurir / Suplier</label>
              <input type="text" id="mbg-courier" placeholder="Pak Sugeng" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Petugas Penerima (Sekolah)</label>
            <input type="text" id="mbg-receiver" value="Ustdz. Fatimah" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition">
            Simpan Berita Acara MBG
          </button>
        </form>
      </div>

      <!-- Logs List Container -->
      <div id="mbg-list-container" class="space-y-2.5">
        ${logs.map(log => `
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-check-double"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(log.menu_name)}</div>
                <div class="text-[10px] text-slate-400">${log.portion_received} Porsi · Kurir: ${sanitizeHtml(log.courier_name)}</div>
                <div class="text-[9px] text-emerald-400 mt-0.5">Penerima: ${sanitizeHtml(log.receiver_name)}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ${sanitizeHtml(log.organoleptic_status)}
              </span>
              <div class="text-[9px] text-slate-500 mt-1">${formatDate(log.date)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
