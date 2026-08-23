/**
 * Atlas Edu — Activity Feed View (src/components/ActivityFeed.js)
 * Real-time event log & audit trail.
 */

import { store } from '../lib/store.js';
import { sanitizeHtml } from '../lib/utils.js';

export class ActivityFeed {
  constructor() {
    this.container = document.getElementById('activity-stream');
    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => this.render());
  }

  render() {
    if (!this.container) return;
    const activities = store.state.activities || [];

    if (activities.length === 0) {
      this.container.innerHTML = `
        <div class="py-12 text-center text-slate-400 text-xs">
          <i class="fas fa-history text-xl text-slate-500 mb-2"></i>
          <p>Belum ada aktivitas baru tercatat.</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = activities
      .map(
        (act) => `
      <div class="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-xs ${act.color || 'text-emerald-400'}">
          <i class="fas ${act.icon || 'fa-info-circle'}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-slate-200 leading-snug">${sanitizeHtml(act.text)}</div>
          <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <i class="fas fa-clock text-[9px]"></i>
            <span>${sanitizeHtml(act.time)}</span>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  }
}
