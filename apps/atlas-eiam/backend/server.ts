/**
 * Project Atlas — EIAM Server Engine (`db_atlas_eiam`)
 * Page 2 PRD v5.0 Specification
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface SaaSClient {
  id: string;
  organizationName: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE_WHITE_LABEL';
  ownerEmail: string;
  isActive: boolean;
  createdAt: string;
}

export interface WhiteLabelConfig {
  id: string;
  saasClientId: string;
  subdomain: string;
  customDomain?: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  createdAt: string;
}

export class AtlasEIAMService {
  private clients: Map<string, SaaSClient> = new Map();
  private configs: Map<string, WhiteLabelConfig> = new Map();

  constructor() {
    // Default EIAM Master Record for Buana Studios
    const defaultClient: SaaSClient = {
      id: 'client-buana-001',
      organizationName: 'Buana Studios Enterprise',
      plan: 'ENTERPRISE_WHITE_LABEL',
      ownerEmail: 'sakti@buana.studio',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.clients.set(defaultClient.id, defaultClient);

    const defaultConfig: WhiteLabelConfig = {
      id: 'config-001',
      saasClientId: defaultClient.id,
      subdomain: 'atlas',
      customDomain: 'atlas.buana.studio',
      brandName: 'Atlas',
      primaryColor: '#0F172A',
      secondaryColor: '#3B82F6',
      logoUrl: 'assets/images/atlas-logo.svg',
      createdAt: new Date().toISOString()
    };
    this.configs.set(defaultConfig.saasClientId, defaultConfig);
  }

  public async getClient(id: string): Promise<SaaSClient | undefined> {
    return this.clients.get(id);
  }

  public async getWhiteLabelConfig(saasClientId: string): Promise<WhiteLabelConfig | undefined> {
    return this.configs.get(saasClientId);
  }
}
