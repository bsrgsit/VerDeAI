import type { Permission, User } from "@verdeai/shared";
import { ROLE_PERMISSIONS } from "@verdeai/shared";

const API_BASE = "http://localhost:8080";

export interface Session {
  token: string;
  user: User;
}

async function unwrap<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload?.error ? JSON.stringify(payload.error) : `Request failed: ${path}`;
    throw new Error(message);
  }

  const payload = await res.json();
  return payload.data as T;
}

export async function login(email: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return unwrap<Session>(res, "/auth/login");
}

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return unwrap<T>(res, path);
}

export async function apiPost<T>(path: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrap<T>(res, path);
}

export async function apiPatch<T>(path: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrap<T>(res, path);
}

export function hasPermission(user: User, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[user.role] ?? []).includes(permission);
}