import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Name of the product sold',
    example: 'Paracetamol 500mg',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Formula or composition of the product',
    example: 'Paracetamol',
    required: false,
  })
  @IsString()
  @IsOptional()
  formula?: string;

  @ApiProperty({
    description: 'Type of the product',
    enum: Type,
    example: 'Medicine',
    required: false,
  })
  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @ApiProperty({
    description: 'Quantity of the product sold',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Price of the product sold',
    example: 10.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Discount applied to the sale',
    example: 1.00,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    description: 'Whether the product was replaced',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  replace: boolean;

  @ApiProperty({
    description: 'ID of the user making the sale',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID of the customer',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({
    description: 'ID of the invoice',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  invoiceId: number;

  @ApiProperty({
    description: 'ID of the inventory item',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  inventoryId: number;

  @ApiProperty({
    description: 'ID of the stock batch',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockBatchId?: number;
} 