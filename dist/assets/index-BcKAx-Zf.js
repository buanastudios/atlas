import{s,a as r}from"./index-Bz9qjcCL.js";class i{static async getAcademicYears(){return[{id:1,year:"2026/2027",semester:"Ganjil",is_active:!0,start_date:"2026-07-15",end_date:"2026-12-20",effective_weeks:18},{id:2,year:"2026/2027",semester:"Genap",is_active:!1,start_date:"2027-01-05",end_date:"2027-06-18",effective_weeks:18}]}}function d(a=[]){return`
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
        ${a.map(e=>`
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">T.A. ${s(e.year)} · Semester ${s(e.semester)}</div>
                <div class="text-[10px] text-slate-400">${r(e.start_date)} s/d ${r(e.end_date)}</div>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${e.is_active?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-slate-800 text-slate-400 border border-slate-700"}">
                ${e.is_active?"SEMESTER AKTIF":"TERJADWAL"}
              </span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}class n{constructor(e){this.container=e}async mount(){this.container.innerHTML='<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-rose-400 mb-2"></i><br/>Memuat kalender akademik...</div>';const e=await i.getAcademicYears();this.render(e)}render(e){this.container.innerHTML=d(e)}destroy(){this.container.innerHTML=""}}const l={id:"tahun-ajaran",name:"Tahun Ajaran",category:"Governance",version:"2.0.0"};let t=null;function c(a){return t=new n(a),t.mount(),t}function x(){t&&(t.destroy(),t=null)}export{l as manifest,c as mount,x as unmount};
