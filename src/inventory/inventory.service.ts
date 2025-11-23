import { Injectable } from '@nestjs/common';
import { AlertType, HomeUseStatus, Inventory, Type } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import * as PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { AdvancedSearchDto, AggregateFunction, LogicalOperator } from './dto/advanced-search.dto';
import { AnalyticsReportDto, ChartType, DashboardSummaryDto, ExportFormat, ExportReportDto, InventoryImpactDto, MetricType, PaymentTrackingDto, ReportType, TimeFrame, VisualizationDto } from './dto/analytics.dto';
import { BulkCreateMedicineDto, BulkDeleteMedicineDto, BulkUpdateMedicineDto, BulkUpdateStockDto } from './dto/bulk-medicine.dto';
import { CreateMedicineDto, MedicineDiseaseDto, MedicineSearchDto } from './dto/medicine-search.dto';
import { BatchReportDto, BatchTransferDto, HomeUseProductDto, HomeUseReportDto, ReturnHomeUseProductDto, StockAlertDto } from './dto/stock-management.dto';

// Helper function to convert string type to Type enum
function convertStringToType(type: string | Type): Type {
  if (typeof type === 'string') {
    const typeMap: Record<string, Type> = {
      'medicine': Type.Medicine,
      'food': Type.Food,
      'cosmetic': Type.Cosmetic,
      'other': Type.Other,
      'Medicine': Type.Medicine,
      'Food': Type.Food,
      'Cosmetic': Type.Cosmetic,
      'Other': Type.Other,
    };
    return typeMap[type.toLowerCase()] || Type.Other;
  }
  return type;
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    formula?: string;
    type: Type;
    categoryId: number;
    rackLocation: string;
    wholeSalePrice: number;
    retailPrice: number;
    expiryDate?: Date;
    stock: number;
    supplierId: number;
    genericName?: string;
    brandName?: string;
    manufacturer?: string;
    dosageForm?: string;
    strength?: string;
    variantForm?: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    baseProductId?: number;
    storage?: string;
    batchNumber?: string; // Optional batch number for initial stock
  }): Promise<Inventory> {
    // Use transaction to create inventory and initial batch
    return this.prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.create({
        data: {
          name: data.name,
          formula: data.formula,
          type: data.type, // Frontend now sends correct enum values
          categoryId: data.categoryId,
          rackLocation: data.rackLocation,
          wholeSalePrice: data.wholeSalePrice,
          retailPrice: data.retailPrice,
          expiryDate: data.expiryDate,
          stock: data.stock,
          supplierId: data.supplierId,
          genericName: data.genericName,
          brandName: data.brandName,
          manufacturer: data.manufacturer,
          dosageForm: data.dosageForm,
          strength: data.strength,
          storage: data.storage,
          value: data.stock * data.retailPrice, // Calculate initial value
          // Include variant fields if provided
          ...(data.variantForm && { variantForm: data.variantForm }),
          ...(data.packagingUnit && { packagingUnit: data.packagingUnit }),
          ...(data.unitsPerPackage && { unitsPerPackage: data.unitsPerPackage }),
          ...(data.baseProductId && { baseProductId: data.baseProductId }),
        } as any, // Type assertion to handle new Prisma fields
      });

      // Create initial stock batch if stock > 0 and expiry date is provided
      if (data.stock > 0 && data.expiryDate) {
        const batchNumber = data.batchNumber || `BATCH-${inventory.id}-${Date.now()}`;
        await tx.stockBatch.create({
          data: {
            inventoryId: inventory.id,
            batchNumber: batchNumber,
            quantity: data.stock,
            expiryDate: data.expiryDate,
          },
        });
      }

      // Return inventory with relations
      return tx.inventory.findUnique({
        where: { id: inventory.id },
        include: {
          category: true,
          supplier: true,
          stockBatches: {
            orderBy: {
              expiryDate: 'asc', // Order by expiry date (oldest first)
            },
          },
        },
      });
    });
  }

  async findAll(): Promise<Inventory[]> {
    try {
      const inventories = await this.prisma.inventory.findMany({
        include: {
          category: true,
          supplier: true,
          stockBatches: {
            orderBy: {
              expiryDate: 'asc', // Order batches by expiry date (oldest first)
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Recalculate stock from batches to ensure accuracy
      // This ensures stock always matches the sum of all batches
      for (const inventory of inventories) {
        const totalStockFromBatches = inventory.stockBatches.reduce(
          (sum, batch) => sum + batch.quantity,
          0,
        );

        // If stock doesn't match batches, update it
        if (inventory.stock !== totalStockFromBatches) {
          await this.prisma.inventory.update({
            where: { id: inventory.id },
            data: { stock: totalStockFromBatches },
          });
          inventory.stock = totalStockFromBatches;
        }
      }

      return inventories;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stockBatches: {
          orderBy: {
            expiryDate: 'asc', // Order batches by expiry date (oldest first)
          },
          include: {
            sales: {
              select: {
                id: true,
                quantity: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 5, // Show last 5 sales from this batch
            },
          },
        },
        // baseProduct and variants - uncomment after confirming Prisma client has these relations
        // baseProduct: {
        //   select: {
        //     id: true,
        //     name: true,
        //     genericName: true,
        //   },
        // },
        // variants: {
        //   select: {
        //     id: true,
        //     name: true,
        //     variantForm: true,
        //     packagingUnit: true,
        //     stock: true,
        //   },
        // },
      },
    });
  }

  async update(id: number, data: Partial<Inventory>): Promise<Inventory> {
    return this.prisma.inventory.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async remove(id: number): Promise<Inventory> {
    return this.prisma.inventory.delete({
      where: { id },
    });
  }

  async updateStock(id: number, quantity: number, batchNumber?: string, expiryDate?: Date): Promise<Inventory> {
    return this.prisma.$transaction(async (tx) => {
      // If batch number and expiry date are provided, create/update batch
      if (batchNumber && expiryDate) {
        await tx.stockBatch.upsert({
          where: {
            inventoryId_batchNumber: {
              inventoryId: id,
              batchNumber: batchNumber,
            },
          },
          update: {
            quantity: {
              increment: quantity,
            },
          },
          create: {
            inventoryId: id,
            batchNumber: batchNumber,
            quantity: quantity,
            expiryDate: expiryDate,
          },
        });

        // Recalculate total stock from all batches
        const batches = await tx.stockBatch.findMany({
          where: { inventoryId: id },
        });
        const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

        // Update inventory stock to match total from batches
        return await tx.inventory.update({
          where: { id },
          data: {
            stock: totalStock,
          },
          include: {
            category: true,
            supplier: true,
            stockBatches: {
              orderBy: {
                expiryDate: 'asc',
              },
            },
          },
        });
      } else {
        // If no batch info, just update stock directly (legacy behavior)
        return await tx.inventory.update({
          where: { id },
          data: {
            stock: {
              increment: quantity,
            },
          },
          include: {
            category: true,
            supplier: true,
          },
        });
      }
    });
  }

  /**
   * Add a new batch to existing inventory
   * This is used when purchasing more stock of an existing product
   * Updates the inventory stock to be the sum of all batches
   */
  async addBatchToInventory(
    inventoryId: number,
    batchNumber: string,
    quantity: number,
    expiryDate: Date | string,
    purchaseDate?: Date | string,
    supplierId?: number,
  ): Promise<Inventory> {
    // Convert string dates to Date objects if needed
    const expiryDateObj = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
    const purchaseDateObj = purchaseDate ? (purchaseDate instanceof Date ? purchaseDate : new Date(purchaseDate)) : undefined;
    
    // Validate dates
    if (isNaN(expiryDateObj.getTime())) {
      throw new Error(`Invalid expiry date: ${expiryDate}`);
    }
    
    return this.prisma.$transaction(async (tx) => {
      // Verify inventory exists
      const inventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new Error(`Inventory with ID ${inventoryId} not found`);
      }

      // Check if batch already exists
      const existingBatch = await tx.stockBatch.findUnique({
        where: {
          inventoryId_batchNumber: {
            inventoryId,
            batchNumber,
          },
        },
      });

      if (existingBatch) {
        // If batch exists, increment quantity
        await tx.stockBatch.update({
          where: {
            inventoryId_batchNumber: {
              inventoryId,
              batchNumber,
            },
          },
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
      } else {
        // Create new batch
        await tx.stockBatch.create({
          data: {
            inventoryId,
            batchNumber,
            quantity,
            expiryDate: expiryDateObj,
          },
        });
      }

      // Calculate total stock from all batches
      const batches = await tx.stockBatch.findMany({
        where: { inventoryId },
      });

      const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

      // Update inventory stock to match total from batches
      // Optionally update supplier if different supplier provided
      const updateData: any = {
        stock: totalStock,
      };

      if (supplierId && supplierId !== inventory.supplierId) {
        // Note: In a real system, you might want to track multiple suppliers per product
        // For now, we'll update the supplier if a different one is provided
        updateData.supplierId = supplierId;
      }

      const updatedInventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: updateData,
        include: {
          category: true,
          supplier: true,
          stockBatches: {
            orderBy: {
              expiryDate: 'asc', // Oldest batches first
            },
          },
        },
      });

      return updatedInventory;
    });
  }

  async findLowStock(threshold: number): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      where: {
        stock: {
          lte: threshold,
        },
      },
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async findExpiringSoon(days: number): Promise<Inventory[]> {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return this.prisma.inventory.findMany({
      where: {
        expiryDate: {
          lte: date,
        },
      },
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async searchMedicines(searchDto: MedicineSearchDto) {
    const where: any = {};

    if (searchDto.diseaseName) {
      where.diseases = {
        some: {
          disease: {
            name: {
              contains: searchDto.diseaseName,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (searchDto.formula) {
      where.formula = {
        contains: searchDto.formula,
        mode: 'insensitive',
      };
    }

    if (searchDto.genericName) {
      where.genericName = {
        contains: searchDto.genericName,
        mode: 'insensitive',
      };
    }

    if (searchDto.brandName) {
      where.brandName = {
        contains: searchDto.brandName,
        mode: 'insensitive',
      };
    }

    if (searchDto.type) {
      where.type = searchDto.type;
    }

    if (searchDto.manufacturer) {
      where.manufacturer = {
        contains: searchDto.manufacturer,
        mode: 'insensitive',
      };
    }

    if (searchDto.dosageForm) {
      where.dosageForm = {
        contains: searchDto.dosageForm,
        mode: 'insensitive',
      };
    }

    if (searchDto.strength) {
      where.strength = {
        contains: searchDto.strength,
        mode: 'insensitive',
      };
    }

    if (searchDto.indications?.length) {
      where.indications = {
        hasSome: searchDto.indications,
      };
    }

    if (searchDto.minPrice !== undefined || searchDto.maxPrice !== undefined) {
      where.retailPrice = {
        ...(searchDto.minPrice !== undefined && { gte: searchDto.minPrice }),
        ...(searchDto.maxPrice !== undefined && { lte: searchDto.maxPrice }),
      };
    }

    if (searchDto.minStock !== undefined || searchDto.maxStock !== undefined) {
      where.stock = {
        ...(searchDto.minStock !== undefined && { gte: searchDto.minStock }),
        ...(searchDto.maxStock !== undefined && { lte: searchDto.maxStock }),
      };
    }

    if (searchDto.expiryDateStart || searchDto.expiryDateEnd) {
      where.expiryDate = {
        ...(searchDto.expiryDateStart && { gte: searchDto.expiryDateStart }),
        ...(searchDto.expiryDateEnd && { lte: searchDto.expiryDateEnd }),
      };
    }

    if (searchDto.categoryId) {
      where.categoryId = searchDto.categoryId;
    }

    if (searchDto.supplierId) {
      where.supplierId = searchDto.supplierId;
    }

    if (searchDto.batchNumber) {
      where.batchNumber = {
        contains: searchDto.batchNumber,
        mode: 'insensitive',
      };
    }

    if (searchDto.storageConditions) {
      where.storage = {
        contains: searchDto.storageConditions,
        mode: 'insensitive',
      };
    }

    if (searchDto.therapeuticClass) {
      where.therapeuticClass = {
        contains: searchDto.therapeuticClass,
        mode: 'insensitive',
      };
    }

    if (searchDto.activeIngredients?.length) {
      where.activeIngredients = {
        hasSome: searchDto.activeIngredients,
      };
    }

    if (searchDto.contraindications?.length) {
      where.contraindications = {
        hasSome: searchDto.contraindications,
      };
    }

    if (searchDto.sideEffects?.length) {
      where.sideEffects = {
        hasSome: searchDto.sideEffects,
      };
    }

    if (searchDto.prescriptionRequired !== undefined) {
      where.prescriptionRequired = searchDto.prescriptionRequired;
    }

    if (searchDto.ageRestriction) {
      where.ageRestriction = {
        contains: searchDto.ageRestriction,
        mode: 'insensitive',
      };
    }

    if (searchDto.pregnancyCategory) {
      where.pregnancyCategory = {
        contains: searchDto.pregnancyCategory,
        mode: 'insensitive',
      };
    }

    if (searchDto.shelfLife) {
      where.shelfLife = searchDto.shelfLife;
    }

    if (searchDto.manufacturingDateStart || searchDto.manufacturingDateEnd) {
      where.manufacturingDate = {
        ...(searchDto.manufacturingDateStart && { gte: searchDto.manufacturingDateStart }),
        ...(searchDto.manufacturingDateEnd && { lte: searchDto.manufacturingDateEnd }),
      };
    }

    if (searchDto.registrationNumber) {
      where.registrationNumber = {
        contains: searchDto.registrationNumber,
        mode: 'insensitive',
      };
    }

    if (searchDto.countryOfOrigin) {
      where.countryOfOrigin = {
        contains: searchDto.countryOfOrigin,
        mode: 'insensitive',
      };
    }

    if (searchDto.minWholesalePrice !== undefined || searchDto.maxWholesalePrice !== undefined) {
      where.wholeSalePrice = {
        ...(searchDto.minWholesalePrice !== undefined && { gte: searchDto.minWholesalePrice }),
        ...(searchDto.maxWholesalePrice !== undefined && { lte: searchDto.maxWholesalePrice }),
      };
    }

    if (searchDto.minProfitMargin !== undefined || searchDto.maxProfitMargin !== undefined) {
      where.profitMargin = {
        ...(searchDto.minProfitMargin !== undefined && { gte: searchDto.minProfitMargin }),
        ...(searchDto.maxProfitMargin !== undefined && { lte: searchDto.maxProfitMargin }),
      };
    }

    if (searchDto.minSalesLast30Days !== undefined || searchDto.maxSalesLast30Days !== undefined) {
      where.salesLast30Days = {
        ...(searchDto.minSalesLast30Days !== undefined && { gte: searchDto.minSalesLast30Days }),
        ...(searchDto.maxSalesLast30Days !== undefined && { lte: searchDto.maxSalesLast30Days }),
      };
    }

    if (searchDto.minReorderLevel !== undefined || searchDto.maxReorderLevel !== undefined) {
      where.reorderLevel = {
        ...(searchDto.minReorderLevel !== undefined && { gte: searchDto.minReorderLevel }),
        ...(searchDto.maxReorderLevel !== undefined && { lte: searchDto.maxReorderLevel }),
      };
    }

    const orderBy = searchDto.sortBy ? {
      [searchDto.sortBy]: searchDto.sortDirection || 'asc',
    } : undefined;

    return this.prisma.inventory.findMany({
      where,
      orderBy,
      include: {
        category: true,
        supplier: true,
        diseases: {
          include: {
            disease: true,
          },
        },
      },
    });
  }

  async findMedicinesByDisease(diseaseName: string) {
    return this.prisma.inventory.findMany({
      where: {
        diseases: {
          some: {
            disease: {
              name: {
                contains: diseaseName,
                mode: 'insensitive',
              },
            },
          },
        },
      },
      include: {
        diseases: {
          include: {
            disease: true,
          },
          orderBy: {
            priority: 'asc',
          },
        },
      },
    });
  }

  async findMedicinesByFormula(formula: string) {
    return this.prisma.inventory.findMany({
      where: {
        formula: {
          contains: formula,
          mode: 'insensitive',
        },
      },
      include: {
        diseases: {
          include: {
            disease: true,
          },
        },
      },
    });
  }

  async createMedicine(createMedicineDto: CreateMedicineDto & Partial<{
    type: Type;
    rackLocation: string;
    wholeSalePrice: number;
    retailPrice: number;
    categoryId: number;
    supplierId: number;
    stock: number;
  }>) {
    const { diseases, ...medicineData } = createMedicineDto;

    return this.prisma.inventory.create({
      data: {
        ...medicineData,
        diseases: diseases ? {
          create: diseases.map(disease => ({
            disease: {
              connectOrCreate: {
                where: { name: disease.diseaseName },
                create: {
                  name: disease.diseaseName,
                },
              },
            },
            priority: disease.priority,
            notes: disease.notes,
          })),
        } : undefined,
      } as any, // Type assertion to handle Prisma input type complexity
      include: {
        diseases: {
          include: {
            disease: true,
          },
        },
      },
    });
  }

  async addDiseaseToMedicine(medicineId: number, diseaseDto: MedicineDiseaseDto) {
    return this.prisma.medicineDisease.create({
      data: {
        medicine: {
          connect: { id: medicineId },
        },
        disease: {
          connectOrCreate: {
            where: { name: diseaseDto.diseaseName },
            create: {
              name: diseaseDto.diseaseName,
            },
          },
        },
        priority: diseaseDto.priority,
        notes: diseaseDto.notes,
      },
      include: {
        disease: true,
      },
    });
  }

  async removeDiseaseFromMedicine(medicineId: number, diseaseId: number) {
    return this.prisma.medicineDisease.delete({
      where: {
        medicineId_diseaseId: {
          medicineId,
          diseaseId,
        },
      },
    });
  }

  async bulkCreateMedicines(bulkCreateDto: BulkCreateMedicineDto) {
    const medicines = await Promise.all(
      bulkCreateDto.medicines.map(medicine => this.createMedicine(medicine))
    );
    return medicines;
  }

  async bulkUpdateMedicines(bulkUpdateDto: BulkUpdateMedicineDto) {
    const { medicineIds, ...updateData } = bulkUpdateDto;
    const medicines = await Promise.all(
      medicineIds.map(id => this.update(id, updateData))
    );
    return medicines;
  }

  async bulkDeleteMedicines(bulkDeleteDto: BulkDeleteMedicineDto) {
    const medicines = await Promise.all(
      bulkDeleteDto.medicineIds.map(id => this.remove(id))
    );
    return medicines;
  }

  async bulkUpdateStock(bulkUpdateStockDto: BulkUpdateStockDto) {
    const { medicineIds, quantity } = bulkUpdateStockDto;
    const medicines = await Promise.all(
      medicineIds.map(id => this.updateStock(id, quantity))
    );
    return medicines;
  }

  async advancedSearch(advancedSearchDto: AdvancedSearchDto) {
    const whereConditions = advancedSearchDto.conditions.map(condition => {
      const where = this.buildSearchWhere(condition.criteria);
      return {
        ...where,
        operator: condition.operator || LogicalOperator.AND,
      };
    });

    const where = this.combineWhereConditions(whereConditions);
    const include = {
      category: true,
      supplier: true,
      stockBatches: true,
    };

    const results = await this.prisma.inventory.findMany({
      where,
      include,
    });

    if (advancedSearchDto.aggregations?.length) {
      const aggregations = await this.calculateAggregations(results, advancedSearchDto.aggregations);
      return {
        results,
        aggregations,
      };
    }

    return results;
  }

  private buildSearchWhere(searchDto: MedicineSearchDto) {
    const where: any = {};
    // ... existing search criteria building ...
    return where;
  }

  private combineWhereConditions(conditions: any[]) {
    if (conditions.length === 1) {
      return conditions[0];
    }

    return {
      AND: conditions.map(condition => {
        const { operator, ...where } = condition;
        return where;
      }),
    };
  }

  private async calculateAggregations(results: any[], aggregations: any[]) {
    const aggregationResults = {};

    for (const agg of aggregations) {
      const { field, function: func, groupBy } = agg;
      
      if (groupBy) {
        // Group by aggregation
        const grouped = results.reduce((acc, item) => {
          const groupKey = item[groupBy];
          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(item[field]);
          return acc;
        }, {});

        aggregationResults[`${func}_${field}_by_${groupBy}`] = Object.entries(grouped).reduce((acc, [key, values]) => {
          acc[key] = this.calculateAggregationFunction(values as number[], func);
          return acc;
        }, {} as Record<string, number>);
      } else {
        // Simple aggregation
        const values = results.map(item => item[field]);
        aggregationResults[`${func}_${field}`] = this.calculateAggregationFunction(values, func);
      }
    }

    return aggregationResults;
  }

  private calculateAggregationFunction(values: number[], func: AggregateFunction) {
    switch (func) {
      case AggregateFunction.COUNT:
        return values.length;
      case AggregateFunction.SUM:
        return values.reduce((sum, val) => sum + val, 0);
      case AggregateFunction.AVG:
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case AggregateFunction.MIN:
        return Math.min(...values);
      case AggregateFunction.MAX:
        return Math.max(...values);
      default:
        return null;
    }
  }

  async updateStockWithExpiry(inventoryId: number, batchNumber: string, quantity: number, expiryDate: Date) {
    return this.prisma.stockBatch.upsert({
      where: {
        inventoryId_batchNumber: {
          inventoryId,
          batchNumber,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        inventoryId,
        batchNumber,
        quantity,
        expiryDate,
      },
    });
  }

  /**
   * Add a new batch to existing inventory
   * Updates the inventory stock to be the sum of all batches
   */
  async addBatch(inventoryId: number, batchNumber: string, quantity: number, expiryDate: Date): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      // Check if batch already exists
      const existingBatch = await tx.stockBatch.findUnique({
        where: {
          inventoryId_batchNumber: {
            inventoryId,
            batchNumber,
          },
        },
      });

      if (existingBatch) {
        // If batch exists, increment quantity
        await tx.stockBatch.update({
          where: {
            inventoryId_batchNumber: {
              inventoryId,
              batchNumber,
            },
          },
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
      } else {
        // Create new batch
        await tx.stockBatch.create({
          data: {
            inventoryId,
            batchNumber,
            quantity,
            expiryDate,
          },
        });
      }

      // Calculate total stock from all batches
      const batches = await tx.stockBatch.findMany({
        where: { inventoryId },
      });

      const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

      // Update inventory stock to match total from batches
      const inventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          stock: totalStock,
        },
        include: {
          category: true,
          supplier: true,
          stockBatches: {
            orderBy: {
              expiryDate: 'asc',
            },
          },
        },
      });

      return inventory;
    });
  }

  async sellFromStock(inventoryId: number, quantity: number) {
    // Get available stock batches ordered by expiry date (FEFO - First Expired, First Out)
    const availableBatches = await this.prisma.stockBatch.findMany({
      where: {
        inventoryId,
        quantity: {
          gt: 0,
        },
        expiryDate: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    let remainingQuantity = quantity;
    const usedBatches = [];

    for (const batch of availableBatches) {
      if (remainingQuantity <= 0) break;

      const quantityToUse = Math.min(batch.quantity, remainingQuantity);
      
      await this.prisma.stockBatch.update({
        where: { id: batch.id },
        data: {
          quantity: {
            decrement: quantityToUse,
          },
        },
      });

      usedBatches.push({
        batchId: batch.id,
        quantity: quantityToUse,
      });

      remainingQuantity -= quantityToUse;
    }

    if (remainingQuantity > 0) {
      throw new Error('Insufficient stock available');
    }

    return usedBatches;
  }

  async getStockSummary(inventoryId: number) {
    const batches = await this.prisma.stockBatch.findMany({
      where: { inventoryId },
      orderBy: { expiryDate: 'asc' },
    });

    return {
      totalQuantity: batches.reduce((sum, batch) => sum + batch.quantity, 0),
      batches: batches.map(batch => ({
        batchNumber: batch.batchNumber,
        quantity: batch.quantity,
        expiryDate: batch.expiryDate,
        daysUntilExpiry: Math.ceil((batch.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      })),
    };
  }

  async transferBatch(transferDto: BatchTransferDto, userId: number) {
    const { sourceBatchId, targetBatchId, quantity, reason } = transferDto;

    // Verify source batch has enough quantity
    const sourceBatch = await this.prisma.stockBatch.findUnique({
      where: { id: sourceBatchId },
    });

    if (!sourceBatch || sourceBatch.quantity < quantity) {
      throw new Error('Insufficient quantity in source batch');
    }

    // Create transfer record
    const transfer = await this.prisma.batchTransfer.create({
      data: {
        sourceBatchId,
        targetBatchId,
        quantity,
        reason,
        userId,
      },
    });

    // Update quantities
    await this.prisma.stockBatch.update({
      where: { id: sourceBatchId },
      data: { quantity: { decrement: quantity } },
    });

    await this.prisma.stockBatch.update({
      where: { id: targetBatchId },
      data: { quantity: { increment: quantity } },
    });

    return transfer;
  }

  async takeHomeUseProduct(homeUseDto: HomeUseProductDto, userId: number) {
    const { inventoryId, batchId, quantity, purpose, willPay, isBusinessExpense } = homeUseDto;

    // Get inventory and batch details
    const [inventory, batch] = await Promise.all([
      this.prisma.inventory.findUnique({
        where: { id: inventoryId },
      }),
      this.prisma.stockBatch.findUnique({
        where: { id: batchId },
      }),
    ]);

    if (!inventory || !batch || batch.quantity < quantity) {
      throw new Error('Insufficient quantity in batch');
    }

    // Calculate costs
    const costPrice = inventory.wholeSalePrice * quantity;
    const retailPrice = inventory.retailPrice * quantity;

    // Create home use record
    const homeUse = await this.prisma.homeUseProduct.create({
      data: {
        inventoryId,
        batchId,
        quantity,
        purpose,
        userId,
        status: HomeUseStatus.TAKEN,
        costPrice,
        retailPrice,
        isPaid: !willPay && !isBusinessExpense, // Mark as paid if it's a business expense
        paymentDate: !willPay && !isBusinessExpense ? new Date() : null,
      },
    });

    // If it's a business expense, create an expense record
    if (isBusinessExpense) {
      const expense = await this.prisma.expense.create({
        data: {
          description: `Home use product: ${inventory.name} - ${purpose}`,
          amount: costPrice,
          date: new Date(),
          expenseType: 'HOME_USE_PRODUCT',
        },
      });

      // Link expense to home use record
      await this.prisma.homeUseProduct.update({
        where: { id: homeUse.id },
        data: { expenseId: expense.id },
      });
    }

    // Update batch quantity
    await this.prisma.stockBatch.update({
      where: { id: batchId },
      data: { quantity: { decrement: quantity } },
    });

    return homeUse;
  }

  async returnHomeUseProduct(returnDto: ReturnHomeUseProductDto) {
    const { id, status, notes, paymentAmount } = returnDto;

    const homeUse = await this.prisma.homeUseProduct.findUnique({
      where: { id },
      include: {
        inventory: true,
      },
    });

    if (!homeUse) {
      throw new Error('Home use record not found');
    }

    if (homeUse.status !== HomeUseStatus.TAKEN) {
      throw new Error('Product is not in TAKEN status');
    }

    // Update home use record
    const updatedHomeUse = await this.prisma.homeUseProduct.update({
      where: { id },
      data: {
        status,
        returnedAt: new Date(),
        notes,
        isPaid: status === HomeUseStatus.RETURNED ? true : homeUse.isPaid,
        paymentDate: status === HomeUseStatus.RETURNED ? new Date() : homeUse.paymentDate,
      },
    });

    // If returned, update batch quantity
    if (status === HomeUseStatus.RETURNED) {
      await this.prisma.stockBatch.update({
        where: { id: homeUse.batchId },
        data: { quantity: { increment: homeUse.quantity } },
      });
    }

    // If payment is provided, create a payment record
    if (paymentAmount && paymentAmount > 0) {
      await this.prisma.expense.create({
        data: {
          description: `Payment for home use product: ${homeUse.inventory.name}`,
          amount: paymentAmount,
          date: new Date(),
          expenseType: 'HOME_USE_PRODUCT',
        },
      });
    }

    return updatedHomeUse;
  }

  async createStockAlert(alertDto: StockAlertDto) {
    return this.prisma.stockAlert.create({
      data: {
        inventoryId: alertDto.inventoryId,
        batchId: alertDto.batchId,
        type: alertDto.type,
        threshold: alertDto.threshold,
        message: alertDto.message,
        isActive: true,
      },
    });
  }

  async getAllStockAlerts() {
    return this.prisma.stockAlert.findMany({
      include: {
        inventory: {
          include: {
            category: true,
            supplier: true,
          },
        },
        batch: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkStockAlerts() {
    const alerts = await this.prisma.stockAlert.findMany({
      where: { isActive: true },
      include: {
        inventory: true,
        batch: true,
      },
    });

    const triggeredAlerts = [];

    for (const alert of alerts) {
      let isTriggered = false;

      switch (alert.type) {
        case AlertType.EXPIRY:
          if (alert.batch && alert.batch.expiryDate) {
            const daysUntilExpiry = Math.ceil(
              (alert.batch.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            isTriggered = daysUntilExpiry <= alert.threshold;
          }
          break;

        case AlertType.LOW_STOCK:
          if (alert.batch) {
            isTriggered = alert.batch.quantity <= alert.threshold;
          } else {
            const totalStock = await this.getStockSummary(alert.inventoryId);
            isTriggered = totalStock.totalQuantity <= alert.threshold;
          }
          break;

        case AlertType.HIGH_STOCK:
          if (alert.batch) {
            isTriggered = alert.batch.quantity >= alert.threshold;
          } else {
            const totalStock = await this.getStockSummary(alert.inventoryId);
            isTriggered = totalStock.totalQuantity >= alert.threshold;
          }
          break;
      }

      if (isTriggered) {
        triggeredAlerts.push(alert);
      }
    }

    return triggeredAlerts;
  }

  async generateBatchReport(reportDto: BatchReportDto) {
    const { startDate, endDate, includeHomeUse, includeTransfers, includeAlerts } = reportDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const report = {
      period: { start, end },
      batches: [],
      homeUse: includeHomeUse ? [] : undefined,
      transfers: includeTransfers ? [] : undefined,
      alerts: includeAlerts ? [] : undefined,
    };

    // Get all batches
    const batches = await this.prisma.stockBatch.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        inventory: true,
        sales: true,
      },
    });

    // Process each batch
    for (const batch of batches) {
      const batchReport = {
        batchNumber: batch.batchNumber,
        product: batch.inventory.name,
        initialQuantity: batch.quantity,
        currentQuantity: batch.quantity,
        expiryDate: batch.expiryDate,
        sales: batch.sales.length,
        totalSalesQuantity: batch.sales.reduce((sum, sale) => sum + sale.quantity, 0),
      };

      if (includeHomeUse) {
        const homeUse = await this.prisma.homeUseProduct.findMany({
          where: {
            batchId: batch.id,
            takenAt: {
              gte: start,
              lte: end,
            },
          },
        });
        report.homeUse.push(...homeUse);
      }

      if (includeTransfers) {
        const transfers = await this.prisma.batchTransfer.findMany({
          where: {
            OR: [
              { sourceBatchId: batch.id },
              { targetBatchId: batch.id },
            ],
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        });
        report.transfers.push(...transfers);
      }

      if (includeAlerts) {
        const alerts = await this.prisma.stockAlert.findMany({
          where: {
            batchId: batch.id,
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        });
        report.alerts.push(...alerts);
      }

      report.batches.push(batchReport);
    }

    return report;
  }

  async generateHomeUseReport(reportDto: HomeUseReportDto) {
    const {
      startDate,
      endDate,
      includePaid = true,
      includeUnpaid = true,
      includeBusinessExpenses = true,
      groupByUser = false,
      groupByProduct = false,
    } = reportDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Build where clause
    const where: any = {
      takenAt: {
        gte: start,
        lte: end,
      },
    };

    if (!includePaid || !includeUnpaid) {
      where.isPaid = includePaid ? true : false;
    }

    if (!includeBusinessExpenses) {
      where.expenseId = null;
    }

    // Get home use records
    const homeUseRecords = await this.prisma.homeUseProduct.findMany({
      where,
      include: {
        inventory: true,
        takenBy: true,
        expense: true,
      },
    });

    // Calculate totals
    const totals = {
      totalQuantity: 0,
      totalCostPrice: 0,
      totalRetailPrice: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      totalBusinessExpense: 0,
    };

    homeUseRecords.forEach(record => {
      totals.totalQuantity += record.quantity;
      totals.totalCostPrice += record.costPrice;
      totals.totalRetailPrice += record.retailPrice;

      if (record.isPaid) {
        totals.totalPaid += record.costPrice;
      } else {
        totals.totalUnpaid += record.costPrice;
      }

      if (record.expenseId) {
        totals.totalBusinessExpense += record.costPrice;
      }
    });

    // Group data if requested
    let groupedData = null;
    if (groupByUser || groupByProduct) {
      groupedData = {};

      homeUseRecords.forEach(record => {
        const groupKey = groupByUser
          ? record.takenBy.username
          : record.inventory.name;

        if (!groupedData[groupKey]) {
          groupedData[groupKey] = {
            quantity: 0,
            costPrice: 0,
            retailPrice: 0,
            paid: 0,
            unpaid: 0,
            businessExpense: 0,
            records: [],
          };
        }

        groupedData[groupKey].quantity += record.quantity;
        groupedData[groupKey].costPrice += record.costPrice;
        groupedData[groupKey].retailPrice += record.retailPrice;

        if (record.isPaid) {
          groupedData[groupKey].paid += record.costPrice;
        } else {
          groupedData[groupKey].unpaid += record.costPrice;
        }

        if (record.expenseId) {
          groupedData[groupKey].businessExpense += record.costPrice;
        }

        groupedData[groupKey].records.push(record);
      });
    }

    return {
      period: { start, end },
      totals,
      groupedData,
      records: homeUseRecords,
    };
  }

  async generateAnalyticsReport(reportDto: AnalyticsReportDto) {
    const { startDate, endDate, timeFrame, reportType, includeDetails, groupByCategory, groupBySupplier, minThreshold } = reportDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    let data;
    switch (reportType) {
      case ReportType.DEMAND:
        data = await this.generateDemandReport(start, end, timeFrame, minThreshold);
        break;
      case ReportType.SALES:
        data = await this.generateSalesReport(start, end, timeFrame, minThreshold);
        break;
      case ReportType.INVENTORY:
        data = await this.generateInventoryReport(start, end, timeFrame);
        break;
      case ReportType.PAYMENT:
        data = await this.generatePaymentReport(start, end, timeFrame);
        break;
      case ReportType.PROFIT:
        data = await this.generateProfitReport(start, end, timeFrame);
        break;
    }

    if (groupByCategory) {
      data = this.groupDataByCategory(data);
    }

    if (groupBySupplier) {
      data = this.groupDataBySupplier(data);
    }

    return {
      period: { start, end },
      timeFrame,
      reportType,
      data,
      details: includeDetails ? await this.getDetailedRecords(reportType, start, end) : undefined,
    };
  }

  private async generateDemandReport(start: Date, end: Date, timeFrame: TimeFrame, minThreshold?: number) {
    const demands = await this.prisma.demand.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...(minThreshold && { quantity: { gte: minThreshold } }),
      },
      include: {
        inventory: true,
      },
    });

    return this.groupDataByTimeFrame(demands, timeFrame, 'quantity');
  }

  private async generateSalesReport(start: Date, end: Date, timeFrame: TimeFrame, minThreshold?: number) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...(minThreshold && { quantity: { gte: minThreshold } }),
      },
      include: {
        inventory: true,
      },
    });

    return this.groupDataByTimeFrame(sales, timeFrame, 'quantity');
  }

  private async generateInventoryReport(start: Date, end: Date, timeFrame: TimeFrame) {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
    });

    return this.groupDataByTimeFrame(inventory, timeFrame, 'stock');
  }

  private async generatePaymentReport(start: Date, end: Date, timeFrame: TimeFrame) {
    const payments = await this.prisma.expense.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    return this.groupDataByTimeFrame(payments, timeFrame, 'amount');
  }

  private async generateProfitReport(start: Date, end: Date, timeFrame: TimeFrame) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    const profitData = sales.map(sale => ({
      date: sale.createdAt,
      amount: (sale.price - sale.inventory.wholeSalePrice) * sale.quantity,
    }));

    return this.groupDataByTimeFrame(profitData, timeFrame, 'amount');
  }

  private groupDataByTimeFrame(data: any[], timeFrame: TimeFrame, valueField: string) {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item.date || item.createdAt);
      let key;

      switch (timeFrame) {
        case TimeFrame.DAILY:
          key = date.toISOString().split('T')[0];
          break;
        case TimeFrame.WEEKLY:
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case TimeFrame.MONTHLY:
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case TimeFrame.QUARTERLY:
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case TimeFrame.YEARLY:
          key = date.getFullYear().toString();
          break;
      }

      if (!grouped[key]) {
        grouped[key] = {
          total: 0,
          count: 0,
          items: [],
        };
      }

      grouped[key].total += item[valueField];
      grouped[key].count++;
      grouped[key].items.push(item);
    });

    return grouped;
  }

  private getWeekNumber(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  private groupDataByCategory(data: any) {
    const grouped = {};
    
    Object.entries(data).forEach(([timeKey, timeData]: [string, any]) => {
      const categoryGroups: any = {};
      
      if (timeData?.items) {
        timeData.items.forEach((item: any) => {
          const category = item.inventory?.category?.name || 'Uncategorized';
          if (!categoryGroups[category]) {
            categoryGroups[category] = {
              total: 0,
              count: 0,
              items: [],
            };
          }
          
          categoryGroups[category].total += item.quantity || item.amount;
          categoryGroups[category].count++;
          categoryGroups[category].items.push(item);
        });
      }
      
      grouped[timeKey] = categoryGroups;
    });
    
    return grouped;
  }

  private groupDataBySupplier(data: any) {
    const grouped = {};
    
    Object.entries(data).forEach(([timeKey, timeData]: [string, any]) => {
      const supplierGroups: any = {};
      
      if (timeData?.items) {
        timeData.items.forEach((item: any) => {
          const supplier = item.inventory?.supplier?.supplierName || 'Unknown';
          if (!supplierGroups[supplier]) {
            supplierGroups[supplier] = {
              total: 0,
              count: 0,
              items: [],
            };
          }
          
          supplierGroups[supplier].total += item.quantity || item.amount;
          supplierGroups[supplier].count++;
          supplierGroups[supplier].items.push(item);
        });
      }
      
      grouped[timeKey] = supplierGroups;
    });
    
    return grouped;
  }

  private async getDetailedRecords(reportType: ReportType, start: Date, end: Date) {
    switch (reportType) {
      case ReportType.DEMAND:
        return this.prisma.demand.findMany({
          where: { createdAt: { gte: start, lte: end } },
          include: { inventory: true },
        });
      case ReportType.SALES:
        return this.prisma.sale.findMany({
          where: { createdAt: { gte: start, lte: end } },
          include: { inventory: true },
        });
      case ReportType.INVENTORY:
        return this.prisma.inventory.findMany({
          include: { stockBatches: true },
        });
      case ReportType.PAYMENT:
        return this.prisma.expense.findMany({
          where: { date: { gte: start, lte: end } },
        });
      default:
        return [];
    }
  }

  async trackPayments(trackingDto: PaymentTrackingDto) {
    const { startDate, endDate, includePending, includePaid, groupByMethod } = trackingDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const payments = await this.prisma.expense.findMany({
      where: {
        date: { gte: start, lte: end },
        ...(includePending !== undefined && { isPaid: includePaid }),
      },
    });

    const report = {
      period: { start, end },
      totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
      totalCount: payments.length,
      payments: groupByMethod ? this.groupPaymentsByMethod(payments) : payments,
    };

    return report;
  }

  private groupPaymentsByMethod(payments: any[]) {
    return payments.reduce((groups, payment) => {
      const method = payment.paymentMethod || 'Unknown';
      if (!groups[method]) {
        groups[method] = {
          total: 0,
          count: 0,
          payments: [],
        };
      }
      groups[method].total += payment.amount;
      groups[method].count++;
      groups[method].payments.push(payment);
      return groups;
    }, {});
  }

  async analyzeInventoryImpact(impactDto: InventoryImpactDto) {
    const { startDate, endDate, includeMovements, includeExpiry, includeCost } = impactDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const analysis = {
      period: { start, end },
      stockMovements: includeMovements ? await this.analyzeStockMovements(start, end) : undefined,
      expiryAnalysis: includeExpiry ? await this.analyzeExpiry(start, end) : undefined,
      costAnalysis: includeCost ? await this.analyzeCosts(start, end) : undefined,
    };

    return analysis;
  }

  private async analyzeStockMovements(start: Date, end: Date) {
    const movements = await this.prisma.stockBatch.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
        sales: true,
        sourceTransfers: true,
        targetTransfers: true,
      },
    });

    return movements.map(movement => ({
      batchNumber: movement.batchNumber,
      product: movement.inventory.name,
      initialQuantity: movement.quantity,
      sales: movement.sales.reduce((sum, sale) => sum + sale.quantity, 0),
      transfers: {
        out: movement.sourceTransfers.reduce((sum, transfer) => sum + transfer.quantity, 0),
        in: movement.targetTransfers.reduce((sum, transfer) => sum + transfer.quantity, 0),
      },
      netMovement: movement.quantity - movement.sales.reduce((sum, sale) => sum + sale.quantity, 0),
    }));
  }

  private async analyzeExpiry(start: Date, end: Date) {
    const batches = await this.prisma.stockBatch.findMany({
      where: {
        expiryDate: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return batches.map(batch => ({
      batchNumber: batch.batchNumber,
      product: batch.inventory.name,
      quantity: batch.quantity,
      expiryDate: batch.expiryDate,
      daysUntilExpiry: Math.ceil((batch.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      value: batch.quantity * batch.inventory.wholeSalePrice,
    }));
  }

  private async analyzeCosts(start: Date, end: Date) {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
    });

    return inventory.map(item => ({
      product: item.name,
      totalCost: item.stockBatches.reduce((sum, batch) => sum + (batch.quantity * item.wholeSalePrice), 0),
      totalValue: item.stockBatches.reduce((sum, batch) => sum + (batch.quantity * item.retailPrice), 0),
      potentialProfit: item.stockBatches.reduce((sum, batch) => 
        sum + (batch.quantity * (item.retailPrice - item.wholeSalePrice)), 0),
    }));
  }

  async generateVisualization(visualizationDto: VisualizationDto) {
    const { startDate, endDate, chartType, metrics, groupBy, includeTrend } = visualizationDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const data = await this.getMetricsData(metrics, start, end, groupBy);
    const visualization = this.formatVisualizationData(data, chartType, includeTrend);

    return {
      type: chartType,
      data: visualization,
      metadata: {
        metrics,
        period: { start, end },
        groupBy,
        includeTrend,
      },
    };
  }

  private async getMetricsData(metrics: MetricType[], start: Date, end: Date, groupBy?: string) {
    const data = {};

    for (const metric of metrics) {
      switch (metric) {
        case MetricType.SALES_VOLUME:
          data[metric] = await this.getSalesVolumeData(start, end, groupBy);
          break;
        case MetricType.REVENUE:
          data[metric] = await this.getRevenueData(start, end, groupBy);
          break;
        case MetricType.PROFIT_MARGIN:
          data[metric] = await this.getProfitMarginData(start, end, groupBy);
          break;
        case MetricType.STOCK_LEVEL:
          data[metric] = await this.getStockLevelData(start, end, groupBy);
          break;
        case MetricType.EXPIRY_RATE:
          data[metric] = await this.getExpiryRateData(start, end, groupBy);
          break;
        case MetricType.TURNOVER_RATE:
          data[metric] = await this.getTurnoverRateData(start, end, groupBy);
          break;
        case MetricType.CUSTOMER_RETENTION:
          data[metric] = await this.getCustomerRetentionData(start, end, groupBy);
          break;
        case MetricType.PRODUCT_PERFORMANCE:
          data[metric] = await this.getProductPerformanceData(start, end, groupBy);
          break;
      }
    }

    return data;
  }

  private formatVisualizationData(data: any, chartType: ChartType, includeTrend: boolean) {
    switch (chartType) {
      case ChartType.LINE:
        return this.formatLineChartData(data, includeTrend);
      case ChartType.BAR:
        return this.formatBarChartData(data);
      case ChartType.PIE:
        return this.formatPieChartData(data);
      case ChartType.SCATTER:
        return this.formatScatterChartData(data);
      case ChartType.AREA:
        return this.formatAreaChartData(data, includeTrend);
      default:
        return data;
    }
  }

  async exportReport(exportDto: ExportReportDto) {
    const { startDate, endDate, format, reportType, includeHeaders, filename } = exportDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const reportResult = await this.generateAnalyticsReport({
      startDate,
      endDate,
      reportType,
      timeFrame: TimeFrame.DAILY,
    });

    // Extract the actual data array from the report result
    // The report result has structure: { period, timeFrame, reportType, data, details }
    // We need to convert the data to an array format for export
    let exportData: any[] = [];
    
    // First, check if details exists and is an array
    if (reportResult.details && Array.isArray(reportResult.details)) {
      exportData = reportResult.details;
    } 
    // Check if details is an object with items array
    else if (reportResult.details && typeof reportResult.details === 'object' && (reportResult.details as any).items && Array.isArray((reportResult.details as any).items)) {
      exportData = (reportResult.details as any).items;
    }
    // Check if data exists and is an array
    else if (reportResult.data) {
      if (Array.isArray(reportResult.data)) {
        exportData = reportResult.data;
      } else if (reportResult.data.records && Array.isArray(reportResult.data.records)) {
        // If data has a records property, use that
        exportData = reportResult.data.records;
      } else if ((reportResult.data as any).items && Array.isArray((reportResult.data as any).items)) {
        // If data has an items property, use that
        exportData = (reportResult.data as any).items;
      } else {
        // Convert object to array of key-value pairs
        exportData = [reportResult.data];
      }
    }

    // If still no data, create a summary row
    if (exportData.length === 0) {
      exportData = [{
        period: `${reportResult.period?.start?.toISOString()} to ${reportResult.period?.end?.toISOString()}`,
        reportType: reportResult.reportType,
        timeFrame: reportResult.timeFrame,
        message: 'No data available for the selected period',
      }];
    }

    switch (format) {
      case ExportFormat.CSV:
        return this.exportToCSV(exportData, includeHeaders, filename);
      case ExportFormat.EXCEL:
        return this.exportToExcel(exportData, includeHeaders, filename);
      case ExportFormat.PDF:
        return this.exportToPDF(exportData, includeHeaders, filename);
      case ExportFormat.JSON:
        return this.exportToJSON(reportResult, filename); // For JSON, export the full report structure
      default:
        throw new Error('Unsupported export format');
    }
  }

  private async exportToCSV(data: any, includeHeaders: boolean, filename?: string) {
    const parser = new Parser({
      header: includeHeaders,
    });
    const csv = parser.parse(data);
    return {
      buffer: Buffer.from(csv),
      filename: filename || 'report.csv',
      contentType: 'text/csv',
    };
  }

  private async exportToExcel(data: any, includeHeaders: boolean, filename?: string) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');
      worksheet.addRow(['No data available']);
      const buffer = await workbook.xlsx.writeBuffer();
      return {
        buffer,
        filename: filename || 'report.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    if (includeHeaders && data[0] && typeof data[0] === 'object') {
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(key => ({
        header: key,
        key,
        width: 20,
      }));
    }

    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();
    return {
      buffer,
      filename: filename || 'report.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }

  private async exportToPDF(data: any, includeHeaders: boolean, filename?: string) {
    return new Promise<{ buffer: Buffer; filename: string; contentType: string }>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            buffer,
            filename: filename || 'report.pdf',
            contentType: 'application/pdf',
          });
        });
        doc.on('error', (error) => {
          reject(error);
        });

        // Add title
        doc.fontSize(20).font('Helvetica-Bold').text('Sales Report', { align: 'center' });
        doc.moveDown();

        if (!data || !Array.isArray(data) || data.length === 0) {
          doc.fontSize(12).font('Helvetica').text('No data available', { align: 'center' });
          doc.end();
          return;
        }

        // Flatten nested objects and create a clean data structure
        const flattenedData = data.map((row: any) => {
          if (!row || typeof row !== 'object') return row;
          
          const flattened: any = {};
          Object.keys(row).forEach(key => {
            const value = row[key];
            if (value === null || value === undefined) {
              flattened[key] = '';
            } else if (value instanceof Date) {
              flattened[key] = value.toLocaleDateString();
            } else if (typeof value === 'object' && !Array.isArray(value)) {
              // For nested objects like inventory, extract key fields as readable text
              const nestedFields: string[] = [];
              if (value.name) nestedFields.push(`Name: ${value.name}`);
              if (value.price !== undefined) nestedFields.push(`Price: ${value.price}`);
              if (value.stock !== undefined) nestedFields.push(`Stock: ${value.stock}`);
              flattened[key] = nestedFields.length > 0 ? nestedFields.join(', ') : JSON.stringify(value).substring(0, 50);
            } else if (Array.isArray(value)) {
              flattened[key] = value.join(', ');
            } else {
              flattened[key] = String(value);
            }
          });
          return flattened;
        });

        // Get headers from first row
        const firstRow = flattenedData[0];
        if (!firstRow || typeof firstRow !== 'object') {
          doc.fontSize(12).font('Helvetica').text('Invalid data format', { align: 'center' });
          doc.end();
          return;
        }

        // Select key headers for display (prioritize important fields)
        const allHeaders = Object.keys(firstRow);
        const priorityHeaders = ['id', 'name', 'quantity', 'price', 'totalAmount', 'discount', 'createdAt', 'invoiceId', 'customerId'];
        const relevantHeaders = [
          ...priorityHeaders.filter(h => allHeaders.includes(h)),
          ...allHeaders.filter(h => !priorityHeaders.includes(h) && !h.includes('inventory') && !h.includes('customer') && !h.includes('user'))
        ].slice(0, 8); // Limit to 8 columns for readability

        // Print table
        const startX = 50;
        const colWidth = 60;
        let currentY = doc.y;

        if (includeHeaders && relevantHeaders.length > 0) {
          doc.fontSize(9).font('Helvetica-Bold');
          relevantHeaders.forEach((header, idx) => {
            const displayName = header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).substring(0, 12);
            doc.text(displayName, startX + (idx * colWidth), currentY, { width: colWidth - 5 });
          });
          currentY += 15;
          doc.moveTo(startX, currentY).lineTo(startX + (relevantHeaders.length * colWidth), currentY).stroke();
          currentY += 5;
        }

        // Add data rows
        doc.fontSize(8).font('Helvetica');
        flattenedData.forEach((row: any, index: number) => {
          if (row && typeof row === 'object') {
            relevantHeaders.forEach((header, idx) => {
              const value = row[header] || '';
              const displayValue = String(value).substring(0, 15); // Truncate long values
              doc.text(displayValue, startX + (idx * colWidth), currentY, { width: colWidth - 5 });
            });
            currentY += 12;
            
            // Check if we need a new page
            if (currentY > 750) {
              doc.addPage();
              currentY = 50;
              // Reprint headers if needed
              if (includeHeaders) {
                doc.fontSize(9).font('Helvetica-Bold');
                relevantHeaders.forEach((header, idx) => {
                  const displayName = header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).substring(0, 12);
                  doc.text(displayName, startX + (idx * colWidth), currentY, { width: colWidth - 5 });
                });
                currentY += 15;
                doc.moveTo(startX, currentY).lineTo(startX + (relevantHeaders.length * colWidth), currentY).stroke();
                currentY += 5;
                doc.fontSize(8).font('Helvetica');
              }
            }
          }
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private async exportToJSON(data: any, filename?: string) {
    return {
      buffer: Buffer.from(JSON.stringify(data, null, 2)),
      filename: filename || 'report.json',
      contentType: 'application/json',
    };
  }

  async getDashboardSummary(summaryDto: DashboardSummaryDto) {
    const { timeFrame, includeSales, includeInventory, includeFinancial, includePerformance } = summaryDto;
    const summary: any = {};

    if (includeSales) {
      summary.sales = await this.getSalesSummary(timeFrame);
    }

    if (includeInventory) {
      summary.inventory = await this.getInventorySummary(timeFrame);
    }

    if (includeFinancial) {
      summary.financial = await this.getFinancialSummary(timeFrame);
    }

    if (includePerformance) {
      summary.performance = await this.getPerformanceSummary(timeFrame);
    }

    return summary;
  }

  private async getSalesSummary(timeFrame: TimeFrame) {
    const now = new Date();
    const start = this.getStartDate(timeFrame, now);

    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start },
      },
      include: {
        inventory: true,
      },
    });

    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0),
      averageOrderValue: sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0) / sales.length,
      topProducts: this.getTopProducts(sales),
    };
  }

  private async getInventorySummary(timeFrame: TimeFrame) {
    const now = new Date();
    const start = this.getStartDate(timeFrame, now);

    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start },
          },
        },
      },
    });

    return {
      totalProducts: inventory.length,
      lowStockItems: inventory.filter(item => item.stock <= 10).length, // Using 10 as default low stock threshold
      expiringSoon: await this.getExpiringSoonItems(start),
      stockValue: inventory.reduce((sum, item) => sum + item.stock * item.wholeSalePrice, 0),
    };
  }

  private async getFinancialSummary(timeFrame: TimeFrame) {
    const now = new Date();
    const start = this.getStartDate(timeFrame, now);

    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start },
      },
      include: {
        inventory: true,
      },
    });

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: { gte: start },
      },
    });

    const revenue = sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0);
    const cost = sales.reduce((sum, sale) => sum + sale.inventory.wholeSalePrice * sale.quantity, 0);
    const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      revenue,
      cost,
      expenses: expensesTotal,
      profit: revenue - cost - expensesTotal,
      profitMargin: ((revenue - cost - expensesTotal) / revenue) * 100,
    };
  }

  private async getPerformanceSummary(timeFrame: TimeFrame) {
    const now = new Date();
    const start = this.getStartDate(timeFrame, now);

    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start },
      },
    });

    return {
      salesGrowth: await this.calculateGrowth(sales, timeFrame),
      inventoryTurnover: await this.calculateInventoryTurnover(start),
      customerRetention: await this.calculateCustomerRetention(start),
      productPerformance: await this.calculateProductPerformance(start),
    };
  }

  private getStartDate(timeFrame: TimeFrame, now: Date): Date {
    const start = new Date(now);
    switch (timeFrame) {
      case TimeFrame.DAILY:
        start.setDate(start.getDate() - 1);
        break;
      case TimeFrame.WEEKLY:
        start.setDate(start.getDate() - 7);
        break;
      case TimeFrame.MONTHLY:
        start.setMonth(start.getMonth() - 1);
        break;
      case TimeFrame.QUARTERLY:
        start.setMonth(start.getMonth() - 3);
        break;
      case TimeFrame.YEARLY:
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    return start;
  }

  private getTopProducts(sales: any[], limit: number = 5) {
    const productSales = sales.reduce((acc, sale) => {
      const key = sale.inventory.name;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[key].quantity += sale.quantity;
      acc[key].revenue += sale.price * sale.quantity;
      return acc;
    }, {});

    return Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  private async getExpiringSoonItems(start: Date) {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return this.prisma.stockBatch.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
      include: {
        inventory: true,
      },
    });
  }

  private async calculateGrowth(sales: any[], timeFrame: TimeFrame) {
    const previousPeriod = new Date(this.getStartDate(timeFrame, new Date()));
    previousPeriod.setDate(previousPeriod.getDate() - this.getDaysInTimeFrame(timeFrame));

    const currentPeriodSales = sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0);
    const previousPeriodSales = await this.getPreviousPeriodSales(previousPeriod, this.getStartDate(timeFrame, new Date()));

    return ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;
  }

  private getDaysInTimeFrame(timeFrame: TimeFrame): number {
    switch (timeFrame) {
      case TimeFrame.DAILY:
        return 1;
      case TimeFrame.WEEKLY:
        return 7;
      case TimeFrame.MONTHLY:
        return 30;
      case TimeFrame.QUARTERLY:
        return 90;
      case TimeFrame.YEARLY:
        return 365;
    }
  }

  private async calculateInventoryTurnover(start: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start },
      },
      include: {
        inventory: true,
      },
    });

    const averageInventory = await this.calculateAverageInventory(start);
    const costOfGoodsSold = sales.reduce((sum, sale) => sum + sale.inventory.wholeSalePrice * sale.quantity, 0);

    return costOfGoodsSold / averageInventory;
  }

  private async calculateAverageInventory(start: Date) {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start },
          },
        },
      },
    });

    const totalValue = inventory.reduce((sum, item) => {
      const stockValue = item.stockBatches.reduce((batchSum, batch) => batchSum + batch.quantity * item.wholeSalePrice, 0);
      return sum + stockValue;
    }, 0);

    return totalValue / 2; // Simple average of start and end inventory
  }

  private async calculateCustomerRetention(start: Date) {
    const customers = await this.prisma.customer.findMany({
      include: {
        Sales: {
          where: {
            createdAt: { gte: start },
          },
        },
      },
    });

    const repeatCustomers = customers.filter(customer => customer.Sales.length > 1).length;
    return (repeatCustomers / customers.length) * 100;
  }

  private async calculateProductPerformance(start: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start },
      },
      include: {
        inventory: true,
      },
    });

    const productPerformance = sales.reduce((acc, sale) => {
      const key = sale.inventory.name;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantity: 0,
          revenue: 0,
          profit: 0,
        };
      }
      acc[key].quantity += sale.quantity;
      acc[key].revenue += sale.price * sale.quantity;
      acc[key].profit += (sale.price - sale.inventory.wholeSalePrice) * sale.quantity;
      return acc;
    }, {});

    return Object.values(productPerformance)
      .sort((a: any, b: any) => b.profit - a.profit)
      .slice(0, 10);
  }

  async getDashboardMetrics(metrics: string[]) {
    const now = new Date();
    const data = {};

    for (const metric of metrics) {
      switch (metric) {
        case 'sales_volume':
          data[metric] = await this.getSalesVolumeData(now, now);
          break;
        case 'revenue':
          data[metric] = await this.getRevenueData(now, now);
          break;
        case 'profit_margin':
          data[metric] = await this.getProfitMarginData(now, now);
          break;
        case 'stock_level':
          data[metric] = await this.getStockLevelData(now, now);
          break;
        case 'expiry_rate':
          data[metric] = await this.getExpiryRateData(now, now);
          break;
        case 'turnover_rate':
          data[metric] = await this.getTurnoverRateData(now, now);
          break;
        case 'customer_retention':
          data[metric] = await this.getCustomerRetentionData(now, now);
          break;
        case 'product_performance':
          data[metric] = await this.getProductPerformanceData(now, now);
          break;
      }
    }

    return data;
  }

  async getTrendAnalysis(timeFrame: string) {
    const now = new Date();
    const start = this.getStartDate(TimeFrame[timeFrame], now);

    const trends = {
      sales: await this.analyzeSalesTrend(start, now),
      inventory: await this.analyzeInventoryTrend(start, now),
      financial: await this.analyzeFinancialTrend(start, now),
      performance: await this.analyzePerformanceTrend(start, now),
    };

    return trends;
  }

  private async analyzeSalesTrend(start: Date, end: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return {
      volume: this.calculateTrend(sales.map(sale => sale.quantity)),
      revenue: this.calculateTrend(sales.map(sale => sale.price * sale.quantity)),
      averageOrderValue: this.calculateTrend(sales.map(sale => sale.price)),
    };
  }

  private async analyzeInventoryTrend(start: Date, end: Date) {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
    });

    return {
      stockLevels: this.calculateTrend(inventory.map(item => item.stock)),
      value: this.calculateTrend(inventory.map(item => item.stock * item.wholeSalePrice)),
      turnover: await this.calculateInventoryTurnover(start),
    };
  }

  private async analyzeFinancialTrend(start: Date, end: Date) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    const expenses = await this.prisma.expense.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    const revenue = sales.map(sale => sale.price * sale.quantity);
    const cost = sales.map(sale => sale.inventory.wholeSalePrice * sale.quantity);
    const profit = revenue.map((r, i) => r - cost[i]);

    return {
      revenue: this.calculateTrend(revenue),
      cost: this.calculateTrend(cost),
      profit: this.calculateTrend(profit),
      expenses: this.calculateTrend(expenses.map(e => e.amount)),
    };
  }

  private async analyzePerformanceTrend(start: Date, end: Date) {
    return {
      salesGrowth: await this.calculateGrowth(
        await this.prisma.sale.findMany({
          where: { createdAt: { gte: start, lte: end } },
        }),
        TimeFrame.MONTHLY,
      ),
      inventoryTurnover: await this.calculateInventoryTurnover(start),
      customerRetention: await this.calculateCustomerRetention(start),
      productPerformance: await this.calculateProductPerformance(start),
    };
  }

  private calculateTrend(values: number[]): { trend: number; direction: 'up' | 'down' | 'stable' } {
    if (values.length < 2) {
      return { trend: 0, direction: 'stable' };
    }

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const trend = ((lastValue - firstValue) / firstValue) * 100;

    return {
      trend,
      direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
    };
  }

  private async getSalesVolumeData(start: Date, end: Date, groupBy?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return this.groupData(sales, 'quantity', groupBy);
  }

  private async getRevenueData(start: Date, end: Date, groupBy?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return this.groupData(sales.map(sale => ({
      ...sale,
      revenue: sale.price * sale.quantity,
    })), 'revenue', groupBy);
  }

  private async getProfitMarginData(start: Date, end: Date, groupBy?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return this.groupData(sales.map(sale => ({
      ...sale,
      profitMargin: ((sale.price - sale.inventory.wholeSalePrice) / sale.price) * 100,
    })), 'profitMargin', groupBy);
  }

  private async getStockLevelData(start: Date, end: Date, groupBy?: string) {
    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: {
          where: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
    });

    return this.groupData(inventory, 'stock', groupBy);
  }

  private async getExpiryRateData(start: Date, end: Date, groupBy?: string) {
    const batches = await this.prisma.stockBatch.findMany({
      where: {
        expiryDate: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    return this.groupData(batches, 'quantity', groupBy);
  }

  private async getTurnoverRateData(start: Date, end: Date, groupBy?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    const inventory = await this.prisma.inventory.findMany({
      include: {
        stockBatches: true,
      },
    });

    const turnoverData = inventory.map(item => ({
      ...item,
      turnoverRate: sales
        .filter(sale => sale.inventoryId === item.id)
        .reduce((sum, sale) => sum + sale.quantity, 0) / item.stock,
    }));

    return this.groupData(turnoverData, 'turnoverRate', groupBy);
  }

  private async getCustomerRetentionData(start: Date, end: Date, groupBy?: string) {
    const customers = await this.prisma.customer.findMany({
      include: {
        Sales: {
          where: {
            createdAt: { gte: start, lte: end },
          },
        },
      },
    });

    const retentionData = customers.map(customer => ({
      ...customer,
      retentionRate: customer.Sales.length > 1 ? 100 : 0,
    }));

    return this.groupData(retentionData, 'retentionRate', groupBy);
  }

  private async getProductPerformanceData(start: Date, end: Date, groupBy?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        inventory: true,
      },
    });

    const performanceData = sales.reduce((acc, sale) => {
      const key = sale.inventory.name;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantity: 0,
          revenue: 0,
          profit: 0,
        };
      }
      acc[key].quantity += sale.quantity;
      acc[key].revenue += sale.price * sale.quantity;
      acc[key].profit += (sale.price - sale.inventory.wholeSalePrice) * sale.quantity;
      return acc;
    }, {});

    return this.groupData(Object.values(performanceData), 'revenue', groupBy);
  }

  private formatLineChartData(data: any, includeTrend: boolean) {
    // Implementation for line chart formatting
    return {
      type: 'line',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.1,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Line Chart',
          },
        },
        ...(includeTrend && {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }),
      },
    };
  }

  private formatBarChartData(data: any) {
    // Implementation for bar chart formatting
    return {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bar Chart',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  }

  private formatPieChartData(data: any) {
    // Implementation for pie chart formatting
    return {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: Object.keys(data).map(() => this.getRandomColor()),
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pie Chart',
          },
        },
      },
    };
  }

  private formatScatterChartData(data: any) {
    // Implementation for scatter chart formatting
    return {
      type: 'scatter',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Scatter Chart',
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
        },
      },
    };
  }

  private formatAreaChartData(data: any, includeTrend: boolean) {
    // Implementation for area chart formatting
    return {
      type: 'line',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          fill: true,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
          tension: 0.4,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Area Chart',
          },
        },
        ...(includeTrend && {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }),
      },
    };
  }

  private formatRadarChartData(data: any) {
    // Implementation for radar chart formatting
    return {
      type: 'radar',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
          pointBackgroundColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Radar Chart',
          },
        },
      },
    };
  }

  private formatBubbleChartData(data: any) {
    // Implementation for bubble chart formatting
    return {
      type: 'bubble',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bubble Chart',
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
      },
    };
  }

  private formatHeatmapChartData(data: any) {
    // Implementation for heatmap chart formatting
    return {
      type: 'heatmap',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Heatmap Chart',
          },
        },
      },
    };
  }

  private formatCandlestickChartData(data: any) {
    // Implementation for candlestick chart formatting
    return {
      type: 'candlestick',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          color: {
            up: '#26a69a',
            down: '#ef5350',
            unchanged: '#888888',
          },
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Candlestick Chart',
          },
        },
      },
    };
  }

  private formatGaugeChartData(data: any) {
    // Implementation for gauge chart formatting
    return {
      type: 'gauge',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Gauge Chart',
          },
        },
      },
    };
  }

  private formatTreemapChartData(data: any) {
    // Implementation for treemap chart formatting
    return {
      type: 'treemap',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Treemap Chart',
          },
        },
      },
    };
  }

  private formatSankeyChartData(data: any) {
    // Implementation for sankey chart formatting
    return {
      type: 'sankey',
      data: {
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          colorFrom: this.getRandomColor(),
          colorTo: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sankey Chart',
          },
        },
      },
    };
  }

  private formatWaterfallChartData(data: any) {
    // Implementation for waterfall chart formatting
    return {
      type: 'waterfall',
      data: {
        labels: Object.keys(data),
        datasets: Object.entries(data).map(([key, value]) => ({
          label: key,
          data: value,
          backgroundColor: this.getRandomColor(0.2),
          borderColor: this.getRandomColor(),
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Waterfall Chart',
          },
        },
      },
    };
  }

  private getRandomColor(alpha: number = 1) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private groupData(data: any[], valueField: string, groupBy?: string) {
    if (!groupBy) {
      return data.reduce((acc, item) => acc + (item[valueField] || 0), 0);
    }

    return data.reduce((acc, item) => {
      const groupKey = item[groupBy];
      if (!acc[groupKey]) {
        acc[groupKey] = 0;
      }
      acc[groupKey] += item[valueField] || 0;
      return acc;
    }, {});
  }

  private async getPreviousPeriodSales(start: Date, end: Date): Promise<number> {
    const sales = await this.prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        inventory: true,
      },
    });

    return sales.reduce((sum, sale) => sum + sale.price * sale.quantity, 0);
  }
} 