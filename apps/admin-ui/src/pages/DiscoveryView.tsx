import React from "react";
import { BRAND } from "@verdeai/shared";
import { IS_DEMO_MODE, hasPermission, Session } from "../lib/api";
import { CredentialGroup, QueryAudit, PlatformTile } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icons } from "../components/ui/Icons";

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
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem" }}>
            Discovery Engine
          </p>
          <h1>{BRAND.name} Discovery Manager</h1>
          <p className="muted">
            Query infrastructure by IP or CIDR, bind credentials, and map your topology.
          </p>
        </div>
        <div className="header-actions">
           {IS_DEMO_MODE && <span className="badge-soon">UI Demo Mode</span>}
           <div className="status-chip">Release 1.2</div>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title">
            <span>Inventory Assets</span>
            <Icons.Inventory size={20} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: "2rem" }}>{stats.deviceCount}</strong>
            <span className="muted">Active nodes</span>
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <span>Logical Links</span>
            <Icons.Topology size={20} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: "2rem" }}>{stats.linkCount}</strong>
            <span className="muted">Mapped rels</span>
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <span>Query History</span>
            <Icons.Compliance size={20} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: "2rem" }}>{stats.queryCount}</strong>
            <span className="muted">Jobs run</span>
          </div>
        </article>
      </section>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card eyebrow="Unified Discovery" title="Discovery Parameters">
          {hasPermission(session.user, "discovery.write") ? (
            <>
              <label htmlFor="targets">IP Address or CIDR Targets</label>
              <textarea
                id="targets"
                className="input-area"
                style={{ height: "100px", marginBottom: "1rem" }}
                placeholder="e.g. 10.0.0.1, 192.168.1.0/24"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
              />

              <label htmlFor="credentialGroup">Credential Profile</label>
              <select
                id="credentialGroup"
                value={selectedCredentialGroupId}
                onChange={(e) => setSelectedCredentialGroupId(e.target.value)}
                style={{ marginBottom: "1.5rem" }}
              >
                {credentialGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.protocol})
                  </option>
                ))}
              </select>

              <Button onClick={runDiscovery} loading={busy} style={{ width: "100%", gap: "8px" }}>
                <Icons.Discovery size={18} />
                Submit Discovery Job
              </Button>
            </>
          ) : (
            <div className="comp-item">
              <p>Locked</p>
              <span className="muted">Discovery submission is restricted to admin roles.</span>
            </div>
          )}
        </Card>

        <Card eyebrow="Access Control" title="Credential Profiles">
          <div className="credential-list" style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1.5rem" }}>
            {credentialGroups.map((group) => (
              <div
                key={group.id}
                className={`credential-card ${selectedCredentialGroupId === group.id ? "selected" : ""}`}
                onClick={() => setSelectedCredentialGroupId(group.id)}
                style={{ padding: "0.75rem", border: "1px solid var(--line)", borderRadius: "6px", marginBottom: "0.5rem", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{group.name}</strong>
                    <p className="muted" style={{ margin: 0, fontSize: "0.75rem" }}>{group.vendor} / {group.protocol}</p>
                  </div>
                  <Icons.Credentials size={16} />
                </div>
              </div>
            ))}
          </div>

          <div className="credential-form" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
            <div className="form-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label>Name</label>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <div>
                <label>Vendor</label>
                <select value={groupVendor} onChange={(e) => setGroupVendor(e.target.value as any)}>
                  <option value="Cisco">Cisco</option>
                  <option value="Juniper">Juniper</option>
                  <option value="Arista">Arista</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div className="form-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
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
            <Button variant="secondary" onClick={addCredentialGroup} style={{ width: "100%", marginTop: "1rem" }}>
              <Icons.Plus size={14} /> Create Profile
            </Button>
          </div>
        </Card>
      </section>

      <section className="card" style={{ marginTop: "2rem" }}>
         <div className="card-title">
            <span>Recent Scan Audit</span>
         </div>
         <table className="data-table">
            <thead>
               <tr>
                  <th>Job ID</th>
                  <th>Submitted At</th>
                  <th>Targets</th>
                  <th>Credential Profile</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {queryAudit.map((q) => (
                  <tr key={q.id}>
                     <td><code>{q.id}</code></td>
                     <td>{q.submittedAt}</td>
                     <td>{q.targets.join(", ")}</td>
                     <td>{q.credentialGroupName}</td>
                     <td><span className="status-dot bg-green"></span> Completed</td>
                  </tr>
               ))}
               <tr>
                  <td><code>job_prev_01</code></td>
                  <td>2023-10-27 12:00:00</td>
                  <td>10.10.10.0/24</td>
                  <td>Core_SSH</td>
                  <td><span className="status-dot bg-green"></span> Completed</td>
               </tr>
            </tbody>
         </table>
      </section>
    </>
  );
};
