import
    {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        Patch,
        Post,
        Query,
        UseGuards,
    } from '@nestjs/common';
import { ExpenseType, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: Partial<{
      expenseType: ExpenseType;
      amount: number;
      description: string;
      date: Date;
    }>,
  ) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }

  @Get('category/:category')
  @Roles(Role.Admin)
  getExpensesByCategory(@Param('category') category: ExpenseType) {
    return this.expensesService.getExpensesByCategory(category);
  }

  @Get('date-range')
  @Roles(Role.Admin)
  getExpensesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getExpensesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('total/date-range')
  @Roles(Role.Admin)
  getTotalExpensesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getTotalExpensesByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('category/:category/date-range')
  @Roles(Role.Admin)
  getExpensesByCategoryAndDateRange(
    @Param('category') category: ExpenseType,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getExpensesByCategoryAndDateRange(
      category,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('total/category/:category/date-range')
  @Roles(Role.Admin)
  getTotalExpensesByCategoryAndDateRange(
    @Param('category') category: ExpenseType,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getTotalExpensesByCategoryAndDateRange(
      category,
      new Date(startDate),
      new Date(endDate),
    );
  }
} 