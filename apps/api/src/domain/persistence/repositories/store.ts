import { nanoid } from "nanoid";
import type { Device, DiscoveryJob, DiscoveryJobStatus, RoleName, TopologyGraph, User } from "@verdeai/shared";
import { DeviceModel, DiscoveryJobModel, TopologySnapshotModel, UserModel, TopologySnapshotRecord } from "../models/models.js";

const defaultTenant = "tenant-verdeai";

function mapUser(record: {
  _id: string;
  tenantId: string;
  email: string;
  displayName: string;
  role: RoleName;
}): User {
  return {
    id: record._id,
    tenantId: record.tenantId,
    email: record.email,
    displayName: record.displayName,
    role: record.role,
  };
}

function mapDevice(record: {
  _id: string;
  tenantId: string;
  hostname: string;
  mgmtIp: string;
  kind: Device["kind"];
  vendor?: string;
  model?: string;
  serial?: string;
  osVersion?: string;
  discoveredAt: string;
  source: Device["source"];
  confidence: number;
}): Device {
  return {
    id: record._id,
    tenantId: record.tenantId,
    hostname: record.hostname,
    mgmtIp: record.mgmtIp,
    kind: record.kind,
    vendor: record.vendor,
    model: record.model,
    serial: record.serial,
    osVersion: record.osVersion,
    discoveredAt: record.discoveredAt,
    source: record.source,
    confidence: record.confidence,
  };
}

function mapJob(record: {
  _id: string;
  tenantId: string;
  status: DiscoveryJobStatus;
  startedAt?: string;
  finishedAt?: string;
  requestedBy: string;
  input: DiscoveryJob["input"];
  summary?: DiscoveryJob["summary"];
}): DiscoveryJob {
  return {
    id: record._id,
    tenantId: record.tenantId,
    status: record.status,
    startedAt: record.startedAt,
    finishedAt: record.finishedAt,
    requestedBy: record.requestedBy,
    input: record.input,
    summary: record.summary,
  };
}

function stableDeviceId(tenantId: string, mgmtIp: string): string {
  return `dev_${tenantId.replace(/[^a-zA-Z0-9]/g, "")}_${mgmtIp.replace(/[^0-9]/g, "_")}`;
}

export async function seedUsersIfMissing(): Promise<void> {
  const count = await UserModel.countDocuments({ tenantId: defaultTenant });
  if (count > 0) {
    return;
  }

  await UserModel.insertMany([
    {
      _id: "user-admin",
      tenantId: defaultTenant,
      email: "admin@verdeai.local",
      displayName: "VerdeAI Admin",
      role: "platform_admin",
    },
    {
      _id: "user-operator",
      tenantId: defaultTenant,
      email: "operator@verdeai.local",
      displayName: "VerdeAI Operator",
      role: "operator",
    },
    {
      _id: "user-auditor",
      tenantId: defaultTenant,
      email: "auditor@verdeai.local",
      displayName: "VerdeAI Auditor",
      role: "auditor",
    },
  ]);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const record = await UserModel.findOne({ email }).lean();
  return record ? mapUser(record as never) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const record = await UserModel.findById(id).lean();
  return record ? mapUser(record as never) : null;
}

export async function listUsersByTenant(tenantId: string): Promise<User[]> {
  const records = await UserModel.find({ tenantId }).sort({ email: 1 }).lean();
  return records.map((record) => mapUser(record as never));
}

export async function updateUserRole(tenantId: string, userId: string, role: RoleName): Promise<User | null> {
  const updated = await UserModel.findOneAndUpdate(
    { _id: userId, tenantId },
    { $set: { role } },
    { new: true }
  ).lean();

  return updated ? mapUser(updated as never) : null;
}

export async function createDiscoveryJob(input: Omit<DiscoveryJob, "id" | "status">): Promise<DiscoveryJob> {
  const created = await DiscoveryJobModel.create({
    _id: `job_${nanoid(10)}`,
    tenantId: input.tenantId,
    status: "queued",
    requestedBy: input.requestedBy,
    input: input.input,
  });

  return mapJob(created.toObject() as never);
}

export async function updateDiscoveryJobState(
  jobId: string,
  status: DiscoveryJobStatus,
  patch: Partial<Pick<DiscoveryJob, "startedAt" | "finishedAt" | "summary">>
): Promise<DiscoveryJob> {
  const updated = await DiscoveryJobModel.findByIdAndUpdate(
    jobId,
    {
      $set: {
        status,
        ...patch,
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error(`Discovery job not found: ${jobId}`);
  }

  return mapJob(updated as never);
}

export async function listDiscoveryJobsByTenant(tenantId: string): Promise<DiscoveryJob[]> {
  const records = await DiscoveryJobModel.find({ tenantId }).sort({ createdAt: -1 }).lean();
  return records.map((record) => mapJob(record as never));
}

export async function upsertDevices(devices: Device[]): Promise<void> {
  if (devices.length === 0) {
    return;
  }

  const operations = devices.map((device) => {
    const _id = stableDeviceId(device.tenantId, device.mgmtIp);
    return {
      updateOne: {
        filter: { tenantId: device.tenantId, mgmtIp: device.mgmtIp },
        update: {
          $setOnInsert: {
            _id,
          },
          $set: {
            tenantId: device.tenantId,
            hostname: device.hostname,
            mgmtIp: device.mgmtIp,
            kind: device.kind,
            vendor: device.vendor,
            model: device.model,
            serial: device.serial,
            osVersion: device.osVersion,
            discoveredAt: device.discoveredAt,
            source: device.source,
            confidence: device.confidence,
          },
        },
        upsert: true,
      },
    };
  });

  await DeviceModel.bulkWrite(operations, { ordered: false });
}

export async function listTenantDevices(tenantId: string): Promise<Device[]> {
  const records = await DeviceModel.find({ tenantId }).sort({ kind: 1, hostname: 1 }).lean();
  return records.map((record) => mapDevice(record as never));
}

export async function setTopology(graph: TopologyGraph): Promise<void> {
  await TopologySnapshotModel.findOneAndUpdate(
    { tenantId: graph.tenantId },
    {
      $setOnInsert: {
        _id: `top_${graph.tenantId}`,
      },
      $set: {
        tenantId: graph.tenantId,
        generatedAt: graph.generatedAt,
        nodes: graph.nodes,
        links: graph.links,
      },
    },
    { upsert: true }
  );
}

export async function getTenantTopology(tenantId: string): Promise<TopologyGraph> {
  const record = await TopologySnapshotModel.findOne({ tenantId }).lean() as TopologySnapshotRecord | null;
  if (!record) {
    return {
      tenantId,
      generatedAt: new Date().toISOString(),
      nodes: [],
      links: [],
    };
  }

  return {
    tenantId: record.tenantId,
    generatedAt: record.generatedAt,
    nodes: record.nodes,
    links: record.links,
  };
}
