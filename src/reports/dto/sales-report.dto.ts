import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SalesReportItemDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Paracetamol 500mg',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product formula',
    example: 'C8H9NO2',
    required: false,
  })
  @IsString()
  @IsOptional()
  formula?: string;

  @ApiProperty({
    description: 'Quantity sold',
    example: 100,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: 9.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Total amount',
    example: 999.00,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Discount applied',
    example: 50.00,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class SalesReportSummaryDto {
  @ApiProperty({
    description: 'Total sales amount',
    example: 15000.00,
  })
  @IsNumber()
  totalSales: number;

  @ApiProperty({
    description: 'Total number of items sold',
    example: 1500,
  })
  @IsNumber()
  totalItems: number;

  @ApiProperty({
    description: 'Average sale value',
    example: 100.00,
  })
  @IsNumber()
  averageValue: number;

  @ApiProperty({
    description: 'Total discounts given',
    example: 500.00,
  })
  @IsNumber()
  totalDiscounts: number;

  @ApiProperty({
    description: 'Net sales amount',
    example: 14500.00,
  })
  @IsNumber()
  netSales: number;
}

export class SalesReportDto {
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
    description: 'Summary of sales data',
    type: SalesReportSummaryDto,
  })
  @ValidateNested()
  @Type(() => SalesReportSummaryDto)
  summary: SalesReportSummaryDto;

  @ApiProperty({
    description: 'Detailed sales items',
    type: [SalesReportItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesReportItemDto)
  items: SalesReportItemDto[];

  @ApiProperty({
    description: 'Sales by product type',
    example: {
      MEDICINE: 10000.00,
      FOOD: 3000.00,
      COSMETIC: 2000.00,
    },
  })
  salesByType: Record<string, number>;

  @ApiProperty({
    description: 'Sales by customer type',
    example: {
      WHOLESALE: 12000.00,
      RETAIL: 3000.00,
    },
  })
  salesByCustomerType: Record<string, number>;
} 