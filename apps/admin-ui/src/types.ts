import { RoleName } from "@verdeai/shared";

export type View =
  | "dashboard"
  | "discovery"
  | "topology"
  | "compliance"
  | "approvals"
  | "audit"
  | "access";

export type CredentialGroup = {
  id: string;
  name: string;
  vendor:
    | "Cisco"
    | "Juniper"
    | "Arista"
    | "Dell"
    | "HPE"
    | "Supermicro"
    | "Lenovo"
    | "Mixed";
  protocol: "SSH" | "SNMPv3" | "Netconf";
  username: string;
  scope: string;
};

export type QueryAudit = {
  id: string;
  submittedAt: string;
  targets: string[];
  credentialGroupName: string;
};

export type PlatformTile = {
  name: string;
  vendors: string;
  summary: string;
  image?: string;
  sourceLabel?: string;
  sourceUrl?: string;
};
