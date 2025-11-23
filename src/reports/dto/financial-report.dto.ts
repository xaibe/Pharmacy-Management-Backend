import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ExpenseItemDto {
  @ApiProperty({
    description: 'Expense description',
    example: 'Office Supplies',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Expense amount',
    example: 150.50,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Expense date',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Expense category',
    example: 'OPERATIONAL',
  })
  @IsString()
  category: string;
}

export class FinancialReportSummaryDto {
  @ApiProperty({
    description: 'Total sales revenue',
    example: 15000.00,
  })
  @IsNumber()
  totalSales: number;

  @ApiProperty({
    description: 'Total expenses',
    example: 5000.00,
  })
  @IsNumber()
  totalExpenses: number;

  @ApiProperty({
    description: 'Gross profit',
    example: 10000.00,
  })
  @IsNumber()
  grossProfit: number;

  @ApiProperty({
    description: 'Net profit',
    example: 9500.00,
  })
  @IsNumber()
  netProfit: number;

  @ApiProperty({
    description: 'Profit margin percentage',
    example: 63.33,
  })
  @IsNumber()
  profitMargin: number;
}

export class FinancialReportDto {
  @ApiProperty({
    description: 'Report period start date',
    example: '2024-01-01',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Report period end date',
    example: '2024-01-31',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Summary of financial data',
    type: FinancialReportSummaryDto,
  })
  @ValidateNested()
  @Type(() => FinancialReportSummaryDto)
  summary: FinancialReportSummaryDto;

  @ApiProperty({
    description: 'Detailed expense items',
    type: [ExpenseItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseItemDto)
  expenses: ExpenseItemDto[];

  @ApiProperty({
    description: 'Expenses by category',
    example: {
      OPERATIONAL: 2000.00,
      SALARY: 2500.00,
      UTILITIES: 500.00,
    },
  })
  expensesByCategory: Record<string, number>;

  @ApiProperty({
    description: 'Monthly comparison data',
    example: {
      '2023-12': {
        sales: 14000.00,
        expenses: 4800.00,
        profit: 9200.00,
      },
      '2024-01': {
        sales: 15000.00,
        expenses: 5000.00,
        profit: 9500.00,
      },
    },
  })
  monthlyComparison: Record<string, {
    sales: number;
    expenses: number;
    profit: number;
  }>;
} 