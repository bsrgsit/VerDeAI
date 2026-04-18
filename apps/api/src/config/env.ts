export const env = {
  port: Number(process.env.PORT ?? 8080),
  host: process.env.HOST ?? "0.0.0.0",
  jwtSecret: process.env.JWT_SECRET ?? "verdeai-dev-secret",
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/verdeai",
  mongoDbName: process.env.MONGO_DB_NAME ?? "verdeai",
};