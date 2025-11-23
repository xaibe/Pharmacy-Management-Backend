import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
    DashboardLayoutDto,
    DataSourceType,
    LayoutSectionDto,
    LayoutWidgetDto,
    RefreshInterval,
    WidgetSize,
    WidgetType
} from './dashboard-layout.dto';

describe('Dashboard Layout DTOs', () => {
  describe('DashboardLayoutDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(DashboardLayoutDto, {
        name: 'Sales Dashboard',
        description: 'Overview of sales metrics',
        sections: [
          {
            title: 'Sales Overview',
            widgets: [
              {
                type: WidgetType.CHART,
                title: 'Sales Trend',
                dataSource: {
                  type: DataSourceType.ANALYTICS,
                  query: 'sales_trend',
                  refreshInterval: RefreshInterval.HOURLY,
                },
                size: WidgetSize.LARGE,
                position: { x: 0, y: 0 },
                config: {
                  chartType: 'line',
                  metrics: ['sales_volume', 'revenue'],
                },
              },
            ],
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty name', async () => {
      const dto = plainToClass(DashboardLayoutDto, {
        name: '',
        sections: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with empty sections array', async () => {
      const dto = plainToClass(DashboardLayoutDto, {
        name: 'Test Dashboard',
        sections: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('LayoutSectionDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(LayoutSectionDto, {
        title: 'Sales Overview',
        widgets: [
          {
            type: WidgetType.CHART,
            title: 'Sales Trend',
            dataSource: {
              type: DataSourceType.ANALYTICS,
              query: 'sales_trend',
              refreshInterval: RefreshInterval.HOURLY,
            },
            size: WidgetSize.LARGE,
            position: { x: 0, y: 0 },
            config: {
              chartType: 'line',
              metrics: ['sales_volume', 'revenue'],
            },
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty title', async () => {
      const dto = plainToClass(LayoutSectionDto, {
        title: '',
        widgets: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with empty widgets array', async () => {
      const dto = plainToClass(LayoutSectionDto, {
        title: 'Test Section',
        widgets: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('LayoutWidgetDto', () => {
    it('should validate valid data', async () => {
      const dto = plainToClass(LayoutWidgetDto, {
        type: WidgetType.CHART,
        title: 'Sales Trend',
        dataSource: {
          type: DataSourceType.ANALYTICS,
          query: 'sales_trend',
          refreshInterval: RefreshInterval.HOURLY,
        },
        size: WidgetSize.LARGE,
        position: { x: 0, y: 0 },
        config: {
          chartType: 'line',
          metrics: ['sales_volume', 'revenue'],
        },
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid widget type', async () => {
      const dto = plainToClass(LayoutWidgetDto, {
        type: 'INVALID_TYPE',
        title: 'Test Widget',
        dataSource: {
          type: DataSourceType.ANALYTICS,
          query: 'test_query',
        },
        size: WidgetSize.MEDIUM,
        position: { x: 0, y: 0 },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid widget size', async () => {
      const dto = plainToClass(LayoutWidgetDto, {
        type: WidgetType.CHART,
        title: 'Test Widget',
        dataSource: {
          type: DataSourceType.ANALYTICS,
          query: 'test_query',
        },
        size: 'INVALID_SIZE',
        position: { x: 0, y: 0 },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid position', async () => {
      const dto = plainToClass(LayoutWidgetDto, {
        type: WidgetType.CHART,
        title: 'Test Widget',
        dataSource: {
          type: DataSourceType.ANALYTICS,
          query: 'test_query',
        },
        size: WidgetSize.MEDIUM,
        position: { x: -1, y: -1 },
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Enums', () => {
    it('should validate WidgetType enum values', () => {
      expect(Object.values(WidgetType)).toContain('CHART');
      expect(Object.values(WidgetType)).toContain('TABLE');
      expect(Object.values(WidgetType)).toContain('METRIC');
      expect(Object.values(WidgetType)).toContain('LIST');
      expect(Object.values(WidgetType)).toContain('GAUGE');
      expect(Object.values(WidgetType)).toContain('PROGRESS');
      expect(Object.values(WidgetType)).toContain('STATUS');
      expect(Object.values(WidgetType)).toContain('ALERT');
    });

    it('should validate WidgetSize enum values', () => {
      expect(Object.values(WidgetSize)).toContain('SMALL');
      expect(Object.values(WidgetSize)).toContain('MEDIUM');
      expect(Object.values(WidgetSize)).toContain('LARGE');
      expect(Object.values(WidgetSize)).toContain('XLARGE');
    });

    it('should validate DataSourceType enum values', () => {
      expect(Object.values(DataSourceType)).toContain('ANALYTICS');
      expect(Object.values(DataSourceType)).toContain('INVENTORY');
      expect(Object.values(DataSourceType)).toContain('SALES');
      expect(Object.values(DataSourceType)).toContain('PAYMENT');
      expect(Object.values(DataSourceType)).toContain('CUSTOMER');
      expect(Object.values(DataSourceType)).toContain('SUPPLIER');
    });

    it('should validate RefreshInterval enum values', () => {
      expect(Object.values(RefreshInterval)).toContain('REALTIME');
      expect(Object.values(RefreshInterval)).toContain('MINUTELY');
      expect(Object.values(RefreshInterval)).toContain('HOURLY');
      expect(Object.values(RefreshInterval)).toContain('DAILY');
      expect(Object.values(RefreshInterval)).toContain('WEEKLY');
      expect(Object.values(RefreshInterval)).toContain('MONTHLY');
    });
  });
}); 