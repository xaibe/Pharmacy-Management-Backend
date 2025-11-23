import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '@prisma/client';

export const AUDIT_KEY = 'audit';

export interface AuditOptions {
  action: AuditAction;
  entityType: string;
  description?: string;
}

/**
 * Decorator to mark methods for audit logging
 * Usage: @Audit({ action: AuditAction.CREATE, entityType: 'Inventory' })
 */
export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);

