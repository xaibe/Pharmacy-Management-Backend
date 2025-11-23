import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateBillDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Paracetamol 500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

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
    description: 'ID of the supplier',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 100,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Total amount of the bill',
    example: 500,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;
} 