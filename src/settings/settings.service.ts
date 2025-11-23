import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDto) {
    return this.prisma.settings.create({
      data: createSettingDto,
    });
  }

  async findAll() {
    return this.prisma.settings.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.settings.findMany({
      where: { category },
      orderBy: { key: 'asc' },
    });
  }

  async findOne(key: string) {
    return this.prisma.settings.findUnique({
      where: { key },
    });
  }

  async getValue(key: string): Promise<string | null> {
    const setting = await this.prisma.settings.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    return this.prisma.settings.update({
      where: { key },
      data: updateSettingDto,
    });
  }

  async upsert(key: string, value: string, description?: string, category?: string) {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value, description, category },
      create: {
        key,
        value,
        description,
        category: category || 'general',
      },
    });
  }

  async remove(key: string) {
    return this.prisma.settings.delete({
      where: { key },
    });
  }

  // Helper method to get pharmacy name
  async getPharmacyName(): Promise<string> {
    const name = await this.getValue('pharmacy_name');
    return name || 'Pharmacy';
  }

  // Helper method to set pharmacy name
  async setPharmacyName(name: string) {
    return this.upsert('pharmacy_name', name, 'Pharmacy business name', 'pharmacy');
  }
}

