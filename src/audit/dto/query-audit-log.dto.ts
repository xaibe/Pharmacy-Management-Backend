import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { AuditAction } from '@prisma/client';

export class QueryAuditLogDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    required: false,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({
    description: 'Filter by action type',
    enum: AuditAction,
    required: false,
  })
  @IsEnum(AuditAction)
  @IsOptional()
  action?: AuditAction;

  @ApiProperty({
    description: 'Filter by entity type',
    example: 'Inventory',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({
    description: 'Filter by entity ID',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  entityId?: number;

  @ApiProperty({
    description: 'Filter by actor ID',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  actorId?: number;

  @ApiProperty({
    description: 'Filter by actor email',
    example: 'user@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  actorEmail?: string;

  @ApiProperty({
    description: 'Start date for filtering',
    example: '2025-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering',
    example: '2025-01-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

