import { PrismaClient, Role, Type, CustomerType, OrderStatus, ExpenseType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { pakistaniMedicines } from './medicine-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  // Delete in order to respect foreign key constraints
  await prisma.returnedItem.deleteMany();
  await prisma.return.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.demand.deleteMany();
  await prisma.stockBatch.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.errorLog.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      emailAddress: 'admin@pharmacy.com',
      password: hashedPassword,
      roles: Role.Admin,
      dateOfBirth: new Date('1990-01-01'),
      emailVerifiedAt: new Date(), // Set email as verified so user can login immediately
    },
  });

  const pharmacist = await prisma.user.create({
    data: {
      username: 'pharmacist',
      emailAddress: 'pharmacist@pharmacy.com',
      password: hashedPassword,
      roles: Role.Pharmacist,
      dateOfBirth: new Date('1992-05-15'),
      emailVerifiedAt: new Date(), // Set email as verified so user can login immediately
    },
  });

  const cashier = await prisma.user.create({
    data: {
      username: 'cashier',
      emailAddress: 'cashier@pharmacy.com',
      password: hashedPassword,
      roles: Role.Cashier,
      dateOfBirth: new Date('1995-08-20'),
      emailVerifiedAt: new Date(), // Set email as verified so user can login immediately
    },
  });

  // Create Categories
  console.log('📦 Creating categories...');
  const medicineCategory = await prisma.category.create({
    data: { name: 'Medicine' },
  });

  const foodCategory = await prisma.category.create({
    data: { name: 'Food & Supplements' },
  });

  const cosmeticCategory = await prisma.category.create({
    data: { name: 'Cosmetics' },
  });

  const otherCategory = await prisma.category.create({
    data: { name: 'Other' },
  });

  // Create Suppliers
  console.log('🏢 Creating suppliers...');
  const supplierMap = new Map<string, any>();
  
  const supplier1 = await prisma.supplier.create({
    data: {
      supplierName: 'John Smith',
      number: '+1234567890',
      companyName: 'PharmaCorp Ltd.',
      address: '123 Medical Street, City, State 12345',
    },
  });
  supplierMap.set('PharmaCorp Ltd.', supplier1);

  const supplier2 = await prisma.supplier.create({
    data: {
      supplierName: 'Sarah Johnson',
      number: '+1987654321',
      companyName: 'MedSupply Inc.',
      address: '456 Health Avenue, City, State 54321',
    },
  });
  supplierMap.set('MedSupply Inc.', supplier2);

  const supplier3 = await prisma.supplier.create({
    data: {
      supplierName: 'Michael Brown',
      number: '+1555555555',
      companyName: 'Global Pharmaceuticals',
      address: '789 Wellness Road, City, State 67890',
    },
  });
  supplierMap.set('Global Pharmaceuticals', supplier3);

  // Get unique suppliers from medicine data and create them
  const uniqueSuppliers = Array.from(new Set(pakistaniMedicines.map(m => m.supplierName)));
  for (const supplierName of uniqueSuppliers) {
    if (!supplierMap.has(supplierName)) {
      const supplier = await prisma.supplier.create({
        data: {
          supplierName: supplierName.split(' ')[0] + ' Contact',
          number: `+92${Math.floor(Math.random() * 1000000000)}`,
          companyName: supplierName,
          address: `${supplierName} Headquarters, Pakistan`,
        },
      });
      supplierMap.set(supplierName, supplier);
    }
  }

  // Create Customers
  console.log('👥 Creating customers...');
  const customer1 = await prisma.customer.create({
    data: {
      name: 'ABC Wholesale',
      email: 'contact@abcwholesale.com',
      phoneNumber: '+1111111111',
      address: '100 Business Park, City, State 11111',
      customerType: CustomerType.Wholesale,
      defaultDiscount: 10.0,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'XYZ Medical Supplies',
      email: 'info@xyzmedical.com',
      phoneNumber: '+1222222222',
      address: '200 Commerce Drive, City, State 22222',
      customerType: CustomerType.Wholesale,
      defaultDiscount: 15.0,
    },
  });

  const walkInCustomer = await prisma.customer.create({
    data: {
      name: 'Walk-in Customer',
      email: 'walkin@pharmacy.com',
      phoneNumber: '+1999999999',
      address: 'Store Location',
      customerType: CustomerType.Wholesale,
      defaultDiscount: 0.0,
    },
  });

  // Create Inventory Items from Medicine Data
  console.log('💊 Creating inventory items from Pakistani medicine database...');
  const createdBaseProducts = new Map<string, any>();
  const createdInventory: any[] = []; // Array to store all created inventory items
  
  for (const medicine of pakistaniMedicines) {
    // Get or create category
    let category = await prisma.category.findFirst({
      where: { name: medicine.categoryName },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: medicine.categoryName },
      });
    }

    // Get supplier
    const supplier = supplierMap.get(medicine.supplierName) || supplier1;

    // Create base product (first variant or a representative product)
    const firstVariant = medicine.variants[0];
    const baseProductName = `${medicine.name} ${firstVariant.strength} ${firstVariant.variantForm}`;
    
    const baseProduct = await prisma.inventory.create({
      data: {
        name: baseProductName,
        formula: medicine.formula,
        type: medicine.type,
        categoryId: category.id,
        supplierId: supplier.id,
        rackLocation: firstVariant.rackLocation,
        wholeSalePrice: firstVariant.wholeSalePrice,
        retailPrice: firstVariant.retailPrice,
        stock: firstVariant.stock,
        expiryDate: firstVariant.expiryDate,
        genericName: medicine.genericName,
        brandName: medicine.brandName,
        manufacturer: medicine.manufacturer,
        dosageForm: medicine.dosageForm,
        strength: firstVariant.strength,
        variantForm: firstVariant.variantForm,
        packagingUnit: firstVariant.packagingUnit,
        unitsPerPackage: firstVariant.unitsPerPackage,
        indications: medicine.indications,
        contraindications: medicine.contraindications,
        sideEffects: medicine.sideEffects,
        storage: medicine.storage,
        value: firstVariant.wholeSalePrice * firstVariant.stock,
      },
    });

    // Create stock batch for base product
    await prisma.stockBatch.create({
      data: {
        inventoryId: baseProduct.id,
        batchNumber: `BATCH-${baseProduct.id}-001`,
        quantity: firstVariant.stock,
        expiryDate: firstVariant.expiryDate,
      },
    });

    createdBaseProducts.set(medicine.name, baseProduct);
    createdInventory.push(baseProduct);

    // Create variants (skip first one as it's the base)
    for (let i = 1; i < medicine.variants.length; i++) {
      const variant = medicine.variants[i];
      const variantName = `${medicine.name} ${variant.strength} ${variant.variantForm}`;
      
      const variantProduct = await prisma.inventory.create({
        data: {
          name: variantName,
          formula: medicine.formula,
          type: medicine.type,
          categoryId: category.id,
          supplierId: supplier.id,
          rackLocation: variant.rackLocation,
          wholeSalePrice: variant.wholeSalePrice,
          retailPrice: variant.retailPrice,
          stock: variant.stock,
          expiryDate: variant.expiryDate,
          genericName: medicine.genericName,
          brandName: medicine.brandName,
          manufacturer: medicine.manufacturer,
          dosageForm: medicine.dosageForm,
          strength: variant.strength,
          variantForm: variant.variantForm,
          packagingUnit: variant.packagingUnit,
          unitsPerPackage: variant.unitsPerPackage,
          baseProductId: baseProduct.id, // Link to base product
          indications: medicine.indications,
          contraindications: medicine.contraindications,
          sideEffects: medicine.sideEffects,
          storage: medicine.storage,
          value: variant.wholeSalePrice * variant.stock,
        },
      });

      // Create stock batch for variant
      await prisma.stockBatch.create({
        data: {
          inventoryId: variantProduct.id,
          batchNumber: `BATCH-${variantProduct.id}-001`,
          quantity: variant.stock,
          expiryDate: variant.expiryDate,
        },
      });
      
      createdInventory.push(variantProduct);
    }

    console.log(`   ✓ Created ${medicine.name} with ${medicine.variants.length} variant(s)`);
  }

  console.log(`✅ Created ${createdBaseProducts.size} base products with variants`);

  // Create Purchase Orders
  console.log('📋 Creating purchase orders...');
  const purchaseOrder1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier1.id,
      orderDate: new Date('2024-01-15'),
      status: OrderStatus.Delivered,
      totalAmount: 2500.00,
    },
  });

  const purchaseOrder2 = await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier2.id,
      orderDate: new Date('2024-02-20'),
      status: OrderStatus.Shipped,
      totalAmount: 1800.00,
    },
  });

  // Create Bills
  console.log('🧾 Creating bills...');
  await prisma.bill.create({
    data: {
      name: 'Paracetamol 500mg',
      formula: 'Paracetamol',
      type: Type.Medicine,
      supplierId: supplier1.id,
      quantity: 100,
      total: 500,
    },
  });

  await prisma.bill.create({
    data: {
      name: 'Ibuprofen 400mg',
      formula: 'Ibuprofen',
      type: Type.Medicine,
      supplierId: supplier1.id,
      quantity: 50,
      total: 300,
    },
  });

  // Create Invoices and Sales
  console.log('💰 Creating invoices and sales...');
  const invoice1 = await prisma.invoice.create({
    data: {
      number: 'INV-2024-0001',
      date: new Date('2024-03-01'),
      customerId: customer1.id,
      totalAmount: 160.00,
      discount: 16.00,
      status: 'paid',
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      number: 'INV-2024-0002',
      date: new Date('2024-03-05'),
      customerId: customer2.id,
      totalAmount: 240.00,
      discount: 36.00,
      status: 'paid',
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      number: 'INV-2024-0003',
      date: new Date('2024-03-10'),
      customerId: walkInCustomer.id,
      totalAmount: 80.00,
      discount: 0.00,
      status: 'paid',
    },
  });

  // Create Sales
  const sale1 = await prisma.sale.create({
    data: {
      name: 'Paracetamol 500mg',
      formula: 'Paracetamol',
      type: Type.Medicine,
      quantity: 20,
      price: 8.00,
      totalAmount: 160.00,
      discount: 16.00,
      replace: false,
      userId: cashier.id,
      customerId: customer1.id,
      invoiceId: invoice1.id,
      inventoryId: createdInventory[0].id,
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      name: 'Ibuprofen 400mg',
      formula: 'Ibuprofen',
      type: Type.Medicine,
      quantity: 15,
      price: 10.00,
      totalAmount: 150.00,
      discount: 15.00,
      replace: false,
      userId: cashier.id,
      customerId: customer2.id,
      invoiceId: invoice2.id,
      inventoryId: createdInventory[1].id,
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      name: 'Amoxicillin 250mg',
      formula: 'Amoxicillin',
      type: Type.Medicine,
      quantity: 10,
      price: 20.00,
      totalAmount: 200.00,
      discount: 20.00,
      replace: false,
      userId: cashier.id,
      customerId: customer2.id,
      invoiceId: invoice2.id,
      inventoryId: createdInventory[2].id,
    },
  });

  const sale4 = await prisma.sale.create({
    data: {
      name: 'Paracetamol 500mg',
      formula: 'Paracetamol',
      type: Type.Medicine,
      quantity: 10,
      price: 8.00,
      totalAmount: 80.00,
      discount: 0.00,
      replace: false,
      userId: cashier.id,
      customerId: walkInCustomer.id,
      invoiceId: invoice3.id,
      inventoryId: createdInventory[0].id,
    },
  });

  // Create Returns
  console.log('↩️ Creating returns...');
  const return1 = await prisma.return.create({
    data: {
      saleId: sale1.id,
      invoiceId: invoice1.id,
      reason: 'Defective product',
      status: 'approved',
      totalRefundAmount: 16.00,
    },
  });

  await prisma.returnedItem.create({
    data: {
      returnId: return1.id,
      inventoryId: createdInventory[0].id,
      quantity: 2,
    },
  });

  // Create Expenses
  console.log('💸 Creating expenses...');
  await prisma.expense.create({
    data: {
      description: 'Office supplies',
      amount: 150.00,
      date: new Date('2024-03-01'),
      expenseType: ExpenseType.OPERATIONAL,
    },
  });

  await prisma.expense.create({
    data: {
      description: 'Equipment maintenance',
      amount: 500.00,
      date: new Date('2024-03-05'),
      expenseType: ExpenseType.MAINTENANCE,
    },
  });

  await prisma.expense.create({
    data: {
      description: 'Utilities',
      amount: 300.00,
      date: new Date('2024-03-10'),
      expenseType: ExpenseType.OPERATIONAL,
    },
  });

  // Create Demands
  console.log('📝 Creating demands...');
  await prisma.demand.create({
    data: {
      name: 'Aspirin 100mg',
      formula: 'Acetylsalicylic Acid',
      type: Type.Medicine,
      quantity: 50,
      bought: false,
      userId: pharmacist.id,
      inventoryId: createdInventory[0].id, // Using existing inventory for reference
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 3 (Admin, Pharmacist, Cashier)`);
  console.log(`   - Categories: 4`);
  console.log(`   - Suppliers: 3`);
  console.log(`   - Customers: 3`);
  console.log(`   - Inventory Items: ${createdInventory.length}`);
  console.log(`   - Purchase Orders: 2`);
  console.log(`   - Bills: 2`);
  console.log(`   - Invoices: 3`);
  console.log(`   - Sales: 4`);
  console.log(`   - Returns: 1`);
  console.log(`   - Expenses: 3`);
  console.log(`   - Demands: 1`);
  console.log('\n🔑 Default login credentials:');
  console.log('   Admin: admin@pharmacy.com / password123');
  console.log('   Pharmacist: pharmacist@pharmacy.com / password123');
  console.log('   Cashier: cashier@pharmacy.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
