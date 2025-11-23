import
    {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        Patch,
        Post,
        UseGuards,
    } from '@nestjs/common';
import { Category, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createCategoryDto: {
    name: string;
    description?: string;
    parentId?: number;
  }) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<Category>,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Get(':id/inventory')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  getCategoryInventory(@Param('id') id: string) {
    return this.categoriesService.getCategoryInventory(+id);
  }

  @Get(':id/subcategories')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  getSubcategories(@Param('id') id: string) {
    return this.categoriesService.getSubcategories(+id);
  }
} 