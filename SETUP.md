# Pharmacy Management System - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Database Setup

1. **Install PostgreSQL** if you haven't already
2. **Create a database**:
   ```sql
   CREATE DATABASE pharmacy_db;
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pharmacy_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   NODE_ENV=development
   ```

## Backend Setup

1. **Install dependencies**:
   ```bash
   cd pharmacy-app
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Seed the database** (optional but recommended):
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`
API documentation will be available at `http://localhost:3000/api`

## Frontend Setup

1. **Install dependencies**:
   ```bash
   cd pharmacy-frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3001`

## Default Users

After running the seed script, you'll have these default users:

- **Admin**: `admin@pharmacy.com` / `admin123`
- **Pharmacist**: `pharmacist@pharmacy.com` / `admin123`
- **Cashier**: `cashier@pharmacy.com` / `admin123`

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3001` (frontend)
- `http://localhost:3000` (backend)

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/forget-password-email-link` - Request password reset
- `POST /auth/verify-Otp` - Verify OTP
- `POST /auth/update-Password` - Update password

### Inventory Management
- `GET /inventory` - Get all inventory items (includes batch information)
- `POST /inventory` - Create new inventory item (creates initial batch if stock and expiry provided)
- `PUT /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item
- `POST /inventory/:id/batch` - Add new batch to existing inventory item
  - Body: `{ batchNumber: string, quantity: number, expiryDate: Date, purchaseDate?: Date, supplierId?: number }`
- `PATCH /inventory/:id/stock` - Update stock quantity (creates/updates batch if batch info provided)
- `GET /inventory/low-stock` - Get low stock items
- `GET /inventory/expiring` - Get expiring items

**Batch Management:**
- Each product can have multiple batches with different batch numbers, expiry dates, and suppliers
- Total stock is automatically calculated as the sum of all batch quantities
- Use "Add Stock/Batch" (`POST /inventory/:id/batch`) to add more stock to existing products
- Use "Add Product" (`POST /inventory`) only for new products to avoid duplicates

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Suppliers
- `GET /suppliers` - Get all suppliers
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Sales
- `GET /sales` - Get all sales
- `POST /sales` - Create new sale
- `GET /sales/:id` - Get sale by ID

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

2. **CORS Errors**:
   - Backend is configured to allow localhost:3001
   - Check if frontend is running on correct port

3. **Authentication Issues**:
   - Ensure JWT_SECRET is set in .env
   - Check if user exists in database
   - Verify password is correct

4. **Module Import Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check if all modules are properly exported

### Development Commands

```bash
# Backend
npm run start:dev          # Start development server
npm run build             # Build for production
npm run lint              # Run ESLint
npm run test              # Run tests

# Database
npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run migrations
npm run db:seed           # Seed database
npm run db:studio         # Open Prisma Studio

# Frontend
npm run dev               # Start development server
npm run build             # Build for production
npm run lint              # Run ESLint
```

## Production Deployment

1. **Environment Variables**: Update `.env` with production values
2. **Database**: Use production PostgreSQL instance
3. **Build**: Run `npm run build` for both frontend and backend
4. **Security**: Change default passwords and JWT secret
5. **CORS**: Update CORS configuration for production domains

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/api`
3. Check the console logs for error messages
4. Verify database connectivity and schema 