import{f as i,s as a}from"./index-Bz9qjcCL.js";class r{static async getClubs(){const{data:e}=await i("clubs");return e}}function d(s=[]){return`
    <div class="space-y-4">
      <!-- Clubs Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-900/70 to-teal-950/70 p-4 rounded-3xl border border-emerald-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Bakat & Minat Santri</div>
            <h3 class="text-base font-extrabold text-white">Ekstrakurikuler & Prestasi</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-base border border-emerald-400/30">
            <i class="fas fa-trophy"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Klub Aktif</span>
            <div class="text-sm font-bold text-white">12 Cabang</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Prestasi 2026</span>
            <div class="text-sm font-bold text-amber-400">18 Medali Emas</div>
          </div>
        </div>
      </div>

      <!-- Clubs List -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-white px-1">Daftar Klub Pilihan</h4>
        ${s.map(e=>`
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-medal"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${a(e.name)}</div>
                <div class="text-[10px] text-slate-400">${e.members_count} Anggota · Pembina: ${a(e.coach)}</div>
                <div class="text-[9px] text-emerald-400 mt-0.5">Jadwal: ${a(e.schedule)}</div>
              </div>
            </div>
            <button onclick="alert('Membuka jadwal presensi & prestasi klub')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition">
              Detail
            </button>
          </div>
        `).join("")}
      </div>
    </div>
  `}class l{constructor(e){this.container=e}async mount(){this.container.innerHTML='<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-emerald-400 mb-2"></i><br/>Memuat data ekstrakurikuler...</div>';const e=await r.getClubs();this.render(e)}render(e){this.container.innerHTML=d(e)}destroy(){this.container.innerHTML=""}}const o={id:"clubs",name:"Ekstrakurikuler",category:"Academic",version:"2.0.0"};let t=null;function c(s){return t=new l(s),t.mount(),t}function x(){t&&(t.destroy(),t=null)}export{o as manifest,c as mount,x as unmount};
