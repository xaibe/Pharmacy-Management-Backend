import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({
    description: 'Setting value',
    example: 'ABC Pharmacy',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;

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
  })
  @IsString()
  @IsOptional()
  category?: string;
}

