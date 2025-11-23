import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorLoggingService } from './error-logging.service';
import { CreateErrorLogDto, QueryErrorLogDto, UpdateErrorLogDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('error-logs')
@Controller('error-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ErrorLoggingController {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create error log (usually called by interceptor)' })
  @ApiResponse({ status: 201, description: 'Error log created successfully' })
  create(@Body() createErrorLogDto: CreateErrorLogDto) {
    return this.errorLoggingService.createErrorLog(createErrorLogDto);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all error logs with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of error logs' })
  findAll(@Query() query: QueryErrorLogDto) {
    return this.errorLoggingService.findAll(query);
  }

  @Get('statistics')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get error statistics' })
  @ApiResponse({ status: 200, description: 'Error statistics' })
  getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.errorLoggingService.getStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get error log by ID' })
  @ApiResponse({ status: 200, description: 'Error log details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.errorLoggingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update error log (e.g., mark as resolved)' })
  @ApiResponse({ status: 200, description: 'Error log updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateErrorLogDto: UpdateErrorLogDto,
  ) {
    return this.errorLoggingService.update(id, updateErrorLogDto);
  }

  @Patch(':id/resolve')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Mark error as resolved' })
  @ApiResponse({ status: 200, description: 'Error marked as resolved' })
  markAsResolved(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string },
    // @Req() req: any, // Uncomment if you want to get userId from request
  ) {
    // TODO: Get userId from request user
    const userId = 1; // Placeholder - should come from authenticated user
    return this.errorLoggingService.markAsResolved(id, userId, body.notes);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete error log' })
  @ApiResponse({ status: 200, description: 'Error log deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.errorLoggingService.remove(id);
  }

  @Delete('cleanup/old')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete old resolved error logs' })
  @ApiResponse({ status: 200, description: 'Old error logs deleted' })
  deleteOldLogs(@Query('daysToKeep', ParseIntPipe) daysToKeep: number = 90) {
    return this.errorLoggingService.deleteOldLogs(daysToKeep);
  }
}

