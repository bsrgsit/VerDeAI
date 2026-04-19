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
    { id: "discovery" as View, label: "Dashboard", Icon: Icons.Dashboard },
    { id: "discovery" as View, label: "Discovery", Icon: Icons.Discovery },
    { id: "topology" as View, label: "Inventory", Icon: Icons.Inventory },
    { id: "topology" as View, label: "Topology", Icon: Icons.Topology },
    { id: "access" as View, label: "Credentials", Icon: Icons.Credentials },
    { id: "access" as View, label: "Admin", Icon: Icons.Admin },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>VerdeAI</h1>
        <p>Infrastructure Discovery</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          // Note: In the mockup, Dashboard is currently pointing to Discovery view for demo
          const isActive = view === item.id && idx === 1; // Simplification for demo
          return (
            <a
              key={idx}
              href={`#${item.id}`}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={(e) => {
                // e.preventDefault(); // Let hash routing handle it, or manual handle
              }}
            >
              <item.Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="btn-discovery">
          <Icons.Plus size={16} />
          New Discovery Job
        </button>
        
        <a href="#support" className="nav-item">
          <Icons.Help size={18} />
          Support
        </a>
        <a href="#docs" className="nav-item">
          <Icons.Documentation size={18} />
          Documentation
        </a>
      </div>
    </aside>
  );
};
