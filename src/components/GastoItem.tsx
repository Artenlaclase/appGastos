"use client"

import { useState } from "react"
import type { Gasto } from "@/types"
import { Check, X } from "lucide-react"

interface Props {
  gasto: Gasto
  onTogglePagado: (gastoId: string, pagado: boolean) => Promise<void>
}

export default function GastoItem({ gasto, onTogglePagado }: Props) {
  const [loading, setLoading] = useState(false)

  const handleTogglePagado = async () => {
    setLoading(true)
    try {
      await onTogglePagado(gasto.id, !gasto.pagado)
    } catch (error) {
      console.error("Error al actualizar gasto:", error)
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
        gasto.pagado ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTogglePagado}
              disabled={loading}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                gasto.pagado ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-500"
              }`}
            >
              {gasto.pagado && <Check className="h-3 w-3" />}
            </button>

            <div className="flex-1">
              <h4 className={`font-medium ${gasto.pagado ? "line-through text-gray-500" : "text-gray-900"}`}>
                {gasto.descripcion}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="capitalize">{gasto.categoria}</span>
                <span>•</span>
                <span className="capitalize">{gasto.tipo}</span>
                <span>•</span>
                <span>{formatDate(gasto.fecha)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`text-lg font-semibold ${gasto.pagado ? "text-gray-500 line-through" : "text-gray-900"}`}>
            {formatCurrency(gasto.monto)}
          </span>

          <div className="flex items-center space-x-1">
            {gasto.pagado ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-xs ml-1">Pagado</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <X className="h-4 w-4" />
                <span className="text-xs ml-1">Pendiente</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
