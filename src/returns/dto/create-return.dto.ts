import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty({
    description: 'ID of the sale being returned',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  saleId: number;

  @ApiProperty({
    description: 'ID of the invoice',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  invoiceId: number;

  @ApiProperty({
    description: 'Reason for the return',
    example: 'Defective product',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Total refund amount',
    example: 50.00,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalRefundAmount?: number;
} 