/**
 * Atlas Edu — Persistent Bottom Dock Component (src/components/BottomDock.js)
 * Glassmorphic smartphone dock controller.
 */

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';

export class BottomDock {
  constructor() {
    this.dockButtons = document.querySelectorAll('.dock-btn');
    this.views = {
      launcher: document.getElementById('view-launcher'),
      activity: document.getElementById('view-activity'),
      profile: document.getElementById('view-profile'),
      settings: document.getElementById('view-settings'),
    };
    this.init();
  }

  init() {
    this.dockButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const dockName = e.currentTarget.getAttribute('data-dock');
        router.switchDock(dockName);
      });
    });

    store.subscribe((state) => {
      this.updateActiveDock(state.activeDock);
    });
  }

  updateActiveDock(activeDock) {
    // Update button visual styles
    this.dockButtons.forEach((btn) => {
      const name = btn.getAttribute('data-dock');
      if (name === activeDock) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Switch visible view
    for (const [name, el] of Object.entries(this.views)) {
      if (!el) continue;
      if (name === activeDock) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  }
}
