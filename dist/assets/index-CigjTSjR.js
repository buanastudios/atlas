import{f as p,i as x,s as i,a as m,b as d,c as f}from"./index-Bz9qjcCL.js";class b{static async getRegistrations(){const{data:t}=await p("ppdb_admissions","*",{order:{column:"created_at",ascending:!1}});return t}static async submitRegistration(t){const e=`PPDB-2026-${Math.floor(100+Math.random()*900)}`,n={...t,reg_number:e,status:"VERIFIED",created_at:new Date().toISOString()};return await x("ppdb_admissions",n)}}function v(r=[]){return`
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
        ${r.map(t=>`
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                <i class="fas fa-user-check"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${i(t.full_name)}</div>
                <div class="text-[10px] text-slate-400">${i(t.target_grade)} · Wali: ${i(t.parent_name)}</div>
                <div class="text-[9px] text-blue-400 font-mono mt-0.5">${i(t.reg_number)}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${t.status==="VERIFIED"?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-amber-500/20 text-amber-400 border border-amber-500/30"}">
                ${i(t.status)}
              </span>
              <div class="text-[9px] text-slate-500 mt-1">${m(t.created_at)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}class h{constructor(t){this.container=t}async mount(){this.container.innerHTML='<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-blue-400 mb-2"></i><br/>Memuat data PPDB...</div>';const t=await b.getRegistrations();this.render(t)}render(t){this.container.innerHTML=v(t),this.bindEvents()}bindEvents(){const t=this.container.querySelector("#btn-tab-ppdb-list"),e=this.container.querySelector("#btn-tab-ppdb-form"),n=this.container.querySelector("#ppdb-form-container"),o=this.container.querySelector("#ppdb-list-container"),a=this.container.querySelector("#ppdb-form");t&&e&&(t.addEventListener("click",()=>{t.className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white transition",e.className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition",n.classList.add("hidden"),o.classList.remove("hidden")}),e.addEventListener("click",()=>{e.className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white transition",t.className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition",n.classList.remove("hidden"),o.classList.add("hidden")})),a&&a.addEventListener("submit",async c=>{c.preventDefault();const l={full_name:a.querySelector("#ppdb-fullname").value.trim(),target_grade:a.querySelector("#ppdb-grade").value,parent_name:a.querySelector("#ppdb-parent").value.trim(),phone:a.querySelector("#ppdb-phone").value.trim()};try{await b.submitRegistration(l),d("Pendaftaran santri baru berhasil disimpan!","success"),f.addActivity({type:"ppdb",text:`Pendaftaran santri baru ${l.full_name} (${l.target_grade}) berhasil`,icon:"fa-user-plus",color:"text-blue-400"}),this.mount()}catch(u){d(`Gagal menyimpan pendaftaran: ${u.message}`,"error")}})}destroy(){this.container.innerHTML=""}}const y={id:"ppdb",name:"PPDB Online",category:"Admissions",version:"2.0.0"};let s=null;function w(r){return s=new h(r),s.mount(),s}function S(){s&&(s.destroy(),s=null)}export{y as manifest,w as mount,S as unmount};
