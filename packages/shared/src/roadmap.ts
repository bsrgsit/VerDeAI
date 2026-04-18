export type PipelineStage = "planned" | "in_progress" | "validation" | "release_ready";

export interface PipelineInitiative {
  id: string;
  title: string;
  objective: string;
  stage: PipelineStage;
  owner: string;
  targetQuarter: string;
  kpis: string[];
}

export type TodoPriority = "p0" | "p1" | "p2";
export type TodoStatus = "todo" | "doing" | "blocked" | "done";

export interface PlatformTodo {
  id: string;
  title: string;
  domain: "discovery" | "switch_ops" | "power_efficiency" | "forecasting" | "audit" | "platform";
  priority: TodoPriority;
  status: TodoStatus;
  description: string;
}

export const STRATEGY_PIPELINE: PipelineInitiative[] = [
  {
    id: "pl-discovery-ai",
    title: "AI Discovery And Device Intelligence",
    objective: "Continuously discover all datacenter assets and classify with explainable confidence scoring.",
    stage: "in_progress",
    owner: "Network Platform",
    targetQuarter: "Q3 2026",
    kpis: ["Discovery coverage > 98%", "Classification precision > 95%", "< 5 min refresh latency"],
  },
  {
    id: "pl-switch-health",
    title: "Switch Configuration Health Checks",
    objective: "Continuously validate switch configs and identify drift, misconfigurations, and compliance risks.",
    stage: "planned",
    owner: "NetOps Automation",
    targetQuarter: "Q4 2026",
    kpis: ["Policy compliance > 99%", "MTTR drift < 30 min", "Automated remediation coverage 70%"],
  },
  {
    id: "pl-config-audit",
    title: "Configuration Audit And Governance",
    objective: "Build complete audit trails across network and server configuration changes.",
    stage: "planned",
    owner: "Security Engineering",
    targetQuarter: "Q4 2026",
    kpis: ["100% change traceability", "Quarterly audit prep < 1 day", "Critical drift alert SLA < 2 min"],
  },
  {
    id: "pl-power-optimization",
    title: "Power Efficiency Optimization",
    objective: "Optimize datacenter energy usage using AI-driven workload placement and power telemetry.",
    stage: "validation",
    owner: "Sustainability Office",
    targetQuarter: "Q1 2027",
    kpis: ["PUE improvement 8%", "Idle power reduction 20%", "Carbon-intensity aware scheduling"],
  },
  {
    id: "pl-forecasting",
    title: "Intelligent Capacity Forecasting",
    objective: "Predict resource requirements for compute, network, and power with proactive recommendations.",
    stage: "planned",
    owner: "AIOps Team",
    targetQuarter: "Q1 2027",
    kpis: ["Forecast MAPE < 10%", "90-day capacity risk alerts", "Budget variance reduction 15%"],
  },
];

export const PLATFORM_TODOS: PlatformTodo[] = [
  {
    id: "td-snmp-lldp-connectors",
    title: "Implement SNMP + LLDP Connectors",
    domain: "discovery",
    priority: "p0",
    status: "doing",
    description: "Ingest neighbors and interface metadata from production network devices.",
  },
  {
    id: "td-switch-baselines",
    title: "Create Switch Configuration Baselines",
    domain: "switch_ops",
    priority: "p0",
    status: "todo",
    description: "Define vendor-specific baseline templates and policy checks.",
  },
  {
    id: "td-config-audit-log",
    title: "Ship Immutable Configuration Audit Log",
    domain: "audit",
    priority: "p0",
    status: "todo",
    description: "Capture who changed what, when, and why for all managed assets.",
  },
  {
    id: "td-power-telemetry",
    title: "Integrate Power Telemetry Pipeline",
    domain: "power_efficiency",
    priority: "p1",
    status: "todo",
    description: "Collect rack-level and device-level power/thermal metrics.",
  },
  {
    id: "td-forecast-engine",
    title: "Build Capacity Forecasting Engine",
    domain: "forecasting",
    priority: "p1",
    status: "todo",
    description: "Train forecasting models for compute, network, and storage demand.",
  },
  {
    id: "td-rbac-approval",
    title: "Role-Based Change Approval Workflow",
    domain: "platform",
    priority: "p1",
    status: "doing",
    description: "Require multi-step approvals for critical configuration pushes.",
  },
];