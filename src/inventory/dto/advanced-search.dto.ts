import { ApiProperty } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MedicineSearchDto } from './medicine-search.dto';

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum AggregateFunction {
  COUNT = 'COUNT',
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
}

export class SearchCondition {
  @ApiProperty({
    description: 'Search criteria',
    type: MedicineSearchDto,
  })
  @IsObject()
  @ValidateNested()
  @TransformType(() => MedicineSearchDto)
  criteria: MedicineSearchDto;

  @ApiProperty({
    description: 'Logical operator to combine with next condition',
    enum: LogicalOperator,
    required: false,
  })
  @IsEnum(LogicalOperator)
  @IsOptional()
  operator?: LogicalOperator;
}

export class AggregateOption {
  @ApiProperty({
    description: 'Field to aggregate',
    example: 'price',
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Aggregation function',
    enum: AggregateFunction,
  })
  @IsEnum(AggregateFunction)
  function: AggregateFunction;

  @ApiProperty({
    description: 'Group by field',
    example: 'category',
    required: false,
  })
  @IsString()
  @IsOptional()
  groupBy?: string;
}

export class AdvancedSearchDto {
  @ApiProperty({
    description: 'List of search conditions with logical operators',
    type: [SearchCondition],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @TransformType(() => SearchCondition)
  conditions: SearchCondition[];

  @ApiProperty({
    description: 'Aggregation options',
    type: [AggregateOption],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @TransformType(() => AggregateOption)
  @IsOptional()
  aggregations?: AggregateOption[];

  @ApiProperty({
    description: 'Include stock details in response',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  includeStockDetails?: boolean;
} 