# Project Atlas Specification & PRD v5.0
### Multi-Tenant, Multi-Vertical SaaS Platform Architecture

**Vendor / Studio**: Buana Studios  
**Lead Architect & Developer**: Hikmatullah / Abu Hafidz (`@thesaktibuana`)  
**Version & Status**: v5.0-AG | Production Blueprint  

---

## 1. Executive Directive & Architectural Mandates

**Project Atlas** is a modular, enterprise-grade multi-tenant platform engineered by **Buana Studios** to serve both foundation core operations (Education, Healthcare, Social Welfare) and commercial holdings (Retail POS, Logistics, Supply Chain) under a **White-Label SaaS** distribution model.

### CORE ENGINEERING DIRECTIVES
- **Multi-Runtime Deployment Strategy**: Runs seamlessly as a **Modular Monolith** for single-server low-footprint setups OR as decoupled **Microservices** (Docker/K8s) without code refactoring.
- **Database-per-Domain & Tier Isolation**: Absolute fault boundary enforcement. Zero cross-domain SQL joins or shared foreign keys. All inter-service references rely on immutable string UUIDs.
- **Transactional Outbox Resilience**: Operational endpoints write local database entries and financial events in a single atomic SQL transaction. Outbox sync workers handle asynchronous posting to the central ledger.
- **White-Label Context Propagation**: Identity and Tenant Context (branding, custom domains, colors, permission matrices) are dynamically injected via JWT claims and middleware context.

---

## 2. Monorepo Directory Structure

```
project-atlas/
├── apps/
│   ├── atlas-eiam/              # Identity, Tenant Directory & SaaS Plan Management
│   │   ├── frontend/            # Kit Split-Screen Login & Signup UI (with Desktop SVG Logo)
│   │   └── backend/             # EIAM Auth API, Client/Tenant Directory Drivers
│   ├── atlas-ledger/            # Universal Double-Entry Engine & Cross-Subsidy Engine
│   │   └── backend/             # Double-Entry Validation Engine (Sum(Debits) == Sum(Credits))
│   ├── atlas-hris/              # Unified Staffing, Attendance & Payroll System
│   ├── atlas-edu/               # Education Vertical (Preschool to PhD, Ekstrakurikuler CRUD)
│   ├── atlas-health/            # Healthcare / EMR Vertical
│   └── atlas-pos/               # Commercial Retail POS & Inventory Vertical
│
├── packages/
│   ├── database-resolver/       # Dynamic Tenant DB Connection Pooler & Engine Router (Postgres/Mongo/SQLite)
│   ├── outbox-engine/           # Transactional Outbox Worker & Retry Circuit Breaker
│   ├── white-label-config/      # Tenant Branding & Dynamic Theme Injector
│   └── security-middleware/     # JWT Parser, RBAC & Tenant Context Guard
│
├── config/
│   ├── saas-plans.json          # Plan Quotas & Vertical Capability Flags
│   └── settings.json            # Active White-Label Branding Schema
│
└── docker-compose.yml           # Microservice Container Orchestration
```

---

## ⚡ How to Run

### Option A: Static SPA Gateway (`apps/atlas-eiam/frontend/`)
```bash
cd apps/atlas-eiam/frontend
python -m http.server 8000
# OR
npx serve
```
Then visit **`http://localhost:8000`**.

### Option B: Microservices Container Orchestration
```bash
docker-compose up -d
```

---

## 📜 Compliance & Verification Matrix

| Rule / Constraint | Implementation Strategy | Verification Status |
| :--- | :--- | :---: |
| **Fault Isolation** | Database-per-domain / Database-per-tier. Zero cross-domain SQL joins. | **VERIFIED** |
| **Offline Resilience** | Local operational transactions paired with atomic Transactional Outbox rows. | **VERIFIED** |
| **Double-Entry Balance** | Strict serializable transaction validation enforcing $\text{Sum(Debits)} == \text{Sum(Credits)}$. | **VERIFIED** |
| **White-Label Multi-Tenancy** | Dynamic DB connection pooling + Context Injection middleware via JWT metadata. | **VERIFIED** |
| **Deployment Versatility** | Single Monorepo architecture supporting Monolith and Microservices runtimes natively. | **VERIFIED** |

---

## 👤 Credits & Contact

- **Lead Architect & Developer**: Hikmatullah Sakti Buana (*Abu Hafidz*)
- **Telegram**: `@thesaktibuana`
- **Email**: `sakti@buana.studio`
- **Studio**: `Buana Studios` (`https://buana.studio`)
