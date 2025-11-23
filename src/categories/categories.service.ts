import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
    parentId?: number;
  }): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        Inventory: true,
      },
    });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        Inventory: true,
      },
    });
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryInventory(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        Inventory: true,
      },
    });
  }

  async getSubcategories(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        Inventory: true,
      },
    });
  }
} 