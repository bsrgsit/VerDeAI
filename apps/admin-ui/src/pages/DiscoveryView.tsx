import React from "react";
import { 
  Plus, 
  Activity, 
  Box, 
  Link as LinkIcon, 
  Key, 
  Cpu, 
  BarChart3,
  Server,
  Network
} from "lucide-react";
import { BRAND, IS_DEMO_MODE, hasPermission } from "@verdeai/shared";
import { Session } from "../lib/api";
import { CredentialGroup, QueryAudit, PlatformTile } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface DiscoveryViewProps {
  session: Session;
  stats: any;
  platformTiles: PlatformTile[];
  targetInput: string;
  setTargetInput: (val: string) => void;
  selectedCredentialGroupId: string;
  setSelectedCredentialGroupId: (val: string) => void;
  credentialGroups: CredentialGroup[];
  runDiscovery: () => void;
  busy: boolean;
  selectedCredentialGroup?: CredentialGroup;
  queryAudit: QueryAudit[];
  groupName: string;
  setGroupName: (val: string) => void;
  groupVendor: any;
  setGroupVendor: (val: any) => void;
  groupProtocol: any;
  setGroupProtocol: (val: any) => void;
  groupUsername: string;
  setGroupUsername: (val: string) => void;
  groupScope: string;
  setGroupScope: (val: string) => void;
  addCredentialGroup: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  session,
  stats,
  platformTiles,
  targetInput,
  setTargetInput,
  selectedCredentialGroupId,
  setSelectedCredentialGroupId,
  credentialGroups,
  runDiscovery,
  busy,
  selectedCredentialGroup,
  queryAudit,
  groupName,
  setGroupName,
  groupVendor,
  setGroupVendor,
  groupProtocol,
  setGroupProtocol,
  groupUsername,
  setGroupUsername,
  groupScope,
  setGroupScope,
  addCredentialGroup,
}) => {
  return (
    <>
      <header className="page-header">
        <div>
          <h1>{BRAND.name} Device Discovery Manager</h1>
          <p>
            Query infrastructure by IP or CIDR, bind credentials at group level, and build a generic topology.
          </p>
          <p className="meta">
            Intelligent forecasting and power orchestration are key upcoming capabilities.
          </p>
          {IS_DEMO_MODE && <p className="meta">Running in UI-only demo mode.</p>}
        </div>
        <div className="status-chip">Release 1 Scope</div>
      </header>

      <section className="stats-grid compact">
        <article className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Assets</h2>
            </div>
            <Box size={20} color="#4b5320" />
          </div>
          <strong>{stats.deviceCount}</strong>
        </article>
        <article className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="eyebrow">Logical</p>
              <h2>Links</h2>
            </div>
            <LinkIcon size={20} color="#4b5320" />
          </div>
          <strong>{stats.linkCount}</strong>
        </article>
        <article className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Queries</h2>
            </div>
            <BarChart3 size={20} color="#4b5320" />
          </div>
          <strong>{stats.queryCount}</strong>
        </article>
        <article className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p className="eyebrow">Security</p>
              <h2>Profiles</h2>
            </div>
            <Key size={20} color="#4b5320" />
          </div>
          <strong>{stats.credentialGroupCount}</strong>
        </article>
      </section>

      <section className="hero-grid">
        <Card eyebrow="Release 1 Focus" title="Unified Discovery" className="hero-panel">
          <p>
            Discovery supports physical and virtual infrastructure via target selection, credential binding, and vendor-aware posture mapping.
          </p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--ink-700)" }}>
              <Network size={14} /> Network
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--ink-700)" }}>
              <Server size={14} /> Compute
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--ink-700)" }}>
              <Cpu size={14} /> Bare Metal
            </div>
          </div>
        </Card>

        <Card eyebrow="Architecture" title="Infrastructure Classes" className="vendor-panel">
          <div className="vendor-grid">
            {platformTiles.map((platform) => (
              <div key={platform.name} className="vendor-tile">
                {platform.image ? (
                  <img src={platform.image} alt={platform.name} />
                ) : (
                  <div className="vendor-placeholder" />
                )}
                <div>
                  <strong>{platform.name}</strong>
                  <p>{platform.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid-discovery">
        <Card
          eyebrow="Target Mapping"
          title="Discovery Query"
          headerAction={
            selectedCredentialGroup && (
              <div className="selection-chip">
                {selectedCredentialGroup.vendor} / {selectedCredentialGroup.protocol}
              </div>
            )
          }
        >
          {hasPermission(session.user, "discovery.write") ? (
            <>
              <label htmlFor="targets">IP Address or CIDR Targets</label>
              <textarea
                id="targets"
                className="input-area"
                placeholder="e.g. 10.0.0.1, 192.168.1.0/24"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />

              <label htmlFor="credentialGroup">Credential Group Profile</label>
              <select
                id="credentialGroup"
                value={selectedCredentialGroupId}
                onChange={(e) => setSelectedCredentialGroupId(e.target.value)}
              >
                {credentialGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.protocol})
                  </option>
                ))}
              </select>

              <Button onClick={runDiscovery} loading={busy} style={{ width: "100%", gap: "8px" }}>
                <Activity size={16} />
                Submit Discovery Job
              </Button>
            </>
          ) : (
            <p className="muted">Read-only role. Discovery submission is restricted.</p>
          )}
        </Card>

        <Card eyebrow="Access Control" title="Credential Profiles">
          <div className="credential-list">
            {credentialGroups.map((group) => (
              <div
                key={group.id}
                className={`credential-card ${selectedCredentialGroupId === group.id ? "selected" : ""}`}
                onClick={() => setSelectedCredentialGroupId(group.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Key size={16} color="var(--ink-500)" />
                  <div>
                    <strong>{group.name}</strong>
                    <p>{group.vendor} / {group.protocol}</p>
                  </div>
                </div>
                <span>{group.username}</span>
              </div>
            ))}
          </div>

          <div className="credential-form">
            <p className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={12} /> Add profile
            </p>
            <div className="form-split">
              <div>
                <label>Profile Name</label>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <div>
                <label>Vendor Class</label>
                <select value={groupVendor} onChange={(e) => setGroupVendor(e.target.value as any)}>
                  <option value="Cisco">Cisco</option>
                  <option value="Juniper">Juniper</option>
                  <option value="Arista">Arista</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div className="form-split">
              <div>
                <label>Protocol</label>
                <select value={groupProtocol} onChange={(e) => setGroupProtocol(e.target.value as any)}>
                  <option value="SSH">SSH</option>
                  <option value="SNMPv3">SNMPv3</option>
                  <option value="Netconf">Netconf</option>
                </select>
              </div>
              <div>
                <label>Username</label>
                <input value={groupUsername} onChange={(e) => setGroupUsername(e.target.value)} />
              </div>
            </div>
            <label>Access Scope</label>
            <input value={groupScope} onChange={(e) => setGroupScope(e.target.value)} placeholder="e.g. 10.0.0.0/8" />
            <Button variant="secondary" onClick={addCredentialGroup} style={{ width: "100%", marginTop: "0.5rem" }}>
              Create Profile
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
};
