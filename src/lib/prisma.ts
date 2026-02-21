import { PrismaClient } from '@prisma/client';

// This is a "singleton" pattern. It prevents your app from creating too many
// database connections, which is a common problem in development.
// This is the professional, recommended way to use Prisma with Next.js.

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // You can remove the 'log' option in production
    // log: ['query'], 
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;