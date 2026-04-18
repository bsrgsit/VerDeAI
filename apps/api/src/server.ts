import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";
import { discoveryRoutes } from "./routes/discovery.routes.js";
import { devicesRoutes } from "./routes/devices.routes.js";
import { topologyRoutes } from "./routes/topology.routes.js";
import { rbacRoutes } from "./routes/rbac.routes.js";
import { usersRoutes } from "./routes/users.routes.js";
import { strategyRoutes } from "./routes/strategy.routes.js";
import { BRAND } from "@verdeai/shared";
import { connectMongo } from "./lib/mongo.js";
import { seedUsersIfMissing } from "./lib/store.js";

async function buildServer() {
  const app = Fastify({ logger: true });

  await connectMongo();
  await seedUsersIfMissing();

  await app.register(cors, { origin: true });
  await app.register(jwt, { secret: env.jwtSecret });

  app.get("/health", async () => ({
    status: "ok",
    service: "verdeai-api",
    brand: BRAND,
    persistence: "mongodb",
  }));

  await authRoutes(app);
  await discoveryRoutes(app);
  await devicesRoutes(app);
  await topologyRoutes(app);
  await rbacRoutes(app);
  await usersRoutes(app);
  await strategyRoutes(app);

  return app;
}

const app = await buildServer();

app.listen({ port: env.port, host: env.host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});