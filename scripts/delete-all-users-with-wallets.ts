import { prisma } from '../src/lib/prisma'

async function deleteAllUsersWithWallets() {
  try {
    console.log('Starting deletion of all users and their related data...');

    // Get count before deletion
    const userCount = await prisma.user.count();
    const walletCount = await prisma.wallet.count();
    
    console.log(`Found ${userCount} users and ${walletCount} wallets`);

    if (userCount === 0) {
      console.log('No users found in database');
      return;
    }

    console.log('\nDeleting related records...');

    // Delete all related records first (due to foreign key constraints)
    
    // Delete all wallets
    const deletedWallets = await prisma.wallet.deleteMany({});
    console.log(`✅ Deleted ${deletedWallets.count} wallets`);

    // Delete all OAuth accounts
    const deletedAccounts = await prisma.account.deleteMany({});
    console.log(`✅ Deleted ${deletedAccounts.count} OAuth accounts`);

    // Delete all token purchases
    const deletedPurchases = await prisma.tokenPurchase.deleteMany({});
    console.log(`✅ Deleted ${deletedPurchases.count} token purchases`);

    // Delete all token holdings
    const deletedHoldings = await prisma.tokenHolding.deleteMany({});
    console.log(`✅ Deleted ${deletedHoldings.count} token holdings`);

    // Delete all bank accounts
    const deletedBankAccounts = await prisma.bankAccount.deleteMany({});
    console.log(`✅ Deleted ${deletedBankAccounts.count} bank accounts`);

    // Delete all notifications
    const deletedNotifications = await prisma.notification.deleteMany({});
    console.log(`✅ Deleted ${deletedNotifications.count} notifications`);

    // Delete all price alerts
    const deletedPriceAlerts = await prisma.priceAlert.deleteMany({});
    console.log(`✅ Deleted ${deletedPriceAlerts.count} price alerts`);

    // Delete all user settings
    const deletedSettings = await prisma.userSettings.deleteMany({});
    console.log(`✅ Deleted ${deletedSettings.count} user settings`);

    // Finally, delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`\n✅ Deleted ${deletedUsers.count} users`);

    console.log('\n✅ Successfully deleted all users and their related data');
  } catch (error) {
    console.error('❌ Error deleting users and related data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsersWithWallets();
