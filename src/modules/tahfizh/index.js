import { TahfizhModule } from './tahfizh.module.js';

export const manifest = {
  id: 'tahfizh',
  name: 'Tahfizh Quran',
  category: 'Diniyah',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new TahfizhModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
