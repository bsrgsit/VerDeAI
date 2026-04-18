import type { FastifyInstance } from "fastify";
import { PLATFORM_TODOS, STRATEGY_PIPELINE } from "@verdeai/shared";
import { requirePermission } from "../domain/auth/guards.js";

export async function strategyRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/strategy/pipeline",
    {
      preHandler: [requirePermission("inventory.read")],
    },
    async () => ({ data: STRATEGY_PIPELINE })
  );

  app.get(
    "/strategy/todos",
    {
      preHandler: [requirePermission("inventory.read")],
    },
    async () => ({ data: PLATFORM_TODOS })
  );
}