/**
 * Atlas Edu — Subpath-Aware Hash Router (src/lib/router.js)
 * Clean SPA routing supporting GitHub Pages subpaths (/atlas/) with deep-linking.
 */

import { store } from './store.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/';
    const hash = rawHash.replace(/^#\/?/, '');
    
    // Parse route format: module/:id or dock/:name
    if (hash.startsWith('module/')) {
      const moduleId = hash.split('/')[1];
      store.setActiveModule(moduleId);
    } else if (hash.startsWith('dock/')) {
      const dockName = hash.split('/')[1] || 'launcher';
      store.setActiveModule(null);
      store.setActiveDock(dockName);
    } else {
      // Default to launcher home
      store.setActiveModule(null);
      store.setActiveDock('launcher');
    }
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
  }

  openModule(moduleId) {
    this.navigate(`module/${moduleId}`);
  }

  closeModule() {
    this.navigate(`dock/${store.state.activeDock || 'launcher'}`);
  }

  switchDock(dockName) {
    this.navigate(`dock/${dockName}`);
  }
}

export const router = new Router();
