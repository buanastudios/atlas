import { sanitizeHtml, formatDate } from '../../lib/utils.js';

export function renderGovernanceTemplate(audits = []) {
  return `
    <div class="space-y-4">
      <!-- Governance Hero Banner -->
      <div class="bg-gradient-to-r from-cyan-900/70 to-blue-950/70 p-4 rounded-3xl border border-cyan-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">COBIT 2019 · ISO 9001:2015</div>
            <h3 class="text-base font-extrabold text-white">Tata Kelola & Audit WTP</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-base border border-cyan-400/30">
            <i class="fas fa-award"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-cyan-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Status Opini</span>
            <div class="text-sm font-bold text-emerald-400">WTP (Wajar Tanpa Pengecualian)</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Skor Kepatuhan</span>
            <div class="text-sm font-bold text-cyan-300">97.2 / 100</div>
          </div>
        </div>
      </div>

      <!-- Audit Items List -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-white px-1">Domain Kepatuhan & Sertifikasi</h4>
        ${audits.map(audit => `
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(audit.title)}</div>
                <div class="text-[10px] text-slate-400">${sanitizeHtml(audit.domain)}</div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ${sanitizeHtml(audit.status)}
              </span>
            </div>
            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Skor Audit: <strong class="text-white">${audit.score}%</strong></span>
              <span>Sertifikasi: ${formatDate(audit.certified_date)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
