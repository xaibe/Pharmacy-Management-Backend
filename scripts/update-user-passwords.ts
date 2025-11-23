import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Updating user passwords...');
  
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const users = await prisma.user.findMany({
    where: {
      emailAddress: {
        in: ['admin@pharmacy.com', 'pharmacist@pharmacy.com', 'cashier@pharmacy.com'],
      },
    },
  });

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerifiedAt: new Date(),
      },
    });
    console.log(`✅ Updated password for ${user.emailAddress}`);
  }

  // Create users if they don't exist
  const existingEmails = users.map(u => u.emailAddress);
  
  if (!existingEmails.includes('admin@pharmacy.com')) {
    await prisma.user.create({
      data: {
        username: 'admin',
        emailAddress: 'admin@pharmacy.com',
        password: hashedPassword,
        roles: 'Admin',
        dateOfBirth: new Date('1990-01-01'),
        emailVerifiedAt: new Date(),
      },
    });
    console.log('✅ Created admin user');
  }

  if (!existingEmails.includes('pharmacist@pharmacy.com')) {
    await prisma.user.create({
      data: {
        username: 'pharmacist',
        emailAddress: 'pharmacist@pharmacy.com',
        password: hashedPassword,
        roles: 'Pharmacist',
        dateOfBirth: new Date('1992-05-15'),
        emailVerifiedAt: new Date(),
      },
    });
    console.log('✅ Created pharmacist user');
  }

  if (!existingEmails.includes('cashier@pharmacy.com')) {
    await prisma.user.create({
      data: {
        username: 'cashier',
        emailAddress: 'cashier@pharmacy.com',
        password: hashedPassword,
        roles: 'Cashier',
        dateOfBirth: new Date('1995-08-20'),
        emailVerifiedAt: new Date(),
      },
    });
    console.log('✅ Created cashier user');
  }

  console.log('✨ Password update complete!');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@pharmacy.com / password123');
  console.log('   Pharmacist: pharmacist@pharmacy.com / password123');
  console.log('   Cashier: cashier@pharmacy.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error updating passwords:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

