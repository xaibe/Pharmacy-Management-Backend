import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'City General Hospital',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'contact@hospital.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: '123 Hospital Street, Medical District',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Type of customer',
    enum: CustomerType,
    example: 'Wholesale',
    required: false,
  })
  @IsEnum(CustomerType)
  @IsOptional()
  customerType?: CustomerType;

  @ApiProperty({
    description: 'Default discount percentage',
    example: 10.0,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultDiscount?: number;
} 