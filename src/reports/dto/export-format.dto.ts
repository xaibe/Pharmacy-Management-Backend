import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export enum ExportOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

export enum ExportPaperSize {
  A4 = 'A4',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
}

export enum ExcelChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  SCATTER = 'SCATTER',
}

export class PdfExportOptionsDto {
  @ApiProperty({
    description: 'Page orientation',
    enum: ExportOrientation,
    example: ExportOrientation.PORTRAIT,
    required: false,
  })
  @IsEnum(ExportOrientation)
  @IsOptional()
  orientation?: ExportOrientation;

  @ApiProperty({
    description: 'Paper size',
    enum: ExportPaperSize,
    example: ExportPaperSize.A4,
    required: false,
  })
  @IsEnum(ExportPaperSize)
  @IsOptional()
  paperSize?: ExportPaperSize;

  @ApiProperty({
    description: 'Include header with company logo',
    example: true,
    required: false,
  })
  @IsOptional()
  includeHeader?: boolean;

  @ApiProperty({
    description: 'Include footer with page numbers',
    example: true,
    required: false,
  })
  @IsOptional()
  includeFooter?: boolean;

  @ApiProperty({
    description: 'Margin in millimeters',
    example: 20,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  margin?: number;

  @ApiProperty({
    description: 'Compress PDF file',
    example: true,
    required: false,
  })
  @IsOptional()
  compress?: boolean;

  @ApiProperty({
    description: 'Password protect PDF',
    example: false,
    required: false,
  })
  @IsOptional()
  passwordProtect?: boolean;
}

export class ExcelExportOptionsDto {
  @ApiProperty({
    description: 'Include multiple sheets for different sections',
    example: true,
    required: false,
  })
  @IsOptional()
  multipleSheets?: boolean;

  @ApiProperty({
    description: 'Include charts and graphs',
    example: true,
    required: false,
  })
  @IsOptional()
  includeCharts?: boolean;

  @ApiProperty({
    description: 'Chart types to include',
    enum: ExcelChartType,
    isArray: true,
    required: false,
  })
  @IsEnum(ExcelChartType, { each: true })
  @IsOptional()
  @IsArray()
  chartTypes?: ExcelChartType[];

  @ApiProperty({
    description: 'Include formulas for calculations',
    example: true,
    required: false,
  })
  @IsOptional()
  includeFormulas?: boolean;

  @ApiProperty({
    description: 'Freeze header row',
    example: true,
    required: false,
  })
  @IsOptional()
  freezeHeader?: boolean;

  @ApiProperty({
    description: 'Auto-filter columns',
    example: true,
    required: false,
  })
  @IsOptional()
  autoFilter?: boolean;

  @ApiProperty({
    description: 'Include data validation',
    example: true,
    required: false,
  })
  @IsOptional()
  includeDataValidation?: boolean;
}

export class CsvExportOptionsDto {
  @ApiProperty({
    description: 'Field delimiter',
    example: ',',
    required: false,
  })
  @IsString()
  @IsOptional()
  delimiter?: string;

  @ApiProperty({
    description: 'Include headers',
    example: true,
    required: false,
  })
  @IsOptional()
  includeHeaders?: boolean;

  @ApiProperty({
    description: 'Character encoding',
    example: 'UTF-8',
    required: false,
  })
  @IsString()
  @IsOptional()
  encoding?: string;

  @ApiProperty({
    description: 'Quote fields',
    example: true,
    required: false,
  })
  @IsOptional()
  quoteFields?: boolean;

  @ApiProperty({
    description: 'Escape special characters',
    example: true,
    required: false,
  })
  @IsOptional()
  escapeSpecialChars?: boolean;

  @ApiProperty({
    description: 'Include BOM (Byte Order Mark)',
    example: false,
    required: false,
  })
  @IsOptional()
  includeBOM?: boolean;
}

export class ExportOptionsDto {
  @ApiProperty({
    description: 'Export format',
    enum: ExportFormat,
    example: ExportFormat.PDF,
  })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({
    description: 'File name',
    example: 'sales-report-2024-01',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({
    description: 'PDF export options',
    type: PdfExportOptionsDto,
    required: false,
  })
  @IsOptional()
  pdfOptions?: PdfExportOptionsDto;

  @ApiProperty({
    description: 'Excel export options',
    type: ExcelExportOptionsDto,
    required: false,
  })
  @IsOptional()
  excelOptions?: ExcelExportOptionsDto;

  @ApiProperty({
    description: 'CSV export options',
    type: CsvExportOptionsDto,
    required: false,
  })
  @IsOptional()
  csvOptions?: CsvExportOptionsDto;

  @ApiProperty({
    description: 'Include metadata',
    example: true,
    required: false,
  })
  @IsOptional()
  includeMetadata?: boolean;

  @ApiProperty({
    description: 'Compress output file',
    example: false,
    required: false,
  })
  @IsOptional()
  compress?: boolean;
} 