import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying user passwords...');
  
  const testPassword = 'password123';
  
  const user = await prisma.user.findUnique({
    where: { emailAddress: 'admin@pharmacy.com' },
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log(`\n📋 User Info:`);
  console.log(`   Email: ${user.emailAddress}`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Password hash: ${user.password}`);
  console.log(`   Hash length: ${user.password.length}`);
  console.log(`   Email verified: ${user.emailVerifiedAt ? 'Yes' : 'No'}`);

  console.log(`\n🔐 Testing password comparison:`);
  console.log(`   Test password: "${testPassword}"`);
  console.log(`   Test password length: ${testPassword.length}`);
  
  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log(`   Comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

  // Test with a fresh hash
  console.log(`\n🧪 Creating fresh hash for comparison:`);
  const freshHash = await bcrypt.hash(testPassword, 10);
  console.log(`   Fresh hash: ${freshHash}`);
  const freshCompare = await bcrypt.compare(testPassword, freshHash);
  console.log(`   Fresh hash comparison: ${freshCompare ? '✅ VALID' : '❌ INVALID'}`);

  // Try to update with a fresh hash
  if (!isValid) {
    console.log(`\n🔄 Updating password with fresh hash...`);
    const newHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });
    console.log(`   ✅ Password updated`);
    
    // Verify again
    const updatedUser = await prisma.user.findUnique({
      where: { emailAddress: 'admin@pharmacy.com' },
    });
    const verifyAfterUpdate = await bcrypt.compare(testPassword, updatedUser!.password);
    console.log(`   Verification after update: ${verifyAfterUpdate ? '✅ VALID' : '❌ INVALID'}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

