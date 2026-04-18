import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { RoleName } from "@verdeai/shared";
import { ROLES } from "@verdeai/shared";
import { listUsersByTenant, updateUserRole } from "../lib/store.js";
import { requirePermission, resolveAuthContext } from "../domain/auth/guards.js";

const updateRoleSchema = z.object({
  role: z.enum(["platform_admin", "network_admin", "operator", "auditor"]),
});

export async function rbacRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/rbac/roles",
    {
      preHandler: [requirePermission("rbac.read")],
    },
    async () => ({ data: ROLES })
  );

  app.get(
    "/rbac/users",
    {
      preHandler: [requirePermission("rbac.read")],
    },
    async (request) => {
      const auth = resolveAuthContext(request);
      const users = await listUsersByTenant(auth.user.tenantId);
      return { data: users };
    }
  );

  app.patch(
    "/rbac/users/:userId/role",
    {
      preHandler: [requirePermission("rbac.write"), requirePermission("users.write")],
    },
    async (request, reply) => {
      const auth = resolveAuthContext(request);
      const params = request.params as { userId: string };
      const parsed = updateRoleSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }

      const updated = await updateUserRole(auth.user.tenantId, params.userId, parsed.data.role as RoleName);
      if (!updated) {
        return reply.code(404).send({ error: "User not found" });
      }

      return { data: updated };
    }
  );
}