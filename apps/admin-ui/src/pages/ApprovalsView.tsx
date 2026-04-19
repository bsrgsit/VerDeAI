import React from "react";
import { Icons } from "../components/ui/Icons";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const ApprovalsView: React.FC = () => {
  return (
    <>
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem" }}>
             Change Governance
          </p>
          <h1>Pending Approvals</h1>
          <p className="muted">
            Review and authorize configuration remediation requests before they are committed.
          </p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-title">
             <span>Authorization Queue</span>
             <Icons.Credentials size={20} />
          </div>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            RBAC-enforced change requests waiting for network administrator review.
          </p>
          <div className="audit-list">
            <div className="audit-card" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--line)", background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong style={{ fontSize: "1.1rem", display: "block" }}>Fix NTP configuration on acc-sw-44</strong>
                  <p className="muted" style={{ marginTop: "0.25rem" }}>Requested by: operator@verdeai.local</p>
                </div>
                <span className="badge-soon">High Priority</span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <Button style={{ gap: "8px", flex: 1 }}>
                  Approve & Commit
                </Button>
                <Button variant="secondary" style={{ gap: "8px", flex: 1 }}>
                   Deny
                </Button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};
