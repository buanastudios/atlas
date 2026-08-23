import { GovernanceModule } from './governance.module.js';

export const manifest = {
  id: 'governance',
  name: 'WTP & Audit',
  category: 'Governance',
  version: '2.0.0',
};

let instance = null;

export function mount(container) {
  instance = new GovernanceModule(container);
  instance.mount();
  return instance;
}

export function unmount() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
