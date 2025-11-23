import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe - Check if application is running' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  async liveness() {
    return this.healthService.checkLiveness();
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe - Check if application is ready to serve traffic' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async readiness() {
    return this.healthService.checkReadiness();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  async metrics() {
    return this.healthService.getMetrics();
  }
}

