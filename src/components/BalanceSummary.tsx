// src/components/BalanceSummary.tsx
"use client"

import type { MonthlySummary } from "@/types"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"

interface Props {
  summary: MonthlySummary | null
  loading: boolean
}

export default function BalanceSummary({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!summary) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available</p>
            <p className={`text-2xl font-bold ${summary.available >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(summary.available)}
            </p>
          </div>
          <DollarSign className={`h-8 w-8 ${summary.available >= 0 ? "text-green-600" : "text-red-600"}`} />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">% Spent</p>
            <p className="text-2xl font-bold text-blue-600">{summary.spentPercentage.toFixed(1)}%</p>
          </div>
          <Percent className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  )
}
