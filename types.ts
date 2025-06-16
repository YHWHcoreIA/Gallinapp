export interface Chicken {
  id: string;
  name: string;
  breed: string;
  acquisitionDate: string; // ISO date string YYYY-MM-DD
}

export interface EggLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  quantity: number;
}

export interface Task {
  id: string;
  description: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  isCompleted: boolean;
}

export interface FoodLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  quantityKg: number;
  foodType?: string;
  notes?: string;
}

// --- New Features ---

// Incubation
export interface IncubationBatch {
  id: string;
  batchName: string;
  startDate: string; // ISO date string YYYY-MM-DD
  eggsSet: number;
  breed?: string; // Optional breed for the batch
  expectedHatchDate?: string; // ISO date string YYYY-MM-DD (auto-calculated)
  actualHatchDate?: string; // ISO date string YYYY-MM-DD
  chicksHatched?: number;
  notes?: string;
  hasBeenRecordedInInventory?: boolean; // To track if chicks have been added to inventory
}

// Financials
export enum Currency {
  VES = 'VES', // Bolívares Soberanos
  USD = 'USD', // Dólar Estadounidense
  EUR = 'EUR', // Euros
  CNY = 'CNY', // Yuanes
  RUB = 'RUB', // Rublos
  PES = 'PES', // Pesos (General - user can specify type in notes)
  YHWHC = 'YHWHC', // YHWHcoin (TRC20)
  MANQ = 'MANQ',   // MAN (YHWH.qt)
}

export enum TransactionType {
  Expense = 'Expense',
  Income = 'Income',
}

export interface FinancialTransaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  category: string; // User-defined category, e.g., "Feed", "Sale of Eggs"
  transactionType: TransactionType;
  amount: number;
  currency: Currency;
  notes?: string;
}

// Inventory
export enum InventoryCategory {
  Meat = 'Meat',
  Eggs = 'Eggs',
}

export enum InventoryAction {
  Addition = 'Addition', // Initial stock or new production
  Sale = 'Sale',
  Consumption = 'Consumption', // Personal use
  Spoilage = 'Spoilage',
  Adjustment = 'Adjustment', // Other corrections (can be positive or negative)
}

export interface InventoryItem {
  id: string;
  name: string; 
  category: InventoryCategory;
  dateAdded: string; 
  unit: string; // e.g., "birds", "kg", "dozen", "units"
  initialQuantity: number;
  currentQuantity: number; 
  storageLocation?: string;
  notes?: string;
  // Category-specific fields:
  processingDate?: string; // If category is Meat
  birdType?: string;       // e.g., "Chicken", "Turkey", "Pollito", "Pollo de Engorde" - If category is Meat
  eggSize?: string;        // e.g., "Medium", "Large", "Mixed" - If category is Eggs
}

export interface InventoryLog {
  id: string;
  inventoryItemId: string; 
  date: string; 
  action: InventoryAction;
  quantityChanged: number; // Always positive. Logic determines if it's +/- to currentQuantity.
  salePricePerUnit?: number; 
  saleCurrency?: Currency;   
  notes?: string;
}


export enum Page {
  Dashboard = 'Dashboard',
  Chickens = 'Mi Gallinero',
  Eggs = 'Registro de Huevos',
  Tasks = 'Tareas y Recordatorios',
  FeedCalculator = 'Calculadora de Alimento',
  FoodLog = 'Registro de Alimento',
  Incubation = 'Registro de Incubación', 
  Inventory = 'Inventario', 
  Financials = 'Gastos e Ingresos', 
}

// For Gemini API (optional feature)
export interface BreedInfo {
    breedName: string;
    description: string;
    characteristics?: string[];
    temperament?: string;
    eggProduction?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string; // Made optional to match @google/genai
    title?: string; // Made optional to match @google/genai
  };
  retrievedContext?: {
    uri?: string; // Made optional to match @google/genai
    title?: string; // Made optional to match @google/genai
  };
}

// For Feed Calculator
export enum ChickenTypeForCalc {
  Laying = "Ponedoras",
  Broiler = "Engorde",
  Mixed = "Mixtas",
}

export enum FeedTypeForCalc {
  Starter = "Alimento de Inicio",
  Grower = "Alimento de Crecimiento",
  Layer = "Alimento para Ponedoras",
  Finisher = "Alimento para Engorde", 
  GeneralPurpose = "Alimento Propósito General",
}

export interface FeedConsumptionRule {
  id: string; 
  chickenType: ChickenTypeForCalc;
  ageGroupDescription: string; 
  feedType: FeedTypeForCalc;
  avgConsumption: { min: number; max: number } | number; // in grams
  unit: 'g/día'; // Unit for avgConsumption
  notes?: string;
}