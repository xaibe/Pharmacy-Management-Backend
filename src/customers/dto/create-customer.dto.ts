import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Name of the customer',
    example: 'City General Hospital',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'contact@hospital.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: '123 Hospital Street, Medical District',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Type of customer',
    enum: CustomerType,
    example: 'Wholesale',
  })
  @IsEnum(CustomerType)
  @IsNotEmpty()
  customerType: CustomerType;

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