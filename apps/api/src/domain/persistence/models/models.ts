import mongoose, { Schema } from "mongoose";
import type { DeviceKind, DiscoveryJobStatus, RoleName } from "@verdeai/shared";

const deviceKinds: DeviceKind[] = ["server", "baremetal", "switch", "router", "firewall", "storage", "unknown"];
const roleNames: RoleName[] = ["platform_admin", "network_admin", "operator", "auditor"];
const discoveryStatuses: DiscoveryJobStatus[] = ["queued", "running", "completed", "failed"];

const discoveryInputSchema = new Schema(
  {
    cidrRanges: { type: [String], required: true },
    useSnmp: { type: Boolean, required: true },
    useLldp: { type: Boolean, required: true },
  },
  { _id: false }
);

const discoverySummarySchema = new Schema(
  {
    devicesFound: { type: Number, required: true },
    linksFound: { type: Number, required: true },
  },
  { _id: false }
);

const topologyNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    kind: { type: String, enum: deviceKinds, required: true },
    mgmtIp: { type: String, required: true },
  },
  { _id: false }
);

const topologyLinkSchema = new Schema(
  {
    id: { type: String, required: true },
    sourceNodeId: { type: String, required: true },
    targetNodeId: { type: String, required: true },
    relation: { type: String, enum: ["layer2", "layer3", "mgmt"], required: true },
    confidence: { type: Number, required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    displayName: { type: String, required: true },
    role: { type: String, enum: roleNames, required: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const deviceSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
    hostname: { type: String, required: true },
    mgmtIp: { type: String, required: true },
    kind: { type: String, enum: deviceKinds, required: true },
    vendor: { type: String },
    model: { type: String },
    serial: { type: String },
    osVersion: { type: String },
    discoveredAt: { type: String, required: true },
    source: { type: String, enum: ["seed-ip-range", "snmp", "lldp", "manual"], required: true },
    confidence: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

deviceSchema.index({ tenantId: 1, mgmtIp: 1 }, { unique: true });

type DiscoveryInput = {
  cidrRanges: string[];
  useSnmp: boolean;
  useLldp: boolean;
};

type DiscoverySummary = {
  devicesFound: number;
  linksFound: number;
};

const discoveryJobSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
    status: { type: String, enum: discoveryStatuses, required: true, index: true },
    startedAt: { type: String },
    finishedAt: { type: String },
    requestedBy: { type: String, required: true },
    input: { type: discoveryInputSchema, required: true },
    summary: { type: discoverySummarySchema, required: false },
  },
  { timestamps: true, versionKey: false }
);

const topologySnapshotSchema = new Schema(
  {
    _id: { type: String, required: true },
    tenantId: { type: String, required: true, unique: true },
    generatedAt: { type: String, required: true },
    nodes: { type: [topologyNodeSchema], required: true, default: [] },
    links: { type: [topologyLinkSchema], required: true, default: [] },
  },
  { timestamps: true, versionKey: false }
);

export const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);
export const DeviceModel = mongoose.models.Device ?? mongoose.model("Device", deviceSchema);
export const DiscoveryJobModel = mongoose.models.DiscoveryJob ?? mongoose.model("DiscoveryJob", discoveryJobSchema);
export const TopologySnapshotModel =
  mongoose.models.TopologySnapshot ?? mongoose.model("TopologySnapshot", topologySnapshotSchema);

export type UserRecord = {
  _id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: RoleName;
};

export type DeviceRecord = {
  _id: string;
  tenantId: string;
  hostname: string;
  mgmtIp: string;
  kind: DeviceKind;
  vendor?: string;
  model?: string;
  serial?: string;
  osVersion?: string;
  discoveredAt: string;
  source: "seed-ip-range" | "snmp" | "lldp" | "manual";
  confidence: number;
};

export type DiscoveryJobRecord = {
  _id: string;
  tenantId: string;
  status: DiscoveryJobStatus;
  startedAt?: string;
  finishedAt?: string;
  requestedBy: string;
  input: DiscoveryInput;
  summary?: DiscoverySummary;
};

export type TopologySnapshotRecord = {
  _id: string;
  tenantId: string;
  generatedAt: string;
  nodes: Array<{ id: string; label: string; kind: DeviceKind; mgmtIp: string }>;
  links: Array<{ id: string; sourceNodeId: string; targetNodeId: string; relation: "layer2" | "layer3" | "mgmt"; confidence: number }>;
};