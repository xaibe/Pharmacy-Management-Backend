import { ApiProperty } from '@nestjs/swagger';
import { Type as ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProductSalesDto {
  @ApiProperty({
    description: 'Date of sale',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Quantity sold',
    example: 50,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Total sale amount',
    example: 499.50,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Average unit price',
    example: 9.99,
  })
  @IsNumber()
  averagePrice: number;
}

export class ProductReportItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNumber()
  id: number;

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
    description: 'Product type',
    enum: ProductType,
    example: ProductType.Medicine,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    description: 'Current stock level',
    example: 100,
  })
  @IsNumber()
  currentStock: number;

  @ApiProperty({
    description: 'Total units sold in period',
    example: 500,
  })
  @IsNumber()
  totalSold: number;

  @ApiProperty({
    description: 'Total sales amount',
    example: 4995.00,
  })
  @IsNumber()
  totalSales: number;

  @ApiProperty({
    description: 'Average daily sales',
    example: 16.67,
  })
  @IsNumber()
  averageDailySales: number;

  @ApiProperty({
    description: 'Wholesale price',
    example: 8.50,
  })
  @IsNumber()
  wholesalePrice: number;

  @ApiProperty({
    description: 'Retail price',
    example: 9.99,
  })
  @IsNumber()
  retailPrice: number;

  @ApiProperty({
    description: 'Profit margin percentage',
    example: 17.52,
  })
  @IsNumber()
  profitMargin: number;

  @ApiProperty({
    description: 'Expiry date',
    example: '2024-12-31',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;
}

export class ProductReportSummaryDto {
  @ApiProperty({
    description: 'Total number of products',
    example: 500,
  })
  @IsNumber()
  totalProducts: number;

  @ApiProperty({
    description: 'Total sales amount',
    example: 150000.00,
  })
  @IsNumber()
  totalSales: number;

  @ApiProperty({
    description: 'Total units sold',
    example: 15000,
  })
  @IsNumber()
  totalUnitsSold: number;

  @ApiProperty({
    description: 'Average product value',
    example: 300.00,
  })
  @IsNumber()
  averageProductValue: number;

  @ApiProperty({
    description: 'Number of low stock items',
    example: 25,
  })
  @IsNumber()
  lowStockItems: number;

  @ApiProperty({
    description: 'Number of expired items',
    example: 5,
  })
  @IsNumber()
  expiredItems: number;
}

export class ProductReportDto {
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
    description: 'Summary of product data',
    type: ProductReportSummaryDto,
  })
  @ValidateNested()
  @Type(() => ProductReportSummaryDto)
  summary: ProductReportSummaryDto;

  @ApiProperty({
    description: 'Detailed product data',
    type: [ProductReportItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductReportItemDto)
  products: ProductReportItemDto[];

  @ApiProperty({
    description: 'Sales by product type',
    example: {
      Medicine: 100000.00,
      Food: 30000.00,
      Cosmetic: 20000.00,
    },
  })
  salesByType: Record<string, number>;

  @ApiProperty({
    description: 'Top selling products',
    example: [
      { id: 1, name: 'Paracetamol 500mg', totalSales: 4995.00 },
      { id: 2, name: 'Amoxicillin 500mg', totalSales: 4500.00 },
    ],
  })
  topProducts: Array<{
    id: number;
    name: string;
    totalSales: number;
  }>;

  @ApiProperty({
    description: 'Products approaching expiry',
    example: [
      { id: 1, name: 'Vitamin C 1000mg', expiryDate: '2024-02-15', stock: 50 },
      { id: 2, name: 'Omega-3 1000mg', expiryDate: '2024-02-28', stock: 30 },
    ],
  })
  expiringProducts: Array<{
    id: number;
    name: string;
    expiryDate: Date;
    stock: number;
  }>;
} 