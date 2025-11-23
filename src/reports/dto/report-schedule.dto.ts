import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum ScheduleDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class EmailRecipientDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Recipient name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}

export class ReportScheduleDto {
  @ApiProperty({
    description: 'Schedule name',
    example: 'Monthly Sales Report',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Report type',
    example: 'sales',
  })
  @IsString()
  reportType: string;

  @ApiProperty({
    description: 'Schedule frequency',
    enum: ScheduleFrequency,
    example: ScheduleFrequency.MONTHLY,
  })
  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @ApiProperty({
    description: 'Schedule time (24-hour format)',
    example: '09:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiProperty({
    description: 'Schedule days for weekly frequency',
    enum: ScheduleDay,
    isArray: true,
    required: false,
  })
  @IsEnum(ScheduleDay, { each: true })
  @IsOptional()
  @IsArray()
  days?: ScheduleDay[];

  @ApiProperty({
    description: 'Schedule day of month for monthly frequency',
    example: 1,
    required: false,
  })
  @IsOptional()
  dayOfMonth?: number;

  @ApiProperty({
    description: 'Email recipients',
    type: [EmailRecipientDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipientDto)
  recipients: EmailRecipientDto[];

  @ApiProperty({
    description: 'Export format',
    example: 'PDF',
  })
  @IsString()
  exportFormat: string;

  @ApiProperty({
    description: 'Include data from previous period',
    example: true,
    required: false,
  })
  @IsOptional()
  includePreviousPeriod?: boolean;

  @ApiProperty({
    description: 'Active status',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
} 