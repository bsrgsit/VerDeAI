import type {
  Device,
  DiscoveryJob,
  Permission,
  PipelineInitiative,
  PlatformTodo,
  Role,
  RoleName,
  TopologyGraph,
  User,
} from "@verdeai/shared";
import { PLATFORM_TODOS, ROLE_PERMISSIONS, ROLES, STRATEGY_PIPELINE } from "@verdeai/shared";

const configuredApiBase = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
export const IS_DEMO_MODE = import.meta.env.VITE_UI_ONLY_DEMO === "true" || !configuredApiBase;
const API_BASE = configuredApiBase ?? "http://localhost:8080";

export interface Session {
  token: string;
  user: User;
}

type MockState = {
  users: User[];
  devices: Device[];
  jobs: DiscoveryJob[];
  topology: TopologyGraph;
};

const defaultTenantId = "tenant-verdeai";

const mockState: MockState = {
  users: [
    {
      id: "user-admin",
      tenantId: defaultTenantId,
      email: "admin@verdeai.local",
      displayName: "VerdeAI Admin",
      role: "platform_admin",
    },
    {
      id: "user-operator",
      tenantId: defaultTenantId,
      email: "operator@verdeai.local",
      displayName: "VerdeAI Operator",
      role: "operator",
    },
    {
      id: "user-auditor",
      tenantId: defaultTenantId,
      email: "auditor@verdeai.local",
      displayName: "VerdeAI Auditor",
      role: "auditor",
    },
  ],
  devices: [
    {
      id: "dev_demo_1",
      tenantId: defaultTenantId,
      hostname: "switch-core-01",
      mgmtIp: "10.10.10.11",
      kind: "switch",
      vendor: "Juniper",
      model: "QFX",
      discoveredAt: new Date().toISOString(),
      source: "manual",
      confidence: 0.96,
    },
    {
      id: "dev_demo_2",
      tenantId: defaultTenantId,
      hostname: "server-ai-01",
      mgmtIp: "10.10.10.21",
      kind: "server",
      vendor: "Dell",
      model: "PowerEdge",
      discoveredAt: new Date().toISOString(),
      source: "manual",
      confidence: 0.92,
    },
    {
      id: "dev_demo_3",
      tenantId: defaultTenantId,
      hostname: "baremetal-rack-07",
      mgmtIp: "10.10.10.31",
      kind: "baremetal",
      vendor: "HPE",
      model: "ProLiant",
      discoveredAt: new Date().toISOString(),
      source: "manual",
      confidence: 0.9,
    },
    {
      id: "dev_demo_4",
      tenantId: defaultTenantId,
      hostname: "router-edge-01",
      mgmtIp: "10.10.10.41",
      kind: "router",
      vendor: "Cisco",
      model: "ASR",
      discoveredAt: new Date().toISOString(),
      source: "manual",
      confidence: 0.94,
    },
  ],
  jobs: [],
  topology: {
    tenantId: defaultTenantId,
    generatedAt: new Date().toISOString(),
    nodes: [
      { id: "dev_demo_1", label: "switch-core-01", kind: "switch", mgmtIp: "10.10.10.11" },
      { id: "dev_demo_2", label: "server-ai-01", kind: "server", mgmtIp: "10.10.10.21" },
      { id: "dev_demo_3", label: "baremetal-rack-07", kind: "baremetal", mgmtIp: "10.10.10.31" },
      { id: "dev_demo_4", label: "router-edge-01", kind: "router", mgmtIp: "10.10.10.41" },
    ],
    links: [
      {
        id: "ln_demo_1",
        sourceNodeId: "dev_demo_1",
        targetNodeId: "dev_demo_2",
        relation: "layer2",
        confidence: 0.9,
      },
      {
        id: "ln_demo_2",
        sourceNodeId: "dev_demo_1",
        targetNodeId: "dev_demo_3",
        relation: "layer2",
        confidence: 0.87,
      },
      {
        id: "ln_demo_3",
        sourceNodeId: "dev_demo_1",
        targetNodeId: "dev_demo_4",
        relation: "layer3",
        confidence: 0.91,
      },
    ],
  },
};

function synthesizeDiscovery(cidrRanges: string[]): { devices: Device[]; topology: TopologyGraph } {
  const now = new Date().toISOString();
  const generatedDevices: Device[] = cidrRanges.flatMap((cidr, index) => {
    const base = cidr.split("/")[0] ?? "10.0.0.0";
    const octets = base.split(".");
    const prefix = `${octets[0] ?? "10"}.${octets[1] ?? "0"}.${octets[2] ?? "0"}`;
    const ip = `${prefix}.${30 + index}`;
    const deviceKinds: Device["kind"][] = ["switch", "router", "server", "baremetal", "firewall", "storage"];
    const kind = deviceKinds[index % deviceKinds.length] ?? "unknown";
    return [
      {
        id: `dev_demo_discovery_${index}`,
        tenantId: defaultTenantId,
        hostname: `${kind}-${ip.replaceAll(".", "-")}`,
        mgmtIp: ip,
        kind,
        vendor: ["Juniper", "Arista", "Dell", "HPE", "Cisco", "Supermicro"][index % 6] ?? "Mixed",
        model: `${kind.toUpperCase()}-${100 + index}`,
        discoveredAt: now,
        source: "seed-ip-range",
        confidence: 0.82,
      },
    ];
  });

  const devices = [...mockState.devices.filter((d) => d.source !== "seed-ip-range"), ...generatedDevices];
  const nodes = devices.map((d) => ({ id: d.id, label: d.hostname, kind: d.kind, mgmtIp: d.mgmtIp }));
  const links = nodes.slice(0, -1).map((node, idx) => ({
    id: `ln_demo_discovery_${idx}`,
    sourceNodeId: node.id,
    targetNodeId: nodes[idx + 1]!.id,
    relation: idx % 2 === 0 ? "layer2" : "layer3",
    confidence: 0.78,
  })) as TopologyGraph["links"];

  return {
    devices,
    topology: {
      tenantId: defaultTenantId,
      generatedAt: now,
      nodes,
      links,
    },
  };
}

async function unwrap<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload?.error ? JSON.stringify(payload.error) : `Request failed: ${path}`;
    throw new Error(message);
  }

  const payload = await res.json();
  return payload.data as T;
}

export async function login(email: string): Promise<Session> {
  if (IS_DEMO_MODE) {
    const user = mockState.users.find((candidate) => candidate.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return { token: `demo-token-${user.id}`, user };
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return unwrap<Session>(res, "/auth/login");
}

export async function apiGet<T>(path: string, token: string): Promise<T> {
  if (IS_DEMO_MODE) {
    const userId = token.replace("demo-token-", "");
    const currentUser = mockState.users.find((u) => u.id === userId) ?? mockState.users[0]!;

    if (path === "/devices") return mockState.devices as T;
    if (path === "/discovery/jobs") return mockState.jobs as T;
    if (path === "/topology") return mockState.topology as T;
    if (path === "/strategy/pipeline") return STRATEGY_PIPELINE as PipelineInitiative[] as T;
    if (path === "/strategy/todos") return PLATFORM_TODOS as PlatformTodo[] as T;
    if (path === "/rbac/roles") return ROLES as Role[] as T;
    if (path === "/rbac/users" || path === "/users") return mockState.users as T;
    if (path === "/users/me") return currentUser as T;

    throw new Error(`Unsupported demo endpoint: ${path}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return unwrap<T>(res, path);
}

export async function apiPost<T>(path: string, token: string, body: unknown): Promise<T> {
  if (IS_DEMO_MODE) {
    if (path === "/discovery/jobs") {
      const input = body as { cidrRanges: string[]; useSnmp: boolean; useLldp: boolean };
      const now = new Date().toISOString();
      const job: DiscoveryJob = {
        id: `job_demo_${Date.now()}`,
        tenantId: defaultTenantId,
        status: "completed",
        startedAt: now,
        finishedAt: now,
        requestedBy: token.replace("demo-token-", "user-admin"),
        input,
      };

      const discovery = synthesizeDiscovery(input.cidrRanges);
      mockState.devices = discovery.devices;
      mockState.topology = discovery.topology;
      job.summary = {
        devicesFound: discovery.devices.length,
        linksFound: discovery.topology.links.length,
      };
      mockState.jobs = [job, ...mockState.jobs].slice(0, 30);

      return job as T;
    }
    throw new Error(`Unsupported demo endpoint: ${path}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrap<T>(res, path);
}

export async function apiPatch<T>(path: string, token: string, body: unknown): Promise<T> {
  if (IS_DEMO_MODE) {
    const rolePathMatch = path.match(/^\/rbac\/users\/([^/]+)\/role$/);
    if (rolePathMatch) {
      const userId = rolePathMatch[1]!;
      const role = (body as { role: RoleName }).role;
      const user = mockState.users.find((u) => u.id === userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.role = role;
      return user as T;
    }
    throw new Error(`Unsupported demo endpoint: ${path}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrap<T>(res, path);
}

export function hasPermission(user: User, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[user.role] ?? []).includes(permission);
}
