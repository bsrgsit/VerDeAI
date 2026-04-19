import React from "react";
import { 
  Search, 
  Network, 
  ShieldCheck, 
  ClipboardCheck, 
  History, 
  Users, 
  LogOut 
} from "lucide-react";
import { Session } from "../../lib/api";

interface TopNavProps {
  view: string;
  session: Session;
  onSignOut: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ view, session, onSignOut }) => {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="nav-brand">
          <p className="eyebrow">VerdeAI</p>
          <h2>Release 1</h2>
        </div>

        <nav className="nav-links" aria-label="Main views">
          <a href="#discovery" className={view === "discovery" ? "active" : ""}>
            <Search size={16} style={{ marginRight: "6px" }} />
            Discovery
          </a>
          <a href="#topology" className={view === "topology" ? "active" : ""}>
            <Network size={16} style={{ marginRight: "6px" }} />
            Topology
          </a>
          <a href="#compliance" className={view === "compliance" ? "active" : ""}>
            <ShieldCheck size={16} style={{ marginRight: "6px" }} />
            Compliance
          </a>
          <a href="#approvals" className={view === "approvals" ? "active" : ""}>
            <ClipboardCheck size={16} style={{ marginRight: "6px" }} />
            Approvals
          </a>
          <a href="#audit" className={view === "audit" ? "active" : ""}>
            <History size={16} style={{ marginRight: "6px" }} />
            Audit
          </a>
          <a href="#access" className={view === "access" ? "active" : ""}>
            <Users size={16} style={{ marginRight: "6px" }} />
            Access
          </a>
        </nav>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{session.user.displayName}</span>
            <span className="user-role">{session.user.role}</span>
          </div>
          <button className="secondary-button" onClick={onSignOut} style={{ gap: "8px" }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
