import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { findUserByEmail } from "../lib/store.js";

const loginSchema = z.object({
  email: z.string().email(),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/login", async (request, reply) => {
    const parse = loginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.code(400).send({ error: parse.error.issues });
    }

    const user = await findUserByEmail(parse.data.email);
    if (!user) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = await reply.jwtSign(user, { expiresIn: "12h" });
    return {
      data: {
        token,
        user,
      },
    };
  });
}