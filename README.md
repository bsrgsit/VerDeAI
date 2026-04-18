# VerdeAI

**VerdeAI: AI-Optimized. Earth-Aligned.**

Enterprise network operations platform focused on automated device discovery, inventory intelligence, and topology mapping.

## Initial Release Capabilities

- Discover network-attached infrastructure assets (servers, bare metals, switches, routers, firewalls)
- Normalize and classify assets into a unified inventory
- Build and serve graph topology (nodes + links)
- Admin console with RBAC-aware access control and role assignment UI
- MongoDB persistence for users, devices, discovery jobs, and topology snapshots

## Workspaces

- `apps/api`: TypeScript API service with auth, RBAC, discovery, inventory, topology endpoints
- `apps/admin-ui`: React + Vite admin portal
- `packages/shared`: Shared domain types and constants

## Quick Start

1. Install dependencies:
   - `npm install`
2. Set API environment:
   - Copy `apps/api/.env.example` to `.env` and adjust values
3. Run API:
   - `npm run dev:api`
4. Run Admin UI:
   - `npm run dev:ui`

## MongoDB (Required)

- Default URI: `mongodb://localhost:27017/verdeai`
- Default DB: `verdeai`
- Collections are created automatically at startup by Mongoose models

## Security Foundations (R1)

- JWT authentication and tenant-aware claims
- Role and permission guards
- Auditable discovery job lifecycle
- RBAC role assignment API and UI controls

## Next After R1

- SNMP/SSH/Netconf connector pack
- Continuous sync + drift detection
- Policy engine and intent validation
- HA control plane and event streaming