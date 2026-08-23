import { FacilitiesModule } from './facilities.module.js';

export const manifest = {
  id: 'facilities',
  name: 'Fasilitas',
  category: 'Operational',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new FacilitiesModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
