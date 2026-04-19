import React from "react";
import { BRAND, IS_DEMO_MODE } from "@verdeai/shared";

interface AuthPageProps {
  demoUsers: string[];
  onLogin: (email: string) => void;
  error: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  demoUsers,
  onLogin,
  error,
}) => {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand-lockup">
          <p className="eyebrow">VerdeAI Platform</p>
          <h1>{BRAND.name}</h1>
          <p>{BRAND.tagline}</p>
        </div>
        <p className="muted">Enterprise Datacenter Discovery Console</p>
        {IS_DEMO_MODE && (
          <p className="muted">Demo mode is active (API not required).</p>
        )}
        <p className="muted" style={{ marginTop: "1rem" }}>Select an identity to sign in:</p>
        <div className="auth-buttons">
          {demoUsers.map((email) => (
            <button key={email} onClick={() => onLogin(email)}>
              {email}
            </button>
          ))}
        </div>
        {error && <p className="error" style={{ marginTop: "1.5rem" }}>{error}</p>}
      </div>
    </main>
  );
};
