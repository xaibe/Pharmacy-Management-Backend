import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  PARTIAL = 'PARTIAL',
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({
    description: 'Invoice number (auto-generated if not provided)',
    example: 'INV-2025-000001',
    required: false,
  })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({
    description: 'Invoice date',
    example: '2024-01-01',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Total amount',
    example: 100.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 10.00,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    description: 'Payment method: CASH, CREDIT, or PARTIAL',
    example: 'CASH',
    enum: PaymentMethod,
    required: false,
    default: 'CASH',
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Amount paid (required for CASH or PARTIAL payments)',
    example: 100.50,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @ApiProperty({
    description: 'Amount due (for CREDIT or PARTIAL payments)',
    example: 0,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  dueAmount?: number;
} 