import { TahunAjaranModule } from './tahun-ajaran.module.js';

export const manifest = {
  id: 'tahun-ajaran',
  name: 'Tahun Ajaran',
  category: 'Governance',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new TahunAjaranModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
