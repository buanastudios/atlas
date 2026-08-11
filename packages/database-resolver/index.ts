/**
 * Project Atlas — Multi-Tenant Dynamic Database Resolver
 * Page 3 PRD v5.0 Specification
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface TenantContext {
  tenantId: string;
  tenantKey: string;
  saasClientId: string;
  domainCategory: string;
  dbEngine: 'POSTGRESQL' | 'MONGODB' | 'SQLITE';
  dbConnectionUri: string;
}

export class AtlasDatabaseResolver {
  private static instance: AtlasDatabaseResolver;
  private pgPools: Map<string, any> = new Map();
  private mongoClients: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): AtlasDatabaseResolver {
    if (!AtlasDatabaseResolver.instance) {
      AtlasDatabaseResolver.instance = new AtlasDatabaseResolver();
    }
    return AtlasDatabaseResolver.instance;
  }

  public async getPostgresPool(tenant: TenantContext): Promise<any> {
    if (!this.pgPools.has(tenant.tenantId)) {
      // Dynamic Postgres pool initialization
      this.pgPools.set(tenant.tenantId, {
        connectionString: tenant.dbConnectionUri,
        tenantId: tenant.tenantId
      });
    }
    return this.pgPools.get(tenant.tenantId);
  }

  public async getMongoClient(tenant: TenantContext): Promise<any> {
    if (!this.mongoClients.has(tenant.tenantId)) {
      // Dynamic Mongo client initialization
      this.mongoClients.set(tenant.tenantId, {
        uri: tenant.dbConnectionUri,
        tenantId: tenant.tenantId
      });
    }
    return this.mongoClients.get(tenant.tenantId);
  }
}
