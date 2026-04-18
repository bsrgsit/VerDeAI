import type { FastifyInstance } from "fastify";
import { findUserById, listUsersByTenant } from "../lib/store.js";
import { requirePermission, resolveAuthContext } from "../domain/auth/guards.js";

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/users/me",
    {
      preHandler: [requirePermission("inventory.read")],
    },
    async (request, reply) => {
      const auth = resolveAuthContext(request);
      const user = await findUserById(auth.user.id);
      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return { data: user };
    }
  );

  app.get(
    "/users",
    {
      preHandler: [requirePermission("users.read")],
    },
    async (request) => {
      const auth = resolveAuthContext(request);
      const users = await listUsersByTenant(auth.user.tenantId);
      return { data: users };
    }
  );
}