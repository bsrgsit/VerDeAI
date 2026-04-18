import type { FastifyReply, FastifyRequest } from "fastify";
import type { Permission, User } from "@verdeai/shared";
import { ROLE_PERMISSIONS } from "@verdeai/shared";

export interface AuthContext {
  user: User;
  permissions: Permission[];
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ error: "Unauthorized" });
  }
}

export function resolveAuthContext(request: FastifyRequest): AuthContext {
  const payload = request.user as User;
  const permissions = ROLE_PERMISSIONS[payload.role] ?? [];
  return { user: payload, permissions };
}

export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await requireAuth(request, reply);
    if (reply.sent) return;

    const auth = resolveAuthContext(request);
    if (!auth.permissions.includes(permission)) {
      reply.code(403).send({ error: `Forbidden. Missing permission ${permission}` });
    }
  };
}