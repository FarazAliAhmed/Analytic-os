/**
 * Script to find admin users
 * 
 * Usage:
 *   npx tsx scripts/find-admin.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findAdminUsers() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, username: true, role: true, createdAt: true }
    });

    if (admins.length === 0) {
      console.log('No admin users found.');
      console.log('\nTo create an admin, first register a user then run:');
      console.log('  npx tsx scripts/set-admin-user.ts <email>');
    } else {
      console.log('Admin users found:\n');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error finding admin users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

findAdminUsers();
