# VerdeAI Product Features

## Product Vision

VerdeAI is an enterprise platform for end-to-end datacenter management.

The long-term goal is to provide a single operational system for:

- infrastructure discovery
- inventory and topology intelligence
- switch and router operations
- bare metal and server visibility
- configuration governance and audits
- health monitoring
- power orchestration
- intelligent forecasting of capacity and resource requirements

## Release 1 Product Goal

Release 1 should establish VerdeAI as the system of discovery and the system of record for datacenter infrastructure.

Release 1 must answer:

- What assets exist in the datacenter?
- What type of devices are they?
- How are they connected?
- Which credential groups are used to access them?
- Which users are allowed to operate the platform?
- What was discovered, by whom, and when?

## Release 1 Features To Implement

### 1. Infrastructure Discovery

- Discover infrastructure using IP addresses and CIDR ranges
- Support grouped credential-based discovery
- Identify switches, routers, firewalls, servers, bare metal, and storage endpoints
- Normalize discovered devices into a common data model
- Track discovery job history and status

### 2. Credential Group Management

- Create and manage credential groups
- Assign protocol types such as SSH, SNMPv3, and Netconf
- Group credentials by vendor or operational scope
- Bind discovery runs to credential groups
- Support mixed-vendor credential grouping where needed

### 3. Unified Inventory

- Maintain a searchable inventory of all discovered infrastructure
- Capture vendor, model, OS version, management IP, hostname, serial, and confidence score
- Support multiple device classes in one inventory model
- Track last discovered time and discovery source

### 4. Generic Topology Model

- Build a generic topology using nodes and links
- Represent topology across switches, routers, servers, bare metal, and future device classes
- Store link type and confidence
- Allow topology to be extended and modified later
- Keep topology generic enough to support future automation and policy layers

### 5. Device Health Visibility

- Show whether a device is reachable
- Track whether credentials worked during discovery
- Show last successful discovery time
- Show topology freshness and inventory freshness
- Surface basic operational health status for managed assets

### 6. RBAC And Access Control

- Tenant-aware authentication and authorization
- Support enterprise roles such as platform admin, network admin, operator, and auditor
- Protect administrative actions with permission checks
- Allow role assignment through the admin UI

### 7. Auditability

- Record who ran discovery
- Record what targets were queried
- Record when inventory and topology changed
- Establish a base for future configuration and compliance audit events

### 8. Enterprise Admin UI

- Professional admin interface for discovery, topology, credentials, and access control
- Support IP/CIDR input workflow
- Support credential group management
- Present generic infrastructure inventory
- Present topology in a vendor-neutral form

## Release 1 Non-Goals

These should not block Release 1:

- autonomous remediation
- full configuration deployment
- advanced forecasting engine
- power optimization engine
- closed-loop orchestration
- deep compliance policy engine
- multi-cluster HA control plane

## Release 1 Optional Stretch Features

- SNMP-based live polling for device metadata
- LLDP/CDP neighbor ingestion
- basic config snapshot collection
- topology drift indicators
- first-pass reachability monitoring

## Phase 2 Features

### Configuration Governance

- Network device configuration backup
- Configuration diff and drift tracking
- Golden baseline validation
- Configuration audit trails
- Policy compliance views

### Switch And Router Operations

- Switch health checks
- Interface and port-state visibility
- Uplink/downlink health
- Environment and power supply alarms
- Capacity indicators on fabric devices

### Bare Metal And Server Operations

- Out-of-band management visibility
- Hardware state collection
- BIOS and firmware visibility
- Rack and host correlation
- Server role tagging and workload classification

## Phase 3 Features

### Power And Sustainability

- Rack-level power telemetry
- Device-level power telemetry
- Thermal trend visibility
- Power orchestration recommendations
- Energy-aware operational insights

### Intelligent Forecasting

- Forecast compute demand
- Forecast network capacity demand
- Forecast storage growth
- Forecast power and thermal risk
- Recommend expansion or optimization actions

## End-State Product Capabilities

When fully implemented, VerdeAI should support:

- complete datacenter discovery
- full infrastructure inventory
- generic and editable topology
- configuration visibility and audits
- device health and operational status
- switch and router compliance checks
- bare metal operational visibility
- power telemetry and orchestration
- intelligent forecasting and planning
- enterprise RBAC and auditability

## Recommended Release 1 Positioning

Release 1 should be positioned as:

`VerdeAI Release 1 = Datacenter discovery, inventory, topology, credentials, and control foundation`

This gives the product a credible enterprise entry point while keeping forecasting and power orchestration visible as key upcoming capabilities.
