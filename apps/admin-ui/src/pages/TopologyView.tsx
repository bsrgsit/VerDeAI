import React from "react";
import { TopologyGraph } from "@verdeai/shared";
import { Card } from "../components/ui/Card";
import { Icons } from "../components/ui/Icons";

interface TopologyViewProps {
  topology: TopologyGraph | null;
}

export const TopologyView: React.FC<TopologyViewProps> = ({ topology }) => {
  return (
    <>
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem" }}>
             Relational Model
          </p>
          <h1>Infrastructure Topology</h1>
          <p className="muted">
            Visualize physical and logical connections mapped during discovery runs.
          </p>
        </div>
        <div className="header-actions">
           <div className="status-chip">3 Layers Active</div>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <article className="card">
          <div className="card-title">
             <span>Compute & Network Nodes</span>
             <Icons.Router size={20} />
          </div>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            Generic node model for switches, routers, and compute devices identified in the recent scan.
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Node ID</th>
                <th>Label</th>
                <th>Type</th>
                <th>Mgmt IP</th>
              </tr>
            </thead>
            <tbody>
              {(topology?.nodes ?? []).map((node) => (
                <tr key={node.id}>
                  <td><code>{node.id}</code></td>
                  <td><strong>{node.label}</strong></td>
                  <td>{node.kind}</td>
                  <td className="muted">{node.mgmtIp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <div className="card-title">
             <span>Active Link Adjacencies</span>
             <Icons.Topology size={20} />
          </div>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            Relationships extended across device classes using LLDP and Layer 3 routing data.
          </p>
          <ul className="list-clean" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(topology?.links ?? []).map((link) => (
              <li key={link.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem", background: "#f8fafc", borderRadius: "6px" }}>
                <Icons.Activity size={14} style={{ color: "var(--ink-500)" }} />
                <span style={{ fontSize: "0.85rem" }}>
                  <code>{link.sourceNodeId}</code> {" → "} <code>{link.targetNodeId}</code>
                  <div className="meta" style={{ fontSize: "0.7rem", marginTop: "2px" }}>relation: {link.relation} | conf: {link.confidence}</div>
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
};
