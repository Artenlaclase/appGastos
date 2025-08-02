"use client"

import { useState } from "react"
import type { Expense } from "@/types"
import { Check, X } from "lucide-react"

interface Props {
  expense: Expense
  onTogglePaid: (expenseId: string, paid: boolean) => Promise<void>
}

export default function ExpenseItem({ expense, onTogglePaid }: Props) {
  const [loading, setLoading] = useState(false)

  const handleTogglePaid = async () => {
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
      className={`border rounded-lg p-4 transition-all ${
        expense.paid ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTogglePaid}
              disabled={loading}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                expense.paid ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-500"
              }`}
            >
              {expense.paid && <Check className="h-3 w-3" />}
            </button>

            <div className="flex-1">
              <h4 className={`font-medium ${expense.paid ? "line-through text-gray-500" : "text-gray-900"}`}>
                {expense.description}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="capitalize">{expense.category}</span>
                <span>•</span>
                <span className="capitalize">{expense.type}</span>
                <span>•</span>
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`text-lg font-semibold ${expense.paid ? "text-gray-500 line-through" : "text-gray-900"}`}>
            {formatCurrency(expense.amount)}
          </span>

          <div className="flex items-center space-x-1">
            {expense.paid ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-xs ml-1">Paid</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
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
