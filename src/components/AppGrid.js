/**
 * Atlas Edu — App Grid Component (src/components/AppGrid.js)
 * 4-Column Smartphone icon launcher with category filtering and deep-linked module launching.
 */

import { MODULE_CATALOG } from '../modules/registry.js';
import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { sanitizeHtml } from '../lib/utils.js';

export class AppGrid {
  constructor() {
    this.gridEl = document.getElementById('app-grid');
    this.searchInput = document.getElementById('launcher-search');
    this.categoryTabs = document.getElementById('category-tabs');
    this.init();
  }

  init() {
    this.bindSearch();
    this.bindCategories();
    this.render();
    store.subscribe(() => this.render());
  }

  bindSearch() {
    if (!this.searchInput) return;
    this.searchInput.addEventListener('input', (e) => {
      store.setSearchQuery(e.target.value);
    });
  }

  bindCategories() {
    if (!this.categoryTabs) return;
    this.categoryTabs.querySelectorAll('.category-pill').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-cat');
        store.setSelectedCategory(cat);

        // Update visual active state
        this.categoryTabs.querySelectorAll('.category-pill').forEach((b) => {
          b.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
      });
    });
  }

  render() {
    if (!this.gridEl) return;
    const { searchQuery, selectedCategory, manageMode } = store.state;

    const filtered = MODULE_CATALOG.filter((mod) => {
      const matchCat = selectedCategory === 'all' || mod.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        mod.name.toLowerCase().includes(searchQuery) ||
        mod.description.toLowerCase().includes(searchQuery) ||
        mod.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      this.gridEl.innerHTML = `
        <div class="col-span-4 py-8 text-center text-slate-400 text-xs">
          <i class="fas fa-search text-lg text-slate-500 mb-2"></i>
          <p>Tidak ada modul yang cocok dengan pencarian.</p>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = filtered
      .map(
        (mod) => `
      <div 
        data-module-id="${mod.id}"
        class="app-icon-item flex flex-col items-center gap-1.5 cursor-pointer select-none ${manageMode ? 'app-jiggle' : ''}"
      >
        <!-- Icon Squircle -->
        <div class="app-icon-squircle ${mod.color}">
          <i class="fas ${mod.icon}"></i>
          
          ${
            mod.badge
              ? `
            <span class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] border-2 border-slate-900 shadow-md">
              ${sanitizeHtml(mod.badge)}
            </span>
          `
              : ''
          }
        </div>

        <!-- App Label -->
        <span class="text-[11px] font-semibold text-slate-200 text-center leading-tight tracking-tight line-clamp-1 max-w-[68px]">
          ${sanitizeHtml(mod.name)}
        </span>
      </div>
    `
      )
      .join('');

    // Bind tap to launch
    this.gridEl.querySelectorAll('.app-icon-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-module-id');
        router.openModule(id);
      });
    });
  }
}
