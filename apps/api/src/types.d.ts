export {};

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      tenantId: string;
      email: string;
      displayName: string;
      role: "platform_admin" | "network_admin" | "operator" | "auditor";
    };
  }
}