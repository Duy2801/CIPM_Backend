import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedTeamDirectory } from './seed-team-directory.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

try {
  const result = await seedTeamDirectory(prisma);
  console.log(result);
} finally {
  await prisma.$disconnect();
}
