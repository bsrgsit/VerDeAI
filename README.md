# VerdeAI

**VerdeAI: AI-Optimized. Earth-Aligned.**

Enterprise network and datacenter operations platform focused on AI-driven discovery, control, governance, and efficiency.

## Initial Release Capabilities

- Discover network-attached infrastructure assets (servers, bare metals, switches, routers, firewalls)
- Normalize and classify assets into a unified inventory
- Build and serve graph topology (nodes + links)
- Admin console with RBAC-aware access control and role assignment UI
- MongoDB persistence for users, devices, discovery jobs, and topology snapshots
- Strategic AI pipeline and engineering todo views for enterprise roadmap execution

## Workspaces

- `apps/api`: TypeScript API service with auth, RBAC, discovery, inventory, topology, strategy endpoints
- `apps/admin-ui`: React + Vite enterprise admin portal
- `packages/shared`: Shared domain types, RBAC definitions, and roadmap contracts

## Quick Start

1. Install dependencies:
   - `npm install`
2. Set API environment:
   - Copy `apps/api/.env.example` to `.env` and adjust values
3. Run API:
   - `npm run dev:api`
4. Run Admin UI:
   - `npm run dev:ui`

## Render UI-Only Validation (Skip API)

Use this to validate the product UI before deploying API services.

- Build command:
  - `npm install && npm run build:ui`
- Publish directory:
  - `apps/admin-ui/dist`
- Optional environment variables:
  - `VITE_UI_ONLY_DEMO=true` (forces demo mode)
  - `VITE_API_BASE=https://your-api-url` (when API is ready)

## MongoDB (Required)

- Default URI: `mongodb://localhost:27017/verdeai`
- Default DB: `verdeai`
- Collections are created automatically at startup by Mongoose models

## Product Direction

Ultimate goal: AI-powered complete datacenter management covering switch configuration health checks, configuration audits, power efficiency optimization, and intelligent forecasting of resource requirements.

See:
- `docs/product-pipeline.md`
- `docs/todos.md`

## Security Foundations (R1)

- JWT authentication and tenant-aware claims
- Role and permission guards
- Auditable discovery job lifecycle
- RBAC role assignment API and UI controls
