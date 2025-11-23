# Inventory Batch Management System

## Overview

The Pharmacy Management System supports comprehensive batch tracking for inventory items. This allows you to manage multiple batches of the same product with different batch numbers, expiry dates, purchase dates, and suppliers, while maintaining a single product entry in the inventory.

## Key Features

### Multiple Batches per Product
- **Single Product Entry**: Each product has one inventory entry, regardless of how many batches it has
- **Multiple Batches**: A product can have multiple batches with:
  - Different batch numbers
  - Different expiry dates
  - Different purchase dates
  - Different suppliers (optional)
- **Automatic Stock Calculation**: Total stock is automatically calculated as the sum of all batch quantities

### Batch Information
Each batch tracks:
- **Batch Number**: Unique identifier for the batch (unique per product)
- **Quantity**: Number of units in this batch
- **Expiry Date**: When this batch expires
- **Purchase Date**: When this batch was purchased (optional)
- **Supplier**: Supplier for this batch (optional, defaults to product's main supplier)

## API Endpoints

### Add New Batch to Existing Product
```
POST /inventory/:id/batch
```

**Request Body:**
```json
{
  "batchNumber": "BATCH-2025-001",
  "quantity": 100,
  "expiryDate": "2025-12-31",
  "purchaseDate": "2025-01-15",  // Optional
  "supplierId": 2                 // Optional, defaults to product's supplier
}
```

**Response:**
Returns the updated inventory item with all batches included.

### Create New Product (with Initial Batch)
```
POST /inventory
```

When creating a new product, if you provide `stock` and `expiryDate`, the system automatically creates an initial batch.

**Request Body:**
```json
{
  "name": "Paracetamol 500mg",
  "type": "Medicine",
  "categoryId": 1,
  "supplierId": 1,
  "stock": 50,
  "expiryDate": "2025-12-31",
  "batchNumber": "BATCH-001",  // Optional, auto-generated if not provided
  // ... other product fields
}
```

### Get Inventory (with Batches)
```
GET /inventory
GET /inventory/:id
```

Both endpoints return inventory items with their associated batches:
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "stock": 150,  // Total stock (sum of all batches)
  "stockBatches": [
    {
      "id": 1,
      "batchNumber": "BATCH-001",
      "quantity": 50,
      "expiryDate": "2025-11-30"
    },
    {
      "id": 2,
      "batchNumber": "BATCH-002",
      "quantity": 100,
      "expiryDate": "2025-12-31"
    }
  ]
}
```

## Usage Workflow

### Scenario: Purchasing Same Product Multiple Times

**Day 1 - Initial Purchase:**
1. Create new product using `POST /inventory`
2. Provide initial stock (e.g., 100 units) and expiry date
3. System creates product and initial batch

**Day 7 - Second Purchase:**
1. Find existing product in inventory
2. Use `POST /inventory/:id/batch` to add new batch
3. Provide new batch number, quantity (e.g., 50 units), expiry date
4. System adds batch and updates total stock to 150

**Day 10 - Third Purchase:**
1. Use `POST /inventory/:id/batch` again
2. Add another batch with different batch number and expiry
3. Total stock automatically increases

**Day 12 - Purchase from Different Supplier:**
1. Use `POST /inventory/:id/batch`
2. Provide `supplierId` for the new supplier
3. System tracks that this batch came from a different supplier

### Important Notes

1. **Use "Add Product" Only for New Products**: 
   - If you use "Add Product" for an existing product, it will create a duplicate entry
   - Always use "Add Stock/Batch" for existing products

2. **Stock Updates**:
   - When you add a batch, total stock is automatically recalculated
   - Stock displayed in inventory list = sum of all batch quantities

3. **Sales Processing**:
   - Sales automatically use FIFO (First In First Out) / FEFO (First Expired First Out) logic
   - Stock is deducted from the oldest/expiring batches first

4. **Batch Uniqueness**:
   - Batch numbers must be unique per product
   - If you add a batch with an existing batch number, the quantity is added to that batch

## Frontend Usage

### Adding a New Batch

1. Navigate to Inventory page
2. Find the product you want to add stock to
3. Click the cyan "Add Stock/Batch" button (plus circle icon)
4. Fill in the form:
   - Batch Number (required)
   - Quantity (required)
   - Expiry Date (required)
   - Purchase Date (optional)
   - Supplier (optional - defaults to current supplier)
5. Click "Add Batch"
6. Total stock is automatically updated

### Viewing Batch Information

- Batch information is displayed in the inventory table
- Shows up to 2 batches with batch number, quantity, and expiry date
- Color coding:
  - Red: Expired batches
  - Amber: Expiring within 30 days
  - Green: Valid batches
- Total stock shows the sum from all batches

## Database Schema

### StockBatch Model
```prisma
model StockBatch {
  id          Int       @id @default(autoincrement())
  inventory   Inventory @relation(fields: [inventoryId], references: [id])
  inventoryId Int
  batchNumber String
  quantity    Int
  expiryDate  DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@unique([inventoryId, batchNumber])
}
```

### Inventory Model (Relevant Fields)
```prisma
model Inventory {
  id             Int            @id @default(autoincrement())
  name           String
  stock          Int            // Total stock (sum of all batches)
  stockBatches   StockBatch[]   // All batches for this product
  // ... other fields
}
```

## Benefits

1. **No Duplicate Products**: Same product purchased multiple times doesn't create duplicate entries
2. **Complete Traceability**: Track which batch was purchased when, from which supplier
3. **Accurate Stock Management**: Total stock always matches sum of batches
4. **Expiry Management**: Easy to identify which batches are expiring soon
5. **Audit Trail**: Complete history of purchases with dates and suppliers
6. **FIFO/FEFO Compliance**: Automatic oldest/expiring batch selection for sales

## Examples

### Example 1: Same Product, Multiple Batches, Same Supplier
```
Product: Paracetamol 500mg
- Batch 1: BATCH-001, 100 units, Expires: 2025-11-30, Purchased: 2025-01-01
- Batch 2: BATCH-002, 50 units, Expires: 2025-12-31, Purchased: 2025-01-07
- Batch 3: BATCH-003, 75 units, Expires: 2026-01-15, Purchased: 2025-01-10

Total Stock: 225 units
```

### Example 2: Same Product, Multiple Batches, Different Suppliers
```
Product: Ibuprofen 400mg
- Batch 1: BATCH-A, 100 units, Supplier: PharmaCorp, Expires: 2025-12-31
- Batch 2: BATCH-B, 50 units, Supplier: MedSupply, Expires: 2026-01-15

Total Stock: 150 units
Main Supplier: PharmaCorp (first supplier)
```

## Troubleshooting

### Issue: Stock doesn't match batches
**Solution**: The system automatically recalculates stock from batches when fetching inventory. If there's a mismatch, it will be corrected automatically.

### Issue: Can't add batch with same batch number
**Solution**: If a batch number already exists for a product, the quantity is added to that existing batch instead of creating a new one.

### Issue: Want to track different suppliers
**Solution**: Provide `supplierId` when adding a batch. The system will track which batch came from which supplier.

## Related Features

- **Sales Processing**: Automatically uses FIFO/FEFO to select batches
- **Expiry Alerts**: Alerts based on batch expiry dates
- **Low Stock Alerts**: Based on total stock (sum of batches)
- **Reports**: Batch-level reporting for expiry and stock tracking

