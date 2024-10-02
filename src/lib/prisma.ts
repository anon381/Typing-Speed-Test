import { PrismaClient } from '@prisma/client';

// Prevent multiple instances during hot reload in dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function pingDb() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
