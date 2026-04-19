import React from "react";
import { Icons } from "../ui/Icons";
import { View } from "../../types";

interface SidebarProps {
  view: View;
  onViewChange: (view: View) => void;
  userEmail: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, onViewChange, userEmail }) => {
  const navItems = [
    { id: "dashboard" as View, label: "Dashboard", Icon: Icons.Dashboard },
    { id: "discovery" as View, label: "Discovery", Icon: Icons.Discovery },
    { id: "inventory" as View, label: "Inventory", Icon: Icons.Inventory },
    { id: "topology" as View, label: "Topology", Icon: Icons.Topology },
    { id: "compliance" as View, label: "Compliance", Icon: Icons.Compliance },
    { id: "access" as View, label: "Access Control", Icon: Icons.Admin },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>VerdeAI</h1>
        <p>Admin Console</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={`#${item.id}`}
            className={`nav-item ${view === item.id ? "active" : ""}`}
            onClick={() => onViewChange(item.id)}
          >
            <item.Icon size={18} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="btn-discovery" 
          onClick={() => onViewChange("discovery")}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <Icons.Plus size={16} />
          New Discovery Job
        </button>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <a href="#support" className="nav-item" onClick={() => onViewChange("dashboard")}>
            <Icons.Help size={18} />
            Support
          </a>
          <a href="#docs" className="nav-item" onClick={() => onViewChange("dashboard")}>
            <Icons.Documentation size={18} />
            Documentation
          </a>
        </div>

        <div className="user-profile" style={{ marginTop: "1.5rem", padding: "0.75rem", borderTop: "1px solid var(--sidebar-line)", fontSize: "0.75rem", color: "var(--sidebar-ink-dim)" }}>
          <p>Logged in as:</p>
          <strong style={{ color: "var(--sidebar-ink)" }}>{userEmail}</strong>
        </div>
      </div>
    </aside>
  );
};
