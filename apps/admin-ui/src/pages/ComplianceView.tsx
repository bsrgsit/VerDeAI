import React from "react";
import { Icons } from "../ui/Icons";
import { Button } from "../components/ui/Button";

export const ComplianceView: React.FC = () => {
  return (
    <>
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Icons.Dashboard size={14} /> Operations Subsystem
          </p>
          <h1>Configuration Audits</h1>
        </div>
        <div className="header-actions">
           <button className="btn-discovery" style={{ background: "#144633", border: "none" }}>
             <Icons.Plus size={16} /> Run New Audit
           </button>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card">
          <p className="eyebrow">Total Audits (24h)</p>
          <strong style={{ fontSize: "2.5rem", display: "block", marginTop: "1rem" }}>1,402</strong>
        </article>

        <article className="card" style={{ borderLeft: "4px solid #ef4444" }}>
          <p className="eyebrow">Critical Failures</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1rem" }}>
            <strong style={{ fontSize: "2.5rem", color: "#b42335" }}>12</strong>
            <span className="muted">+3 since last run</span>
          </div>
        </article>

        <article className="card">
          <p className="eyebrow">Compliance Score</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1rem" }}>
            <strong style={{ fontSize: "2.5rem" }}>98.2%</strong>
            <span style={{ color: "#10b981", fontWeight: 600 }}>Optimal</span>
          </div>
        </article>
      </section>

      <article className="card">
        <div className="card-title">
           <span>Recent Audit Logs</span>
           <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" size="sm">Filter</Button>
              <Button variant="secondary" size="sm">Sort</Button>
           </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Audit Type</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "core-sw-nyc-01", type: "Security Baseline v2.1", status: "Fail", dot: "bg-red", time: "2023-10-27 14:32:01 UTC" },
              { name: "edge-rt-lon-04", type: "BGP Route Map Validation", status: "Pass", dot: "bg-green", time: "2023-10-27 14:31:45 UTC" },
              { name: "dist-sw-tok-02", type: "Port Security Check", status: "Warning", dot: "bg-orange", time: "2023-10-27 14:28:12 UTC" },
              { name: "fw-palo-ams-01", type: "Rule Consistency Audit", status: "Pass", dot: "bg-green", time: "2023-10-27 14:15:00 UTC" },
              { name: "core-sw-sfo-02", type: "VLAN Trunking Protocol", status: "Fail", dot: "bg-red", time: "2023-10-27 13:55:22 UTC" },
              { name: "lb-f5-fra-01", type: "SSL Certificate Expiry", status: "Pass", dot: "bg-green", time: "2023-10-27 13:40:10 UTC" },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{row.name}</td>
                <td className="muted">{row.type}</td>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={`status-dot ${row.dot}`}></span> {row.status}
                  </span>
                </td>
                <td className="muted">{row.time}</td>
                <td>
                  <a href="#" style={{ color: "var(--ink-900)", fontWeight: 600, textDecoration: "none" }}>View Report</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
           <span className="muted" style={{ fontSize: "0.75rem" }}>Showing 1 to 6 of 1,402 entries</span>
           <div style={{ display: "flex", gap: "2px" }}>
              <Button variant="secondary" size="sm" disabled>Previous</Button>
              <Button variant="secondary" size="sm">Next</Button>
           </div>
        </div>
      </article>
    </>
  );
};
