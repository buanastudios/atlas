/**
 * Atlas Edu — Status Bar Component (src/components/StatusBar.js)
 * Real-time clock and battery level indicator.
 */

export class StatusBar {
  constructor() {
    this.clockEl = document.getElementById('status-clock');
    this.batteryEl = document.getElementById('battery-level');
    this.init();
  }

  init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.initBattery();
  }

  updateClock() {
    if (!this.clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.clockEl.textContent = `${hours}:${minutes}`;
  }

  async initBattery() {
    if (!this.batteryEl) return;
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        const update = () => {
          this.batteryEl.textContent = `${Math.round(battery.level * 100)}%`;
        };
        update();
        battery.addEventListener('levelchange', update);
      } catch (_) {
        this.batteryEl.textContent = '100%';
      }
    } else {
      this.batteryEl.textContent = '100%';
    }
  }
}
