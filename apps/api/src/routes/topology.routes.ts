import type { FastifyInstance } from "fastify";
import { getTenantTopology } from "../lib/store.js";
import { requirePermission, resolveAuthContext } from "../domain/auth/guards.js";

export async function topologyRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/topology",
    {
      preHandler: [requirePermission("topology.read")],
    },
    async (request) => {
      const auth = resolveAuthContext(request);
      const topology = await getTenantTopology(auth.user.tenantId);
      return { data: topology };
    }
  );
}