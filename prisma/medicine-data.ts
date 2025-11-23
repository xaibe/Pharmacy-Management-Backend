// Comprehensive Medicine Data for Pakistan Pharmacy
// This file contains medicines commonly available in Pakistan with their variants
// All prices are in PKR (Pakistani Rupees)

import { Type } from '@prisma/client';

export interface MedicineVariant {
  variantForm: string; // Tablet, Drops, Syrup, Capsule, etc.
  packagingUnit: string; // Individual, Strip, Bottle, Box, etc.
  unitsPerPackage: number; // e.g., 10 tablets per strip
  strength: string; // e.g., 500mg, 250mg/5ml
  wholeSalePrice: number;
  retailPrice: number;
  stock: number;
  expiryDate: Date;
  rackLocation: string;
}

export interface MedicineData {
  name: string;
  formula: string;
  genericName: string;
  brandName: string;
  manufacturer: string;
  type: Type;
  categoryName: string;
  supplierName: string;
  dosageForm: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  storage: string;
  variants: MedicineVariant[];
}

// Pakistani Pharmaceutical Manufacturers
const manufacturers = [
  'Getz Pharma',
  'GlaxoSmithKline Pakistan',
  'Pfizer Pakistan',
  'Novartis Pakistan',
  'Sanofi Aventis Pakistan',
  'Abbott Laboratories Pakistan',
  'Ferozsons Laboratories',
  'Hilton Pharma',
  'Searle Pakistan',
  'Atco Laboratories',
  'Highnoon Laboratories',
  'Martin Dow',
  'PharmEvo',
  'Barrett Hodgson',
  'ICI Pakistan',
];

// Suppliers
const suppliers = [
  'MediCorp Distributors',
  'PharmaLink Pakistan',
  'HealthCare Supplies',
  'MediTrade International',
  'Pharmaceutical Distributors Ltd',
];

// Categories
const categories = {
  medicine: 'Medicine',
  food: 'Food & Supplements',
  cosmetic: 'Cosmetics',
  other: 'Other',
};

// Helper function to generate expiry dates (1-3 years from now)
function getExpiryDate(monthsFromNow: number = 24): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date;
}

// Helper function to generate rack locations
function getRackLocation(section: string, row: number, col: number): string {
  return `${section}-${String(row).padStart(2, '0')}-${String(col).padStart(2, '0')}`;
}

export const pakistaniMedicines: MedicineData[] = [
  // Paracetamol with variants
  {
    name: 'Paracetamol',
    formula: 'Acetaminophen',
    genericName: 'Paracetamol',
    brandName: 'Panadol',
    manufacturer: 'GlaxoSmithKline Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Tablet',
    indications: ['Fever', 'Pain', 'Headache'],
    contraindications: ['Severe liver disease', 'Severe kidney disease'],
    sideEffects: ['Nausea', 'Rash', 'Liver damage (overdose)'],
    storage: 'Store at room temperature, away from moisture',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '500mg',
        wholeSalePrice: 25.00, // PKR
        retailPrice: 40.00, // PKR
        stock: 500,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 1, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 20,
        strength: '500mg',
        wholeSalePrice: 45.00, // PKR
        retailPrice: 70.00, // PKR
        stock: 300,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 1, 2),
      },
      {
        variantForm: 'Drops',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '100mg/ml',
        wholeSalePrice: 120.00, // PKR
        retailPrice: 180.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 1, 3),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '120mg/5ml',
        wholeSalePrice: 150.00, // PKR
        retailPrice: 220.00, // PKR
        stock: 120,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 1, 4),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '650mg',
        wholeSalePrice: 30.00, // PKR
        retailPrice: 50.00, // PKR
        stock: 400,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 1, 5),
      },
    ],
  },

  // Ibuprofen with variants
  {
    name: 'Ibuprofen',
    formula: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandName: 'Brufen',
    manufacturer: 'Abbott Laboratories Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Tablet',
    indications: ['Pain', 'Inflammation', 'Fever', 'Arthritis'],
    contraindications: ['Stomach ulcers', 'Severe heart failure', 'Kidney disease'],
    sideEffects: ['Stomach upset', 'Nausea', 'Dizziness', 'Headache'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '200mg',
        wholeSalePrice: 30.00, // PKR
        retailPrice: 50.00, // PKR
        stock: 450,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 2, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '400mg',
        wholeSalePrice: 40.00, // PKR
        retailPrice: 65.00, // PKR
        stock: 350,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 2, 2),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '100mg/5ml',
        wholeSalePrice: 180.00, // PKR
        retailPrice: 260.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 2, 3),
      },
      {
        variantForm: 'Gel',
        packagingUnit: 'Tube',
        unitsPerPackage: 1,
        strength: '5%',
        wholeSalePrice: 200.00, // PKR
        retailPrice: 300.00, // PKR
        stock: 80,
        expiryDate: getExpiryDate(30),
        rackLocation: getRackLocation('A', 2, 4),
      },
    ],
  },

  // Amoxicillin with variants
  {
    name: 'Amoxicillin',
    formula: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandName: 'Amoxil',
    manufacturer: 'GlaxoSmithKline Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Capsule',
    indications: ['Bacterial infections', 'Respiratory infections', 'Urinary tract infections'],
    contraindications: ['Penicillin allergy', 'Severe liver disease'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reactions'],
    storage: 'Store in a cool, dry place',
    variants: [
      {
        variantForm: 'Capsule',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '250mg',
        wholeSalePrice: 180.00, // PKR
        retailPrice: 280.00, // PKR
        stock: 300,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 3, 1),
      },
      {
        variantForm: 'Capsule',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '500mg',
        wholeSalePrice: 250.00, // PKR
        retailPrice: 380.00, // PKR
        stock: 250,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 3, 2),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '125mg/5ml',
        wholeSalePrice: 220.00, // PKR
        retailPrice: 320.00, // PKR
        stock: 120,
        expiryDate: getExpiryDate(12),
        rackLocation: getRackLocation('A', 3, 3),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '250mg/5ml',
        wholeSalePrice: 280.00, // PKR
        retailPrice: 400.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(12),
        rackLocation: getRackLocation('A', 3, 4),
      },
    ],
  },

  // Cetirizine with variants
  {
    name: 'Cetirizine',
    formula: 'Cetirizine Hydrochloride',
    genericName: 'Cetirizine',
    brandName: 'Zyrtec',
    manufacturer: 'Pfizer Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[2],
    dosageForm: 'Tablet',
    indications: ['Allergic rhinitis', 'Urticaria', 'Allergic conjunctivitis'],
    contraindications: ['Severe kidney disease'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '10mg',
        wholeSalePrice: 50.00, // PKR
        retailPrice: 80.00, // PKR
        stock: 400,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 4, 1),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '5mg/5ml',
        wholeSalePrice: 200.00, // PKR
        retailPrice: 290.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('A', 4, 2),
      },
    ],
  },

  // Omeprazole with variants
  {
    name: 'Omeprazole',
    formula: 'Omeprazole',
    genericName: 'Omeprazole',
    brandName: 'Losec',
    manufacturer: 'AstraZeneca Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Capsule',
    indications: ['Gastric ulcers', 'GERD', 'Zollinger-Ellison syndrome'],
    contraindications: ['Severe liver disease'],
    sideEffects: ['Headache', 'Diarrhea', 'Abdominal pain'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Capsule',
        packagingUnit: 'Strip',
        unitsPerPackage: 14,
        strength: '20mg',
        wholeSalePrice: 350.00, // PKR
        retailPrice: 550.00, // PKR
        stock: 200,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 5, 1),
      },
      {
        variantForm: 'Capsule',
        packagingUnit: 'Strip',
        unitsPerPackage: 14,
        strength: '40mg',
        wholeSalePrice: 450.00, // PKR
        retailPrice: 680.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('A', 5, 2),
      },
    ],
  },

  // Metformin with variants
  {
    name: 'Metformin',
    formula: 'Metformin Hydrochloride',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    manufacturer: 'Merck Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Tablet',
    indications: ['Type 2 Diabetes', 'Polycystic ovary syndrome'],
    contraindications: ['Severe kidney disease', 'Lactic acidosis', 'Severe liver disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Lactic acidosis'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '500mg',
        wholeSalePrice: 35.00, // PKR
        retailPrice: 60.00, // PKR
        stock: 350,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 1, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '850mg',
        wholeSalePrice: 45.00, // PKR
        retailPrice: 75.00, // PKR
        stock: 300,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 1, 2),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '1000mg',
        wholeSalePrice: 55.00, // PKR
        retailPrice: 90.00, // PKR
        stock: 250,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 1, 3),
      },
    ],
  },

  // Salbutamol (Albuterol) with variants
  {
    name: 'Salbutamol',
    formula: 'Salbutamol Sulphate',
    genericName: 'Salbutamol',
    brandName: 'Ventolin',
    manufacturer: 'GlaxoSmithKline Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Inhaler',
    indications: ['Asthma', 'Bronchospasm', 'COPD'],
    contraindications: ['Hypersensitivity'],
    sideEffects: ['Tremor', 'Headache', 'Palpitations', 'Muscle cramps'],
    storage: 'Store at room temperature, protect from heat',
    variants: [
      {
        variantForm: 'Inhaler',
        packagingUnit: 'Individual',
        unitsPerPackage: 1,
        strength: '100mcg/dose',
        wholeSalePrice: 350.00, // PKR
        retailPrice: 520.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 2, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '2mg',
        wholeSalePrice: 90.00, // PKR
        retailPrice: 150.00, // PKR
        stock: 200,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 2, 2),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '2mg/5ml',
        wholeSalePrice: 250.00, // PKR
        retailPrice: 360.00, // PKR
        stock: 120,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('B', 2, 3),
      },
    ],
  },

  // Azithromycin with variants
  {
    name: 'Azithromycin',
    formula: 'Azithromycin',
    genericName: 'Azithromycin',
    brandName: 'Zithromax',
    manufacturer: 'Pfizer Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Tablet',
    indications: ['Bacterial infections', 'Respiratory infections', 'Skin infections'],
    contraindications: ['Severe liver disease', 'Macrolide allergy'],
    sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'Headache'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 3,
        strength: '500mg',
        wholeSalePrice: 380.00, // PKR
        retailPrice: 580.00, // PKR
        stock: 180,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 3, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 6,
        strength: '250mg',
        wholeSalePrice: 450.00, // PKR
        retailPrice: 680.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 3, 2),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '200mg/5ml',
        wholeSalePrice: 280.00, // PKR
        retailPrice: 420.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(12),
        rackLocation: getRackLocation('B', 3, 3),
      },
    ],
  },

  // Cefixime with variants
  {
    name: 'Cefixime',
    formula: 'Cefixime',
    genericName: 'Cefixime',
    brandName: 'Suprax',
    manufacturer: 'Lupin Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[2],
    dosageForm: 'Capsule',
    indications: ['Bacterial infections', 'Urinary tract infections', 'Respiratory infections'],
    contraindications: ['Cephalosporin allergy'],
    sideEffects: ['Diarrhea', 'Nausea', 'Abdominal pain'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Capsule',
        packagingUnit: 'Strip',
        unitsPerPackage: 6,
        strength: '400mg',
        wholeSalePrice: 450.00, // PKR
        retailPrice: 680.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(18),
        rackLocation: getRackLocation('B', 4, 1),
      },
      {
        variantForm: 'Syrup',
        packagingUnit: 'Bottle',
        unitsPerPackage: 1,
        strength: '100mg/5ml',
        wholeSalePrice: 320.00, // PKR
        retailPrice: 460.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(12),
        rackLocation: getRackLocation('B', 4, 2),
      },
    ],
  },

  // Montelukast with variants
  {
    name: 'Montelukast',
    formula: 'Montelukast Sodium',
    genericName: 'Montelukast',
    brandName: 'Singulair',
    manufacturer: 'Merck Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Tablet',
    indications: ['Asthma', 'Allergic rhinitis'],
    contraindications: ['Hypersensitivity'],
    sideEffects: ['Headache', 'Dizziness', 'Nausea', 'Fatigue'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '10mg',
        wholeSalePrice: 240.00, // PKR
        retailPrice: 380.00, // PKR
        stock: 200,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 5, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '5mg',
        wholeSalePrice: 200.00, // PKR
        retailPrice: 320.00, // PKR
        stock: 180,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('B', 5, 2),
      },
    ],
  },

  // Additional common Pakistani medicines (without variants for now)
  {
    name: 'Amlodipine',
    formula: 'Amlodipine Besylate',
    genericName: 'Amlodipine',
    brandName: 'Norvasc',
    manufacturer: 'Pfizer Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Tablet',
    indications: ['Hypertension', 'Angina'],
    contraindications: ['Severe hypotension'],
    sideEffects: ['Dizziness', 'Edema', 'Fatigue', 'Headache'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '5mg',
        wholeSalePrice: 70.00, // PKR
        retailPrice: 120.00, // PKR
        stock: 250,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 1, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '10mg',
        wholeSalePrice: 85.00, // PKR
        retailPrice: 140.00, // PKR
        stock: 200,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 1, 2),
      },
    ],
  },

  {
    name: 'Atorvastatin',
    formula: 'Atorvastatin Calcium',
    genericName: 'Atorvastatin',
    brandName: 'Lipitor',
    manufacturer: 'Pfizer Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Tablet',
    indications: ['Hypercholesterolemia', 'Cardiovascular disease prevention'],
    contraindications: ['Active liver disease', 'Pregnancy'],
    sideEffects: ['Muscle pain', 'Liver problems', 'Memory loss'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '10mg',
        wholeSalePrice: 180.00, // PKR
        retailPrice: 280.00, // PKR
        stock: 180,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 2, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '20mg',
        wholeSalePrice: 220.00, // PKR
        retailPrice: 350.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 2, 2),
      },
    ],
  },

  {
    name: 'Losartan',
    formula: 'Losartan Potassium',
    genericName: 'Losartan',
    brandName: 'Cozaar',
    manufacturer: 'Merck Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[0],
    dosageForm: 'Tablet',
    indications: ['Hypertension', 'Diabetic nephropathy'],
    contraindications: ['Pregnancy'],
    sideEffects: ['Dizziness', 'Fatigue', 'Cough'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '50mg',
        wholeSalePrice: 130.00, // PKR
        retailPrice: 210.00, // PKR
        stock: 200,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 3, 1),
      },
    ],
  },

  {
    name: 'Levothyroxine',
    formula: 'Levothyroxine Sodium',
    genericName: 'Levothyroxine',
    brandName: 'Synthroid',
    manufacturer: 'Abbott Laboratories Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[1],
    dosageForm: 'Tablet',
    indications: ['Hypothyroidism', 'Thyroid cancer'],
    contraindications: ['Hyperthyroidism', 'Acute myocardial infarction'],
    sideEffects: ['Palpitations', 'Insomnia', 'Weight loss'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '50mcg',
        wholeSalePrice: 140.00, // PKR
        retailPrice: 240.00, // PKR
        stock: 150,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 4, 1),
      },
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '100mcg',
        wholeSalePrice: 150.00, // PKR
        retailPrice: 260.00, // PKR
        stock: 140,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 4, 2),
      },
    ],
  },

  {
    name: 'Furosemide',
    formula: 'Furosemide',
    genericName: 'Furosemide',
    brandName: 'Lasix',
    manufacturer: 'Sanofi Aventis Pakistan',
    type: Type.Medicine,
    categoryName: categories.medicine,
    supplierName: suppliers[2],
    dosageForm: 'Tablet',
    indications: ['Edema', 'Hypertension', 'Heart failure'],
    contraindications: ['Anuria', 'Severe electrolyte depletion'],
    sideEffects: ['Dehydration', 'Electrolyte imbalance', 'Dizziness'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Strip',
        unitsPerPackage: 10,
        strength: '40mg',
        wholeSalePrice: 45.00, // PKR
        retailPrice: 70.00, // PKR
        stock: 300,
        expiryDate: getExpiryDate(24),
        rackLocation: getRackLocation('C', 5, 1),
      },
    ],
  },

  // Supplements
  {
    name: 'Vitamin D3',
    formula: 'Cholecalciferol',
    genericName: 'Vitamin D3',
    brandName: 'Calci-D',
    manufacturer: 'Getz Pharma',
    type: Type.Food,
    categoryName: categories.food,
    supplierName: suppliers[3],
    dosageForm: 'Softgel',
    indications: ['Vitamin D deficiency', 'Bone health'],
    contraindications: ['Hypercalcemia'],
    sideEffects: ['Nausea', 'Constipation'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Softgel',
        packagingUnit: 'Bottle',
        unitsPerPackage: 30,
        strength: '1000IU',
        wholeSalePrice: 700.00, // PKR
        retailPrice: 980.00, // PKR
        stock: 100,
        expiryDate: getExpiryDate(36),
        rackLocation: getRackLocation('D', 1, 1),
      },
      {
        variantForm: 'Softgel',
        packagingUnit: 'Bottle',
        unitsPerPackage: 60,
        strength: '1000IU',
        wholeSalePrice: 1260.00, // PKR
        retailPrice: 1820.00, // PKR
        stock: 80,
        expiryDate: getExpiryDate(36),
        rackLocation: getRackLocation('D', 1, 2),
      },
    ],
  },

  {
    name: 'Calcium Carbonate',
    formula: 'Calcium Carbonate',
    genericName: 'Calcium',
    brandName: 'Calcium Plus',
    manufacturer: 'Getz Pharma',
    type: Type.Food,
    categoryName: categories.food,
    supplierName: suppliers[3],
    dosageForm: 'Tablet',
    indications: ['Calcium deficiency', 'Osteoporosis'],
    contraindications: ['Hypercalcemia', 'Kidney stones'],
    sideEffects: ['Constipation', 'Gas'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Bottle',
        unitsPerPackage: 60,
        strength: '500mg',
        wholeSalePrice: 500.00, // PKR
        retailPrice: 700.00, // PKR
        stock: 120,
        expiryDate: getExpiryDate(36),
        rackLocation: getRackLocation('D', 2, 1),
      },
    ],
  },

  {
    name: 'Multivitamin',
    formula: 'Multiple Vitamins',
    genericName: 'Multivitamin',
    brandName: 'Centrum',
    manufacturer: 'Pfizer Pakistan',
    type: Type.Food,
    categoryName: categories.food,
    supplierName: suppliers[3],
    dosageForm: 'Tablet',
    indications: ['Vitamin deficiency', 'General health'],
    contraindications: ['Hypervitaminosis'],
    sideEffects: ['Nausea', 'Constipation'],
    storage: 'Store at room temperature',
    variants: [
      {
        variantForm: 'Tablet',
        packagingUnit: 'Bottle',
        unitsPerPackage: 30,
        strength: 'Multivitamin',
        wholeSalePrice: 980.00, // PKR
        retailPrice: 1400.00, // PKR
        stock: 90,
        expiryDate: getExpiryDate(36),
        rackLocation: getRackLocation('D', 3, 1),
      },
    ],
  },
];

