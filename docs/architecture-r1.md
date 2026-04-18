# VerdeAI R1 Architecture

## Product Identity

- Company: VerdeAI
- Tagline: AI-Optimized. Earth-Aligned.

## Objective (Release 1)

Deliver an enterprise control plane that can:

- Connect to a target network scope
- Discover managed infrastructure assets
- Classify discovered assets (`server`, `baremetal`, `switch`, `router`, `firewall`, `storage`)
- Produce a queryable topology graph
- Expose an RBAC-governed admin UI

## System Components

1. `@verdeai/api`
- Auth and JWT issuance
- RBAC enforcement via permission guards
- Discovery job lifecycle APIs
- Device inventory APIs
- Topology graph API
- MongoDB persistence layer

2. `@verdeai/admin-ui`
- Login and role-aware experience
- Discovery trigger UX
- Inventory and topology visibility
- Access-control management (roles + user role assignment)

3. `@verdeai/shared`
- Shared domain contracts and RBAC definitions

## Persistence Layer

- Engine: MongoDB via Mongoose
- Collections: `users`, `devices`, `discoveryjobs`, `topologysnapshots`
- Multi-tenant data segmentation through `tenantId`
- Unique keys:
  - `users`: `(tenantId, email)`
  - `devices`: `(tenantId, mgmtIp)`
  - `topologysnapshots`: `tenantId`

## Discovery Flow (R1)

1. Admin submits seed CIDR ranges.
2. API creates discovery job.
3. Discovery engine synthesizes candidate devices from ranges (placeholder for SNMP/LLDP/SSH connectors).
4. Device classifier tags assets by kind.
5. Topology builder emits `nodes` and `links`.
6. Inventory and graph are persisted to MongoDB.
7. UI fetches and renders job, inventory, and topology.

## API Surface (R1)

- `POST /auth/login`
- `POST /discovery/jobs`
- `GET /discovery/jobs`
- `GET /devices`
- `GET /topology`
- `GET /rbac/roles`
- `GET /rbac/users`
- `PATCH /rbac/users/:userId/role`
- `GET /users`
- `GET /users/me`