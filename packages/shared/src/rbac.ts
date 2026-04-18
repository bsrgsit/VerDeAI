import type { Permission, Role } from "./index.js";

export const ROLE_PERMISSIONS: Record<Role["name"], Permission[]> = {
  platform_admin: [
    "discovery.read",
    "discovery.write",
    "inventory.read",
    "inventory.write",
    "topology.read",
    "topology.write",
    "users.read",
    "users.write",
    "rbac.read",
    "rbac.write",
    "audit.read",
  ],
  network_admin: [
    "discovery.read",
    "discovery.write",
    "inventory.read",
    "inventory.write",
    "topology.read",
    "topology.write",
    "users.read",
    "rbac.read",
    "audit.read",
  ],
  operator: ["discovery.read", "inventory.read", "topology.read", "audit.read"],
  auditor: ["inventory.read", "topology.read", "audit.read", "rbac.read"],
};

export const ROLES: Role[] = [
  {
    id: "role-platform-admin",
    name: "platform_admin",
    description: "Global tenant administrator",
    permissions: ROLE_PERMISSIONS.platform_admin,
  },
  {
    id: "role-network-admin",
    name: "network_admin",
    description: "Network operations administrator",
    permissions: ROLE_PERMISSIONS.network_admin,
  },
  {
    id: "role-operator",
    name: "operator",
    description: "Read-focused operations user",
    permissions: ROLE_PERMISSIONS.operator,
  },
  {
    id: "role-auditor",
    name: "auditor",
    description: "Compliance and audit user",
    permissions: ROLE_PERMISSIONS.auditor,
  },
];