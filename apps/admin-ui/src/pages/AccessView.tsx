import React from "react";
import { Users, Shield, Cpu, Zap, Mail, UserPlus } from "lucide-react";
import { Role, RoleName, User, hasPermission } from "@verdeai/shared";
import { Card } from "../components/ui/Card";
import { Session } from "../lib/api";

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
      <header className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Users size={24} color="#4b5320" />
            <h1>Access Control</h1>
          </div>
          <p>Manage role-based access assignments and view available authorization scopes.</p>
        </div>
      </header>

      <section className="grid-two">
        <Card eyebrow="Platform Roadmap" title="Compute & Power Management" headerAction={<Zap size={18} color="var(--ink-500)" />}>
          <p className="meta" style={{ marginBottom: "1rem" }}>
            Upcoming capabilities focused on sustainable orchestration.
          </p>
          <ul className="list-clean">
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Cpu size={14} color="var(--ink-500)" />
              <span>Intelligent forecasting for demand nodes.</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Zap size={14} color="var(--ink-500)" />
              <span>Power orchestration for energy optimization.</span>
            </li>
          </ul>
        </Card>

        <Card eyebrow="RBAC" title="Authorization Roles" headerAction={<Shield size={18} color="var(--ink-500)" />}>
          <ul className="list-clean">
            {roles.map((role) => (
              <li key={role.id}>
                <strong>{role.name}</strong> | {role.permissions.length} permissions
                <p className="meta">{role.description}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card eyebrow="Identity" title="User Assignments" className="full-width" headerAction={<UserPlus size={18} color="var(--ink-500)" />}>
          <table>
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
                  <td>{user.displayName}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Mail size={12} color="var(--ink-500)" />
                      {user.email}
                    </div>
                  </td>
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
                      <span className="selection-chip">{user.role}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  );
};
