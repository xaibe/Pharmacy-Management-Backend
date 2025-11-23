# PHMS — Pharmacy Management System

Version: v1.0 (Initial Release)

Prepared by: Development Team

Date: January 2025

Status: Approved for Development

Distribution: Engineering • Product • Operations • Compliance • Executive

---

## Table of Contents

- [0. Document Control](#0-document-control)
- [1. Overview](#1-overview)
- [2. Objectives](#2-objectives)
- [3. Scope](#3-scope)
- [4. Stakeholders and Roles](#4-stakeholders-and-roles)
- [5. Personas & User Stories](#5-personas--user-stories)
- [6. Core Business Logic](#6-core-business-logic)
- [7. Inventory Management](#7-inventory-management)
- [8. Sales & Invoice Management](#8-sales--invoice-management)
- [9. Purchase & Supplier Management](#9-purchase--supplier-management)
- [10. Customer Management](#10-customer-management)
- [11. Financial Management](#11-financial-management)
- [12. Security & Compliance](#12-security--compliance)
- [13. Data Model Overview](#13-data-model-overview)
- [14. API Surface and Contracts](#14-api-surface-and-contracts)
- [15. Reporting & Analytics](#15-reporting--analytics)
- [16. Audit & Governance](#16-audit--governance)
- [17. Non-Functional Requirements](#17-non-functional-requirements)
- [18. Deployment Architecture](#18-deployment-architecture)
- [19. Configuration & Feature Flags](#19-configuration--feature-flags)
- [20. Testing & UAT](#20-testing--uat)
- [21. Risks & Mitigations](#21-risks--mitigations)
- [22. Success Metrics & KPIs](#22-success-metrics--kpis)
- [23. Glossary](#23-glossary)
- [24. Appendices](#24-appendices)
- [25. Drug Interaction & Safety Features](#25-drug-interaction--safety-features)
- [26. Regulatory Compliance](#26-regulatory-compliance)
- [27. Advanced Inventory Management](#27-advanced-inventory-management)
- [28. Communication & Notifications](#28-communication--notifications)
- [29. Integration Capabilities](#29-integration-capabilities)

---

## 0. Document Control

- Document Type: Product Requirements Document (PRD)
- Product Name: PHMS — Pharmacy Management System
- Version: v1.0 (Initial Release)
- Prepared By: Development Team
- Status: Approved for Development
- Distribution: Engineering • Product • Operations • Compliance • Executive

### Revision History

| Version | Date       | Author | Change Summary                                    |
| ------: | ---------- | ------ | ------------------------------------------------- |
|   v1.0  | 2025-01-XX | Team   | Initial PRD with core pharmacy management features |

---

## 1. Overview

The Pharmacy Management System (PHMS) is a comprehensive platform for end-to-end pharmacy operations management—from inventory tracking and batch management to sales processing, invoice generation, customer management, supplier relations, expense tracking, and comprehensive reporting. The system supports multiple user roles with role-based access control, ensuring secure and efficient pharmacy operations.

Key principles:

- **Inventory-first model**: All products tracked with batch numbers, expiry dates, and stock levels; automatic alerts for low stock and expiring items.
- **Sales-driven workflow**: Every sale creates an invoice; supports both retail and wholesale customers with configurable discounts.
- **Batch tracking**: Full traceability of medicines by batch number and expiry date for compliance and safety.
- **Role-based access**: Admin, Pharmacist, and Cashier roles with appropriate permissions.
- **Audit-ready**: Immutable logs for all transactions, stock movements, and system actions.

---

## 2. Objectives

| Goal                          | Description                                                  | Metric                                |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| Streamline inventory          | Track all products with batch numbers, expiry dates, stock   | 100% inventory accuracy               |
| Automate sales process        | Quick sales entry, automatic invoice generation              | ≤2 minutes per transaction            |
| Ensure compliance             | Batch tracking, expiry alerts, audit trails                  | 100% traceable transactions           |
| Improve customer service      | Customer profiles, discount management, purchase history      | ≥90% customer satisfaction            |
| Enable data-driven decisions  | Real-time reports, analytics, financial summaries            | Daily operational insights             |
| Reduce manual errors          | Automated calculations, validations, stock updates              | ≤1% error rate                        |

---

## 3. Scope

**In Scope:**

- Inventory management with batch tracking and expiry monitoring
- Sales processing with invoice generation
- Customer management (retail and wholesale)
- Supplier management and purchase orders
- Bill management for supplier purchases
- Expense tracking and categorization
- Returns and refunds processing
- Comprehensive reporting (sales, inventory, financial, customers)
- User management with role-based access control
- Category and product organization
- Low stock and expiry alerts
- Dashboard with real-time metrics
- Drug interaction checking and safety features
- Regulatory compliance (FDA tracking, controlled substances, recalls)
- Advanced inventory management (automated reordering, price management, promotions)
- Communication features (SMS/Email notifications, alerts)
- Integration capabilities (barcode scanning, external drug databases)

**Out of Scope (Phase 1):**

- Multi-location inventory management
- Payment gateway integration (manual entry only)
- Mobile app (web-only)
- Prescription management
- Insurance claim processing
- Multi-currency support

---

## 4. Stakeholders and Roles

| Role       | Responsibilities                                        | Critical Permissions (Examples)                         |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------- |
| Admin      | Full system access, user management, configuration      | Manage users, categories, suppliers; view all reports   |
| Pharmacist | Inventory management, product entry, supplier relations  | Manage inventory, products, suppliers, purchase orders  |
| Cashier    | Sales processing, customer management, invoice creation | Create sales, manage customers, generate invoices         |

**RACI Matrix (Abbreviated):**

| Activity              | Admin | Pharmacist | Cashier |
| --------------------- | ----- | ---------- | ------- |
| User management       | R     | I          | I       |
| Inventory management  | C     | R          | I       |
| Sales processing      | C     | C          | R       |
| Supplier management   | C     | R          | I       |
| Report generation     | R     | R          | I       |
| System configuration  | R     | I          | I       |

---

## 5. Personas & User Stories

**Personas:**

- **Pharmacist**: Needs to manage inventory, track batches, monitor expiry dates, and maintain supplier relationships.
- **Cashier**: Needs fast sales processing, customer lookup, invoice generation, and payment recording.
- **Admin**: Needs comprehensive oversight, user management, reporting, and system configuration.

**Sample User Stories:**

- As a Pharmacist, I want to add new products with batch numbers and expiry dates so that I can track inventory accurately.
- As a Cashier, I want to quickly process a sale and generate an invoice so that customers don't wait long.
- As a Pharmacist, I want to see low stock alerts so that I can reorder products before running out.
- As an Admin, I want to view sales reports by date range so that I can analyze business performance.
- As a Cashier, I want to search for products by name or formula so that I can find items quickly.
- As a Pharmacist, I want to track which batches are expiring soon so that I can prioritize sales.

---

## 6. Core Business Logic

### 6.1 Inventory Management Flow

**Product Entry:**
1. Pharmacist enters product details (name, type, category, supplier, prices)
2. Sets initial stock quantity
3. Enters batch number and expiry date (optional for initial creation)
4. System creates initial batch if stock and expiry date are provided
5. Product can have multiple batches with different batch numbers, expiry dates, and suppliers
6. Stock is tracked at batch level, with total stock calculated as sum of all batches

**Adding More Stock to Existing Products:**
1. Pharmacist selects existing product
2. Uses "Add Stock/Batch" feature (not "Add Product" to avoid duplicates)
3. Enters new batch number, quantity, expiry date, purchase date, and optional supplier
4. System creates new batch and automatically updates total stock
5. Product remains single entry with multiple batches tracked separately
6. Each batch maintains its own purchase date and supplier for audit purposes

**Stock Updates:**
- Stock increases: Purchase orders, returns from customers
- Stock decreases: Sales, returns to suppliers, home use products
- Automatic stock calculation based on batch quantities

**Batch Management:**
- Each batch has: batch number, quantity, expiry date, cost price
- FIFO (First In, First Out) for sales when multiple batches exist
- Automatic alerts for batches expiring within configured days

### 6.2 Sales Processing Flow

**Sale Creation:**
1. Cashier selects product from inventory
2. System shows available stock and batch information
3. Cashier enters quantity, applies discount if applicable
4. System calculates total (price × quantity - discount)
5. Sale is linked to invoice (invoice created if not exists)
6. Stock is automatically decremented from oldest batch (FIFO)
7. Invoice total is updated

**Invoice Generation:**
- Invoice created per customer transaction
- Contains: invoice number, date, customer, line items (sales), total amount, discount
- Invoice can have multiple sales items
- Invoice status: Draft → Paid → Completed

### 6.3 Purchase Order Flow

**Purchase Order Creation:**
1. Pharmacist creates purchase order for supplier
2. Selects products and quantities
3. System generates purchase order with status: Pending
4. When supplier delivers, status updated to: Delivered
5. Bill is created linking to purchase order
6. Inventory stock is updated

**Bill Processing:**
- Bill links supplier, products, quantities, total amount
- Bill status: Pending → Paid
- Payment updates supplier balance

### 6.4 Returns Processing

**Customer Returns:**
1. Cashier selects original sale
2. Selects items and quantities to return
3. System validates return against original sale
4. Stock is added back to inventory (new batch or existing)
5. Refund processed (if applicable)
6. Return record created

**Supplier Returns:**
1. Pharmacist selects purchase order or bill
2. Selects items to return
3. Stock is decremented
4. Supplier credit note created

### 6.5 Expense Management

**Expense Entry:**
1. Admin/Pharmacist creates expense entry
2. Categorizes expense (Operational, Maintenance, Home Use Product, Other)
3. Records amount, date, payment method, status
4. Links to receipt number if available
5. Expense tracked for financial reporting

---

## 7. Inventory Management

### 7.1 Product Types

| Type      | Description                    | Examples                          |
| --------- | ------------------------------ | --------------------------------- |
| Medicine  | Pharmaceutical products        | Paracetamol, Amoxicillin          |
| Food      | Food items and supplements     | Vitamins, Supplements             |
| Cosmetic  | Cosmetic products              | Shampoo, Soap                     |
| Other     | Miscellaneous items            | Medical equipment, Accessories    |

### 7.2 Product Attributes

- **Basic Info**: Name, Generic Name, Brand Name, Formula
- **Pricing**: Retail Price, Wholesale Price, Cost Price
- **Organization**: Category, Supplier, Rack Location
- **Medical Info**: Indications, Contraindications, Side Effects, Dosage Form, Strength
- **Storage**: Storage conditions, Manufacturer
- **Tracking**: Stock quantity, Batch information, Expiry dates

### 7.3 Stock Alerts

**Low Stock Alert:**
- Configurable threshold per product
- Alert when stock falls below threshold
- Dashboard notification and report

**Expiry Alert:**
- Configurable days before expiry (e.g., 30 days, 60 days)
- Alert for batches expiring within threshold
- Prioritized list for sales

### 7.4 Batch Tracking

**Batch Information:**
- Batch Number (unique identifier per inventory item)
- Quantity in batch
- Expiry Date
- Purchase Date (optional)
- Supplier Reference (can differ from main product supplier)

**Multiple Batch Management:**
- **Same Product, Multiple Batches**: A single product can have multiple batches with different batch numbers, expiry dates, and purchase dates
- **Stock Calculation**: Total stock for a product is automatically calculated as the sum of all batch quantities
- **Batch Addition**: New batches can be added to existing products without creating duplicate inventory entries
- **Different Suppliers**: Each batch can be associated with a different supplier, allowing tracking of products purchased from multiple suppliers
- **Audit Trail**: Each batch maintains its own purchase date and supplier information for complete traceability

**Batch Operations:**
- **Add New Batch**: Add additional stock to existing products with new batch information
- **Transfer between batches**: Transfer stock between batches
- **Home use product tracking**: Track products taken from specific batches
- **Return to batch**: Return items to specific batches
- **Batch expiry reporting**: Generate reports on batches expiring soon
- **FIFO/FEFO Sales**: Sales automatically use oldest batches first (First In First Out / First Expired First Out)

**Workflow:**
1. **Initial Product Creation**: When creating a new product, an initial batch is created if stock and expiry date are provided
2. **Adding More Stock**: Use "Add Stock/Batch" feature to add new batches to existing products
3. **Stock Updates**: Total stock is automatically recalculated from all batches
4. **Sales Processing**: Sales automatically deduct from batches using FIFO/FEFO logic

### 7.5 Advanced Inventory Features

**Automated Reordering:**
- Configurable reorder points per product
- Automatic purchase order suggestions
- Reorder quantity calculations based on sales history
- Supplier preference for reordering

**Price Management:**
- Cost price tracking
- Retail price management
- Wholesale price management
- Price history and change tracking
- Dynamic pricing rules

**Promotions & Discounts:**
- Product-level promotions
- Category-based discounts
- Time-based promotional pricing
- Customer-specific pricing rules
- Bulk discount configurations

---

## 8. Sales & Invoice Management

### 8.1 Sale Components

**Sale Record:**
- Product name, formula, type
- Quantity sold
- Unit price
- Discount amount
- Total amount
- Customer (optional for walk-in)
- Invoice reference
- User (cashier/pharmacist)
- Inventory batch reference
- Replace flag (for returns/exchanges)

### 8.2 Invoice Structure

**Invoice Fields:**
- Invoice Number (unique, auto-generated)
- Invoice Date
- Customer (or "Walk-in Customer")
- Line Items (sales)
- Subtotal
- Discount
- Total Amount
- Status (Draft, Paid, Completed, Cancelled)
- Created By (user)

### 8.3 Discount Management

**Discount Types:**
- Customer default discount (wholesale customers)
- Per-sale discount override
- Percentage or fixed amount

**Discount Rules:**
- Wholesale customers have default discount percentage
- Can be overridden per transaction
- Discount applied at sale level, aggregated at invoice level

### 8.4 Sales Queries

**Available Filters:**
- Date range
- Customer
- User (cashier/pharmacist)
- Product
- Invoice status

---

## 9. Purchase & Supplier Management

### 9.1 Supplier Information

**Supplier Fields:**
- Supplier Name
- Company Name
- Phone Number
- Address
- Associated Inventory Items
- Purchase History

### 9.2 Purchase Order Lifecycle

**States:**
- Pending → Shipped → Delivered → Completed
- Can be cancelled before delivery

**Purchase Order Contents:**
- Supplier
- Products with quantities
- Expected delivery date
- Status
- Total amount

### 9.3 Bill Management

**Bill Creation:**
- Linked to supplier
- Products and quantities from purchase order
- Total amount
- Payment status
- Payment date

**Bill Payment:**
- Record payment method
- Update payment status
- Link to expense entry (if applicable)

---

## 10. Customer Management

### 10.1 Customer Types

| Type      | Description                    | Features                          |
| --------- | ------------------------------ | --------------------------------- |
| Wholesale | Business customers buying bulk | Default discount, purchase history |

### 10.2 Customer Profile

**Customer Information:**
- Name
- Email
- Phone Number
- Address
- Customer Type
- Default Discount (%)
- Purchase History
- Total Spent
- Last Purchase Date

### 10.3 Customer Analytics

**Available Metrics:**
- Total customers by type
- Top customers by purchase amount
- Customer purchase frequency
- Average order value per customer

---

## 11. Financial Management

### 11.1 Expense Categories

| Category            | Description                          |
| ------------------- | ------------------------------------ |
| HOME_USE_PRODUCT    | Products taken for personal use      |
| OPERATIONAL         | Day-to-day operational expenses      |
| MAINTENANCE         | Equipment and facility maintenance   |
| OTHER               | Miscellaneous expenses               |

### 11.2 Expense Tracking

**Expense Fields:**
- Category
- Amount
- Description
- Date
- Payment Method
- Status (Pending, Paid)
- Receipt Number (optional)
- Notes

### 11.3 Financial Reports

**Report Types:**
- Sales Report (by date range, customer, product)
- Inventory Report (stock levels, low stock, expiring items)
- Financial Report (revenue, expenses, profit/loss)
- Returns Report (customer returns, supplier returns)
- Customer Report (purchase history, top customers)

---

## 12. Security & Compliance

### 12.1 Authentication & Authorization

**Authentication:**
- JWT-based authentication
- Password hashing (bcrypt)
- Email verification (optional)
- Password reset via OTP

**Authorization:**
- Role-based access control (RBAC)
- Route guards for protected endpoints
- Permission checks at API level

### 12.2 Data Security

**Transport Security:**
- HTTPS (TLS 1.2+) only
- CORS configuration for frontend
- Secure headers

**Data Protection:**
- Sensitive data encryption at rest
- Password hashing (never stored in plain text)
- Secure session management

### 12.3 Audit Trail

**Audit Logging:**
- All create, update, delete operations
- User actions (login, logout, password changes)
- Stock movements
- Financial transactions
- System configuration changes

**Audit Log Fields:**
- Timestamp
- User (actor)
- Action
- Entity Type
- Entity ID
- Before/After snapshots (for updates)
- IP Address

### 12.4 Compliance

**Pharmacy Compliance:**
- Batch tracking for medicines
- Expiry date monitoring
- Product traceability
- Inventory accuracy
- Transaction records

### 12.5 Regulatory Compliance

**FDA Tracking:**
- FDA product registration verification
- NDC (National Drug Code) tracking
- Product approval status
- Manufacturer verification

**Controlled Substances:**
- DEA Schedule classification (I-V)
- Controlled substance tracking and reporting
- Prescription requirements for controlled substances
- Controlled substance inventory logs
- Regulatory reporting for controlled substances

**Product Recalls:**
- Recall notification system
- FDA recall database integration
- Product recall alerts
- Recall tracking and compliance
- Customer notification for recalled products

**Regulatory Reporting:**
- Controlled substance transaction logs
- Inventory audit reports
- Compliance audit trails
- Regulatory submission formats

---

## 13. Data Model Overview

### 13.1 Core Entities

**User:**
- id, username, emailAddress, password (hashed), roles, dateOfBirth
- Relationships: Sales, Demands, BatchTransfers, HomeUseProducts

**Inventory:**
- id, name, formula, type, categoryId, supplierId, rackLocation
- wholeSalePrice, retailPrice, stock, genericName, brandName
- manufacturer, dosageForm, strength, storage
- Relationships: Category, Supplier, Sales, StockBatches

**Category:**
- id, name, description, parentId
- Relationships: Inventory, Subcategories

**Supplier:**
- id, supplierName, companyName, number, address
- Relationships: Inventory, Bills

**Customer:**
- id, name, email, phoneNumber, address, customerType, defaultDiscount
- Relationships: Sales, Invoices

**Sale:**
- id, name, formula, type, quantity, price, discount, replace
- userId, customerId, invoiceId, inventoryId, stockBatchId
- Relationships: User, Customer, Invoice, Inventory, StockBatch

**Invoice:**
- id, number, date, totalAmount, discount, customerId
- Relationships: Customer, Sales

**Bill:**
- id, name, formula, type, supplierId, quantity, total
- Relationships: Supplier

**PurchaseOrder:**
- id, supplierId, orderDate, status, totalAmount
- Relationships: Supplier

**Return:**
- id, saleId, reason
- Relationships: Sale, ReturnedItems

**Expense:**
- id, category, amount, description, date, paymentMethod, status
- receiptNumber, notes

**StockBatch:**
- id, inventoryId, batchNumber, quantity, expiryDate
- Relationships: Inventory, Sales, HomeUseProducts

**DrugInteraction:**
- id, drug1Id, drug2Id, severity, description, clinicalSignificance
- Relationships: Inventory (drug1, drug2)

**ProductRecall:**
- id, inventoryId, recallDate, recallReason, fdaRecallNumber, status
- affectedBatches, notificationSent
- Relationships: Inventory, StockBatch

**ControlledSubstance:**
- id, inventoryId, deaSchedule, requiresPrescription, trackingRequired
- Relationships: Inventory

**Notification:**
- id, userId, type, title, message, read, createdAt
- Relationships: User

**NotificationPreference:**
- id, userId, emailEnabled, smsEnabled, lowStockAlerts, expiryAlerts
- Relationships: User

**PriceHistory:**
- id, inventoryId, priceType, oldPrice, newPrice, changedBy, changedAt
- Relationships: Inventory, User

**Promotion:**
- id, name, description, discountType, discountValue, startDate, endDate
- applicableToProducts, applicableToCategories, status
- Relationships: Inventory, Category

**ReorderPoint:**
- id, inventoryId, reorderPoint, reorderQuantity, supplierPreference
- Relationships: Inventory, Supplier

### 13.2 Field Types

- **id**: Integer (Primary Key, Auto-increment)
- **amount/price**: DECIMAL(14,2) (Non-negative)
- **date/timestamp**: TIMESTAMP WITH TIME ZONE (UTC stored)
- **status**: ENUM (varies by entity)
- **discount**: DECIMAL(8,4) (Percentage or fixed amount)
- **quantity**: INTEGER (Non-negative)

---

## 14. API Surface and Contracts

### 14.1 Authentication Endpoints

**Public:**
- `POST /auth/login` - User login
- `POST /auth/forget-Password` - Request password reset
- `POST /auth/verify-Otp` - Verify OTP for password reset
- `PATCH /auth/update-Password` - Update password

### 14.2 Inventory Endpoints

**Protected (Pharmacist, Admin):**
- `GET /inventory` - Get all inventory items (includes batch information)
- `GET /inventory/:id` - Get inventory item by ID (includes all batches)
- `POST /inventory` - Create new inventory item (creates initial batch if stock and expiry provided)
- `PATCH /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item
- `PATCH /inventory/:id/stock` - Update stock quantity (creates/updates batch if batch info provided)
- `POST /inventory/:id/batch` - Add new batch to existing inventory item
- `POST /inventory/search` - Search inventory
- `GET /inventory/low-stock/:threshold` - Get low stock items
- `GET /inventory/expiring-soon/:days` - Get expiring items

### 14.3 Sales Endpoints

**Protected (Cashier, Admin):**
- `GET /sales` - Get all sales
- `GET /sales/:id` - Get sale by ID
- `POST /sales` - Create new sale
- `PATCH /sales/:id` - Update sale
- `DELETE /sales/:id` - Delete sale
- `GET /sales/date-range` - Get sales by date range
- `GET /sales/customer/:customerId` - Get sales by customer
- `GET /sales/user/:userId` - Get sales by user

### 14.4 Invoice Endpoints

**Protected (Cashier, Admin, Pharmacist):**
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create new invoice
- `PATCH /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice

### 14.5 Customer Endpoints

**Protected (Cashier, Admin, Pharmacist):**
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer
- `GET /customers/type/:type` - Get customers by type
- `GET /customers/search/query?q=...` - Search customers
- `GET /customers/analytics/summary` - Get customer analytics
- `GET /customers/analytics/top-customers?limit=...` - Get top customers

### 14.6 Supplier Endpoints

**Protected (Pharmacist, Admin):**
- `GET /suppliers` - Get all suppliers
- `GET /suppliers/:id` - Get supplier by ID
- `POST /suppliers` - Create new supplier
- `PATCH /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier
- `GET /suppliers/:id/inventory` - Get supplier inventory
- `GET /suppliers/:id/bills` - Get supplier bills

### 14.7 Category Endpoints

**Protected (Pharmacist, Admin):**
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/:id/inventory` - Get category inventory
- `GET /categories/:id/subcategories` - Get subcategories

### 14.8 Bill Endpoints

**Protected (Pharmacist, Admin):**
- `GET /bills` - Get all bills
- `GET /bills/:id` - Get bill by ID
- `POST /bills` - Create new bill
- `PATCH /bills/:id` - Update bill
- `DELETE /bills/:id` - Delete bill

### 14.9 Purchase Order Endpoints

**Protected (Pharmacist, Admin):**
- `GET /purchase-orders` - Get all purchase orders
- `GET /purchase-orders/:id` - Get purchase order by ID
- `POST /purchase-orders` - Create new purchase order
- `PATCH /purchase-orders/:id` - Update purchase order
- `DELETE /purchase-orders/:id` - Delete purchase order

### 14.10 Return Endpoints

**Protected (Cashier, Admin, Pharmacist):**
- `GET /returns` - Get all returns
- `GET /returns/:id` - Get return by ID
- `POST /returns` - Create new return
- `PATCH /returns/:id` - Update return
- `DELETE /returns/:id` - Delete return

### 14.11 Expense Endpoints

**Protected (Admin, Pharmacist):**
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get expense by ID
- `POST /expenses` - Create new expense
- `PATCH /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/category/:category` - Get expenses by category
- `GET /expenses/date-range?startDate=...&endDate=...` - Get expenses by date range
- `GET /expenses/status/:status` - Get expenses by status
- `GET /expenses/total/date-range?startDate=...&endDate=...` - Get total expenses by date range

### 14.12 Report Endpoints

**Protected (Admin):**
- `GET /reports/sales?startDate=...&endDate=...` - Get sales report
- `GET /reports/inventory` - Get inventory report
- `GET /reports/financial?startDate=...&endDate=...` - Get financial report
- `GET /reports/returns?startDate=...&endDate=...` - Get returns report
- `GET /reports/customers?startDate=...&endDate=...` - Get customers report

### 14.13 User Endpoints

**Protected (Admin only):**
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### 14.15 Drug Interaction Endpoints

**Protected (Pharmacist, Admin):**
- `GET /drug-interactions` - Get all drug interactions
- `GET /drug-interactions/:id` - Get drug interaction by ID
- `POST /drug-interactions/check` - Check interactions for multiple drugs
- `POST /drug-interactions` - Create new drug interaction record
- `PATCH /drug-interactions/:id` - Update drug interaction
- `DELETE /drug-interactions/:id` - Delete drug interaction
- `GET /drug-interactions/drug/:drugId` - Get all interactions for a drug

### 14.16 Regulatory Compliance Endpoints

**Protected (Pharmacist, Admin):**
- `GET /controlled-substances` - Get all controlled substances
- `GET /controlled-substances/:id` - Get controlled substance by ID
- `POST /controlled-substances` - Mark product as controlled substance
- `PATCH /controlled-substances/:id` - Update controlled substance info
- `GET /controlled-substances/report` - Generate controlled substance report
- `GET /recalls` - Get all product recalls
- `GET /recalls/:id` - Get recall by ID
- `POST /recalls` - Create recall record
- `PATCH /recalls/:id` - Update recall status
- `GET /recalls/active` - Get active recalls
- `POST /recalls/sync-fda` - Sync with FDA recall database

### 14.17 Advanced Inventory Endpoints

**Protected (Pharmacist, Admin):**
- `GET /reorder-points` - Get all reorder points
- `GET /reorder-points/:id` - Get reorder point by ID
- `POST /reorder-points` - Set reorder point for product
- `PATCH /reorder-points/:id` - Update reorder point
- `GET /reorder-points/suggestions` - Get suggested purchase orders
- `GET /price-history/:inventoryId` - Get price history for product
- `GET /promotions` - Get all promotions
- `GET /promotions/:id` - Get promotion by ID
- `POST /promotions` - Create new promotion
- `PATCH /promotions/:id` - Update promotion
- `DELETE /promotions/:id` - Delete promotion
- `GET /promotions/active` - Get active promotions

### 14.18 Communication Endpoints

**Protected (All roles):**
- `GET /notifications` - Get user notifications
- `GET /notifications/:id` - Get notification by ID
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all notifications as read
- `GET /notification-preferences` - Get user notification preferences
- `PATCH /notification-preferences` - Update notification preferences
- `POST /notifications/send` - Send notification (Admin only)

**Protected (Admin, Pharmacist):**
- `POST /notifications/send-email` - Send email notification
- `POST /notifications/send-sms` - Send SMS notification
- `GET /notifications/system` - Get system notifications

### 14.19 Integration Endpoints

**Protected (Pharmacist, Admin):**
- `POST /integrations/barcode/scan` - Scan barcode and get product info
- `POST /integrations/drug-database/lookup` - Lookup drug in external database
- `GET /integrations/drug-database/:ndc` - Get drug info by NDC
- `POST /integrations/fda/verify` - Verify product with FDA database
- `GET /integrations/fda/recalls` - Get FDA recalls

### 14.20 Sample Request/Response

**Create Sale Request:**
```json
{
  "name": "Paracetamol 500mg",
  "formula": "Paracetamol",
  "type": "Medicine",
  "quantity": 2,
  "price": 10.50,
  "discount": 1.00,
  "replace": false,
  "userId": 1,
  "customerId": 1,
  "invoiceId": 1,
  "inventoryId": 5
}
```

**Create Invoice Request:**
```json
{
  "customerId": 1,
  "number": "INV-2025-001",
  "date": "2025-01-15",
  "totalAmount": 100.50,
  "discount": 10.00
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "quantity": ["Quantity must be at least 1"],
    "price": ["Price must be positive"]
  }
}
```

---

## 15. Reporting & Analytics

### 15.1 Sales Reports

**Metrics:**
- Total sales by date range
- Sales by customer
- Sales by product
- Sales by user (cashier/pharmacist)
- Average transaction value
- Top selling products

**Filters:**
- Date range
- Customer
- Product
- User
- Invoice status

### 15.2 Inventory Reports

**Metrics:**
- Total products
- Low stock items
- Expiring items (by days)
- Stock value
- Category distribution
- Supplier distribution

**Alerts:**
- Low stock threshold breach
- Expiry warnings
- Zero stock items

### 15.3 Financial Reports

**Metrics:**
- Total revenue (sales)
- Total expenses
- Profit/Loss
- Expense by category
- Revenue trends
- Expense trends

**Periods:**
- Daily
- Weekly
- Monthly
- Yearly
- Custom date range

### 15.4 Customer Reports

**Metrics:**
- Total customers
- Customers by type
- Top customers by purchase amount
- Customer purchase frequency
- Average order value per customer
- Customer retention rate

### 15.5 Returns Reports

**Metrics:**
- Total returns
- Returns by reason
- Returns by product
- Returns by customer
- Return rate percentage

---

## 16. Audit & Governance

### 16.1 Audit Logging

**Logged Actions:**
- User authentication (login, logout)
- User management (create, update, delete)
- Inventory changes (create, update, delete, stock updates)
- Sales creation and updates
- Invoice creation and updates
- Customer management
- Supplier management
- Expense entries
- System configuration changes

### 16.2 Audit Log Structure

**Log Entry:**
- Timestamp (UTC)
- User ID and username
- Action type (CREATE, UPDATE, DELETE, VIEW)
- Entity type (Inventory, Sale, Invoice, etc.)
- Entity ID
- Before snapshot (for updates)
- After snapshot (for updates/creates)
- IP Address
- User Agent (optional)

### 16.3 Audit Export

**Export Formats:**
- CSV
- JSON
- PDF (for compliance)

**Export Filters:**
- Date range
- User
- Entity type
- Action type

### 16.4 Data Retention

- Audit logs: 7 years (compliance requirement)
- Transaction data: 7 years
- User data: While user is active + 2 years after deactivation

---

## 17. Non-Functional Requirements

| Area          | Target/Practice                                                |
| ------------- | -------------------------------------------------------------- |
| Availability  | ≥ 99.0% (business hours), ≥ 95% (24/7)                       |
| Latency       | p95 < 500ms for API; < 2s for report generation              |
| Scalability   | Support 10,000+ products, 1000+ daily transactions            |
| Security      | TLS 1.2+; JWT authentication; RBAC; password hashing          |
| Observability | Structured logs, error tracking, performance monitoring       |
| Backups       | Daily database backups; 30-day retention                       |
| Data Integrity | Transaction consistency, referential integrity, validation   |

---

## 18. Deployment Architecture

### 18.1 Technology Stack

**Backend:**
- Framework: NestJS (Node.js)
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- API Documentation: Swagger/OpenAPI

**Frontend:**
- Framework: Next.js 15 (React)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React Context
- Forms: React Hook Form + Zod

### 18.2 Deployment Model

**Single-Instance Deployment:**
- One codebase
- One database instance
- One frontend deployment
- Environment-based configuration

**Environment Configuration:**
- Development
- Staging
- Production

### 18.3 Infrastructure

**Requirements:**
- PostgreSQL database server
- Node.js runtime environment
- Web server (Nginx/Apache) for frontend
- SSL certificate for HTTPS
- Backup storage

---

## 19. Configuration & Feature Flags

**Environment Variables:**

| Key                | Example                    | Description                    |
| ------------------ | -------------------------- | ------------------------------ |
| DATABASE_URL       | postgresql://...           | Database connection string     |
| JWT_SECRET         | your-secret-key            | JWT signing secret             |
| PORT               | 3000                       | Backend server port            |
| NODE_ENV           | production                 | Environment mode               |
| NEXT_PUBLIC_API_URL| http://localhost:3000      | Frontend API base URL          |
| CORS_ORIGIN        | http://localhost:3001      | Allowed CORS origins           |

**Feature Flags (Future):**
- Enable/disable specific modules
- Enable/disable advanced features
- Configure alert thresholds
- Configure report retention

---

## 20. Testing & UAT

### 20.1 Testing Strategy

**Unit Tests:**
- Service layer logic
- Business rule validation
- Calculation accuracy
- Data transformation

**Integration Tests:**
- API endpoint testing
- Database operations
- Authentication flow
- Authorization checks

**E2E Tests:**
- Complete user workflows
- Sales processing flow
- Inventory management flow
- Report generation

### 20.2 UAT Scenarios

**Critical Paths:**
1. User login → Create sale → Generate invoice → Update stock
2. Add product → Create purchase order → Receive bill → Update inventory
3. Create customer → Process sale → View customer history
4. Generate reports → Export data → Verify accuracy

---

## 21. Risks & Mitigations

| Risk                    | Impact                  | Mitigation                                              |
| ----------------------- | ----------------------- | ------------------------------------------------------- |
| Data loss               | Business disruption     | Daily backups, transaction logging, point-in-time recovery |
| Unauthorized access    | Security breach         | RBAC, JWT authentication, audit logging, regular security reviews |
| Inventory discrepancies | Financial loss        | Batch tracking, stock validation, regular audits, reconciliation |
| System downtime         | Operational disruption | Monitoring, alerts, backup systems, disaster recovery plan |
| User errors              | Data inaccuracy        | Input validation, confirmation dialogs, audit trails, training |

---

## 22. Success Metrics & KPIs

| Metric                          | Target        | Measurement Method                    |
| ------------------------------- | ------------- | ------------------------------------- |
| Inventory accuracy              | ≥ 99%         | Regular stock audits                  |
| Sales processing time           | ≤ 2 minutes   | Average transaction time              |
| System uptime                   | ≥ 99%         | Monitoring and logging                |
| User satisfaction               | ≥ 90%         | User surveys and feedback            |
| Report generation time          | ≤ 5 seconds   | Performance monitoring                |
| Error rate                      | ≤ 1%          | Error logging and analysis            |
| Data entry accuracy             | ≥ 99.5%       | Validation and audit checks          |

---

## 23. Glossary

- **Batch**: A group of products with the same batch number and expiry date
- **FIFO**: First In, First Out - inventory management method
- **Invoice**: Document representing a customer transaction with line items
- **Sale**: Individual product sale transaction
- **Stock Batch**: Inventory tracking unit with batch number and expiry
- **Wholesale Customer**: Business customer buying in bulk with discounts
- **Retail Customer**: Individual customer (walk-in)
- **Purchase Order**: Order placed with supplier
- **Bill**: Record of purchase from supplier
- **Return**: Product returned by customer or to supplier
- **Expense**: Operational cost or expenditure
- **RBAC**: Role-Based Access Control

---

## 24. Appendices

### 24.1 Data Dictionary

**Monetary Fields:**
- Use DECIMAL(14,2) for all currency amounts
- Non-negative constraints where applicable

**Date/Time Fields:**
- All timestamps stored in UTC
- Timezone-aware types used

**ID Fields:**
- Integer auto-increment for primary keys
- Foreign keys reference parent entities

**Status Enums:**
- Invoice: DRAFT, PAID, COMPLETED, CANCELLED
- Purchase Order: PENDING, SHIPPED, DELIVERED, COMPLETED, CANCELLED
- Expense: PENDING, PAID
- Return: PENDING, PROCESSED, CANCELLED

### 24.2 API Versioning

- Base path: `/api/v1` (future)
- Current: No versioning (v1 implicit)
- Backward-compatible changes allowed
- Breaking changes require version increment

### 24.3 Error Codes

| Code              | HTTP | Meaning                             |
| ----------------- | ---- | ----------------------------------- |
| UNAUTHORIZED      | 401  | Authentication required             |
| FORBIDDEN         | 403  | Insufficient permissions            |
| NOT_FOUND         | 404  | Resource not found                  |
| VALIDATION_ERROR  | 422  | Input validation failed             |
| INTERNAL_ERROR    | 500  | Server error                        |

### 24.4 Story Mapping Seeds

**Epic 1 — Inventory Management**
- As a Pharmacist, I want to add products with batch information so that I can track inventory accurately.
- As a Pharmacist, I want to see low stock alerts so that I can reorder before running out.

**Epic 2 — Sales Processing**
- As a Cashier, I want to quickly process a sale so that customers don't wait.
- As a Cashier, I want to generate invoices automatically so that records are accurate.

**Epic 3 — Customer Management**
- As a Cashier, I want to manage customer profiles so that I can apply discounts and track history.
- As an Admin, I want to see customer analytics so that I can understand buying patterns.

**Epic 4 — Reporting & Analytics**
- As an Admin, I want to view sales reports so that I can analyze business performance.
- As a Pharmacist, I want to see inventory reports so that I can manage stock effectively.

**Epic 5 — Supplier & Purchasing**
- As a Pharmacist, I want to manage suppliers so that I can track purchase history.
- As a Pharmacist, I want to create purchase orders so that I can order products systematically.

---

## 25. Drug Interaction & Safety Features

### 25.1 Overview

The Drug Interaction & Safety module provides real-time drug interaction checking, allergy warnings, and dosage validation to ensure patient safety and medication compliance.

### 25.2 Drug Interaction Checking

**Interaction Database:**
- Integration with drug interaction databases (e.g., DrugBank, RxNorm)
- Local database of known drug interactions
- Severity levels: Major, Moderate, Minor, Unknown
- Clinical significance descriptions

**Real-Time Checking:**
- Automatic interaction checking during sale creation
- Multi-drug interaction analysis
- Interaction warnings displayed to pharmacist/cashier
- Requires acknowledgment before completing sale

**Interaction Types:**
- Drug-drug interactions
- Drug-food interactions
- Drug-disease interactions
- Drug-allergy interactions

### 25.3 Allergy Management

**Allergy Tracking:**
- Customer allergy profiles
- Product allergen information
- Allergy warnings during sales
- Cross-reactivity checking

**Allergy Warnings:**
- Real-time alerts when selling products with known allergens
- Visual warnings in UI
- Requires pharmacist override for confirmed allergies

### 25.4 Dosage Validation

**Dosage Checking:**
- Recommended dosage ranges by age/weight
- Maximum daily dosage validation
- Dosage form compatibility
- Strength validation

**Dosage Recommendations:**
- Age-appropriate dosing
- Weight-based dosing calculations
- Frequency recommendations
- Duration guidelines

### 25.5 Patient Medication History

**History Tracking:**
- Customer purchase history
- Medication timeline
- Current medications (if tracked)
- Previous interactions

**Safety Features:**
- Duplicate therapy warnings
- Refill too soon warnings
- Medication adherence tracking

### 25.6 User Stories

- As a Pharmacist, I want to check drug interactions before dispensing so that I can prevent harmful combinations.
- As a Cashier, I want to see allergy warnings when processing sales so that I can alert the pharmacist.
- As a Pharmacist, I want to validate dosages so that I can ensure appropriate medication use.
- As a Pharmacist, I want to view customer medication history so that I can provide informed counseling.

---

## 26. Regulatory Compliance

### 26.1 FDA Tracking

**Product Verification:**
- NDC (National Drug Code) tracking
- FDA product registration verification
- Manufacturer information validation
- Product approval status checking

**FDA Database Integration:**
- Real-time FDA database queries
- Product information enrichment
- Approval status updates
- Manufacturer verification

### 26.2 Controlled Substances Management

**DEA Schedule Classification:**
- Schedule I-V classification
- Controlled substance flagging
- Prescription requirements
- Special handling requirements

**Controlled Substance Tracking:**
- Inventory tracking for controlled substances
- Transaction logging (sales, returns, adjustments)
- Required documentation
- Regulatory reporting

**Controlled Substance Reports:**
- Daily transaction logs
- Inventory reconciliation reports
- Regulatory submission formats
- Audit trail maintenance

### 26.3 Product Recall Management

**Recall Tracking:**
- FDA recall database integration
- Automatic recall notifications
- Product recall status
- Affected batch identification

**Recall Workflow:**
1. System receives recall notification (manual or automatic)
2. Identifies affected products and batches
3. Flags products in inventory
4. Alerts staff when attempting to sell recalled products
5. Tracks recall compliance

**Recall Alerts:**
- Visual warnings in inventory
- Sales prevention for recalled products
- Customer notification system
- Recall compliance reporting

### 26.4 Regulatory Reporting

**Report Types:**
- Controlled substance transaction logs
- Inventory audit reports
- Recall compliance reports
- Regulatory submission formats

**Reporting Requirements:**
- Scheduled report generation
- Export formats (PDF, CSV, XML)
- Regulatory agency submission
- Compliance audit trails

### 26.5 Compliance Audit

**Audit Features:**
- Complete transaction history
- Regulatory compliance checks
- Automated compliance validation
- Compliance score tracking

**User Stories:**
- As a Pharmacist, I want to track controlled substances so that I can maintain regulatory compliance.
- As an Admin, I want to generate regulatory reports so that I can submit to authorities.
- As a Pharmacist, I want to be alerted about product recalls so that I can prevent selling recalled items.
- As a Pharmacist, I want to verify FDA product information so that I can ensure product authenticity.

---

## 27. Advanced Inventory Management

### 27.1 Automated Reordering

**Reorder Point Configuration:**
- Product-specific reorder points
- Automatic calculation based on sales velocity
- Safety stock levels
- Lead time considerations

**Purchase Order Suggestions:**
- Automatic generation of suggested purchase orders
- Supplier preference configuration
- Quantity calculations based on:
  - Current stock level
  - Average daily sales
  - Lead time
  - Safety stock requirements

**Reorder Workflow:**
1. System monitors stock levels
2. Detects when reorder point is reached
3. Generates purchase order suggestions
4. Pharmacist reviews and approves
5. Purchase order created

### 27.2 Price Management

**Price Types:**
- Cost Price (purchase price)
- Retail Price (selling price to retail customers)
- Wholesale Price (selling price to wholesale customers)

**Price History:**
- Track all price changes
- Price change reasons
- User who made changes
- Timestamp of changes
- Price trend analysis

**Dynamic Pricing:**
- Rule-based pricing
- Category-based pricing
- Customer-type pricing
- Volume-based pricing

### 27.3 Promotions & Discounts

**Promotion Types:**
- Product-specific promotions
- Category-based promotions
- Buy X Get Y offers
- Percentage discounts
- Fixed amount discounts

**Promotion Management:**
- Start and end dates
- Applicable products/categories
- Discount values
- Promotion status (Active, Inactive, Scheduled)

**Promotion Application:**
- Automatic application during sales
- Manual override capability
- Promotion stacking rules
- Maximum discount limits

### 27.4 Price Optimization

**Pricing Strategies:**
- Competitive pricing analysis
- Margin optimization
- Market-based pricing
- Cost-plus pricing

**User Stories:**
- As a Pharmacist, I want automatic reorder suggestions so that I can maintain optimal stock levels.
- As an Admin, I want to manage promotions so that I can drive sales.
- As a Pharmacist, I want to track price history so that I can analyze pricing trends.
- As an Admin, I want to set dynamic pricing rules so that prices adjust automatically.

---

## 28. Communication & Notifications

### 28.1 Notification System

**Notification Types:**
- Low stock alerts
- Expiry warnings
- Product recall notifications
- System updates
- Order confirmations
- Report ready notifications

**Notification Channels:**
- In-app notifications
- Email notifications
- SMS notifications
- Push notifications (future)

### 28.2 Alert Configuration

**Alert Settings:**
- User-specific notification preferences
- Alert frequency configuration
- Alert severity levels
- Alert grouping rules

**Alert Management:**
- Mark as read/unread
- Dismiss alerts
- Alert history
- Alert filtering

### 28.3 Email Notifications

**Email Types:**
- Low stock alerts
- Expiry warnings
- Daily/weekly reports
- System maintenance notices
- Order confirmations
- Customer communications

**Email Configuration:**
- SMTP server configuration
- Email templates
- Email scheduling
- Email delivery tracking

### 28.4 SMS Notifications

**SMS Types:**
- Critical alerts (low stock, recalls)
- Order confirmations
- Customer reminders
- System alerts

**SMS Configuration:**
- SMS gateway integration
- SMS templates
- SMS scheduling
- Delivery status tracking

### 28.5 Customer Communications

**Communication Features:**
- Order confirmation emails/SMS
- Delivery notifications
- Product availability notifications
- Promotional communications
- Recall notifications

**User Stories:**
- As a Pharmacist, I want to receive low stock alerts via email so that I can reorder promptly.
- As an Admin, I want to configure notification preferences so that I receive relevant alerts.
- As a Cashier, I want in-app notifications so that I'm aware of important updates.
- As a Customer, I want order confirmations so that I know my order was received.

---

## 29. Integration Capabilities

### 29.1 Barcode Scanning

**Barcode Support:**
- UPC (Universal Product Code)
- EAN (European Article Number)
- Code 128
- QR codes

**Barcode Integration:**
- Barcode scanner hardware integration
- Mobile barcode scanning (camera)
- Barcode lookup API
- Product identification via barcode

**Barcode Workflow:**
1. Scan barcode using scanner or mobile camera
2. System looks up product in database
3. If found, loads product information
4. If not found, searches external databases
5. Option to add new product from external data

### 29.2 External Drug Databases

**Database Integrations:**
- FDA Drug Database (NDC lookup)
- RxNorm (standardized drug names)
- DrugBank (drug information)
- NLM (National Library of Medicine)

**Data Enrichment:**
- Automatic product information enrichment
- Drug classification
- Dosage information
- Interaction data
- Regulatory information

**API Integration:**
- RESTful API connections
- API key management
- Rate limiting
- Error handling and fallbacks

### 29.3 Product Verification

**Verification Services:**
- FDA product verification
- Manufacturer verification
- Authenticity checking
- Expiry date validation

### 29.4 Third-Party Integrations

**Integration Types:**
- Payment gateways (future)
- Shipping providers (future)
- Accounting software (future)
- Reporting tools

**Integration Architecture:**
- API-based integrations
- Webhook support
- Event-driven architecture
- Integration health monitoring

### 29.5 User Stories

- As a Cashier, I want to scan barcodes so that I can quickly identify products.
- As a Pharmacist, I want to enrich product data from external databases so that I have complete information.
- As a Pharmacist, I want to verify products with FDA database so that I can ensure authenticity.
- As an Admin, I want to integrate with external services so that I can automate workflows.

---

**End of Document**

