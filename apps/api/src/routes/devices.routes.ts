import type { FastifyInstance } from "fastify";
import { listTenantDevices } from "../lib/store.js";
import { requirePermission, resolveAuthContext } from "../domain/auth/guards.js";

export async function devicesRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/devices",
    {
      preHandler: [requirePermission("inventory.read")],
    },
    async (request) => {
      const auth = resolveAuthContext(request);
      const devices = await listTenantDevices(auth.user.tenantId);
      return { data: devices };
    }
  );
}