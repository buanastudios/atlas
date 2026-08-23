import{s as i}from"./index-Bz9qjcCL.js";class s{static async getPillars(){return[{id:"diniyah",title:"Pilar 1: Diniyah & Karakter Qurani",badge:"Inti Pokok",color:"border-purple-500/40 bg-purple-950/30 text-purple-300",modules:["Tahfizh & Tajwid Bersanad","Aqidah Shahihah & Fiqih Ibadah","Adab & Akhlaq Mulia (Nabawiyah)"]},{id:"sains",title:"Pilar 2: Sains, Matematika & STEM",badge:"Akademik",color:"border-blue-500/40 bg-blue-950/30 text-blue-300",modules:["Olimpiade Matematika & Logika","Eksperimen Sains & Robotika Dasar","Coding & Computational Thinking"]},{id:"bahasa",title:"Pilar 3: Bahasa Internasional",badge:"Komunikasi",color:"border-emerald-500/40 bg-emerald-950/30 text-emerald-300",modules:["Bahasa Arab Fusha Aktif (Muhadatsah)","Bahasa Inggris Konversasi & Storytelling","Literasi & Jurnalistik Cilik"]},{id:"leadership",title:"Pilar 4: Kepemimpinan & Kemandirian",badge:"Lifeskills",color:"border-amber-500/40 bg-amber-950/30 text-amber-300",modules:["Outing & Tafakkur Alam","Public Speaking & Muhadharah","Manajemen Finansial Santri"]},{id:"riset",title:"Pilar 5: Riset & Karya Terapan",badge:"Inovasi",color:"border-cyan-500/40 bg-cyan-950/30 text-cyan-300",modules:["Proyek Karya Ilmiah Santri (KIS)","Portofolio Digital & Pameran Hasil Belajar","Inovasi Lingkungan & Bank Sampah"]}]}}function n(t=[]){return`
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
        ${t.map(a=>`
          <div class="bg-slate-900/90 border ${a.color} p-4 rounded-3xl space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-white">${i(a.title)}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                ${i(a.badge)}
              </span>
            </div>
            <div class="space-y-1.5 pt-1">
              ${a.modules.map(r=>`
                <div class="flex items-center gap-2 text-xs text-slate-300">
                  <i class="fas fa-check-circle text-[11px] text-emerald-400"></i>
                  <span>${i(r)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}class l{constructor(a){this.container=a}async mount(){this.container.innerHTML='<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-teal-400 mb-2"></i><br/>Memuat data kurikulum...</div>';const a=await s.getPillars();this.render(a)}render(a){this.container.innerHTML=n(a)}destroy(){this.container.innerHTML=""}}const o={id:"curriculum",name:"Kurikulum 5P",category:"Academic",version:"2.0.0"};let e=null;function u(t){return e=new l(t),e.mount(),e}function c(){e&&(e.destroy(),e=null)}export{o as manifest,u as mount,c as unmount};
