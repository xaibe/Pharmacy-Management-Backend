import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { Type as TransformType } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class MedicineSearchDto {
  @ApiProperty({
    description: 'Search by disease name',
    example: 'Hypertension',
    required: false,
  })
  @IsString()
  @IsOptional()
  diseaseName?: string;

  @ApiProperty({
    description: 'Search by medicine formula',
    example: 'C8H9NO2',
    required: false,
  })
  @IsString()
  @IsOptional()
  formula?: string;

  @ApiProperty({
    description: 'Search by generic name',
    example: 'Paracetamol',
    required: false,
  })
  @IsString()
  @IsOptional()
  genericName?: string;

  @ApiProperty({
    description: 'Search by brand name',
    example: 'Tylenol',
    required: false,
  })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiProperty({
    description: 'Search by medicine type',
    enum: Type,
    required: false,
  })
  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @ApiProperty({
    description: 'Search by manufacturer',
    example: 'Johnson & Johnson',
    required: false,
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({
    description: 'Search by dosage form',
    example: 'tablet',
    required: false,
  })
  @IsString()
  @IsOptional()
  dosageForm?: string;

  @ApiProperty({
    description: 'Search by strength',
    example: '500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiProperty({
    description: 'Search by indications',
    example: ['fever', 'pain'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  indications?: string[];

  @ApiProperty({
    description: 'Minimum price range',
    example: 10.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price range',
    example: 100.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Minimum stock quantity',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStock?: number;

  @ApiProperty({
    description: 'Maximum stock quantity',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxStock?: number;

  @ApiProperty({
    description: 'Expiry date range start',
    example: '2024-12-31',
    required: false,
  })
  @IsDate()
  @TransformType(() => Date)
  @IsOptional()
  expiryDateStart?: Date;

  @ApiProperty({
    description: 'Expiry date range end',
    example: '2025-12-31',
    required: false,
  })
  @IsDate()
  @TransformType(() => Date)
  @IsOptional()
  expiryDateEnd?: Date;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'Supplier ID',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @ApiProperty({
    description: 'Sort by field',
    example: 'name',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort direction (asc/desc)',
    example: 'asc',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortDirection?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Search by batch number',
    example: 'BATCH123',
    required: false,
  })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({
    description: 'Search by storage conditions',
    example: 'Store in a cool, dry place',
    required: false,
  })
  @IsString()
  @IsOptional()
  storageConditions?: string;

  @ApiProperty({
    description: 'Search by therapeutic class',
    example: 'Antibiotics',
    required: false,
  })
  @IsString()
  @IsOptional()
  therapeuticClass?: string;

  @ApiProperty({
    description: 'Search by active ingredients',
    example: ['paracetamol', 'codeine'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  activeIngredients?: string[];

  @ApiProperty({
    description: 'Search by contraindications',
    example: ['liver disease', 'pregnancy'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contraindications?: string[];

  @ApiProperty({
    description: 'Search by side effects',
    example: ['nausea', 'drowsiness'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sideEffects?: string[];

  @ApiProperty({
    description: 'Search by prescription required',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  prescriptionRequired?: boolean;

  @ApiProperty({
    description: 'Search by age restrictions',
    example: '18+',
    required: false,
  })
  @IsString()
  @IsOptional()
  ageRestriction?: string;

  @ApiProperty({
    description: 'Search by pregnancy category',
    example: 'Category A',
    required: false,
  })
  @IsString()
  @IsOptional()
  pregnancyCategory?: string;

  @ApiProperty({
    description: 'Search by shelf life (in months)',
    example: 24,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  shelfLife?: number;

  @ApiProperty({
    description: 'Search by manufacturing date range start',
    example: '2023-01-01',
    required: false,
  })
  @IsDate()
  @TransformType(() => Date)
  @IsOptional()
  manufacturingDateStart?: Date;

  @ApiProperty({
    description: 'Search by manufacturing date range end',
    example: '2023-12-31',
    required: false,
  })
  @IsDate()
  @TransformType(() => Date)
  @IsOptional()
  manufacturingDateEnd?: Date;

  @ApiProperty({
    description: 'Search by registration number',
    example: 'REG123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({
    description: 'Search by country of origin',
    example: 'USA',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @ApiProperty({
    description: 'Search by minimum wholesale price',
    example: 50.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minWholesalePrice?: number;

  @ApiProperty({
    description: 'Search by maximum wholesale price',
    example: 500.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxWholesalePrice?: number;

  @ApiProperty({
    description: 'Search by minimum profit margin percentage',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minProfitMargin?: number;

  @ApiProperty({
    description: 'Search by maximum profit margin percentage',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxProfitMargin?: number;

  @ApiProperty({
    description: 'Search by minimum sales in last 30 days',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minSalesLast30Days?: number;

  @ApiProperty({
    description: 'Search by maximum sales in last 30 days',
    example: 1000,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxSalesLast30Days?: number;

  @ApiProperty({
    description: 'Search by minimum reorder level',
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minReorderLevel?: number;

  @ApiProperty({
    description: 'Search by maximum reorder level',
    example: 200,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxReorderLevel?: number;
}

export class MedicineDiseaseDto {
  @ApiProperty({
    description: 'Disease name',
    example: 'Hypertension',
  })
  @IsString()
  diseaseName: string;

  @ApiProperty({
    description: 'Priority of medicine for this disease (1 being highest)',
    example: 1,
    required: false,
  })
  @IsOptional()
  priority?: number;

  @ApiProperty({
    description: 'Additional notes about medicine-disease relationship',
    example: 'First line treatment for mild cases',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateMedicineDto {
  @ApiProperty({
    description: 'Medicine name',
    example: 'Paracetamol 500mg',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Medicine formula',
    example: 'C8H9NO2',
    required: false,
  })
  @IsString()
  @IsOptional()
  formula?: string;

  @ApiProperty({
    description: 'Generic name',
    example: 'Paracetamol',
    required: false,
  })
  @IsString()
  @IsOptional()
  genericName?: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'Tylenol',
    required: false,
  })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiProperty({
    description: 'Manufacturer',
    example: 'Johnson & Johnson',
    required: false,
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({
    description: 'Dosage form',
    example: 'tablet',
    required: false,
  })
  @IsString()
  @IsOptional()
  dosageForm?: string;

  @ApiProperty({
    description: 'Strength',
    example: '500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  strength?: string;

  @ApiProperty({
    description: 'List of indications',
    example: ['fever', 'pain'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  indications?: string[];

  @ApiProperty({
    description: 'List of contraindications',
    example: ['liver disease', 'alcoholism'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contraindications?: string[];

  @ApiProperty({
    description: 'List of side effects',
    example: ['nausea', 'headache'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sideEffects?: string[];

  @ApiProperty({
    description: 'Storage instructions',
    example: 'Store in a cool, dry place',
    required: false,
  })
  @IsString()
  @IsOptional()
  storage?: string;

  @ApiProperty({
    description: 'Related diseases',
    type: [MedicineDiseaseDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  diseases?: MedicineDiseaseDto[];
} 