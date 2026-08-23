import { HalaqahModule } from './halaqah.module.js';

export const manifest = {
  id: 'halaqah',
  name: 'Absensi KBM',
  category: 'Diniyah',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new HalaqahModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
