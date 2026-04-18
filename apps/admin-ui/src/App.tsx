import { useEffect, useMemo, useState } from "react";
import type {
  Device,
  DiscoveryJob,
  PipelineInitiative,
  PlatformTodo,
  Role,
  RoleName,
  TopologyGraph,
  User,
} from "@verdeai/shared";
import { BRAND } from "@verdeai/shared";
import { apiGet, apiPatch, apiPost, hasPermission, IS_DEMO_MODE, login, type Session } from "./lib/api";

type View = "command" | "topology" | "access" | "pipeline";

const demoUsers = ["admin@verdeai.local", "operator@verdeai.local", "auditor@verdeai.local"];
const roleOptions: RoleName[] = ["platform_admin", "network_admin", "operator", "auditor"];

function stageBadge(stage: PipelineInitiative["stage"]): string {
  switch (stage) {
    case "planned":
      return "stage-planned";
    case "in_progress":
      return "stage-progress";
    case "validation":
      return "stage-validation";
    case "release_ready":
      return "stage-ready";
    default:
      return "";
  }
}

function todoBadge(status: PlatformTodo["status"]): string {
  switch (status) {
    case "todo":
      return "todo-todo";
    case "doing":
      return "todo-doing";
    case "blocked":
      return "todo-blocked";
    case "done":
      return "todo-done";
    default:
      return "";
  }
}

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("command");
  const [devices, setDevices] = useState<Device[]>([]);
  const [jobs, setJobs] = useState<DiscoveryJob[]>([]);
  const [topology, setTopology] = useState<TopologyGraph | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [pipeline, setPipeline] = useState<PipelineInitiative[]>([]);
  const [todos, setTodos] = useState<PlatformTodo[]>([]);
  const [cidrs, setCidrs] = useState("10.10.10.0/24,10.20.20.0/24");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(
    () => ({
      deviceCount: devices.length,
      linkCount: topology?.links.length ?? 0,
      jobCount: jobs.length,
      openTodos: todos.filter((t) => t.status !== "done").length,
      pipelineInFlight: pipeline.filter((i) => i.stage === "in_progress" || i.stage === "validation").length,
    }),
    [devices.length, jobs.length, topology?.links.length, todos, pipeline]
  );

  async function refreshData(activeSession: Session) {
    const calls: Array<Promise<unknown>> = [
      apiGet<Device[]>("/devices", activeSession.token).then(setDevices),
      apiGet<DiscoveryJob[]>("/discovery/jobs", activeSession.token).then(setJobs),
      apiGet<TopologyGraph>("/topology", activeSession.token).then(setTopology),
      apiGet<PipelineInitiative[]>("/strategy/pipeline", activeSession.token).then(setPipeline),
      apiGet<PlatformTodo[]>("/strategy/todos", activeSession.token).then(setTodos),
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
          <div className="brand-lockup">
            <h1>{BRAND.name}</h1>
            <p>{BRAND.tagline}</p>
          </div>
          <p className="muted">Enterprise Datacenter Control Plane</p>
          {IS_DEMO_MODE && <p className="muted">Demo mode is active (API not required).</p>}
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
          <h1>{BRAND.name} Enterprise Datacenter Manager</h1>
          <p>{BRAND.tagline}</p>
          {IS_DEMO_MODE && <p className="meta">Running in UI-only demo mode.</p>}
        </div>
        <div className="header-right">
          <nav className="tabs" aria-label="Main views">
            <button className={view === "command" ? "active" : ""} onClick={() => setView("command")}>
              Command Center
            </button>
            <button className={view === "topology" ? "active" : ""} onClick={() => setView("topology")}>
              Topology
            </button>
            <button className={view === "pipeline" ? "active" : ""} onClick={() => setView("pipeline")}>
              AI Pipeline
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
          <h2>Discovered Assets</h2>
          <strong>{stats.deviceCount}</strong>
        </article>
        <article>
          <h2>Active Topology Links</h2>
          <strong>{stats.linkCount}</strong>
        </article>
        <article>
          <h2>Discovery Runs</h2>
          <strong>{stats.jobCount}</strong>
        </article>
        <article>
          <h2>Open Engineering Todos</h2>
          <strong>{stats.openTodos}</strong>
        </article>
        <article>
          <h2>Pipeline In Flight</h2>
          <strong>{stats.pipelineInFlight}</strong>
        </article>
      </section>

      {view === "command" && (
        <>
          <section className="panel hero-panel">
            <h3>Ultimate Goal</h3>
            <p>
              AI-powered complete datacenter management across discovery, switch operations, health checks, config audits,
              power optimization, and intelligent resource forecasting.
            </p>
          </section>

          <section className="panel">
            <h3>Discovery Operations</h3>
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
            <h3>Discovered Inventory</h3>
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
            <h3>Discovery Job History</h3>
            <ul className="list-clean">
              {jobs.map((job) => (
                <li key={job.id}>
                  <strong>{job.id}</strong> | {job.status} | devices: {job.summary?.devicesFound ?? 0} | links:
                  {" "}
                  {job.summary?.linksFound ?? 0}
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
            <ul className="list-clean">
              {(topology?.links ?? []).map((link) => (
                <li key={link.id}>
                  <code>{link.sourceNodeId}</code> -> <code>{link.targetNodeId}</code> ({link.relation})
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {view === "pipeline" && (
        <section className="grid-two-wide">
          <article className="panel">
            <h3>Strategic Pipeline</h3>
            <div className="pipeline-grid">
              {pipeline.map((item) => (
                <div key={item.id} className="pipeline-card">
                  <p className={`stage-tag ${stageBadge(item.stage)}`}>{item.stage.replace("_", " ")}</p>
                  <h4>{item.title}</h4>
                  <p>{item.objective}</p>
                  <p className="meta">Owner: {item.owner}</p>
                  <p className="meta">Target: {item.targetQuarter}</p>
                  <ul className="list-clean tight">
                    {item.kpis.map((kpi) => (
                      <li key={kpi}>{kpi}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <h3>Engineering Todo Pipeline</h3>
            <table>
              <thead>
                <tr>
                  <th>Todo</th>
                  <th>Domain</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id}>
                    <td>
                      <strong>{todo.title}</strong>
                      <div className="meta">{todo.description}</div>
                    </td>
                    <td>{todo.domain}</td>
                    <td>{todo.priority.toUpperCase()}</td>
                    <td>
                      <span className={`todo-tag ${todoBadge(todo.status)}`}>{todo.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>
      )}

      {view === "access" && hasPermission(session.user, "rbac.read") && (
        <section className="grid-two">
          <article className="panel">
            <h3>Roles</h3>
            <ul className="list-clean">
              {roles.map((role) => (
                <li key={role.id}>
                  <strong>{role.name}</strong> | {role.permissions.length} permissions | {role.description}
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
