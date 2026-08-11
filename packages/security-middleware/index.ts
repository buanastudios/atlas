/**
 * Project Atlas — JWT Parser, RBAC & Tenant Context Guard
 * Page 1 PRD v5.0 Specification
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface JWTTenantClaims {
  sub: string;
  email: string;
  saasClientId: string;
  tenantId: string;
  tenantKey: string;
  roles: string[];
  planTier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE_WHITE_LABEL';
}

export function validateTenantContext(claims: JWTTenantClaims): boolean {
  if (!claims.saasClientId || !claims.tenantId) {
    throw new Error('UNAUTHORIZED_TENANT_CONTEXT: Missing tenant claims in JWT token');
  }
  return true;
}
