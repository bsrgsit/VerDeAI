import React from "react";
import { ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const ApprovalsView: React.FC = () => {
  return (
    <>
      <header className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <ClipboardCheck size={24} color="#4b5320" />
            <h1>Pending Change Approvals</h1>
          </div>
          <p>
            Review and authorize configuration remediation requests before they are committed.
          </p>
        </div>
      </header>

      <section className="grid-two">
        <Card eyebrow="Change Management" title="Pending Requests">
          <p className="meta" style={{ marginBottom: "1rem" }}>
            RBAC-enforced change requests waiting for network admin review.
          </p>
          <div className="audit-list">
            <div className="audit-card">
              <div>
                <strong>Fix NTP configuration on acc-sw-44</strong>
                <p>Requested by: operator@verdeai.local</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <Button style={{ gap: "8px" }}>
                  <CheckCircle2 size={16} />
                  Approve & Commit
                </Button>
                <Button variant="secondary" style={{ gap: "8px" }}>
                  <XCircle size={16} />
                  Deny
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};
