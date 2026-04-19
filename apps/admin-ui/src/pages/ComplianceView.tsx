import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const ComplianceView: React.FC = () => {
  return (
    <>
      <header className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <ShieldCheck size={24} color="#4b5320" />
            <h1>Compliance Posture</h1>
          </div>
          <p>Validate the current device configuration baselines against enterprise standard templates.</p>
        </div>
      </header>

      <section className="grid-discovery">
        <Card
          eyebrow="Posture Audit"
          title="Configuration Baseline Checks"
          headerAction={
            <div
              className="status-chip"
              style={{
                color: "#b42335",
                borderColor: "rgba(180, 35, 53, 0.2)",
                background: "#fef2f2",
              }}
            >
              3 Drifting
            </div>
          }
        >
          <p className="meta" style={{ marginBottom: "1rem" }}>
            Validates switch and router configs against enterprise standard templates.
          </p>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Vendor</th>
                <th>Policy Class</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>core-sw-01.mgmt</td>
                <td>Juniper</td>
                <td>Spine Routing</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4b5320" }}>
                    <CheckCircle2 size={14} />
                    <strong>Compliant</strong>
                  </div>
                </td>
                <td>
                  <Button variant="secondary" size="sm" style={{ gap: "6px" }}>
                    <Search size={14} />
                    View Report
                  </Button>
                </td>
              </tr>
              <tr>
                <td>acc-sw-44.mgmt</td>
                <td>Cisco</td>
                <td>Campus Access</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#b42335" }}>
                    <AlertCircle size={14} />
                    <strong>Drifting</strong> (NTP Mismatch)
                  </div>
                </td>
                <td>
                  <Button size="sm">Remediate</Button>
                </td>
              </tr>
              <tr>
                <td>fw-edge-02.mgmt</td>
                <td>Arista</td>
                <td>Edge Security</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#b42335" }}>
                    <AlertCircle size={14} />
                    <strong>Drifting</strong> (ACL Outdated)
                  </div>
                </td>
                <td>
                  <Button size="sm">Remediate</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </>
  );
};
