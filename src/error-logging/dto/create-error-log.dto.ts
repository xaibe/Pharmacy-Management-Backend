import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsInt } from 'class-validator';
import { ErrorSeverity } from '@prisma/client';

export class CreateErrorLogDto {
  @ApiProperty({ description: 'Error message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Error stack trace' })
  @IsString()
  @IsOptional()
  stack?: string;

  @ApiPropertyOptional({ description: 'HTTP status code' })
  @IsNumber()
  @IsOptional()
  statusCode?: number;

  @ApiPropertyOptional({ description: 'Request path' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({ description: 'HTTP method' })
  @IsString()
  @IsOptional()
  method?: string;

  @ApiPropertyOptional({ description: 'User ID if authenticated' })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({ description: 'User email if available' })
  @IsString()
  @IsOptional()
  userEmail?: string;

  @ApiPropertyOptional({ description: 'Client IP address' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Request body (JSON string)' })
  @IsString()
  @IsOptional()
  requestBody?: string;

  @ApiPropertyOptional({ description: 'Query parameters (JSON string)' })
  @IsString()
  @IsOptional()
  queryParams?: string;

  @ApiPropertyOptional({ description: 'Error type/class name' })
  @IsString()
  @IsOptional()
  errorType?: string;

  @ApiPropertyOptional({
    description: 'Error severity level',
    enum: ErrorSeverity,
    default: ErrorSeverity.MEDIUM,
  })
  @IsEnum(ErrorSeverity)
  @IsOptional()
  severity?: ErrorSeverity;
}

