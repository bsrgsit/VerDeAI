import { RoleName } from "@verdeai/shared";
import { CredentialGroup, PlatformTile } from "./types";

export const demoUsers = [
  "admin@verdeai.local",
  "operator@verdeai.local",
  "auditor@verdeai.local",
];

export const roleOptions: RoleName[] = [
  "platform_admin",
  "network_admin",
  "operator",
  "auditor",
];

export const platformTiles: PlatformTile[] = [
  {
    name: "Switches",
    vendors: "Cisco, Juniper, Arista, Dell",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cisco_Catalyst_4506-E_Switch_004.jpg",
    summary: "Leaf, spine, access, fabric, and campus switching",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cisco_Catalyst_4506-E_Switch_004.jpg",
  },
  {
    name: "Bare Metal Servers",
    vendors: "Dell, HPE, Lenovo, Supermicro",
    summary:
      "Rack and blade servers discovered through IP management and credentials",
  },
  {
    name: "Routers and Edge",
    vendors: "Cisco, Juniper, Arista",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Juniper_Networks_QFX5100_ethernet_switch.jpg",
    summary: "Core routing, WAN edge, and L3 topology discovery",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Juniper_Networks_QFX5100_ethernet_switch.jpg",
  },
  {
    name: "Generic Topology Model",
    vendors: "Nodes, links, roles, and editable relationships",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Distro_swtich_used_under_The_Gathering_2025_%28cropped-_Arista_switch%29.jpg",
    summary:
      "Release 1 topology is generic and can be extended across device classes",
    sourceLabel: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Distro_swtich_used_under_The_Gathering_2025_(cropped-_Arista_switch).jpg",
  },
];

export const initialCredentialGroups: CredentialGroup[] = [
  {
    id: "cred-core-netconf",
    name: "Core Netconf",
    vendor: "Juniper",
    protocol: "Netconf",
    username: "verde-netops",
    scope: "QFX / Spine / Leaf",
  },
  {
    id: "cred-campus-ssh",
    name: "Campus SSH",
    vendor: "Cisco",
    protocol: "SSH",
    username: "verde-admin",
    scope: "Access / Distribution",
  },
  {
    id: "cred-mixed-snmp",
    name: "Mixed SNMP",
    vendor: "Mixed",
    protocol: "SNMPv3",
    username: "verde-discovery",
    scope: "Read-only telemetry",
  },
  {
    id: "cred-baremetal-ssh",
    name: "Bare Metal SSH",
    vendor: "Dell",
    protocol: "SSH",
    username: "verde-baremetal",
    scope: "iDRAC / iLO reachable bare metal",
  },
];
