# Error Logging Module Setup

## Overview

The Error Logging Module has been implemented to automatically capture and store all application errors in the database for debugging, monitoring, and compliance purposes.

## Features

- **Automatic Error Capture**: All errors are automatically logged via interceptor
- **Database Storage**: Errors are stored in the `ErrorLog` table
- **Severity Levels**: Errors are categorized by severity (LOW, MEDIUM, HIGH, CRITICAL)
- **Request Context**: Captures request path, method, user info, IP address, etc.
- **Error Resolution**: Mark errors as resolved with notes
- **Statistics**: Get error statistics and analytics
- **Cleanup**: Delete old resolved errors

## Database Migration

After adding the ErrorLog model to the Prisma schema, you need to create and run a migration:

```bash
cd pharmacy-app
npx prisma migrate dev --name add_error_logging
```

Or if you want to create the migration without applying it:

```bash
npx prisma migrate dev --create-only --name add_error_logging
```

Then apply it:

```bash
npx prisma migrate deploy
```

## Prisma Schema

The ErrorLog model has been added to `prisma/schema.prisma`:

```prisma
model ErrorLog {
  id            Int       @id @default(autoincrement())
  message       String
  stack         String?
  statusCode    Int?
  path          String?
  method        String?
  userId        Int?
  userEmail     String?
  ipAddress     String?
  userAgent     String?
  requestBody   String?
  queryParams   String?
  errorType     String?
  severity      ErrorSeverity @default(MEDIUM)
  resolved      Boolean   @default(false)
  resolvedAt    DateTime?
  resolvedBy    Int?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([createdAt])
  @@index([severity])
  @@index([resolved])
  @@index([userId])
}

enum ErrorSeverity {
  LOW      @map("low")
  MEDIUM   @map("medium")
  HIGH     @map("high")
  CRITICAL @map("critical")
}
```

## Module Structure

```
src/error-logging/
├── error-logging.module.ts      # Module definition (global)
├── error-logging.service.ts     # Service for CRUD operations
├── error-logging.controller.ts  # REST API endpoints
├── error-logging.interceptor.ts # Automatic error capture
└── dto/
    ├── create-error-log.dto.ts
    ├── query-error-log.dto.ts
    ├── update-error-log.dto.ts
    └── index.ts
```

## API Endpoints

All endpoints require Admin role and JWT authentication:

- `GET /error-logs` - List all error logs (with pagination and filters)
- `GET /error-logs/statistics` - Get error statistics
- `GET /error-logs/:id` - Get error log by ID
- `POST /error-logs` - Create error log (usually called by interceptor)
- `PATCH /error-logs/:id` - Update error log
- `PATCH /error-logs/:id/resolve` - Mark error as resolved
- `DELETE /error-logs/:id` - Delete error log
- `DELETE /error-logs/cleanup/old?daysToKeep=90` - Delete old resolved errors

## Query Parameters

When querying error logs, you can use:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `severity` - Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
- `resolved` - Filter by resolved status (true/false)
- `userId` - Filter by user ID
- `startDate` - Filter by start date (ISO string)
- `endDate` - Filter by end date (ISO string)

## Example Usage

### Get all errors
```bash
GET /error-logs?page=1&limit=20&severity=HIGH&resolved=false
```

### Get error statistics
```bash
GET /error-logs/statistics?startDate=2025-01-01&endDate=2025-01-31
```

### Mark error as resolved
```bash
PATCH /error-logs/123/resolve
Body: { "notes": "Fixed in version 1.2.0" }
```

### Cleanup old errors
```bash
DELETE /error-logs/cleanup/old?daysToKeep=90
```

## How It Works

1. **ErrorLoggingInterceptor** is registered globally via `APP_INTERCEPTOR`
2. When any error occurs in the application, the interceptor catches it
3. Error details are extracted (message, stack, request info, user info, etc.)
4. Severity is determined based on HTTP status code:
   - 5xx errors → HIGH severity
   - 4xx errors → MEDIUM severity
   - Other errors → CRITICAL severity
5. Error is saved to database asynchronously (doesn't block error response)
6. Original error is re-thrown to be handled by exception filters

## Integration

The module is already integrated into:
- `app.module.ts` - Module imported
- `main.ts` - No additional setup needed (interceptor is auto-registered)

## Next Steps

1. Run Prisma migration to create the ErrorLog table
2. Generate Prisma client: `npx prisma generate`
3. Test error logging by triggering an error
4. View errors in Swagger UI at `/api` or via API calls
5. Optionally create a frontend page to view and manage error logs

## Notes

- Error logging is asynchronous and won't slow down error responses
- Request bodies are truncated to 5000 characters to prevent huge logs
- Only resolved errors older than specified days are deleted during cleanup
- All endpoints require Admin role for security

