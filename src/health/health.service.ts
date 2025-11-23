import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkLiveness(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkReadiness(): Promise<{
    status: string;
    database: { status: string; responseTime?: number };
    timestamp: string;
  }> {
    const startTime = Date.now();
    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        status: 'ready',
        database: {
          status: 'connected',
          responseTime,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not ready',
        database: {
          status: 'disconnected',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getMetrics(): Promise<{
    status: string;
    database: { status: string; responseTime?: number };
    system: {
      uptime: number;
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
    };
    timestamp: string;
  }> {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let dbResponseTime: number | undefined;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      dbResponseTime = Date.now() - startTime;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    return {
      status: 'ok',
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round(memoryPercentage * 100) / 100,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}

