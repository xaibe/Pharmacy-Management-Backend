import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { Type as TransformType } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateMedicineDto } from './medicine-search.dto';

export class BulkCreateMedicineDto {
  @ApiProperty({
    description: 'List of medicines to create',
    type: [CreateMedicineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @TransformType(() => CreateMedicineDto)
  medicines: CreateMedicineDto[];
}

export class BulkUpdateMedicineDto {
  @ApiProperty({
    description: 'List of medicine IDs to update',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  medicineIds: number[];

  @ApiProperty({
    description: 'New type for the medicines',
    enum: Type,
    required: false,
  })
  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @ApiProperty({
    description: 'New category ID for the medicines',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'New supplier ID for the medicines',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @ApiProperty({
    description: 'New rack location for the medicines',
    required: false,
  })
  @IsString()
  @IsOptional()
  rackLocation?: string;

  @ApiProperty({
    description: 'New wholesale price for the medicines',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  wholeSalePrice?: number;

  @ApiProperty({
    description: 'New retail price for the medicines',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  retailPrice?: number;
}

export class BulkDeleteMedicineDto {
  @ApiProperty({
    description: 'List of medicine IDs to delete',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  medicineIds: number[];
}

export class BulkUpdateStockDto {
  @ApiProperty({
    description: 'List of medicine IDs to update stock',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  medicineIds: number[];

  @ApiProperty({
    description: 'Quantity to add to stock (can be negative for reduction)',
  })
  @IsNumber()
  quantity: number;
} 