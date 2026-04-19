import React from "react";
import { Icons } from "../components/ui/Icons";
import { Card } from "../components/ui/Card";

export const AuditView: React.FC = () => {
  return (
    <>
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem" }}>
             Immutable History
          </p>
          <h1>System Audit Logs</h1>
          <p className="muted">
            An append-only log detailing all system modifications, discovery triggers, and RBAC actions.
          </p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card" style={{ gridColumn: "span 3" }}>
          <div className="card-title">
             <span>Historical Ledger</span>
             <Icons.Compliance size={20} />
          </div>
          <ul className="list-clean" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
            <li style={{ display: "flex", gap: "1.25rem", padding: "1rem", borderRadius: "8px", background: "#f8fafc" }}>
              <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", boxShadow: "var(--shadow-sm)" }}>
                <Icons.Discovery size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Discovery Job Initiated</strong>
                  <span className="muted" style={{ fontSize: "0.75rem" }}>2 mins ago</span>
                </div>
                <p className="muted" style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>Target: 10.10.10.0/24 via Mixed SNMP (Triggered by: admin)</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "1.25rem", padding: "1rem", borderRadius: "8px", background: "#f8fafc" }}>
              <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", boxShadow: "var(--shadow-sm)" }}>
                <Icons.Admin size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>RBAC Policy Updated</strong>
                  <span className="muted" style={{ fontSize: "0.75rem" }}>4 hours ago</span>
                </div>
                <p className="muted" style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>Operator role granted to new.hire@verdeai.local (Triggered by: admin)</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "1.25rem", padding: "1rem", borderRadius: "8px", background: "#f8fafc" }}>
              <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", boxShadow: "var(--shadow-sm)" }}>
                <Icons.Settings size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Configuration Check Remediated</strong>
                  <span className="muted" style={{ fontSize: "0.75rem" }}>Yesterday</span>
                </div>
                <p className="muted" style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>acc-sw-21 NTP server updated to primary (Triggered by automated policy)</p>
              </div>
            </li>
          </ul>
        </article>
      </section>
    </>
  );
};
