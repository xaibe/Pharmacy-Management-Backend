import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum ReportType {
  DEMAND = 'DEMAND',
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  PAYMENT = 'PAYMENT',
  PROFIT = 'PROFIT'
}

export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  PDF = 'PDF',
  JSON = 'JSON',
  XML = 'XML',
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  POWERPOINT = 'POWERPOINT'
}

export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  SCATTER = 'SCATTER',
  AREA = 'AREA',
  RADAR = 'RADAR',
  BUBBLE = 'BUBBLE',
  HEATMAP = 'HEATMAP',
  CANDLESTICK = 'CANDLESTICK',
  GAUGE = 'GAUGE',
  TREEMAP = 'TREEMAP',
  SANKEY = 'SANKEY',
  WATERFALL = 'WATERFALL'
}

export enum MetricType {
  SALES_VOLUME = 'SALES_VOLUME',
  REVENUE = 'REVENUE',
  PROFIT_MARGIN = 'PROFIT_MARGIN',
  STOCK_LEVEL = 'STOCK_LEVEL',
  EXPIRY_RATE = 'EXPIRY_RATE',
  TURNOVER_RATE = 'TURNOVER_RATE',
  CUSTOMER_RETENTION = 'CUSTOMER_RETENTION',
  PRODUCT_PERFORMANCE = 'PRODUCT_PERFORMANCE',
  GROSS_PROFIT = 'GROSS_PROFIT',
  NET_PROFIT = 'NET_PROFIT',
  OPERATING_MARGIN = 'OPERATING_MARGIN',
  RETURN_ON_INVESTMENT = 'RETURN_ON_INVESTMENT',
  INVENTORY_AGE = 'INVENTORY_AGE',
  STOCKOUT_RATE = 'STOCKOUT_RATE',
  CUSTOMER_ACQUISITION_COST = 'CUSTOMER_ACQUISITION_COST',
  CUSTOMER_LIFETIME_VALUE = 'CUSTOMER_LIFETIME_VALUE',
  AVERAGE_ORDER_VALUE = 'AVERAGE_ORDER_VALUE',
  REPEAT_PURCHASE_RATE = 'REPEAT_PURCHASE_RATE',
  PRODUCT_CATEGORY_PERFORMANCE = 'PRODUCT_CATEGORY_PERFORMANCE',
  SUPPLIER_PERFORMANCE = 'SUPPLIER_PERFORMANCE',
  SEASONAL_TREND = 'SEASONAL_TREND',
  PRICE_ELASTICITY = 'PRICE_ELASTICITY',
  MARKET_SHARE = 'MARKET_SHARE'
}

export class AnalyticsReportDto {
  @ApiProperty({ description: 'Start date for the report' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for the report' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Time frame for grouping data', enum: TimeFrame })
  @IsEnum(TimeFrame)
  timeFrame: TimeFrame;

  @ApiProperty({ description: 'Type of report', enum: ReportType })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ description: 'Include detailed records', required: false })
  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;

  @ApiProperty({ description: 'Group by product category', required: false })
  @IsOptional()
  @IsBoolean()
  groupByCategory?: boolean;

  @ApiProperty({ description: 'Group by supplier', required: false })
  @IsOptional()
  @IsBoolean()
  groupBySupplier?: boolean;

  @ApiProperty({ description: 'Minimum threshold for demand/sales', required: false })
  @IsOptional()
  @IsInt()
  minThreshold?: number;
}

export class VisualizationDto {
  @ApiProperty({ description: 'Start date for visualization' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for visualization' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Type of chart', enum: ChartType })
  @IsEnum(ChartType)
  chartType: ChartType;

  @ApiProperty({ description: 'Metrics to visualize', enum: MetricType, isArray: true })
  @IsEnum(MetricType, { each: true })
  metrics: MetricType[];

  @ApiProperty({ description: 'Group by dimension', required: false })
  @IsOptional()
  @IsString()
  groupBy?: string;

  @ApiProperty({ description: 'Include trend line', required: false })
  @IsOptional()
  @IsBoolean()
  includeTrend?: boolean;
}

export class ExportReportDto {
  @ApiProperty({ description: 'Start date for export' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for export' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Export format', enum: ExportFormat })
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @ApiProperty({ description: 'Report type', enum: ReportType })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ description: 'Include headers', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  includeHeaders?: boolean;

  @ApiProperty({ description: 'Custom filename', required: false })
  @IsOptional()
  @IsString()
  filename?: string;
}

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Time period for summary', enum: TimeFrame })
  @IsEnum(TimeFrame)
  timeFrame: TimeFrame;

  @ApiProperty({ description: 'Include sales metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeSales?: boolean;

  @ApiProperty({ description: 'Include inventory metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeInventory?: boolean;

  @ApiProperty({ description: 'Include financial metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeFinancial?: boolean;

  @ApiProperty({ description: 'Include performance metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includePerformance?: boolean;

  @ApiProperty({ description: 'Include customer metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeCustomer?: boolean;

  @ApiProperty({ description: 'Include supplier metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeSupplier?: boolean;

  @ApiProperty({ description: 'Include market metrics', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeMarket?: boolean;

  @ApiProperty({ description: 'Include seasonal analysis', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeSeasonal?: boolean;

  @ApiProperty({ description: 'Include competitive analysis', required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  includeCompetitive?: boolean;
}

export class PaymentTrackingDto {
  @ApiProperty({ description: 'Start date for tracking' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for tracking' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Include pending payments', required: false })
  @IsOptional()
  @IsBoolean()
  includePending?: boolean;

  @ApiProperty({ description: 'Include paid payments', required: false })
  @IsOptional()
  @IsBoolean()
  includePaid?: boolean;

  @ApiProperty({ description: 'Group by payment method', required: false })
  @IsOptional()
  @IsBoolean()
  groupByMethod?: boolean;
}

export class InventoryImpactDto {
  @ApiProperty({ description: 'Start date for analysis' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date for analysis' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Include stock movements', required: false })
  @IsOptional()
  @IsBoolean()
  includeMovements?: boolean;

  @ApiProperty({ description: 'Include expiry analysis', required: false })
  @IsOptional()
  @IsBoolean()
  includeExpiry?: boolean;

  @ApiProperty({ description: 'Include cost analysis', required: false })
  @IsOptional()
  @IsBoolean()
  includeCost?: boolean;
} 