import { GraduationModule } from './graduation.module.js';

export const manifest = {
  id: 'graduation',
  name: 'Kelulusan',
  category: 'Academic',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new GraduationModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
