/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.college.findMany()
  .then(c => console.log('Colleges in DB:', c.length))
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());