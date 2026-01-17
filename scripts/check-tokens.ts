import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      symbol: true,
      name: true,
      price: true,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('=== Tokens in Database ===');
  console.log(`Total: ${tokens.length} tokens\n`);
  
  tokens.forEach((token, i) => {
    console.log(`${i + 1}. ${token.symbol} - ${token.name}`);
    console.log(`   Price: ₦${token.price / 100}`);
    console.log(`   Active: ${token.isActive}`);
    console.log(`   ID: ${token.id}\n`);
  });
  
  await prisma.$disconnect();
}

main();
