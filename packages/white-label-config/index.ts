/**
 * Project Atlas — Tenant Branding, Terminology & Dynamic Theme Injector
 * Page 2 PRD v5.0 Specification
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface WhiteLabelConfig {
  id: string;
  saasClientId: string;
  subdomain: string;
  customDomain?: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  empIdTerm: 'NIKY' | 'NIP' | 'Employee ID' | 'NIK' | 'Badge ID' | string;
  defaultLanguage: 'en' | 'id' | 'ar' | string;
  logoUrl?: string;
  faviconUrl?: string;
  createdAt: string;
}

export function injectTenantBranding(config: WhiteLabelConfig): void {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--kit-primary', config.primaryColor);
    document.documentElement.style.setProperty('--kit-accent', config.secondaryColor);
    if (config.brandName) {
      document.title = `${config.brandName} — Powered by Buana Studios`;
    }
  }
}
