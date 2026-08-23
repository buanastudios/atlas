/**
 * Atlas Edu — Application Bootstrap Entrypoint (src/main.js)
 * Production Mobile Super App Engine with dynamic module registration.
 */

import './styles/app.css';

import { StatusBar } from './components/StatusBar.js';
import { AppGrid } from './components/AppGrid.js';
import { BottomDock } from './components/BottomDock.js';
import { ModuleSheet } from './components/ModuleSheet.js';
import { ActivityFeed } from './components/ActivityFeed.js';
import { ProfileView } from './components/ProfileView.js';
import { SettingsView } from './components/SettingsView.js';
import { router } from './lib/router.js';
import { store } from './lib/store.js';

class AtlasApp {
  static init() {
    // 1. Initialize Global UI Components
    this.statusBar = new StatusBar();
    this.appGrid = new AppGrid();
    this.bottomDock = new BottomDock();
    this.moduleSheet = new ModuleSheet();
    this.activityFeed = new ActivityFeed();
    this.profileView = new ProfileView();
    this.settingsView = new SettingsView();

    // 2. Bind Circuit Guard button to quick diagnostic toast
    const btnCircuit = document.getElementById('btn-circuit-guard');
    if (btnCircuit) {
      btnCircuit.addEventListener('click', () => {
        router.switchDock('settings');
      });
    }

    // 3. Expose debug handles safely
    window.__ATLAS_ROUTER__ = router;
    window.__ATLAS_STORE__ = store;

    console.log('[Atlas Edu Engine v2.0] Initialized successfully. Base path:', import.meta.env.BASE_URL);
  }
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AtlasApp.init());
} else {
  AtlasApp.init();
}
