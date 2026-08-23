import { ClubsModule } from './clubs.module.js';

export const manifest = {
  id: 'clubs',
  name: 'Ekstrakurikuler',
  category: 'Academic',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new ClubsModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
