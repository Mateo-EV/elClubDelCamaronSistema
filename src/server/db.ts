import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

async function initializeDatabase() {
  await db.$executeRawUnsafe(
    `SET SESSION sql_mode = CONCAT(@@SESSION.sql_mode, ',ONLY_FULL_GROUP_BY')`,
  );
}
initializeDatabase().catch((error) => {
  console.error("Error configuring sql_mode:", error);
});
