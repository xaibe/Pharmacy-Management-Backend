import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('category/:category')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findByCategory(@Param('category') category: string) {
    return this.settingsService.findByCategory(category);
  }

  @Get('pharmacy-name')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  getPharmacyName() {
    return this.settingsService.getPharmacyName();
  }

  @Get(':key')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Patch(':key')
  @Roles(Role.Admin)
  update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateSettingDto);
  }

  @Post('pharmacy-name')
  @Roles(Role.Admin)
  setPharmacyName(@Body() body: { name: string }) {
    return this.settingsService.setPharmacyName(body.name);
  }

  @Delete(':key')
  @Roles(Role.Admin)
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}

