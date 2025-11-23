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
    Request,
    Res,
    UseGuards
  } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Inventory, Role, Type } from '@prisma/client';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsReportDto, DashboardSummaryDto, ExportReportDto, InventoryImpactDto, PaymentTrackingDto, VisualizationDto } from './dto/analytics.dto';
import { BulkCreateMedicineDto, BulkDeleteMedicineDto, BulkUpdateMedicineDto, BulkUpdateStockDto } from './dto/bulk-medicine.dto';
import { CreateMedicineDto, MedicineDiseaseDto, MedicineSearchDto } from './dto/medicine-search.dto';
import { AddBatchDto, BatchReportDto, BatchTransferDto, HomeUseProductDto, HomeUseReportDto, ReturnHomeUseProductDto, StockAlertDto } from './dto/stock-management.dto';
import { InventoryService } from './inventory.service';

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

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @Roles(Role.Admin, Role.Pharmacist)
  create(@Body() createInventoryDto: {
    name: string;
    formula?: string;
    type: Type; // Frontend now sends correct enum values
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
  }) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Pharmacist)
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: Partial<Inventory>,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  @Patch(':id/stock')
  @Roles(Role.Admin, Role.Pharmacist)
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: {
      quantity: number;
      batchNumber?: string;
      expiryDate?: Date;
    },
  ) {
    return this.inventoryService.updateStock(+id, updateStockDto.quantity, updateStockDto.batchNumber, updateStockDto.expiryDate);
  }

  @Post(':id/batch')
  @Roles(Role.Admin, Role.Pharmacist)
  @ApiOperation({ summary: 'Add a new batch to existing inventory' })
  @ApiResponse({ status: 201, description: 'Batch added successfully' })
  addBatch(
    @Param('id') id: string,
    @Body() addBatchDto: AddBatchDto,
  ) {
    return this.inventoryService.addBatchToInventory(
      +id,
      addBatchDto.batchNumber,
      addBatchDto.quantity,
      addBatchDto.expiryDate,
      addBatchDto.purchaseDate,
      addBatchDto.supplierId,
    );
  }

  @Get('low-stock/:threshold')
  @Roles(Role.Admin, Role.Pharmacist)
  findLowStock(@Param('threshold') threshold: string) {
    return this.inventoryService.findLowStock(+threshold);
  }

  @Get('expiring-soon/:days')
  @Roles(Role.Admin, Role.Pharmacist)
  findExpiringSoon(@Param('days') days: string) {
    return this.inventoryService.findExpiringSoon(+days);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search medicines with various criteria' })
  @ApiResponse({ status: 200, description: 'Returns list of matching medicines' })
  async searchMedicines(@Body() searchDto: MedicineSearchDto) {
    return this.inventoryService.searchMedicines(searchDto);
  }

  @Get('disease/:diseaseName')
  @ApiOperation({ summary: 'Find medicines by disease name' })
  @ApiParam({ name: 'diseaseName', description: 'Name of the disease' })
  @ApiResponse({ status: 200, description: 'Returns list of medicines for the disease' })
  async findMedicinesByDisease(@Param('diseaseName') diseaseName: string) {
    return this.inventoryService.findMedicinesByDisease(diseaseName);
  }

  @Get('formula/:formula')
  @ApiOperation({ summary: 'Find medicines by formula' })
  @ApiParam({ name: 'formula', description: 'Chemical formula of the medicine' })
  @ApiResponse({ status: 200, description: 'Returns list of medicines with the formula' })
  async findMedicinesByFormula(@Param('formula') formula: string) {
    return this.inventoryService.findMedicinesByFormula(formula);
  }

  @Post('medicine')
  @ApiOperation({ summary: 'Create a new medicine with disease relationships' })
  @ApiResponse({ status: 201, description: 'Medicine created successfully' })
  async createMedicine(@Body() createMedicineDto: CreateMedicineDto) {
    return this.inventoryService.createMedicine(createMedicineDto);
  }

  @Post('medicine/:medicineId/disease')
  @ApiOperation({ summary: 'Add a disease to a medicine' })
  @ApiParam({ name: 'medicineId', description: 'ID of the medicine' })
  @ApiResponse({ status: 201, description: 'Disease added to medicine successfully' })
  async addDiseaseToMedicine(
    @Param('medicineId') medicineId: number,
    @Body() diseaseDto: MedicineDiseaseDto,
  ) {
    return this.inventoryService.addDiseaseToMedicine(medicineId, diseaseDto);
  }

  @Delete('medicine/:medicineId/disease/:diseaseId')
  @ApiOperation({ summary: 'Remove a disease from a medicine' })
  @ApiParam({ name: 'medicineId', description: 'ID of the medicine' })
  @ApiParam({ name: 'diseaseId', description: 'ID of the disease' })
  @ApiResponse({ status: 200, description: 'Disease removed from medicine successfully' })
  async removeDiseaseFromMedicine(
    @Param('medicineId') medicineId: number,
    @Param('diseaseId') diseaseId: number,
  ) {
    return this.inventoryService.removeDiseaseFromMedicine(medicineId, diseaseId);
  }

  @Post('bulk/create')
  @Roles(Role.Admin, Role.Pharmacist)
  @ApiOperation({ summary: 'Create multiple medicines in bulk' })
  @ApiResponse({ status: 201, description: 'Medicines created successfully' })
  async bulkCreateMedicines(@Body() bulkCreateDto: BulkCreateMedicineDto) {
    return this.inventoryService.bulkCreateMedicines(bulkCreateDto);
  }

  @Patch('bulk/update')
  @Roles(Role.Admin, Role.Pharmacist)
  @ApiOperation({ summary: 'Update multiple medicines in bulk' })
  @ApiResponse({ status: 200, description: 'Medicines updated successfully' })
  async bulkUpdateMedicines(@Body() bulkUpdateDto: BulkUpdateMedicineDto) {
    return this.inventoryService.bulkUpdateMedicines(bulkUpdateDto);
  }

  @Delete('bulk/delete')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete multiple medicines in bulk' })
  @ApiResponse({ status: 200, description: 'Medicines deleted successfully' })
  async bulkDeleteMedicines(@Body() bulkDeleteDto: BulkDeleteMedicineDto) {
    return this.inventoryService.bulkDeleteMedicines(bulkDeleteDto);
  }

  @Patch('bulk/stock')
  @Roles(Role.Admin, Role.Pharmacist)
  @ApiOperation({ summary: 'Update stock for multiple medicines in bulk' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  async bulkUpdateStock(@Body() bulkUpdateStockDto: BulkUpdateStockDto) {
    return this.inventoryService.bulkUpdateStock(bulkUpdateStockDto);
  }

  @Post('batch/transfer')
  @ApiOperation({ summary: 'Transfer stock between batches' })
  @ApiResponse({ status: 200, description: 'Batch transfer successful' })
  @Roles(Role.Admin, Role.Pharmacist)
  async transferBatch(
    @Body() transferDto: BatchTransferDto,
    @Request() req,
  ) {
    return this.inventoryService.transferBatch(transferDto, req.user.id);
  }

  @Post('home-use')
  @ApiOperation({ summary: 'Take product for home use' })
  @ApiResponse({ status: 200, description: 'Product taken successfully' })
  @Roles(Role.Admin, Role.Pharmacist)
  async takeHomeUseProduct(
    @Body() homeUseDto: HomeUseProductDto,
    @Request() req,
  ) {
    return this.inventoryService.takeHomeUseProduct(homeUseDto, req.user.id);
  }

  @Post('home-use/return')
  @ApiOperation({ summary: 'Return home use product' })
  @ApiResponse({ status: 200, description: 'Product returned successfully' })
  @Roles(Role.Admin, Role.Pharmacist)
  async returnHomeUseProduct(@Body() returnDto: ReturnHomeUseProductDto) {
    return this.inventoryService.returnHomeUseProduct(returnDto);
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create stock alert' })
  @ApiResponse({ status: 200, description: 'Alert created successfully' })
  @Roles(Role.Admin)
  async createStockAlert(@Body() alertDto: StockAlertDto) {
    return this.inventoryService.createStockAlert(alertDto);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get all stock alerts' })
  @ApiResponse({ status: 200, description: 'Returns list of all alerts' })
  @Roles(Role.Admin, Role.Pharmacist, Role.Cashier)
  async getAllStockAlerts() {
    return this.inventoryService.getAllStockAlerts();
  }

  @Get('alerts/check')
  @ApiOperation({ summary: 'Check for triggered stock alerts' })
  @ApiResponse({ status: 200, description: 'Returns list of triggered alerts' })
  @Roles(Role.Admin, Role.Pharmacist)
  async checkStockAlerts() {
    return this.inventoryService.checkStockAlerts();
  }

  @Get('batch/report')
  @ApiOperation({ summary: 'Generate batch report' })
  @ApiResponse({ status: 200, description: 'Returns batch report' })
  @Roles(Role.Admin)
  async generateBatchReport(@Query() reportDto: BatchReportDto) {
    return this.inventoryService.generateBatchReport(reportDto);
  }

  @Get('home-use/report')
  @ApiOperation({ summary: 'Generate home use report' })
  @ApiResponse({ status: 200, description: 'Returns home use report' })
  @Roles(Role.Admin)
  async generateHomeUseReport(@Query() reportDto: HomeUseReportDto) {
    return this.inventoryService.generateHomeUseReport(reportDto);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Generate analytics report' })
  @ApiResponse({ status: 200, description: 'Returns analytics report' })
  @Roles(Role.Admin)
  async generateAnalyticsReport(@Query() reportDto: AnalyticsReportDto) {
    return this.inventoryService.generateAnalyticsReport(reportDto);
  }

  @Get('payments/track')
  @ApiOperation({ summary: 'Track payments' })
  @ApiResponse({ status: 200, description: 'Returns payment tracking report' })
  @Roles(Role.Admin)
  async trackPayments(@Query() trackingDto: PaymentTrackingDto) {
    return this.inventoryService.trackPayments(trackingDto);
  }

  @Get('impact/analyze')
  @ApiOperation({ summary: 'Analyze inventory impact' })
  @ApiResponse({ status: 200, description: 'Returns inventory impact analysis' })
  @Roles(Role.Admin)
  async analyzeInventoryImpact(@Query() impactDto: InventoryImpactDto) {
    return this.inventoryService.analyzeInventoryImpact(impactDto);
  }

  @Get('analytics/visualize')
  @ApiOperation({ summary: 'Generate data visualization' })
  @ApiResponse({ status: 200, description: 'Returns visualization data' })
  @Roles(Role.Admin)
  async generateVisualization(@Query() visualizationDto: VisualizationDto) {
    return this.inventoryService.generateVisualization(visualizationDto);
  }

  @Get('analytics/export')
  @ApiOperation({ summary: 'Export analytics report' })
  @ApiResponse({ status: 200, description: 'Returns exported report file' })
  @Roles(Role.Admin)
  async exportReport(
    @Query() exportDto: ExportReportDto,
    @Res() res: Response,
  ) {
    const { buffer, filename, contentType } = await this.inventoryService.exportReport(exportDto);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: 200, description: 'Returns dashboard summary data' })
  @Roles(Role.Admin)
  async getDashboardSummary(@Query() summaryDto: DashboardSummaryDto) {
    return this.inventoryService.getDashboardSummary(summaryDto);
  }

  @Get('dashboard/metrics')
  @ApiOperation({ summary: 'Get specific dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Returns requested metrics data' })
  @Roles(Role.Admin)
  async getDashboardMetrics(@Query('metrics') metrics: string[]) {
    return this.inventoryService.getDashboardMetrics(metrics);
  }

  @Get('dashboard/trends')
  @ApiOperation({ summary: 'Get trend analysis' })
  @ApiResponse({ status: 200, description: 'Returns trend analysis data' })
  @Roles(Role.Admin)
  async getTrendAnalysis(@Query('timeFrame') timeFrame: string) {
    return this.inventoryService.getTrendAnalysis(timeFrame);
  }
} 