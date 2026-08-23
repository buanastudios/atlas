import{f,l as p,i as v,d,s as u,a as h,b,c as m}from"./index-Bz9qjcCL.js";class x{static async getInvoices(){const{data:e}=await f("tuition_invoices","*",{order:{column:"id",ascending:!1}});return e}static async payInvoice(e){return p.update("tuition_invoices",e,{status:"PAID",paid_at:new Date().toISOString().split("T")[0]}),!0}static async createInvoice(e){const a=`INV-202608-${Math.floor(100+Math.random()*900)}`,t={...e,invoice_no:a,status:"UNPAID",paid_at:null};return await v("tuition_invoices",t)}}function y(i=[]){const e=i.filter(t=>t.status==="PAID").reduce((t,s)=>t+Number(s.amount),0),a=i.filter(t=>t.status!=="PAID").reduce((t,s)=>t+Number(s.amount),0);return`
    <div class="space-y-4">
      <!-- Finance Stats Card -->
      <div class="bg-gradient-to-r from-teal-900/70 to-emerald-950/70 p-4 rounded-3xl border border-teal-700/40 backdrop-blur-md shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Keuangan Santri · SPP Bulanan</div>
            <h3 class="text-base font-extrabold text-white">Buku Besar SPP</h3>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-base border border-teal-400/30">
            <i class="fas fa-credit-card"></i>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-teal-700/30">
          <div>
            <span class="text-[10px] text-slate-300">Total Terbayar</span>
            <div class="text-sm font-bold text-emerald-400">${d(e)}</div>
          </div>
          <div>
            <span class="text-[10px] text-slate-300">Belum Terbayar</span>
            <div class="text-sm font-bold text-amber-400">${d(a)}</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2">
        <button id="btn-tab-tuition-list" class="flex-1 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white transition">Tagihan & Kwitansi</button>
        <button id="btn-tab-tuition-form" class="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">+ Buat Tagihan</button>
      </div>

      <!-- Form Container (Hidden by default) -->
      <div id="tuition-form-container" class="hidden bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <h4 class="text-xs font-bold text-white flex items-center gap-2"><i class="fas fa-file-invoice-dollar text-teal-400"></i> Buat Tagihan SPP Baru</h4>
        <form id="tuition-form" class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-300 mb-1">Nama Santri</label>
            <input type="text" id="tuition-student" required placeholder="Nama lengkap santri" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Bulan Periode</label>
              <select id="tuition-month" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500">
                <option>Agustus 2026</option>
                <option>September 2026</option>
                <option>Oktober 2026</option>
                <option>November 2026</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Nominal (Rp)</label>
              <input type="number" id="tuition-amount" value="1500000" required class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500" />
            </div>
          </div>
          <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition">
            Terbitkan Tagihan
          </button>
        </form>
      </div>

      <!-- Invoices List Container -->
      <div id="tuition-list-container" class="space-y-2.5">
        ${i.map(t=>`
          <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl ${t.status==="PAID"?"bg-emerald-500/10 text-emerald-400":"bg-amber-500/10 text-amber-400"} flex items-center justify-center font-bold text-xs">
                <i class="fas ${t.status==="PAID"?"fa-receipt":"fa-clock"}"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${u(t.student_name)}</div>
                <div class="text-[10px] text-slate-400">${u(t.month)} · <span class="text-slate-200 font-semibold">${d(t.amount)}</span></div>
                <div class="text-[9px] text-teal-400 font-mono mt-0.5">${u(t.invoice_no)}</div>
              </div>
            </div>
            <div class="text-right flex flex-col items-end gap-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${t.status==="PAID"?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-amber-500/20 text-amber-400 border border-amber-500/30"}">
                ${t.status==="PAID"?"LUNAS":"BELUM BAYAR"}
              </span>
              ${t.status!=="PAID"?`
                <button data-pay-id="${t.id}" class="btn-pay-now px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow transition">
                  Konfirmasi Bayar
                </button>
              `:`
                <div class="text-[9px] text-slate-500">Dibayar: ${h(t.paid_at)}</div>
              `}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}class g{constructor(e){this.container=e}async mount(){this.container.innerHTML='<div class="p-8 text-center text-xs text-slate-400"><i class="fas fa-spinner fa-spin text-base text-teal-400 mb-2"></i><br/>Memuat data SPP...</div>';const e=await x.getInvoices();this.render(e)}render(e){this.container.innerHTML=y(e),this.bindEvents()}bindEvents(){const e=this.container.querySelector("#btn-tab-tuition-list"),a=this.container.querySelector("#btn-tab-tuition-form"),t=this.container.querySelector("#tuition-form-container"),s=this.container.querySelector("#tuition-list-container"),r=this.container.querySelector("#tuition-form");e&&a&&(e.addEventListener("click",()=>{e.className="flex-1 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white transition",a.className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition",t.classList.add("hidden"),s.classList.remove("hidden")}),a.addEventListener("click",()=>{a.className="flex-1 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white transition",e.className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition",t.classList.remove("hidden"),s.classList.add("hidden")})),this.container.querySelectorAll(".btn-pay-now").forEach(c=>{c.addEventListener("click",async n=>{const l=Number(n.currentTarget.getAttribute("data-pay-id"));await x.payInvoice(l),b("Pembayaran SPP berhasil dikonfirmasi!","success"),m.addActivity({type:"tuition",text:`Pembayaran SPP Santri ID #${l} telah dikonfirmasi lunas`,icon:"fa-receipt",color:"text-teal-400"}),this.mount()})}),r&&r.addEventListener("submit",async c=>{c.preventDefault();const n={student_name:r.querySelector("#tuition-student").value.trim(),month:r.querySelector("#tuition-month").value,amount:Number(r.querySelector("#tuition-amount").value)};try{await x.createInvoice(n),b(`Tagihan SPP ${n.student_name} (${d(n.amount)}) diterbitkan!`,"success"),m.addActivity({type:"tuition",text:`Tagihan SPP baru diterbitkan untuk ${n.student_name} periode ${n.month}`,icon:"fa-credit-card",color:"text-teal-400"}),this.mount()}catch(l){b(`Gagal: ${l.message}`,"error")}})}destroy(){this.container.innerHTML=""}}const P={id:"tuition",name:"SPP Ledger",category:"Finance",version:"2.0.0"};let o=null;function S(i){return o=new g(i),o.mount(),o}function T(){o&&(o.destroy(),o=null)}export{P as manifest,S as mount,T as unmount};
