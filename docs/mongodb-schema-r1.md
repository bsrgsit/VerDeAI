# MongoDB Schema (Initial Release)

## Database

- Name: `verdeai` (configurable via `MONGO_DB_NAME`)

## Collections

### `users`

- `_id` (string): user id
- `tenantId` (string, indexed)
- `email` (string, required)
- `displayName` (string, required)
- `role` (enum): `platform_admin | network_admin | operator | auditor`
- Unique index: `{ tenantId: 1, email: 1 }`

### `devices`

- `_id` (string): stable id based on tenant + management IP
- `tenantId` (string, indexed)
- `hostname` (string)
- `mgmtIp` (string)
- `kind` (enum): `server | baremetal | switch | router | firewall | storage | unknown`
- `vendor` (string, optional)
- `model` (string, optional)
- `serial` (string, optional)
- `osVersion` (string, optional)
- `discoveredAt` (ISO string)
- `source` (enum): `seed-ip-range | snmp | lldp | manual`
- `confidence` (number)
- Unique index: `{ tenantId: 1, mgmtIp: 1 }`

### `discoveryjobs`

- `_id` (string): job id
- `tenantId` (string, indexed)
- `status` (enum): `queued | running | completed | failed`
- `startedAt` (ISO string, optional)
- `finishedAt` (ISO string, optional)
- `requestedBy` (string)
- `input.cidrRanges` (string[])
- `input.useSnmp` (boolean)
- `input.useLldp` (boolean)
- `summary.devicesFound` (number, optional)
- `summary.linksFound` (number, optional)

### `topologysnapshots`

- `_id` (string)
- `tenantId` (string, unique)
- `generatedAt` (ISO string)
- `nodes[]`
  - `id` (string)
  - `label` (string)
  - `kind` (enum device kind)
  - `mgmtIp` (string)
- `links[]`
  - `id` (string)
  - `sourceNodeId` (string)
  - `targetNodeId` (string)
  - `relation` (enum): `layer2 | layer3 | mgmt`
  - `confidence` (number)

## Seed Data

At API startup, if tenant `tenant-verdeai` has no users, these users are seeded:

- `admin@verdeai.local` (`platform_admin`)
- `operator@verdeai.local` (`operator`)
- `auditor@verdeai.local` (`auditor`)