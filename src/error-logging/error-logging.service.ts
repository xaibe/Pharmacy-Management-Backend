import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorSeverity } from '@prisma/client';
import { CreateErrorLogDto, QueryErrorLogDto, UpdateErrorLogDto } from './dto';

@Injectable()
export class ErrorLoggingService {
  private readonly logger = new Logger(ErrorLoggingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new error log entry
   */
  async createErrorLog(dto: CreateErrorLogDto) {
    try {
      const errorLog = await this.prisma.errorLog.create({
        data: {
          message: dto.message,
          stack: dto.stack,
          statusCode: dto.statusCode,
          path: dto.path,
          method: dto.method,
          userId: dto.userId,
          userEmail: dto.userEmail,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          requestBody: dto.requestBody,
          queryParams: dto.queryParams,
          errorType: dto.errorType,
          severity: dto.severity || ErrorSeverity.MEDIUM,
        },
      });

      // Log to console for immediate visibility
      this.logger.error(
        `Error logged: ${dto.message}`,
        dto.stack,
        {
          errorId: errorLog.id,
          path: dto.path,
          method: dto.method,
          statusCode: dto.statusCode,
          severity: dto.severity,
        },
      );

      return errorLog;
    } catch (error) {
      // Fallback logging if database write fails
      this.logger.error('Failed to write error log to database', error);
      throw error;
    }
  }

  /**
   * Get all error logs with pagination and filters
   */
  async findAll(query: QueryErrorLogDto) {
    const { page = 1, limit = 20, severity, resolved, startDate, endDate, userId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (severity) {
      where.severity = severity;
    }

    if (resolved !== undefined) {
      where.resolved = resolved;
    }

    if (userId) {
      where.userId = userId;
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

    const [errorLogs, total] = await Promise.all([
      this.prisma.errorLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.errorLog.count({ where }),
    ]);

    return {
      data: errorLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single error log by ID
   */
  async findOne(id: number) {
    return this.prisma.errorLog.findUnique({
      where: { id },
    });
  }

  /**
   * Update error log (e.g., mark as resolved)
   */
  async update(id: number, dto: UpdateErrorLogDto) {
    return this.prisma.errorLog.update({
      where: { id },
      data: {
        resolved: dto.resolved,
        resolvedAt: dto.resolved ? new Date() : null,
        resolvedBy: dto.resolvedBy,
        notes: dto.notes,
      },
    });
  }

  /**
   * Delete an error log
   */
  async remove(id: number) {
    return this.prisma.errorLog.delete({
      where: { id },
    });
  }

  /**
   * Get error statistics
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

    const [total, bySeverity, resolved, unresolved] = await Promise.all([
      this.prisma.errorLog.count({ where }),
      this.prisma.errorLog.groupBy({
        by: ['severity'],
        where,
        _count: true,
      }),
      this.prisma.errorLog.count({ where: { ...where, resolved: true } }),
      this.prisma.errorLog.count({ where: { ...where, resolved: false } }),
    ]);

    return {
      total,
      resolved,
      unresolved,
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  /**
   * Mark error as resolved
   */
  async markAsResolved(id: number, userId: number, notes?: string) {
    return this.prisma.errorLog.update({
      where: { id },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: userId,
        notes,
      },
    });
  }

  /**
   * Delete old error logs (cleanup)
   */
  async deleteOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.errorLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        resolved: true, // Only delete resolved errors
      },
    });

    this.logger.log(`Deleted ${result.count} old error logs older than ${daysToKeep} days`);
    return result;
  }
}

