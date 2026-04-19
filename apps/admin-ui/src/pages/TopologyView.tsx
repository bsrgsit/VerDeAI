import React from "react";
import { Network, Server, Link as LinkIcon, Database } from "lucide-react";
import { TopologyGraph } from "@verdeai/shared";
import { Card } from "../components/ui/Card";

interface TopologyViewProps {
  topology: TopologyGraph | null;
}

export const TopologyView: React.FC<TopologyViewProps> = ({ topology }) => {
  return (
    <>
      <header className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Network size={24} color="#4b5320" />
            <h1>Topology Mapping</h1>
          </div>
          <p>
            Visualize physical and logical connections mapped during discovery runs.
          </p>
        </div>
      </header>

      <section className="grid-two">
        <Card eyebrow="Infrastructure" title="Nodes" headerAction={<Server size={18} color="var(--ink-500)" />}>
          <p className="meta" style={{ marginBottom: "1rem" }}>
            Generic node model for switches, routers, and compute.
          </p>
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
        </Card>

        <Card eyebrow="Relationships" title="Links" headerAction={<LinkIcon size={18} color="var(--ink-500)" />}>
          <p className="meta" style={{ marginBottom: "1rem" }}>
            Relationships extended across device classes.
          </p>
          <ul className="list-clean">
            {(topology?.links ?? []).map((link) => (
              <li key={link.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Database size={14} color="var(--ink-500)" />
                <span>
                  <code>{link.sourceNodeId}</code> {" -> "} <code>{link.targetNodeId}</code>
                  <span className="muted" style={{ marginLeft: "0.5rem" }}>({link.relation})</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
};
