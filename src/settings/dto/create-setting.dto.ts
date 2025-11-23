import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    description: 'Setting key (unique identifier)',
    example: 'pharmacy_name',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Setting value',
    example: 'ABC Pharmacy',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Setting description',
    example: 'Pharmacy business name',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Setting category for grouping',
    example: 'pharmacy',
    required: false,
    default: 'general',
  })
  @IsString()
  @IsOptional()
  category?: string;
}

