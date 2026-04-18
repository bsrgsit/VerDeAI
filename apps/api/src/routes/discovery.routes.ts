import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { createDiscoveryJob, listDiscoveryJobsByTenant, setTopology, updateDiscoveryJobState, upsertDevices } from "../lib/store.js";
import { requirePermission, resolveAuthContext } from "../domain/auth/guards.js";
import { discoveryEngine } from "../domain/discovery/discovery-engine.js";

const runDiscoverySchema = z.object({
  cidrRanges: z.array(z.string().min(1)).min(1),
  useSnmp: z.boolean().default(true),
  useLldp: z.boolean().default(true),
});

export async function discoveryRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/discovery/jobs",
    {
      preHandler: [requirePermission("discovery.write")],
    },
    async (request, reply) => {
      const parsed = runDiscoverySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues });
      }

      const auth = resolveAuthContext(request);
      const queuedJob = await createDiscoveryJob({
        tenantId: auth.user.tenantId,
        requestedBy: auth.user.id,
        input: parsed.data,
      });

      const runningJob = await updateDiscoveryJobState(queuedJob.id, "running", {
        startedAt: new Date().toISOString(),
      });

      const result = discoveryEngine.execute(runningJob);
      await upsertDevices(result.devices);
      await setTopology(result.topology);

      const completedJob = await updateDiscoveryJobState(runningJob.id, "completed", {
        finishedAt: new Date().toISOString(),
        summary: result.summary,
      });

      return { data: completedJob };
    }
  );

  app.get(
    "/discovery/jobs",
    {
      preHandler: [requirePermission("discovery.read")],
    },
    async (request) => {
      const auth = resolveAuthContext(request);
      const jobs = await listDiscoveryJobsByTenant(auth.user.tenantId);
      return { data: jobs };
    }
  );
}