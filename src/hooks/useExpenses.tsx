// src/hooks/useExpenses.tsx
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import type { Expense, Income, MonthlySummary } from "@/types"
import {
  getExpenses,
  getIncomes,
  calculateMonthlySummary,
  addExpense,
  addIncome,
  markExpenseAsPaid,
} from "@/lib/expenses"

export const useExpenses = (month?: string) => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [expensesData, incomesData] = await Promise.all([getExpenses(user.uid, month), getIncomes(user.uid, month)])

      setExpenses(expensesData)
      setIncomes(incomesData)
      setSummary(calculateMonthlySummary(incomesData, expensesData))
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user, month])

  const addNewExpense = async (expense: Omit<Expense, "id" | "userId">) => {
    if (!user) return

    try {
      await addExpense({
        ...expense,
        userId: user.uid,
      })
      await loadData()
    } catch (error) {
      console.error("Error adding expense:", error)
      throw error
    }
  }

  const addNewIncome = async (income: Omit<Income, "id" | "userId">) => {
    if (!user) return

    try {
      await addIncome({
        ...income,
        userId: user.uid,
      })
      await loadData()
    } catch (error) {
      console.error("Error adding income:", error)
      throw error
    }
  }

  const toggleExpensePaid = async (expenseId: string, paid: boolean) => {
    try {
      await markExpenseAsPaid(expenseId, paid)
      await loadData()
    } catch (error) {
      console.error("Error updating expense:", error)
      throw error
    }
  }

  return {
    expenses,
    incomes,
    summary,
    loading,
    addNewExpense,
    addNewIncome,
    toggleExpensePaid,
    reload: loadData,
  }
}
