/**
 * Atlas Edu — Global State Store (src/lib/store.js)
 * Clean, lightweight reactive state management.
 */

const SESSION_STORAGE_KEY = 'atlas_edu_session';
const LAUNCHER_PREF_KEY = 'atlas_launcher_preferences';

class Store {
  constructor() {
    this.state = {
      session: this.loadSession(),
      activeDock: 'launcher',
      activeModuleId: null,
      searchQuery: '',
      selectedCategory: 'all',
      manageMode: false,
      activities: this.loadActivities(),
      listeners: new Set(),
    };
  }

  loadSession() {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      id: 1,
      nama: 'Ustadz Abdullah, Lc.',
      email: 'abdullah@attibyan.sch.id',
      role: 'Head of Education',
      unit: 'SD At-Tibyan',
      isSuperadmin: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80'
    };
  }

  loadActivities() {
    return [
      { id: 1, type: 'halaqah', text: 'Presensi Halaqah Shubuh kelas 6A telah disahkan', time: '10 menit yang lalu', icon: 'fa-calendar-check', color: 'text-indigo-400' },
      { id: 2, type: 'mbg', text: 'Penerimaan Makan Bergizi Gratis 350 porsi terverifikasi', time: '45 menit yang lalu', icon: 'fa-utensils', color: 'text-emerald-400' },
      { id: 3, type: 'tahfizh', text: 'Setoran Surah An-Naba oleh Ahmad Fauzan (Mumtaz)', time: '2 jam yang lalu', icon: 'fa-quran', color: 'text-purple-400' },
      { id: 4, type: 'governance', text: 'Audit COBIT 2019 EDM01 terverifikasi WTP', time: 'Kemarin', icon: 'fa-award', color: 'text-cyan-400' }
    ];
  }

  addActivity(activity) {
    const item = {
      id: Date.now(),
      time: 'Baru saja',
      ...activity
    };
    this.state.activities.unshift(item);
    this.notify();
  }

  setSession(session) {
    this.state.session = session;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.notify();
  }

  setActiveDock(dock) {
    this.state.activeDock = dock;
    this.notify();
  }

  setActiveModule(moduleId) {
    this.state.activeModuleId = moduleId;
    this.notify();
  }

  setSearchQuery(q) {
    this.state.searchQuery = q.toLowerCase();
    this.notify();
  }

  setSelectedCategory(cat) {
    this.state.selectedCategory = cat;
    this.notify();
  }

  toggleManageMode() {
    this.state.manageMode = !this.state.manageMode;
    this.notify();
  }

  subscribe(listener) {
    this.state.listeners.add(listener);
    return () => this.state.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.state.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error('[Store listener error]:', e);
      }
    }
  }
}

export const store = new Store();
