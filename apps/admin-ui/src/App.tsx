import { useEffect, useState } from "react";
import "./styles.css";

// Shared logic and types
import type { DiscoveryJob, RoleName, TopologyGraph, User } from "@verdeai/shared";
import { apiGet, apiPatch, apiPost, login, type Session } from "./lib/api";
import { normalizeTargets } from "./lib/utils";
import { View, CredentialGroup, QueryAudit } from "./types";
import { 
  demoUsers, 
  roleOptions, 
  platformTiles, 
  initialCredentialGroups 
} from "./constants";

// Modular Components
import { Sidebar } from "./components/layout/Sidebar";
import { AuthPage } from "./pages/AuthPage";
import { DashboardView } from "./pages/DashboardView";
import { DiscoveryView } from "./pages/DiscoveryView";
import { TopologyView } from "./pages/TopologyView";
import { ComplianceView } from "./pages/ComplianceView";
import { ApprovalsView } from "./pages/ApprovalsView";
import { AuditView } from "./pages/AuditView";
import { AccessView } from "./pages/AccessView";
import { useNotification } from "./hooks/useNotification";

const VIEW_WHITELIST: View[] = [
  "dashboard",
  "discovery",
  "topology",
  "compliance",
  "approvals",
  "audit",
  "access"
];

export function App() {
  const { notify } = useNotification();
  // Session & Global Info
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Layout State with Persistence
  const [view, setView] = useState<View>(() => {
    const hash = window.location.hash.replace("#", "");
    if (VIEW_WHITELIST.includes(hash as View)) return hash as View;

    const savedView = localStorage.getItem("verde_active_view") as View;
    if (VIEW_WHITELIST.includes(savedView)) return savedView;

    return "dashboard"; // New default
  });

  // Domain Data State
  const [stats, setStats] = useState({
    deviceCount: 0, linkCount: 0, queryCount: 0, credentialGroupCount: 4,
  });
  const [topology, setTopology] = useState<TopologyGraph | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // Discovery Form State
  const [targetInput, setTargetInput] = useState("");
  const [credentialGroups, setCredentialGroups] = useState<CredentialGroup[]>(initialCredentialGroups);
  const [selectedCredentialGroupId, setSelectedCredentialGroupId] = useState(initialCredentialGroups[0].id);
  const [queryAudit, setQueryAudit] = useState<QueryAudit[]>([]);

  // Form State
  const [groupName, setGroupName] = useState("");
  const [groupVendor, setGroupVendor] = useState("Cisco");
  const [groupProtocol, setGroupProtocol] = useState("SSH");
  const [groupUsername, setGroupUsername] = useState("");
  const [groupScope, setGroupScope] = useState("");

  const selectedCredentialGroup = credentialGroups.find(
    (g) => g.id === selectedCredentialGroupId
  );

  // Sync View to Hash & LocalStorage
  useEffect(() => {
    window.location.hash = view;
    localStorage.setItem("verde_active_view", view);
  }, [view]);

  // Handle browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (VIEW_WHITELIST.includes(hash as View)) {
        setView(hash as View);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  async function refreshData(activeSession: Session) {
    const calls = [
      apiGet<any>("/discovery/stats", activeSession.token).then(setStats),
      apiGet<TopologyGraph>("/topology", activeSession.token).then(setTopology),
      apiGet<any[]>("/rbac/roles", activeSession.token).then(setRoles),
    ];

    if (activeSession.user.role === "platform_admin") {
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
      setError("Provide at least one target IP or CIDR."); return;
    }

    try {
      setBusy(true); setError(null);
      const job = await apiPost<DiscoveryJob>("/discovery/jobs", session.token, {
        cidrRanges: targets, useSnmp: true, useLldp: true,
      });

      setQueryAudit((prev) => [
        {
          id: job.id,
          submittedAt: job.startedAt ?? new Date().toISOString(),
          targets,
          credentialGroupName: selectedCredentialGroup.name,
        },
        ...prev,
      ]);
      notify("Discovery job submitted successfully", "success");
      await refreshData(session);
    } catch (err) {
      notify("Failed to submit discovery job", "error");
      setError(err instanceof Error ? err.message : "Discovery job failed.");
    } finally {
      setBusy(false);
    }
  }

  function addCredentialGroup() {
    if (!groupName || !groupUsername || !groupScope) {
      setError("All fields are required."); return;
    }
    const nextGroup: CredentialGroup = {
      id: `cred-${Date.now()}`, name: groupName, vendor: groupVendor as any,
      protocol: groupProtocol as any, username: groupUsername, scope: groupScope,
    };
    setCredentialGroups((prev) => [nextGroup, ...prev]);
    setSelectedCredentialGroupId(nextGroup.id);
    setGroupName(""); setGroupUsername(""); setGroupScope("");
    setError(null);
    notify("Credential profile added", "success");
  }

  async function changeUserRole(userId: string, role: RoleName) {
    if (!session || busy) return;
    try {
      setBusy(true); setError(null);
      await apiPatch(`/rbac/users/${userId}/role`, session.token, { role });
      await refreshData(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role update failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <AuthPage demoUsers={demoUsers} onLogin={handleLogin} error={error} />;
  }

  return (
    <div className="app-shell">
      <Sidebar 
        view={view} 
        onViewChange={setView} 
        userEmail={session.user.email} 
      />

      <main className="main-content">
        {view === "dashboard" && <DashboardView />}
        
        {view === "discovery" && (
          <DiscoveryView 
            session={session} stats={stats} platformTiles={platformTiles}
            targetInput={targetInput} setTargetInput={setTargetInput}
            selectedCredentialGroupId={selectedCredentialGroupId}
            setSelectedCredentialGroupId={setSelectedCredentialGroupId}
            credentialGroups={credentialGroups}
            runDiscovery={runDiscovery} busy={busy}
            selectedCredentialGroup={selectedCredentialGroup}
            queryAudit={queryAudit}
            groupName={groupName} setGroupName={setGroupName}
            groupVendor={groupVendor} setGroupVendor={setGroupVendor}
            groupProtocol={groupProtocol} setGroupProtocol={setGroupProtocol}
            groupUsername={groupUsername} setGroupUsername={setGroupUsername}
            groupScope={groupScope} setGroupScope={setGroupScope}
            addCredentialGroup={addCredentialGroup}
          />
        )}

        {view === "inventory" && <TopologyView topology={topology} />}
        {view === "topology" && <TopologyView topology={topology} />}
        {view === "compliance" && <ComplianceView />}
        {view === "approvals" && <ApprovalsView />}
        {view === "audit" && <AuditView />}
        {view === "access" && (
          <AccessView 
            session={session} roles={roles} users={users} 
            roleOptions={roleOptions} changeUserRole={changeUserRole} 
          />
        )}

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </main>
    </div>
  );
}
