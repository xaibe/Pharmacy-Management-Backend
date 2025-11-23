import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CustomerTransactionDto {
  @ApiProperty({
    description: 'Transaction date',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Transaction type',
    example: 'SALE',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 1500.00,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Transaction reference number',
    example: 'INV-2024-001',
  })
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'PAID',
  })
  @IsString()
  status: string;
}

export class CustomerReportItemDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'ABC Pharmacy',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'contact@abcpharmacy.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Customer type',
    enum: CustomerType,
    example: CustomerType.Wholesale,
  })
  @IsEnum(CustomerType)
  customerType: CustomerType;

  @ApiProperty({
    description: 'Total purchases amount',
    example: 15000.00,
  })
  @IsNumber()
  totalPurchases: number;

  @ApiProperty({
    description: 'Number of transactions',
    example: 25,
  })
  @IsNumber()
  transactionCount: number;

  @ApiProperty({
    description: 'Average transaction value',
    example: 600.00,
  })
  @IsNumber()
  averageTransactionValue: number;

  @ApiProperty({
    description: 'Default discount percentage',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  defaultDiscount?: number;
}

export class CustomerReportSummaryDto {
  @ApiProperty({
    description: 'Total number of customers',
    example: 100,
  })
  @IsNumber()
  totalCustomers: number;

  @ApiProperty({
    description: 'Total sales to all customers',
    example: 150000.00,
  })
  @IsNumber()
  totalSales: number;

  @ApiProperty({
    description: 'Average customer value',
    example: 1500.00,
  })
  @IsNumber()
  averageCustomerValue: number;

  @ApiProperty({
    description: 'Number of active customers',
    example: 85,
  })
  @IsNumber()
  activeCustomers: number;

  @ApiProperty({
    description: 'Number of new customers in period',
    example: 15,
  })
  @IsNumber()
  newCustomers: number;
}

export class CustomerReportDto {
  @ApiProperty({
    description: 'Report period start date',
    example: '2024-01-01',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Report period end date',
    example: '2024-01-31',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Summary of customer data',
    type: CustomerReportSummaryDto,
  })
  @ValidateNested()
  @Type(() => CustomerReportSummaryDto)
  summary: CustomerReportSummaryDto;

  @ApiProperty({
    description: 'Detailed customer data',
    type: [CustomerReportItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerReportItemDto)
  customers: CustomerReportItemDto[];

  @ApiProperty({
    description: 'Sales by customer type',
    example: {
      WHOLESALE: 120000.00,
      RETAIL: 30000.00,
    },
  })
  salesByCustomerType: Record<string, number>;

  @ApiProperty({
    description: 'Top customers by sales',
    example: [
      { id: 1, name: 'ABC Pharmacy', totalSales: 15000.00 },
      { id: 2, name: 'XYZ Medical', totalSales: 12000.00 },
    ],
  })
  topCustomers: Array<{
    id: number;
    name: string;
    totalSales: number;
  }>;
} 