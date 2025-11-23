import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Paracetamol 500mg',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the inventory item',
    example: 'Pain reliever and fever reducer',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of inventory item',
    enum: Type,
    example: 'Medicine',
  })
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Minimum stock level before reorder',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minStock: number;

  @ApiProperty({
    description: 'Unit price of the item',
    example: 9.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Expiry date of the item',
    example: '2024-12-31',
    required: false,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({
    description: 'ID of the supplier',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  supplierId: number;

  @ApiProperty({
    description: 'ID of the category',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
} 