import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'alifaraz22566@gmail.com' },
    include: {
      wallet: true,
      tokenHoldings: true,
      tokenPurchases: { orderBy: { createdAt: 'desc' }, take: 5 }
    }
  });
  
  if (user) {
    console.log('=== User Info ===');
    console.log('Email:', user.email);
    console.log('User ID:', user.userId);
    console.log('');
    console.log('=== Wallet ===');
    console.log('Balance (kobo):', user.wallet?.balance);
    console.log('Balance (NGN): ₦' + (user.wallet ? (Number(user.wallet.balance) / 100).toLocaleString() : 0));
    console.log('');
    console.log('=== Token Holdings ===');
    user.tokenHoldings.forEach(h => {
      console.log(`${h.tokenId}: ${h.quantity} tokens`);
    });
    console.log('');
    console.log('=== Recent Purchases ===');
    user.tokenPurchases.forEach(p => {
      console.log(`- ${p.createdAt.toISOString()}: ${p.tokensReceived} tokens for ₦${p.nairaAmountSpent}`);
    });
  } else {
    console.log('User not found');
  }
  
  await prisma.$disconnect();
}

main();
