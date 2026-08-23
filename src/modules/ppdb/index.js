import { PpdbModule } from './ppdb.module.js';

export const manifest = {
  id: 'ppdb',
  name: 'PPDB Online',
  category: 'Admissions',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new PpdbModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
