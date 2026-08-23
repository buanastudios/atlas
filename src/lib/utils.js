/**
 * Atlas Edu — Utility Functions & Helpers (src/lib/utils.js)
 * Clean, production-grade formatters, DOM helpers, and state helpers.
 */

export function formatIDR(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount));
}

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const defaultOpts = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('id-ID', defaultOpts).format(date);
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function sanitizeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showToast(message, type = 'info', duration = 3000) {
  const existing = document.getElementById('atlas-toast-container');
  let container = existing;
  if (!container) {
    container = document.createElement('div');
    container.id = 'atlas-toast-container';
    container.className = 'fixed top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none px-4 w-full max-w-xs';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeClasses = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    error: 'bg-rose-600 text-white border-rose-500',
    warning: 'bg-amber-600 text-white border-amber-500',
    info: 'bg-slate-800 text-slate-100 border-slate-700'
  }[type] || 'bg-slate-800 text-white border-slate-700';

  toast.className = `p-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 transform -translate-y-2 opacity-0 pointer-events-auto ${typeClasses}`;
  
  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-triangle-exclamation',
    info: 'fa-info-circle'
  }[type] || 'fa-info-circle';

  toast.innerHTML = `<i class="fas ${icon} text-sm"></i><span class="flex-1">${sanitizeHtml(message)}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('-translate-y-2', 'opacity-0');
  });

  // Remove
  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function getBasePath() {
  return import.meta.env.BASE_URL || '/atlas/';
}
