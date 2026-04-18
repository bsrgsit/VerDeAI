import { useEffect, useMemo, useState } from "react";
import type { Device, DiscoveryJob, Role, RoleName, TopologyGraph, User } from "@verdeai/shared";
import { BRAND } from "@verdeai/shared";
import { apiGet, apiPatch, apiPost, hasPermission, login, type Session } from "./lib/api";

type View = "operations" | "topology" | "access";

const demoUsers = ["admin@verdeai.local", "operator@verdeai.local", "auditor@verdeai.local"];
const roleOptions: RoleName[] = ["platform_admin", "network_admin", "operator", "auditor"];

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("operations");
  const [devices, setDevices] = useState<Device[]>([]);
  const [jobs, setJobs] = useState<DiscoveryJob[]>([]);
  const [topology, setTopology] = useState<TopologyGraph | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [cidrs, setCidrs] = useState("10.10.10.0/24,10.20.20.0/24");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(
    () => ({
      deviceCount: devices.length,
      linkCount: topology?.links.length ?? 0,
      jobCount: jobs.length,
      adminCount: users.filter((u) => u.role === "platform_admin" || u.role === "network_admin").length,
    }),
    [devices.length, jobs.length, topology?.links.length, users]
  );

  async function refreshData(activeSession: Session) {
    const calls: Array<Promise<unknown>> = [
      apiGet<Device[]>("/devices", activeSession.token).then((d) => setDevices(d)),
      apiGet<DiscoveryJob[]>("/discovery/jobs", activeSession.token).then((d) => setJobs(d)),
      apiGet<TopologyGraph>("/topology", activeSession.token).then((d) => setTopology(d)),
    ];

    if (hasPermission(activeSession.user, "rbac.read")) {
      calls.push(apiGet<Role[]>("/rbac/roles", activeSession.token).then((d) => setRoles(d)));
      calls.push(apiGet<User[]>("/rbac/users", activeSession.token).then((d) => setUsers(d)));
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
    if (!session || busy) return;

    try {
      setBusy(true);
      setError(null);

      const cidrRanges = cidrs
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      await apiPost<DiscoveryJob>("/discovery/jobs", session.token, {
        cidrRanges,
        useSnmp: true,
        useLldp: true,
      });

      await refreshData(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discovery job failed.");
    } finally {
      setBusy(false);
    }
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
          <h1>{BRAND.name}</h1>
          <p>{BRAND.tagline}</p>
          <p className="muted">Select a demo identity:</p>
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
    <main className="layout">
      <header className="header">
        <div>
          <h1>{BRAND.name} Control Plane</h1>
          <p>{BRAND.tagline}</p>
        </div>
        <div className="header-right">
          <nav className="tabs" aria-label="Main views">
            <button className={view === "operations" ? "active" : ""} onClick={() => setView("operations")}>
              Operations
            </button>
            <button className={view === "topology" ? "active" : ""} onClick={() => setView("topology")}>
              Topology
            </button>
            {hasPermission(session.user, "rbac.read") && (
              <button className={view === "access" ? "active" : ""} onClick={() => setView("access")}>
                Access Control
              </button>
            )}
          </nav>
          <div className="user-pill">
            {session.user.displayName} ({session.user.role})
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <article>
          <h2>Discovered Devices</h2>
          <strong>{stats.deviceCount}</strong>
        </article>
        <article>
          <h2>Topology Links</h2>
          <strong>{stats.linkCount}</strong>
        </article>
        <article>
          <h2>Discovery Runs</h2>
          <strong>{stats.jobCount}</strong>
        </article>
        <article>
          <h2>Admin Users</h2>
          <strong>{stats.adminCount}</strong>
        </article>
      </section>

      {view === "operations" && (
        <>
          <section className="panel">
            <h3>Discovery</h3>
            {hasPermission(session.user, "discovery.write") ? (
              <>
                <label>Seed CIDR Ranges</label>
                <input value={cidrs} onChange={(event) => setCidrs(event.target.value)} />
                <button onClick={runDiscovery} disabled={busy}>
                  {busy ? "Running..." : "Run Discovery"}
                </button>
              </>
            ) : (
              <p className="muted">No permission to execute discovery jobs.</p>
            )}
          </section>

          <section className="panel">
            <h3>Inventory</h3>
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
          </section>

          <section className="panel">
            <h3>Recent Discovery Jobs</h3>
            <ul className="job-list">
              {jobs.map((job) => (
                <li key={job.id}>
                  <strong>{job.id}</strong> | {job.status} | devices: {job.summary?.devicesFound ?? 0} | links: {job.summary?.linksFound ?? 0}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {view === "topology" && (
        <section className="grid-two">
          <article className="panel">
            <h3>Topology Nodes</h3>
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
            <h3>Topology Links</h3>
            <ul className="link-list">
              {(topology?.links ?? []).map((link) => (
                <li key={link.id}>
                  <code>{link.sourceNodeId}</code> -> <code>{link.targetNodeId}</code> ({link.relation})
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {view === "access" && hasPermission(session.user, "rbac.read") && (
        <section className="grid-two">
          <article className="panel">
            <h3>Roles</h3>
            <ul className="job-list">
              {roles.map((role) => (
                <li key={role.id}>
                  <strong>{role.name}</strong> | {role.permissions.length} permissions
                </li>
              ))}
            </ul>
          </article>
          <article className="panel">
            <h3>User Role Assignments</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.displayName}</td>
                    <td>{u.email}</td>
                    <td>
                      {hasPermission(session.user, "rbac.write") && hasPermission(session.user, "users.write") ? (
                        <select value={u.role} onChange={(event) => changeUserRole(u.id, event.target.value as RoleName)}>
                          {roleOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        u.role
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
    </main>
  );
}