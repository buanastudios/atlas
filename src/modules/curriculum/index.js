import { CurriculumModule } from './curriculum.module.js';

export const manifest = {
  id: 'curriculum',
  name: 'Kurikulum 5P',
  category: 'Academic',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new CurriculumModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
