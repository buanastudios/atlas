import { sanitizeHtml } from '../../lib/utils.js';

export function renderGraduationTemplate(students = []) {
  return `
    <div class="space-y-4">
      <!-- Graduation Hero Banner -->
      <div class="bg-gradient-to-r from-amber-900/70 to-orange-950/70 p-4 rounded-3xl border border-amber-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Audit Kelulusan & Ijazah</div>
            <h3 class="text-base font-extrabold text-white">Kelulusan 4-Pilar</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base border border-amber-400/30">
            <i class="fas fa-graduation-cap"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Siap Lulus</span>
            <div class="text-sm font-bold text-emerald-400">92 Santri (96%)</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Ijazah Terbit</span>
            <div class="text-sm font-bold text-amber-300">Signed & Cryptographic</div>
          </div>
        </div>
      </div>

      <!-- Students Clearance List -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-white px-1">Daftar Calon Lulusan</h4>
        ${students.map(st => `
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">${sanitizeHtml(st.name)}</div>
                <div class="text-[10px] text-slate-400">NISN: ${sanitizeHtml(st.nisn)} · Nilai: ${st.academic_score}</div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${st.status === 'CLEARANCE_COMPLETE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${st.status === 'CLEARANCE_COMPLETE' ? 'LULUS VERIFIKASI' : 'PENDING'}
              </span>
            </div>
            
            ${st.ijazah_hash ? `
              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                <span class="text-slate-500 font-mono truncate max-w-[200px]">${st.ijazah_hash}</span>
                <button onclick="alert('Membuka sertifikat ijazah digital terenkripsi')" class="px-2 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-500/30 font-bold">
                  <i class="fas fa-certificate mr-1"></i>Lihat Ijazah
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
