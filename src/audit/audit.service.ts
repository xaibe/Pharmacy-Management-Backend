import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, AuditLog } from '@prisma/client';
import { CreateAuditLogDto, QueryAuditLogDto } from './dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new audit log entry
   */
  async createAuditLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = await this.prisma.auditLog.create({
        data: {
          action: dto.action,
          entityType: dto.entityType,
          entityId: dto.entityId,
          actorId: dto.actorId,
          actorEmail: dto.actorEmail,
          actorUsername: dto.actorUsername,
          beforeSnapshot: dto.beforeSnapshot ? JSON.parse(JSON.stringify(dto.beforeSnapshot)) : null,
          afterSnapshot: dto.afterSnapshot ? JSON.parse(JSON.stringify(dto.afterSnapshot)) : null,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          requestPath: dto.requestPath,
          requestMethod: dto.requestMethod,
          description: dto.description,
          metadata: dto.metadata ? JSON.parse(JSON.stringify(dto.metadata)) : null,
        },
      });

      this.logger.debug(`Audit log created: ${dto.action} on ${dto.entityType}${dto.entityId ? ` (ID: ${dto.entityId})` : ''}`);
      return auditLog;
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      throw error;
    }
  }

  /**
   * Get all audit logs with pagination and filters
   */
  async findAll(query: QueryAuditLogDto) {
    const { page = 1, limit = 20, action, entityType, entityId, actorId, actorEmail, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (actorId) {
      where.actorId = actorId;
    }

    if (actorEmail) {
      where.actorEmail = actorEmail;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [auditLogs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: auditLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single audit log by ID
   */
  async findOne(id: number): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  /**
   * Get audit statistics
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [total, byAction, byEntityType, byActor] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['actorId'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byAction: byAction.reduce((acc, item) => {
        acc[item.action] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byEntityType: byEntityType.reduce((acc, item) => {
        acc[item.entityType] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byActor: byActor.reduce((acc, item) => {
        acc[item.actorId || 'anonymous'] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Get audit logs for a specific entity
   */
  async findByEntity(entityType: string, entityId: number) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get audit logs for a specific actor
   */
  async findByActor(actorId: number, startDate?: Date, endDate?: Date) {
    const where: any = { actorId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Export audit logs (for compliance)
   */
  async exportLogs(query: QueryAuditLogDto) {
    const logs = await this.findAll({ ...query, limit: 10000 }); // Large limit for export
    return logs.data;
  }
}

