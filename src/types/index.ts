// src/types/index.ts
// Tipos básicos
export type MonthFormat = `${number}-${number}`; // Formato: "YYYY-MM"

// Usuario
export interface User {
  uid: string; // Compatible con Firebase
  id?: string; // Opcional para compatibilidad
  email: string | null;
  name?: string | null; // displayName alternativo
  displayName?: string | null; // Compatible con Firebase
  createdAt?: Date; // Opcional para registro adicional
  photoURL?: string | null; // Para avatar del usuario
}

// Gastos
export interface Expense {
  id: string;
  userId: string;
  type: ExpenseType;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paid: boolean;
  date: Date;
  month: MonthFormat;
  createdAt?: Date; // Opcional para auditoría
}

// Ingresos
export interface Income {
  id: string;
  userId: string;
  type: IncomeType;
  description: string;
  amount: number;
  date: Date;
  month: MonthFormat;
  createdAt?: Date; // Opcional para auditoría
}

// Resumen mensual
export interface MonthlySummary {
  month: MonthFormat; // Mejor trazabilidad
  totalIncome: number;
  totalExpenses: number;
  totalPaidExpenses: number; // Seguimiento de pagos
  pendingExpenses: number; // Gastos no pagados
  available: number;
  spentPercentage: number;
  savingsPercentage?: number; // Opcional: % ahorrado
}

// Contexto de autenticación
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  error?: string | null; // Manejo de errores
}

// Tipos enumerados con valores constantes
export const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Clothing",
  "Savings",
  "Investments",
  "Others"
] as const;

export const EXPENSE_TYPES = ["fixed", "variable"] as const;
export const INCOME_TYPES = ["salary", "freelance", "investment", "gift", "extra"] as const;

// Tipos derivados
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type ExpenseType = typeof EXPENSE_TYPES[number];
export type IncomeType = typeof INCOME_TYPES[number];

// Tipos para formularios
export type ExpenseFormData = Omit<Expense, 'id' | 'userId' | 'createdAt'>;
export type IncomeFormData = Omit<Income, 'id' | 'userId' | 'createdAt'>;

// Tipo para filtros
export interface TransactionsFilters {
  month?: MonthFormat;
  type?: ExpenseType | IncomeType;
  category?: ExpenseCategory;
  paid?: boolean;
  minAmount?: number;
  maxAmount?: number;
}