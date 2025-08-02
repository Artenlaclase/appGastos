"use client"

import type { ResumenMensual } from "@/types"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"

interface Props {
  resumen: ResumenMensual | null
  loading: boolean
}

export default function ResumenSaldo({ resumen, loading }: Props) {
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

  if (!resumen) return null

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
            <p className="text-sm font-medium text-gray-600">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(resumen.totalIngresos)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Gastos</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(resumen.totalGastos)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Disponible</p>
            <p className={`text-2xl font-bold ${resumen.disponible >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(resumen.disponible)}
            </p>
          </div>
          <DollarSign className={`h-8 w-8 ${resumen.disponible >= 0 ? "text-green-600" : "text-red-600"}`} />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">% Gastado</p>
            <p className="text-2xl font-bold text-blue-600">{resumen.porcentajeGastado.toFixed(1)}%</p>
          </div>
          <Percent className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  )
}
