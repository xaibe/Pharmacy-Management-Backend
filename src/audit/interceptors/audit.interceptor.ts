import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../audit.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Get audit metadata from decorator
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      handler,
    ) || this.reflector.get<AuditOptions>(AUDIT_KEY, controller);

    if (!auditOptions) {
      // No audit decorator, proceed without logging
      return next.handle();
    }

    // Extract request information
    const user = request.user;
    const ipAddress = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];
    const requestPath = request.url;
    const requestMethod = request.method;

    // Get entity ID from request (params, body, or response)
    let entityId: number | undefined;
    if (request.params?.id) {
      entityId = parseInt(request.params.id);
    } else if (request.body?.id) {
      entityId = request.body.id;
    }

    // Determine action from HTTP method if not specified
    let action = auditOptions.action;
    if (!action) {
      switch (requestMethod) {
        case 'POST':
          action = AuditAction.CREATE;
          break;
        case 'PATCH':
        case 'PUT':
          action = AuditAction.UPDATE;
          break;
        case 'DELETE':
          action = AuditAction.DELETE;
          break;
        case 'GET':
          action = AuditAction.VIEW;
          break;
        default:
          action = AuditAction.VIEW;
      }
    }

    // Capture before snapshot for updates/deletes
    let beforeSnapshot: any = null;
    if (action === AuditAction.UPDATE || action === AuditAction.DELETE) {
      // For updates/deletes, you might want to fetch the current state
      // This is a simplified version - you may need to enhance this
      beforeSnapshot = request.body;
    }

    return next.handle().pipe(
      tap({
        next: async (response) => {
          // Capture after snapshot
          let afterSnapshot: any = null;
          if (action === AuditAction.CREATE || action === AuditAction.UPDATE) {
            // Extract created/updated entity from response
            if (response && typeof response === 'object') {
              afterSnapshot = response;
            }
          }

          // Create audit log asynchronously (don't block response)
          this.auditService
            .createAuditLog({
              action,
              entityType: auditOptions.entityType,
              entityId,
              actorId: user?.id,
              actorEmail: user?.emailAddress,
              actorUsername: user?.username,
              beforeSnapshot,
              afterSnapshot,
              ipAddress,
              userAgent,
              requestPath,
              requestMethod,
              description: auditOptions.description,
            })
            .catch((error) => {
              // If audit logging fails, log to console but don't fail the request
              console.error('Failed to create audit log:', error);
            });
        },
        error: async (error) => {
          // Log failed operations too
          this.auditService
            .createAuditLog({
              action,
              entityType: auditOptions.entityType,
              entityId,
              actorId: user?.id,
              actorEmail: user?.emailAddress,
              actorUsername: user?.username,
              beforeSnapshot,
              afterSnapshot: null,
              ipAddress,
              userAgent,
              requestPath,
              requestMethod,
              description: auditOptions.description || `Failed: ${error.message}`,
              metadata: { error: error.message },
            })
            .catch((logError) => {
              console.error('Failed to create audit log for error:', logError);
            });
        },
      }),
    );
  }
}

