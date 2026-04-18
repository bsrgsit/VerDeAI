# VerdeAI Release Plan

## R1 (Current Scaffold)

- Auth + RBAC baseline
- Discovery job workflow
- Device inventory normalization
- Topology graph generation
- Admin UI shell

## R1.1 (Hardening)

- Persistent Postgres storage
- Background workers + retry queue
- Structured audit events
- API contract tests + UI smoke tests

## R2 (Protocol Connectors)

- SNMP polling and MIB parsing
- LLDP/CDP neighbor ingestion
- SSH fingerprinting for servers and bare metal
- Device confidence scoring with explainability

## R3 (Enterprise Scale)

- Multi-tenant isolation controls
- HA control plane
- Event streaming and incremental topology updates
- Change correlation and drift analytics