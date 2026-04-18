import { nanoid } from "nanoid";
import type { Device, DeviceKind, DiscoveryJob, TopologyGraph, TopologyLink, TopologyNode } from "@verdeai/shared";

const vendors = ["Juniper", "Arista", "Cisco", "Dell", "HPE"];

function hashToDeviceKind(seed: string): DeviceKind {
  const kinds: DeviceKind[] = ["switch", "router", "server", "baremetal", "firewall", "storage"];
  const index = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % kinds.length;
  return kinds[index] ?? "unknown";
}

function ipFromCidr(cidr: string, offset: number): string {
  const base = cidr.split("/")[0] ?? "10.0.0.0";
  const parts = base.split(".").map((v) => Number(v));
  if (parts.length !== 4) return `10.0.0.${offset + 1}`;
  return `${parts[0]}.${parts[1]}.${parts[2]}.${Math.min(254, (parts[3] || 0) + offset + 1)}`;
}

function synthesizeDevices(job: DiscoveryJob): Device[] {
  const devices: Device[] = [];
  const ts = new Date().toISOString();

  for (const cidr of job.input.cidrRanges) {
    for (let i = 0; i < 4; i++) {
      const mgmtIp = ipFromCidr(cidr, i);
      const kind = hashToDeviceKind(`${cidr}-${i}`);
      devices.push({
        id: `dev_${nanoid(8)}`,
        tenantId: job.tenantId,
        hostname: `${kind}-${mgmtIp.replaceAll('.', '-')}`,
        mgmtIp,
        kind,
        vendor: vendors[i % vendors.length],
        model: `${kind.toUpperCase()}-${100 + i}`,
        serial: `SN-${nanoid(10).toUpperCase()}`,
        osVersion: `v${1 + i}.0.${i}`,
        discoveredAt: ts,
        source: "seed-ip-range",
        confidence: 0.74 + i * 0.05,
      });
    }
  }

  return devices;
}

function buildTopology(tenantId: string, devices: Device[]): TopologyGraph {
  const nodes: TopologyNode[] = devices.map((d) => ({
    id: d.id,
    label: d.hostname,
    kind: d.kind,
    mgmtIp: d.mgmtIp,
  }));

  const links: TopologyLink[] = [];
  for (let i = 0; i < devices.length - 1; i++) {
    links.push({
      id: `ln_${nanoid(8)}`,
      sourceNodeId: devices[i]!.id,
      targetNodeId: devices[i + 1]!.id,
      relation: i % 2 === 0 ? "layer2" : "layer3",
      confidence: 0.7,
    });
  }

  return {
    tenantId,
    generatedAt: new Date().toISOString(),
    nodes,
    links,
  };
}

export const discoveryEngine = {
  execute(job: DiscoveryJob) {
    const devices = synthesizeDevices(job);
    const topology = buildTopology(job.tenantId, devices);
    return {
      devices,
      topology,
      summary: {
        devicesFound: devices.length,
        linksFound: topology.links.length,
      },
    };
  },
};