/**
 * Script to set a user as admin
 * 
 * Usage:
 *   npx tsx scripts/set-admin-user.ts <email>
 * 
 * Example:
 *   npx tsx scripts/set-admin-user.ts admin@example.com
 * 
 * Alternative (using Prisma directly):
 *   UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdminUser(email: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, role: true }
    });

    if (!user) {
      console.error(`User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.role === 'ADMIN') {
      console.log(`User "${user.email}" is already an admin`);
      process.exit(0);
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, username: true, role: true }
    });

    console.log('Successfully set user as admin:');
    console.log(`  Email: ${updatedUser.email}`);
    console.log(`  Username: ${updatedUser.username}`);
    console.log(`  Role: ${updatedUser.role}`);
  } catch (error) {
    console.error('Error setting admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: npx tsx scripts/set-admin-user.ts <email>');
  process.exit(1);
}

setAdminUser(email);
