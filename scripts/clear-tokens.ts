import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all tokens from database...\n');
  
  const result = await prisma.token.deleteMany({});
  
  console.log(`✅ Deleted ${result.count} tokens`);
  console.log('\nDatabase is now empty. Add new tokens via:');
  console.log('- Admin dashboard: /admin/tokens');
  console.log('- Or API: POST /api/admin/tokens');
  
  await prisma.$disconnect();
}

main().catch(console.error);
