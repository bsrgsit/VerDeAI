import { useEffect, useMemo, useState } from "react";
import type { Device, DiscoveryJob, Role, RoleName, TopologyGraph, User } from "@verdeai/shared";
import { BRAND } from "@verdeai/shared";
import { apiGet, apiPatch, apiPost, hasPermission, IS_DEMO_MODE, login, type Session } from "./lib/api";

type View = "discovery" | "topology" | "compliance" | "approvals" | "audit" | "access";

type CredentialGroup = {
  id: string;
  name: string;
  vendor: "Cisco" | "Juniper" | "Arista" | "Dell" | "HPE" | "Supermicro" | "Lenovo" | "Mixed";
  protocol: "SSH" | "SNMPv3" | "Netconf";
  username: string;
  scope: string;
};

type QueryAudit = {
  id: string;
  submittedAt: string;
  targets: string[];
  credentialGroupName: string;
};

const demoUsers = ["admin@verdeai.local", "operator@verdeai.local", "auditor@verdeai.local"];
const roleOptions: RoleName[] = ["platform_admin", "network_admin", "operator", "auditor"];
type PlatformTile = {
  name: string;
  vendors: string;
  summary: string;
  image?: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

const platformTiles: PlatformTile[] = [
  {
    name: "Switches",
    vendors: "Cisco, Juniper, Arista, Dell",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cisco_Catalyst_4506-E_Switch_004.jpg",
    summary: "Leaf, spine, access, fabric, and campus switching",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cisco_Catalyst_4506-E_Switch_004.jpg",
  },
  {
    name: "Bare Metal Servers",
    vendors: "Dell, HPE, Lenovo, Supermicro",
    summary: "Rack and blade servers discovered through IP management and credentials",
  },
  {
    name: "Routers and Edge",
    vendors: "Cisco, Juniper, Arista",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Juniper_Networks_QFX5100_ethernet_switch.jpg",
    summary: "Core routing, WAN edge, and L3 topology discovery",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Juniper_Networks_QFX5100_ethernet_switch.jpg",
  },
  {
    name: "Generic Topology Model",
    vendors: "Nodes, links, roles, and editable relationships",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Distro_swtich_used_under_The_Gathering_2025_%28cropped-_Arista_switch%29.jpg",
    summary: "Release 1 topology is generic and can be extended across device classes",
    sourceLabel: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Distro_swtich_used_under_The_Gathering_2025_(cropped-_Arista_switch).jpg",
  },
];

const initialCredentialGroups: CredentialGroup[] = [
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

function normalizeTargets(input: string): string[] {
  return input
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("discovery");
  const [devices, setDevices] = useState<Device[]>([]);
  const [jobs, setJobs] = useState<DiscoveryJob[]>([]);
  const [topology, setTopology] = useState<TopologyGraph | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [targetInput, setTargetInput] = useState("10.10.10.11\n10.10.10.21\n10.20.20.0/24");
  const [credentialGroups, setCredentialGroups] = useState<CredentialGroup[]>(initialCredentialGroups);
  const [selectedCredentialGroupId, setSelectedCredentialGroupId] = useState(initialCredentialGroups[0]!.id);
  const [groupName, setGroupName] = useState("");
  const [groupVendor, setGroupVendor] = useState<CredentialGroup["vendor"]>("Cisco");
  const [groupProtocol, setGroupProtocol] = useState<CredentialGroup["protocol"]>("SSH");
  const [groupUsername, setGroupUsername] = useState("");
  const [groupScope, setGroupScope] = useState("");
  const [queryAudit, setQueryAudit] = useState<QueryAudit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(
    () => ({
      deviceCount: devices.length,
      linkCount: topology?.links.length ?? 0,
      queryCount: jobs.length,
      credentialGroupCount: credentialGroups.length,
    }),
    [credentialGroups.length, devices.length, jobs.length, topology?.links.length]
  );

  const selectedCredentialGroup =
    credentialGroups.find((group) => group.id === selectedCredentialGroupId) ?? credentialGroups[0] ?? null;

  async function refreshData(activeSession: Session) {
    const calls: Array<Promise<unknown>> = [
      apiGet<Device[]>("/devices", activeSession.token).then(setDevices),
      apiGet<DiscoveryJob[]>("/discovery/jobs", activeSession.token).then(setJobs),
      apiGet<TopologyGraph>("/topology", activeSession.token).then(setTopology),
    ];

    if (hasPermission(activeSession.user, "rbac.read")) {
      calls.push(apiGet<Role[]>("/rbac/roles", activeSession.token).then(setRoles));
      calls.push(apiGet<User[]>("/rbac/users", activeSession.token).then(setUsers));
    }

    await Promise.all(calls);
  }

  async function handleLogin(email: string) {
    try {
      setError(null);
      const nextSession = await login(email);
      setSession(nextSession);
      await refreshData(nextSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    }
  }

  async function runDiscovery() {
    if (!session || busy || !selectedCredentialGroup) return;

    const targets = normalizeTargets(targetInput);
    if (targets.length === 0) {
      setError("Provide at least one IP address or CIDR target.");
      return;
    }

    try {
      setBusy(true);
      setError(null);

      const job = await apiPost<DiscoveryJob>("/discovery/jobs", session.token, {
        cidrRanges: targets,
        useSnmp: true,
        useLldp: true,
      });

      setQueryAudit((current) => [
        {
          id: job.id,
          submittedAt: job.startedAt ?? new Date().toISOString(),
          targets,
          credentialGroupName: selectedCredentialGroup.name,
        },
        ...current,
      ]);

      await refreshData(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discovery query failed.");
    } finally {
      setBusy(false);
    }
  }

  function addCredentialGroup() {
    if (!groupName.trim() || !groupUsername.trim() || !groupScope.trim()) {
      setError("Credential group requires name, username, and scope.");
      return;
    }

    const nextGroup: CredentialGroup = {
      id: `cred_${Date.now()}`,
      name: groupName.trim(),
      vendor: groupVendor,
      protocol: groupProtocol,
      username: groupUsername.trim(),
      scope: groupScope.trim(),
    };

    setCredentialGroups((current) => [nextGroup, ...current]);
    setSelectedCredentialGroupId(nextGroup.id);
    setGroupName("");
    setGroupUsername("");
    setGroupScope("");
    setError(null);
  }

  async function changeUserRole(userId: string, role: RoleName) {
    if (!session || busy) return;

    try {
      setBusy(true);
      setError(null);
      await apiPatch<User>(`/rbac/users/${userId}/role`, session.token, { role });
      await refreshData(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role update failed.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!session) return;
    refreshData(session).catch(() => setError("Failed to refresh dashboard data."));
  }, [session]);

  if (!session) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="brand-lockup">
            <p className="eyebrow">VerdeAI Platform</p>
            <h1>{BRAND.name}</h1>
            <p>{BRAND.tagline}</p>
          </div>
          <p className="muted">Enterprise Datacenter Discovery Console</p>
          {IS_DEMO_MODE && <p className="muted">Demo mode is active (API not required).</p>}
          <p className="muted">Select an identity:</p>
          <div className="auth-buttons">
            {demoUsers.map((email) => (
              <button key={email} onClick={() => handleLogin(email)}>
                {email}
              </button>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="layout-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p className="eyebrow">VerdeAI</p>
          <h2>Release 1 Console</h2>
          <p>Device discovery, credential groups, topology, RBAC.</p>
        </div>

        <nav className="nav-stack" aria-label="Main views">
          <button className={view === "discovery" ? "active" : ""} onClick={() => setView("discovery")}>
            Discovery
          </button>
          <button className={view === "topology" ? "active" : ""} onClick={() => setView("topology")}>
            Topology
          </button>
          <button className={view === "compliance" ? "active" : ""} onClick={() => setView("compliance")}>
            Compliance Dashboard
          </button>
          <button className={view === "approvals" ? "active" : ""} onClick={() => setView("approvals")}>
            Change Approvals
          </button>
          <button className={view === "audit" ? "active" : ""} onClick={() => setView("audit")}>
            Audit Logs
          </button>
          {hasPermission(session.user, "rbac.read") && (
            <button className={view === "access" ? "active" : ""} onClick={() => setView("access")}>
              Access Control
            </button>
          )}
        </nav>

        <div className="sidebar-foot">
          <p className="meta">Signed in as</p>
          <p className="user-name">{session.user.displayName}</p>
          <p className="meta">{session.user.role}</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{BRAND.name} Device Discovery Manager</h1>
            <p>Query infrastructure by IP or CIDR, bind credentials at group level, and build a generic topology across network and compute.</p>
            <p className="meta">Intelligent forecasting and power orchestration are key upcoming capabilities.</p>
            {IS_DEMO_MODE && <p className="meta">Running in UI-only demo mode.</p>}
          </div>
          <div className="status-chip">Release 1 Scope</div>
        </header>

        <section className="stats-grid compact">
          <article>
            <h2>Assets</h2>
            <strong>{stats.deviceCount}</strong>
          </article>
          <article>
            <h2>Topology Links</h2>
            <strong>{stats.linkCount}</strong>
          </article>
          <article>
            <h2>Queries</h2>
            <strong>{stats.queryCount}</strong>
          </article>
          <article>
            <h2>Credential Groups</h2>
            <strong>{stats.credentialGroupCount}</strong>
          </article>
        </section>

        {view === "discovery" && (
          <>
            <section className="hero-grid">
              <article className="panel hero-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Release 1 Focus</p>
                    <h3>Query infrastructure directly by IP range and map credentials by operational group.</h3>
                  </div>
                </div>
                <p>
                  Discovery should support switches, routers, bare metal servers, and other managed devices with
                  target selection, credential binding, vendor-aware posture, and a clean handoff into a generic topology.
                </p>
                <p className="meta">Coming soon: intelligent forecasting and power orchestration.</p>
              </article>

              <article className="panel vendor-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Supported Infrastructure Classes</p>
                    <h3>Network, compute, and generic topology mapping</h3>
                  </div>
                </div>
                <div className="vendor-grid">
                  {platformTiles.map((platform) => (
                    <div key={platform.name} className="vendor-tile">
                      {platform.image ? <img src={platform.image} alt={platform.name} /> : <div className="vendor-placeholder" />}
                      <div>
                        <strong>{platform.name}</strong>
                        <p>{platform.summary}</p>
                        <p className="vendor-vendors">{platform.vendors}</p>
                        {platform.sourceUrl && platform.sourceLabel ? (
                          <a className="source-link" href={platform.sourceUrl} target="_blank" rel="noreferrer">
                            Source: {platform.sourceLabel}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid-discovery">
              <article className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Discovery Query</p>
                    <h3>IPs and CIDR targets</h3>
                  </div>
                  {selectedCredentialGroup && (
                    <div className="selection-chip">
                      {selectedCredentialGroup.vendor} / {selectedCredentialGroup.protocol}
                    </div>
                  )}
                </div>

                {hasPermission(session.user, "discovery.write") ? (
                  <>
                    <label htmlFor="targets">Target IPs or CIDRs</label>
                    <textarea
                      id="targets"
                      className="input-area"
                      value={targetInput}
                      onChange={(event) => setTargetInput(event.target.value)}
                    />

                    <label htmlFor="credentialGroup">Credential group</label>
                    <select
                      id="credentialGroup"
                      value={selectedCredentialGroupId}
                      onChange={(event) => setSelectedCredentialGroupId(event.target.value)}
                    >
                      {credentialGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name} | {group.vendor} | {group.protocol}
                        </option>
                      ))}
                    </select>

                    <button onClick={runDiscovery} disabled={busy}>
                      {busy ? "Querying..." : "Query Devices"}
                    </button>
                  </>
                ) : (
                  <p className="muted">No permission to execute device discovery queries.</p>
                )}
              </article>

              <article className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Credential Groups</p>
                    <h3>Group-level access profiles</h3>
                  </div>
                </div>

                <div className="credential-list">
                  {credentialGroups.map((group) => (
                    <button
                      key={group.id}
                      className={`credential-card ${selectedCredentialGroupId === group.id ? "selected" : ""}`}
                      onClick={() => setSelectedCredentialGroupId(group.id)}
                    >
                      <div>
                        <strong>{group.name}</strong>
                        <p>
                          {group.vendor} | {group.protocol}
                        </p>
                      </div>
                      <span>{group.scope}</span>
                    </button>
                  ))}
                </div>

                <div className="credential-form">
                  <label htmlFor="groupName">New group name</label>
                  <input id="groupName" value={groupName} onChange={(event) => setGroupName(event.target.value)} />

                  <div className="form-split">
                    <div>
                      <label htmlFor="groupVendor">Vendor</label>
                      <select
                        id="groupVendor"
                        value={groupVendor}
                        onChange={(event) => setGroupVendor(event.target.value as CredentialGroup["vendor"])}
                      >
                        <option value="Cisco">Cisco</option>
                        <option value="Juniper">Juniper</option>
                        <option value="Arista">Arista</option>
                        <option value="Dell">Dell</option>
                        <option value="HPE">HPE</option>
                        <option value="Supermicro">Supermicro</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="groupProtocol">Protocol</label>
                      <select
                        id="groupProtocol"
                        value={groupProtocol}
                        onChange={(event) => setGroupProtocol(event.target.value as CredentialGroup["protocol"])}
                      >
                        <option value="SSH">SSH</option>
                        <option value="SNMPv3">SNMPv3</option>
                        <option value="Netconf">Netconf</option>
                      </select>
                    </div>
                  </div>

                  <label htmlFor="groupUsername">Username</label>
                  <input
                    id="groupUsername"
                    value={groupUsername}
                    onChange={(event) => setGroupUsername(event.target.value)}
                  />

                  <label htmlFor="groupScope">Device scope</label>
                  <input id="groupScope" value={groupScope} onChange={(event) => setGroupScope(event.target.value)} />

                  <button className="secondary-button" onClick={addCredentialGroup}>
                    Add Credential Group
                  </button>
                </div>
              </article>
            </section>

            <section className="grid-discovery">
              <article className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Inventory</p>
                    <h3>Discovered devices</h3>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Hostname</th>
                      <th>IP</th>
                      <th>Type</th>
                      <th>Vendor</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr key={device.id}>
                        <td>{device.hostname}</td>
                        <td>{device.mgmtIp}</td>
                        <td>{device.kind}</td>
                        <td>{device.vendor ?? "-"}</td>
                        <td>{Math.round(device.confidence * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>

              <article className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Query Audit</p>
                    <h3>Recent discovery submissions</h3>
                  </div>
                </div>
                <div className="audit-list">
                  {queryAudit.length === 0 && <p className="muted">No ad-hoc queries submitted in this session.</p>}
                  {queryAudit.map((entry) => (
                    <div key={entry.id} className="audit-card">
                      <strong>{entry.credentialGroupName}</strong>
                      <p>{new Date(entry.submittedAt).toLocaleString()}</p>
                      <span>{entry.targets.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {view === "topology" && (
          <section className="grid-two">
            <article className="panel">
              <div className="panel-head">
                  <div>
                    <p className="eyebrow">Topology Graph</p>
                    <h3>Nodes</h3>
                    <p className="meta">Generic node model for switches, routers, bare metal, servers, and future device classes.</p>
                  </div>
                </div>
              <table>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Label</th>
                    <th>Type</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {(topology?.nodes ?? []).map((node) => (
                    <tr key={node.id}>
                      <td>{node.id}</td>
                      <td>{node.label}</td>
                      <td>{node.kind}</td>
                      <td>{node.mgmtIp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className="panel">
              <div className="panel-head">
                  <div>
                    <p className="eyebrow">Topology Graph</p>
                    <h3>Links</h3>
                    <p className="meta">Relationships are generic and can be extended beyond current release-one discovery semantics.</p>
                  </div>
                </div>
              <ul className="list-clean">
                {(topology?.links ?? []).map((link) => (
                  <li key={link.id}>
                    <code>{link.sourceNodeId}</code> {" -> "} <code>{link.targetNodeId}</code> ({link.relation})
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {view === "compliance" && (
          <section className="grid-discovery">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Device Posture</p>
                  <h3>Configuration Baseline Checks</h3>
                  <p className="meta">Validates switch and router configs against enterprise standard templates.</p>
                </div>
                <div className="status-chip" style={{color: "#b42335", borderColor: "rgba(180, 35, 53, 0.2)", background: "#fef2f2"}}>
                  3 Drifting
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Vendor</th>
                    <th>Policy Class</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>core-sw-01.mgmt</td>
                    <td>Juniper</td>
                    <td>Spine Routing</td>
                    <td><strong style={{color: "#0f766e"}}>Compliant</strong></td>
                    <td><button className="secondary-button" style={{padding: "0.25rem 0.5rem", fontSize: "0.8rem"}}>View Report</button></td>
                  </tr>
                  <tr>
                    <td>acc-sw-44.mgmt</td>
                    <td>Cisco</td>
                    <td>Campus Access</td>
                    <td><strong style={{color: "#b42335"}}>Drifting</strong> (NTP Mismatch)</td>
                    <td><button style={{padding: "0.25rem 0.5rem", fontSize: "0.8rem"}}>Remediate</button></td>
                  </tr>
                  <tr>
                    <td>fw-edge-02.mgmt</td>
                    <td>Arista</td>
                    <td>Edge Security</td>
                    <td><strong style={{color: "#b42335"}}>Drifting</strong> (ACL Outdated)</td>
                    <td><button style={{padding: "0.25rem 0.5rem", fontSize: "0.8rem"}}>Remediate</button></td>
                  </tr>
                </tbody>
              </table>
            </article>
          </section>
        )}

        {view === "approvals" && (
          <section className="grid-two">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Change Management</p>
                  <h3>Pending Approvals</h3>
                  <p className="meta">RBAC-enforced change requests waiting for network admin review.</p>
                </div>
              </div>
              <div className="audit-list">
                <div className="audit-card">
                  <div>
                    <strong>Fix NTP configuration on acc-sw-44</strong>
                    <p>Requested by: operator@verdeai.local</p>
                  </div>
                  <div style={{display: "flex", gap: "0.5rem", marginTop: "1rem"}}>
                    <button style={{background: "#0f766e"}}>Approve & Commit</button>
                    <button className="secondary-button">Deny</button>
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {view === "audit" && (
          <section className="grid-discovery">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Immutable Event Store</p>
                  <h3>Audit Logs</h3>
                  <p className="meta">Trail of all discovery jobs, configuration changes, and RBAC updates.</p>
                </div>
              </div>
              <ul className="list-clean">
                <li>
                  <strong>Discovery Job Initiated</strong>
                  <p className="meta">Target: 10.10.10.0/24 via Mixed SNMP (Triggered by: admin)</p>
                  <span style={{fontSize: "0.75rem", color: "var(--ink-500)"}}>2 mins ago</span>
                </li>
                <li>
                  <strong>RBAC Policy Updated</strong>
                  <p className="meta">Operator role granted to new.hire@verdeai.local (Triggered by: admin)</p>
                  <span style={{fontSize: "0.75rem", color: "var(--ink-500)"}}>4 hours ago</span>
                </li>
                <li>
                  <strong>Configuration Check Remediated</strong>
                  <p className="meta">acc-sw-21 NTP server updated to primary (Triggered by automated policy via operator request)</p>
                  <span style={{fontSize: "0.75rem", color: "var(--ink-500)"}}>Yesterday</span>
                </li>
              </ul>
            </article>
          </section>
        )}

        {view === "access" && hasPermission(session.user, "rbac.read") && (
          <section className="grid-two">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Coming Soon</p>
                  <h3>Power orchestration and intelligent forecasting</h3>
                  <p className="meta">Key roadmap areas after release one discovery and topology stabilization.</p>
                </div>
              </div>
              <ul className="list-clean">
                <li>Intelligent forecasting for compute, network, and power demand.</li>
                <li>Power orchestration for workload-aware energy optimization.</li>
              </ul>
            </article>

            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">RBAC</p>
                  <h3>Roles</h3>
                </div>
              </div>
              <ul className="list-clean">
                {roles.map((role) => (
                  <li key={role.id}>
                    <strong>{role.name}</strong> | {role.permissions.length} permissions | {role.description}
                  </li>
                ))}
              </ul>
            </article>

            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">RBAC</p>
                  <h3>User role assignments</h3>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>
                        {hasPermission(session.user, "rbac.write") && hasPermission(session.user, "users.write") ? (
                          <select value={user.role} onChange={(event) => changeUserRole(user.id, event.target.value as RoleName)}>
                            {roleOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        )}

        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}
