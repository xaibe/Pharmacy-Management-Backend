import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsObject } from 'class-validator';
import { AuditAction } from '@prisma/client';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'Action type',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Entity type (e.g., Inventory, Sale, Invoice)',
    example: 'Inventory',
  })
  @IsString()
  entityType: string;

  @ApiProperty({
    description: 'Entity ID',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  entityId?: number;

  @ApiProperty({
    description: 'User ID who performed the action',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  actorId?: number;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  actorEmail?: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  actorUsername?: string;

  @ApiProperty({
    description: 'Entity state before action (for updates/deletes)',
    required: false,
  })
  @IsObject()
  @IsOptional()
  beforeSnapshot?: any;

  @ApiProperty({
    description: 'Entity state after action (for creates/updates)',
    required: false,
  })
  @IsObject()
  @IsOptional()
  afterSnapshot?: any;

  @ApiProperty({
    description: 'Client IP address',
    example: '192.168.1.1',
    required: false,
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent string',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/inventory',
    required: false,
  })
  @IsString()
  @IsOptional()
  requestPath?: string;

  @ApiProperty({
    description: 'HTTP method',
    example: 'POST',
    required: false,
  })
  @IsString()
  @IsOptional()
  requestMethod?: string;

  @ApiProperty({
    description: 'Optional description of the action',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: any;
}

