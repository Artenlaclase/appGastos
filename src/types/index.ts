// src/types/index.ts

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface Income {
  id: string
  userId: string
  type: "salary" | "extra"
  description: string
  amount: number
  date: Date
  month: string // format: "2024-01"
}

export interface Expense {
  id: string
  userId: string
  type: "fixed" | "variable"
  category: string
  description: string
  amount: number
  paid: boolean
  date: Date
  month: string // format: "2024-01"
}

export interface MonthlySummary {
  month: string
  totalIncome: number
  totalExpenses: number
  totalPaidExpenses: number
  available: number
  spentPercentage: number
}
