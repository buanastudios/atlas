import { sanitizeHtml } from '../../lib/utils.js';

export function renderCurriculumTemplate(pillars = []) {
  return `
    <div class="space-y-4">
      <!-- Curriculum Hero Banner -->
      <div class="bg-gradient-to-r from-teal-900/70 to-blue-950/70 p-4 rounded-3xl border border-teal-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Kurikulum Terintegrasi</div>
            <h3 class="text-base font-extrabold text-white">5 Pilar Keunggulan Atlas</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-base border border-teal-400/30">
            <i class="fas fa-book-reader"></i>
          </div>
        </div>
        <p class="text-xs text-slate-300 mt-2">
          Kerangka pembelajaran holistik memadukan kurikulum kepesantrenan (Diniyah) dengan standar mutu sains internasional.
        </p>
      </div>

      <!-- Pillars List -->
      <div class="space-y-3">
        ${pillars.map(pillar => `
          <div class="bg-slate-900/90 border ${pillar.color} p-4 rounded-3xl space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-white">${sanitizeHtml(pillar.title)}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                ${sanitizeHtml(pillar.badge)}
              </span>
            </div>
            <div class="space-y-1.5 pt-1">
              ${pillar.modules.map(mod => `
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <i class="fas fa-check-circle text-[11px] text-emerald-400"></i>
                  <span>${sanitizeHtml(mod)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
