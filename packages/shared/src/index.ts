export const BRAND = {
  name: "VerdeAI",
  tagline: "AI-Optimized. Earth-Aligned.",
} as const;

export type DeviceKind =
  | "server"
  | "baremetal"
  | "switch"
  | "router"
  | "firewall"
  | "storage"
  | "unknown";

export type DiscoverySource = "seed-ip-range" | "snmp" | "lldp" | "manual";

export type Permission =
  | "discovery.read"
  | "discovery.write"
  | "inventory.read"
  | "inventory.write"
  | "topology.read"
  | "topology.write"
  | "users.read"
  | "users.write"
  | "rbac.read"
  | "rbac.write"
  | "audit.read";

export type RoleName = "platform_admin" | "network_admin" | "operator" | "auditor";

export interface Role {
  id: string;
  name: RoleName;
  permissions: Permission[];
  description: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: RoleName;
}

export interface Device {
  id: string;
  tenantId: string;
  hostname: string;
  mgmtIp: string;
  kind: DeviceKind;
  vendor?: string;
  model?: string;
  serial?: string;
  osVersion?: string;
  discoveredAt: string;
  source: DiscoverySource;
  confidence: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  kind: DeviceKind;
  mgmtIp: string;
}

export interface TopologyLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relation: "layer2" | "layer3" | "mgmt";
  confidence: number;
}

export interface TopologyGraph {
  tenantId: string;
  generatedAt: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export type DiscoveryJobStatus = "queued" | "running" | "completed" | "failed";

export interface DiscoveryJob {
  id: string;
  tenantId: string;
  status: DiscoveryJobStatus;
  startedAt?: string;
  finishedAt?: string;
  requestedBy: string;
  input: {
    cidrRanges: string[];
    useSnmp: boolean;
    useLldp: boolean;
  };
  summary?: {
    devicesFound: number;
    linksFound: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  requestId: string;
}

export * from "./rbac.js";
export * from "./roadmap.js";