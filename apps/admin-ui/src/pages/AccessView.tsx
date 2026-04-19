import React from "react";
import { Role, RoleName, User } from "@verdeai/shared";
import { IS_DEMO_MODE, hasPermission, Session } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Icons } from "../components/ui/Icons";

interface AccessViewProps {
  session: Session;
  roles: Role[];
  users: User[];
  roleOptions: RoleName[];
  changeUserRole: (userId: string, role: RoleName) => void;
}

export const AccessView: React.FC<AccessViewProps> = ({
  session,
  roles,
  users,
  roleOptions,
  changeUserRole,
}) => {
  return (
    <>
      <header className="content-header">
        <div>
          <p className="eyebrow" style={{ color: "var(--ink-700)", marginBottom: "0.5rem" }}>
             Identity Manager
          </p>
          <h1>Access Control</h1>
          <p className="muted">Manage role-based access assignments and view available authorization scopes.</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title">
             <span>Energy Forecasting</span>
             <Icons.Power size={20} />
          </div>
          <p className="muted" style={{ marginBottom: "1rem" }}>
            Upcoming capabilities focused on sustainable orchestration.
          </p>
          <ul className="list-clean" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <Icons.Activity size={14} style={{ color: "var(--ink-500)" }} />
              <span>Intelligent demand forecasting.</span>
            </li>
          </ul>
        </article>

        <article className="card">
          <div className="card-title">
             <span>Platform Roles</span>
             <Icons.Credentials size={20} />
          </div>
          <ul className="list-clean" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {roles.map((role) => (
              <li key={role.id}>
                <strong style={{ fontSize: "0.9rem" }}>{role.name}</strong>
                <p className="muted" style={{ fontSize: "0.75rem", margin: 0 }}>{role.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className="card" style={{ marginTop: "2rem" }}>
        <div className="card-title">
           <span>User Inventory</span>
           <Icons.Admin size={20} />
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.displayName}</strong></td>
                <td className="muted">{user.email}</td>
                <td>
                  {hasPermission(session.user, "rbac.write") &&
                  hasPermission(session.user, "users.write") ? (
                    <select
                      value={user.role}
                      onChange={(e) => changeUserRole(user.id, e.target.value as RoleName)}
                      style={{ padding: "0.25rem 0.5rem" }}
                    >
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="badge-soon" style={{ background: "#f1f5f9", color: "var(--ink-700)" }}>{user.role}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </>
  );
};
