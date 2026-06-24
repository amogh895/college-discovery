import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Strip sslmode from connection string to avoid pg warning,
  // and configure SSL via Pool options instead
  let connStr = (process.env.DATABASE_URL || "").trim();
  if ((connStr.startsWith('"') && connStr.endsWith('"')) || (connStr.startsWith("'") && connStr.endsWith("'"))) {
    connStr = connStr.slice(1, -1).trim();
  }
  connStr = connStr.replace(/[?&]sslmode=[^&]*/g, "");
  
  const pool = new Pool({
    connectionString: connStr,
    ssl: { rejectUnauthorized: true },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
