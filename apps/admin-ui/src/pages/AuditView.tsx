import React from "react";
import { History, Activity, ShieldAlert, Zap } from "lucide-react";
import { Card } from "../components/ui/Card";

export const AuditView: React.FC = () => {
  return (
    <>
      <header className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <History size={24} color="#4b5320" />
            <h1>Immutable Event Store</h1>
          </div>
          <p>
            An append-only log detailing all system modifications, discovery triggers, and RBAC actions.
          </p>
        </div>
      </header>

      <section className="grid-discovery">
        <Card eyebrow="System Ledger" title="Audit Logs">
          <ul className="list-clean">
            <li style={{ display: "flex", gap: "1rem" }}>
              <Activity size={20} color="var(--ink-500)" style={{ marginTop: "4px" }} />
              <div>
                <strong>Discovery Job Initiated</strong>
                <p className="meta">Target: 10.10.10.0/24 via Mixed SNMP (Triggered by: admin)</p>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-500)" }}>2 mins ago</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: "1rem" }}>
              <ShieldAlert size={20} color="var(--ink-500)" style={{ marginTop: "4px" }} />
              <div>
                <strong>RBAC Policy Updated</strong>
                <p className="meta">
                  Operator role granted to new.hire@verdeai.local (Triggered by: admin)
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-500)" }}>4 hours ago</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: "1rem" }}>
              <Zap size={20} color="var(--ink-500)" style={{ marginTop: "4px" }} />
              <div>
                <strong>Configuration Check Remediated</strong>
                <p className="meta">
                  acc-sw-21 NTP server updated to primary (Triggered by automated policy)
                </p>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-500)" }}>Yesterday</span>
              </div>
            </li>
          </ul>
        </Card>
      </section>
    </>
  );
};
