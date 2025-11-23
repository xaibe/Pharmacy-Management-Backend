# Audit Module

The Audit Module provides comprehensive audit logging for compliance and governance. It automatically tracks all user actions, entity changes, and system operations.

## Features

- **Automatic Audit Logging**: Interceptor-based logging for all endpoints with `@Audit()` decorator
- **Before/After Snapshots**: Tracks entity state changes for updates
- **Actor Tracking**: Records user information (ID, email, username)
- **Request Context**: Captures IP address, user agent, request path, and method
- **Statistics**: Get audit statistics by action, entity type, and actor
- **Export**: Export audit logs for compliance reporting
- **Filtering**: Advanced filtering by date range, entity type, action, actor

## Usage

### Basic Usage with Decorator

Add the `@Audit()` decorator to any controller method you want to audit:

```typescript
import { Audit } from '../audit/decorators/audit.decorator';
import { AuditAction } from '@prisma/client';

@Controller('inventory')
export class InventoryController {
  @Post()
  @Audit({ action: AuditAction.CREATE, entityType: 'Inventory' })
  async create(@Body() createDto: CreateInventoryDto) {
    // This operation will be automatically audited
    return this.inventoryService.create(createDto);
  }

  @Patch(':id')
  @Audit({ action: AuditAction.UPDATE, entityType: 'Inventory' })
  async update(@Param('id') id: number, @Body() updateDto: UpdateInventoryDto) {
    // This operation will be automatically audited
    return this.inventoryService.update(id, updateDto);
  }

  @Delete(':id')
  @Audit({ action: AuditAction.DELETE, entityType: 'Inventory' })
  async remove(@Param('id') id: number) {
    // This operation will be automatically audited
    return this.inventoryService.remove(id);
  }
}
```

### Manual Audit Logging

You can also manually create audit logs using the AuditService:

```typescript
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class SomeService {
  constructor(private readonly auditService: AuditService) {}

  async someOperation() {
    // Perform operation
    const result = await this.doSomething();

    // Manually log audit
    await this.auditService.createAuditLog({
      action: AuditAction.CREATE,
      entityType: 'CustomEntity',
      entityId: result.id,
      actorId: this.currentUser.id,
      actorEmail: this.currentUser.emailAddress,
      description: 'Custom operation performed',
    });

    return result;
  }
}
```

## API Endpoints

All audit endpoints require Admin role:

- `GET /audit` - Get all audit logs with pagination and filters
- `GET /audit/statistics` - Get audit statistics
- `GET /audit/entity/:entityType/:entityId` - Get audit logs for a specific entity
- `GET /audit/actor/:actorId` - Get audit logs for a specific user
- `GET /audit/export` - Export audit logs (for compliance)
- `GET /audit/:id` - Get a specific audit log by ID
- `POST /audit` - Manually create an audit log

## Query Parameters

### Filtering Audit Logs

```
GET /audit?page=1&limit=20&action=CREATE&entityType=Inventory&startDate=2025-01-01&endDate=2025-01-31
```

Available filters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `action` - Filter by action (CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT, EXPORT, IMPORT)
- `entityType` - Filter by entity type (e.g., "Inventory", "Sale", "Invoice")
- `entityId` - Filter by entity ID
- `actorId` - Filter by user ID
- `actorEmail` - Filter by user email
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

## Audit Actions

The following actions are available:

- `CREATE` - Create operation
- `UPDATE` - Update operation
- `DELETE` - Delete operation
- `VIEW` - View/Read operation
- `LOGIN` - User login
- `LOGOUT` - User logout
- `EXPORT` - Data export
- `IMPORT` - Data import

## Integration

The Audit Module is:
- ✅ Registered as a **Global Module** - Available in all modules
- ✅ **Interceptor registered globally** - Automatically intercepts requests
- ✅ **Opt-in via decorator** - Only logs when `@Audit()` decorator is present

## Best Practices

1. **Add @Audit() to all CRUD operations** for entities that need compliance tracking
2. **Use descriptive entityType names** (e.g., "Inventory", "Sale", "Invoice")
3. **Include descriptions** for complex operations
4. **Review audit logs regularly** for security and compliance
5. **Export audit logs** periodically for long-term storage

## Example: Complete Controller with Audit

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { Audit } from '../audit/decorators/audit.decorator';
import { AuditAction } from '@prisma/client';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Audit({ action: AuditAction.CREATE, entityType: 'Customer', description: 'Create new customer' })
  async create(@Body() createDto: CreateCustomerDto) {
    return this.customersService.create(createDto);
  }

  @Get(':id')
  @Audit({ action: AuditAction.VIEW, entityType: 'Customer' })
  async findOne(@Param('id') id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: AuditAction.UPDATE, entityType: 'Customer', description: 'Update customer information' })
  async update(@Param('id') id: number, @Body() updateDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateDto);
  }

  @Delete(':id')
  @Audit({ action: AuditAction.DELETE, entityType: 'Customer', description: 'Delete customer' })
  async remove(@Param('id') id: number) {
    return this.customersService.remove(id);
  }
}
```

## Database Migration

After adding the AuditLog model to Prisma schema, run:

```bash
npx prisma migrate dev --name add_audit_logging
npx prisma generate
```

