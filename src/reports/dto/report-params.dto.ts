import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  FINANCIAL = 'FINANCIAL',
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export class ReportParamsDto {
  @ApiProperty({
    description: 'Type of report to generate',
    enum: ReportType,
    example: ReportType.SALES,
  })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({
    description: 'Start date for the report period',
    example: '2024-01-01',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'End date for the report period',
    example: '2024-12-31',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Format of the report',
    enum: ReportFormat,
    example: ReportFormat.PDF,
    required: false,
  })
  @IsEnum(ReportFormat)
  @IsOptional()
  format?: ReportFormat;

  @ApiProperty({
    description: 'Additional filters for the report',
    example: { category: 'MEDICINE', status: 'ACTIVE' },
    required: false,
  })
  @IsString()
  @IsOptional()
  filters?: string;
} 