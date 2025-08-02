// src/dashboard/page.tsx
"use client"

import { useState } from "react"
import BalanceSummary from "@/components/BalanceSummary"
import IncomeForm from "@/components/IncomeForm"
import ExpenseForm from "@/components/ExpenseForm"
import ExpenseItem from "@/components/ExpenseItem"
import { useExpenses } from "../../hooks/useExpenses"
import { Calendar } from "lucide-react"
import type { Expense } from "@/types"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Month selector */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <label htmlFor="month" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Month:
              </label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="month"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {formatMonth(selectedMonth)}
              </span>
            </div>
          </div>
        </div>

        {/* Financial summary - destacado */}
        <BalanceSummary summary={summary} loading={loading} />

        {/* Forms section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Transactions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncomeForm onAddIncome={addNewIncome} />
            <ExpenseForm onAddExpense={addNewExpense} />
          </div>
        </section>

        {/* Expenses section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Expenses ({expenses.length})
              </h3>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg p-4 bg-gray-100 dark:bg-gray-700">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No expenses recorded for this month</p>
                  <p className="text-sm mt-2">Add your first expense using the form above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map((expense: Expense) => (
                    <ExpenseItem key={expense.id} expense={expense} onTogglePaid={toggleExpensePaid} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Incomes section */}
        {incomes.length > 0 && (
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Monthly Income ({incomes.length})
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {incomes.map((income: Income) => (
                    <div 
                      key={income.id} 
                      className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{income.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="capitalize">{income.type}</span>
                            <span>•</span>
                            <span>{new Intl.DateTimeFormat("en-US").format(income.date)}</span>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
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
            </div>
          </section>
        )}
      </main>
    </div>
  )
}