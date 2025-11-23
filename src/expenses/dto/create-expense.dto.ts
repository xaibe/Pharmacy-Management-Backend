import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Description of the expense',
    example: 'Monthly office supplies purchase',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 150.50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Type of the expense',
    enum: ExpenseType,
    example: ExpenseType.OPERATIONAL,
  })
  @IsEnum(ExpenseType)
  @IsNotEmpty()
  expenseType: ExpenseType;

  @ApiProperty({
    description: 'Date of the expense',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'Payment method used',
    example: 'CREDIT_CARD',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Reference number or receipt number',
    example: 'REC-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({
    description: 'ID of the user recording the expense',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Additional notes about the expense',
    example: 'Including printer ink and paper',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
} 