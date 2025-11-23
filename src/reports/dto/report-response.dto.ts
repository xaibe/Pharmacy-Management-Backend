import { ApiProperty } from '@nestjs/swagger';
import { ReportFormat, ReportType } from './report-params.dto';

export class ReportResponseDto {
  @ApiProperty({
    description: 'Type of report generated',
    enum: ReportType,
    example: ReportType.SALES,
  })
  type: ReportType;

  @ApiProperty({
    description: 'Format of the report',
    enum: ReportFormat,
    example: ReportFormat.PDF,
  })
  format: ReportFormat;

  @ApiProperty({
    description: 'URL or path to the generated report',
    example: '/reports/sales-report-2024-01.pdf',
  })
  reportUrl: string;

  @ApiProperty({
    description: 'Timestamp when the report was generated',
    example: '2024-01-15T10:30:00Z',
  })
  generatedAt: Date;

  @ApiProperty({
    description: 'Summary of the report data',
    example: {
      totalSales: 15000,
      totalItems: 150,
      averageValue: 100,
    },
  })
  summary: Record<string, any>;

  @ApiProperty({
    description: 'Additional metadata about the report',
    example: {
      filters: { category: 'MEDICINE' },
      period: '2024-01-01 to 2024-01-31',
    },
  })
  metadata: Record<string, any>;
} 