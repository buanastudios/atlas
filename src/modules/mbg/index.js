import { MbgModule } from './mbg.module.js';

export const manifest = {
  id: 'mbg',
  name: 'Makan Bergizi',
  category: 'Operational',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new MbgModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
