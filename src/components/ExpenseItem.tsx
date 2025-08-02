// src/components/ExpenseItem.tsx

"use client"

import { useState } from "react"
import type { Expense } from "@/types"
import { Check, X, Loader2 } from "lucide-react"

interface Props {
  expense: Expense
  onTogglePaid: (expenseId: string, paid: boolean) => Promise<void>
  className?: string
}

export default function ExpenseItem({ expense, onTogglePaid, className = "" }: Props) {
  const [loading, setLoading] = useState(false)

  const handleTogglePaid = async () => {
    if (loading) return
    setLoading(true)
    try {
      await onTogglePaid(expense.id, !expense.paid)
    } catch (error) {
      console.error("Error updating expense:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${className} ${
        expense.paid
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTogglePaid}
              disabled={loading}
              aria-label={expense.paid ? "Marcar como pendiente" : "Marcar como pagado"}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0 ${
                expense.paid
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400"
              } ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : expense.paid ? (
                <Check className="h-3 w-3" />
              ) : null}
            </button>

            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium truncate ${
                  expense.paid
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {expense.description}
              </h4>
              <div className="flex items-center flex-wrap gap-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="capitalize">{expense.category}</span>
                <span>•</span>
                <span className="capitalize">{expense.type}</span>
                <span>•</span>
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-2">
          <span
            className={`text-lg font-semibold whitespace-nowrap ${
              expense.paid
                ? "text-gray-500 dark:text-gray-400 line-through"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {formatCurrency(expense.amount)}
          </span>

          <div className="flex items-center space-x-1">
            {expense.paid ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-xs ml-1">Paid</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600 dark:text-orange-400">
                <X className="h-4 w-4" />
                <span className="text-xs ml-1">Pending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}