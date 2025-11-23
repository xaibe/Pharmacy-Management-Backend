import { ApiProperty } from '@nestjs/swagger';
import { AlertType, HomeUseStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class BatchTransferDto {
  @ApiProperty({ description: 'Source batch ID' })
  @IsInt()
  @IsNotEmpty()
  sourceBatchId: number;

  @ApiProperty({ description: 'Target batch ID' })
  @IsInt()
  @IsNotEmpty()
  targetBatchId: number;

  @ApiProperty({ description: 'Quantity to transfer' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Reason for transfer' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class HomeUseProductDto {
  @ApiProperty({ description: 'Inventory ID' })
  @IsInt()
  @IsNotEmpty()
  inventoryId: number;

  @ApiProperty({ description: 'Batch ID' })
  @IsInt()
  @IsNotEmpty()
  batchId: number;

  @ApiProperty({ description: 'Quantity taken' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Purpose of taking the product' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({ description: 'Whether the user will pay for the product', required: false })
  @IsOptional()
  @IsBoolean()
  willPay?: boolean;

  @ApiProperty({ description: 'Treat as business expense', required: false })
  @IsOptional()
  @IsBoolean()
  isBusinessExpense?: boolean;
}

export class ReturnHomeUseProductDto {
  @ApiProperty({ description: 'Home use product ID' })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Status of the returned product' })
  @IsEnum(HomeUseStatus)
  status: HomeUseStatus;

  @ApiProperty({ description: 'Notes about the return', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Payment amount if applicable', required: false })
  @IsOptional()
  @IsNumber()
  paymentAmount?: number;
}

export class StockAlertDto {
  @ApiProperty({ description: 'Inventory ID' })
  @IsInt()
  @IsNotEmpty()
  inventoryId: number;

  @ApiProperty({ description: 'Batch ID', required: false })
  @IsInt()
  @IsOptional()
  batchId?: number;

  @ApiProperty({ description: 'Type of alert', enum: AlertType })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ description: 'Threshold value for the alert' })
  @IsInt()
  @Min(0)
  threshold: number;

  @ApiProperty({ description: 'Alert message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class BatchReportDto {
  @ApiProperty({ description: 'Start date for the report' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for the report' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Include home use products', required: false })
  @IsOptional()
  includeHomeUse?: boolean;

  @ApiProperty({ description: 'Include transfers', required: false })
  @IsOptional()
  includeTransfers?: boolean;

  @ApiProperty({ description: 'Include alerts', required: false })
  @IsOptional()
  includeAlerts?: boolean;
}

export class HomeUseReportDto {
  @ApiProperty({ description: 'Start date for the report' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for the report' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Include paid items', required: false })
  @IsOptional()
  @IsBoolean()
  includePaid?: boolean;

  @ApiProperty({ description: 'Include unpaid items', required: false })
  @IsOptional()
  @IsBoolean()
  includeUnpaid?: boolean;

  @ApiProperty({ description: 'Include business expenses', required: false })
  @IsOptional()
  @IsBoolean()
  includeBusinessExpenses?: boolean;

  @ApiProperty({ description: 'Group by user', required: false })
  @IsOptional()
  @IsBoolean()
  groupByUser?: boolean;

  @ApiProperty({ description: 'Group by product', required: false })
  @IsOptional()
  @IsBoolean()
  groupByProduct?: boolean;
}

export class AddBatchDto {
  @ApiProperty({ description: 'Batch number' })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiProperty({ description: 'Quantity in this batch' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Expiry date for this batch (ISO-8601 DateTime string)' })
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? new Date(value) : value)
  expiryDate: Date;

  @ApiProperty({ description: 'Purchase date (ISO-8601 DateTime string)', required: false })
  @IsOptional()
  @Transform(({ value }) => value ? (typeof value === 'string' ? new Date(value) : value) : undefined)
  purchaseDate?: Date;

  @ApiProperty({ description: 'Supplier ID (can be different from original)', required: false })
  @IsOptional()
  @IsInt()
  supplierId?: number;
} 