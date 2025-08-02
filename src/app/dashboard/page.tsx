// src/dashboard/page.tsx
"use client"

import { useState } from "react"
import Header from "@/components/Header"
import BalanceSummary from "@/components/BalanceSummary"
// Make sure IncomeForm.tsx exists at src/components/IncomeForm.tsx
import IncomeForm from "@/components/IncomeForm"
import ExpenseForm from "@/components/ExpenseForm"
import ExpenseItem from "@/components/ExpenseItem"
// If your hook is at src/hooks/useExpenses.ts, ensure the file exists.
// If the file is named differently or in another folder, update the import path accordingly.
// Example for a common structure:
import { useExpenses } from "../../hooks/useExpenses"
import { Calendar } from "lucide-react"
import type { Expense } from "@/types" // Adjust path if needed
import { Income } from "@/types"

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const { expenses, incomes, summary, loading, addNewExpense, addNewIncome, toggleExpensePaid } =
    useExpenses(selectedMonth)

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + "-01")
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Month selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <label htmlFor="month" className="text-sm font-medium text-gray-700">
              Month:
            </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field w-auto"
            />
            <span className="text-lg font-semibold text-gray-900 capitalize">{formatMonth(selectedMonth)}</span>
          </div>
        </div>

        {/* Financial summary */}
        <BalanceSummary summary={summary} loading={loading} />

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <IncomeForm onAddIncome={addNewIncome} />
          <ExpenseForm onAddExpense={addNewExpense} />
        </div>

        {/* Expenses list */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses ({expenses.length})</h3>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No expenses recorded for this month</p>
              <p className="text-sm">Add your first expense using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense: Expense) => (
              <ExpenseItem key={expense.id} expense={expense} onTogglePaid={toggleExpensePaid} />
              ))}
            </div>
          )}
        </div>

        {/* Incomes list */}
        {incomes.length > 0 && (
          <div className="card mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income ({incomes.length})</h3>
            <div className="space-y-3">
              {incomes.map((income: Income) => (
                <div key={income.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{income.description}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="capitalize">{income.type}</span>
                        <span>•</span>
                        <span>{new Intl.DateTimeFormat("en-US").format(income.date)}</span>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                      }).format(income.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
