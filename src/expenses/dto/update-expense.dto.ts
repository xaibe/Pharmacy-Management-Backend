import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'Description of the expense',
    example: 'Monthly office supplies purchase',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 150.50,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Type of the expense',
    enum: ExpenseType,
    example: ExpenseType.OPERATIONAL,
    required: false,
  })
  @IsEnum(ExpenseType)
  @IsOptional()
  expenseType?: ExpenseType;

  @ApiProperty({
    description: 'Date of the expense',
    example: '2024-01-15',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @ApiProperty({
    description: 'Payment method used',
    example: 'CREDIT_CARD',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    description: 'Reference number or receipt number',
    example: 'REC-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({
    description: 'Additional notes about the expense',
    example: 'Including printer ink and paper',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
} 