import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// Added CA_PEM for SSL
const adapter = new PrismaPg({
  connectionString: connectionString,
  connectionTimeoutMillis: 30000,
  ssl: {
    ca: process.env.CA_PEM,
    rejectUnauthorized: true,
  },
});
const prisma = new PrismaClient({ adapter });

export { prisma };
