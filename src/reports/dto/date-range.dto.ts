import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date for the report period',
    example: '2024-01-01',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'End date for the report period',
    example: '2024-12-31',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;
} 