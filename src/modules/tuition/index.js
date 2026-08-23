import { TuitionModule } from './tuition.module.js';

export const manifest = {
  id: 'tuition',
  name: 'SPP Ledger',
  category: 'Finance',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new TuitionModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
