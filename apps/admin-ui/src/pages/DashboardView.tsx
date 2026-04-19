import React from "react";
import { Icons } from "../components/ui/Icons";

export const DashboardView: React.FC = () => {
  return (
    <>
      <header className="content-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p className="muted">High-level operational overview and telemetry</p>
        </div>
        <div className="header-actions">
          <Icons.Bell size={20} />
          <Icons.Settings size={20} />
          <div className="avatar">A</div>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title">
            <span>Current Discovery Status</span>
            <Icons.Refresh size={16} />
          </div>
          <div className="card-body">
            <div className="card-body-row">
              <span style={{ display: "flex", alignItems: "center" }}>
                <span className="status-dot bg-green"></span> Running
              </span>
              <span className="stat-value">12</span>
            </div>
            <div className="card-body-row">
              <span style={{ display: "flex", alignItems: "center" }}>
                <span className="status-dot bg-orange"></span> Successful (24h)
              </span>
              <span className="stat-value">483</span>
            </div>
            <div className="card-body-row">
              <span style={{ display: "flex", alignItems: "center" }}>
                <span className="status-dot bg-red"></span> Failed (24h)
              </span>
              <span className="stat-value">3</span>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <span>Inventory Composition</span>
            <Icons.Inventory size={16} />
          </div>
          <div className="composition-grid">
            <div className="comp-item">
              <p>Switches</p>
              <strong>1,204</strong>
            </div>
            <div className="comp-item">
              <p>Routers</p>
              <strong>342</strong>
            </div>
            <div className="comp-item">
              <p>Servers</p>
              <strong>8,591</strong>
            </div>
            <div className="comp-item">
              <p>Storage</p>
              <strong>412</strong>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <span>Global Reachability</span>
            <Icons.Globe size={16} />
          </div>
          <div className="reachability-hero">
            <h2>99.98%</h2>
            <p className="muted">Average reachability across 5 regions. Stable.</p>
          </div>
        </article>
      </section>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <article className="card">
          <div className="card-title">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icons.Activity size={20} style={{ color: "var(--ink-500)" }} />
              <span className="badge-soon">Coming Soon</span>
            </div>
          </div>
          <h3 style={{ margin: "0 0 0.5rem" }}>Intelligent Forecasting</h3>
          <p className="muted">
            Predictive capacity planning and automated anomaly detection based on historical telemetry data.
          </p>
          <div style={{ marginTop: "2rem", height: "120px", background: "#f8fafc", borderRadius: "8px", position: "relative" }}>
             {/* Simple bar chart mock */}
             <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "10px", height: "100%" }}>
                <div style={{ flex: 1, height: "20%", background: "#ebf1f9" }} />
                <div style={{ flex: 1, height: "40%", background: "#ebf1f9" }} />
                <div style={{ flex: 1, height: "30%", background: "#ebf1f9" }} />
                <div style={{ flex: 1, height: "60%", background: "#ebf1f9" }} />
                <div style={{ flex: 1, height: "80%", background: "#ebf1f9" }} />
                <div style={{ flex: 1, height: "100%", background: "#ebf1f9" }} />
             </div>
             <span className="muted" style={{ position: "absolute", top: "10px", right: "10px", fontSize: "0.6rem" }}>Projected</span>
          </div>
        </article>

        <article className="card">
          <div className="card-title">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icons.Power size={20} style={{ color: "var(--ink-500)" }} />
              <span className="badge-soon">Coming Soon</span>
            </div>
          </div>
          <h3 style={{ margin: "0 0 0.5rem" }}>Power Orchestration</h3>
          <p className="muted">
            Automated workload migration and power gating to optimize PUE across racks.
          </p>
          
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
             <div style={{ padding: "0.75rem", borderRadius: "6px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="muted">Rack A4 Optimize</span>
                <div style={{ width: "24px", height: "14px", borderRadius: "10px", background: "#e2e8f0" }} />
             </div>
             <div style={{ padding: "0.75rem", borderRadius: "6px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="muted">Thermal Balancing</span>
                <div style={{ width: "24px", height: "14px", borderRadius: "10px", background: "#e2e8f0" }} />
             </div>
          </div>
        </article>
      </section>
    </>
  );
};
