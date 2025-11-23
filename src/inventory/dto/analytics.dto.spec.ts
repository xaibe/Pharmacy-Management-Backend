import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import
    {
        AnalyticsReportDto,
        ChartType,
        DashboardSummaryDto,
        ExportFormat,
        ExportReportDto,
        MetricType,
        ReportType,
        TimeFrame,
        VisualizationDto,
    } from './analytics.dto';

describe('Analytics DTOs', () => {
  describe('AnalyticsReportDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(AnalyticsReportDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        timeFrame: TimeFrame.MONTHLY,
        reportType: ReportType.SALES,
        includeDetails: true,
        groupByCategory: true,
        groupBySupplier: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid dates', async () => {
      const dto = plainToClass(AnalyticsReportDto, {
        startDate: 'invalid-date',
        endDate: '2024-12-31',
        timeFrame: TimeFrame.MONTHLY,
        reportType: ReportType.SALES,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with end date before start date', async () => {
      const dto = plainToClass(AnalyticsReportDto, {
        startDate: '2024-12-31',
        endDate: '2024-01-01',
        timeFrame: TimeFrame.MONTHLY,
        reportType: ReportType.SALES,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('VisualizationDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(VisualizationDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        chartType: ChartType.LINE,
        metrics: [MetricType.SALES_VOLUME, MetricType.REVENUE],
        groupBy: 'category',
        includeTrend: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid chart type', async () => {
      const dto = plainToClass(VisualizationDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        chartType: 'INVALID_TYPE',
        metrics: [MetricType.SALES_VOLUME],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with empty metrics array', async () => {
      const dto = plainToClass(VisualizationDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        chartType: ChartType.LINE,
        metrics: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('ExportReportDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(ExportReportDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        format: ExportFormat.CSV,
        reportType: ReportType.SALES,
        includeHeaders: true,
        filename: 'sales_report.csv',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid export format', async () => {
      const dto = plainToClass(ExportReportDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        format: 'INVALID_FORMAT',
        reportType: ReportType.SALES,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid filename', async () => {
      const dto = plainToClass(ExportReportDto, {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        format: ExportFormat.CSV,
        reportType: ReportType.SALES,
        filename: 'invalid/filename.csv',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('DashboardSummaryDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(DashboardSummaryDto, {
        timeFrame: TimeFrame.MONTHLY,
        includeSales: true,
        includeInventory: true,
        includeFinancial: true,
        includePerformance: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid time frame', async () => {
      const dto = plainToClass(DashboardSummaryDto, {
        timeFrame: 'INVALID_FRAME',
        includeSales: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate with at least one include flag', async () => {
      const dto = plainToClass(DashboardSummaryDto, {
        timeFrame: TimeFrame.MONTHLY,
        includeSales: false,
        includeInventory: false,
        includeFinancial: false,
        includePerformance: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Enums', () => {
    it('should validate TimeFrame enum values', () => {
      expect(Object.values(TimeFrame)).toContain('DAILY');
      expect(Object.values(TimeFrame)).toContain('WEEKLY');
      expect(Object.values(TimeFrame)).toContain('MONTHLY');
      expect(Object.values(TimeFrame)).toContain('QUARTERLY');
      expect(Object.values(TimeFrame)).toContain('YEARLY');
    });

    it('should validate ReportType enum values', () => {
      expect(Object.values(ReportType)).toContain('SALES');
      expect(Object.values(ReportType)).toContain('INVENTORY');
      expect(Object.values(ReportType)).toContain('PAYMENT');
      expect(Object.values(ReportType)).toContain('PROFIT');
    });

    it('should validate ChartType enum values', () => {
      expect(Object.values(ChartType)).toContain('LINE');
      expect(Object.values(ChartType)).toContain('BAR');
      expect(Object.values(ChartType)).toContain('PIE');
      expect(Object.values(ChartType)).toContain('SCATTER');
      expect(Object.values(ChartType)).toContain('AREA');
      expect(Object.values(ChartType)).toContain('RADAR');
      expect(Object.values(ChartType)).toContain('BUBBLE');
      expect(Object.values(ChartType)).toContain('HEATMAP');
      expect(Object.values(ChartType)).toContain('CANDLESTICK');
      expect(Object.values(ChartType)).toContain('GAUGE');
      expect(Object.values(ChartType)).toContain('TREEMAP');
      expect(Object.values(ChartType)).toContain('SANKEY');
      expect(Object.values(ChartType)).toContain('WATERFALL');
    });

    it('should validate MetricType enum values', () => {
      expect(Object.values(MetricType)).toContain('SALES_VOLUME');
      expect(Object.values(MetricType)).toContain('REVENUE');
      expect(Object.values(MetricType)).toContain('PROFIT_MARGIN');
      expect(Object.values(MetricType)).toContain('STOCK_LEVEL');
      expect(Object.values(MetricType)).toContain('EXPIRY_RATE');
      expect(Object.values(MetricType)).toContain('TURNOVER_RATE');
      expect(Object.values(MetricType)).toContain('CUSTOMER_RETENTION');
      expect(Object.values(MetricType)).toContain('PRODUCT_PERFORMANCE');
      expect(Object.values(MetricType)).toContain('GROSS_PROFIT');
      expect(Object.values(MetricType)).toContain('NET_PROFIT');
      expect(Object.values(MetricType)).toContain('OPERATING_MARGIN');
      expect(Object.values(MetricType)).toContain('RETURN_ON_INVESTMENT');
      expect(Object.values(MetricType)).toContain('INVENTORY_AGE');
      expect(Object.values(MetricType)).toContain('STOCKOUT_RATE');
      expect(Object.values(MetricType)).toContain('CUSTOMER_ACQUISITION_COST');
      expect(Object.values(MetricType)).toContain('CUSTOMER_LIFETIME_VALUE');
      expect(Object.values(MetricType)).toContain('AVERAGE_ORDER_VALUE');
      expect(Object.values(MetricType)).toContain('REPEAT_PURCHASE_RATE');
      expect(Object.values(MetricType)).toContain('PRODUCT_CATEGORY_PERFORMANCE');
      expect(Object.values(MetricType)).toContain('SUPPLIER_PERFORMANCE');
      expect(Object.values(MetricType)).toContain('SEASONAL_TREND');
      expect(Object.values(MetricType)).toContain('PRICE_ELASTICITY');
      expect(Object.values(MetricType)).toContain('MARKET_SHARE');
    });

    it('should validate ExportFormat enum values', () => {
      expect(Object.values(ExportFormat)).toContain('CSV');
      expect(Object.values(ExportFormat)).toContain('EXCEL');
      expect(Object.values(ExportFormat)).toContain('PDF');
      expect(Object.values(ExportFormat)).toContain('JSON');
      expect(Object.values(ExportFormat)).toContain('XML');
      expect(Object.values(ExportFormat)).toContain('HTML');
      expect(Object.values(ExportFormat)).toContain('MARKDOWN');
      expect(Object.values(ExportFormat)).toContain('POWERPOINT');
    });
  });
}); 