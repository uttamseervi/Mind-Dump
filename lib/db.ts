import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.cachedPrisma;
}

// Test the database connection on startup
prisma.$connect().catch((error) => {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
});

console.log('✅ Database connection established');

export const db = prisma;