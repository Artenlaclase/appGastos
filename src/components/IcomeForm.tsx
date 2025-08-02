"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

interface Props {
  onAgregarIngreso: (ingreso: {
    tipo: "sueldo" | "extra"
    descripcion: string
    monto: number
    fecha: Date
    mes: string
  }) => Promise<void>
}

export default function IngresoForm({ onAgregarIngreso }: Props) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipo, setTipo] = useState<"sueldo" | "extra">("sueldo")
  const [descripcion, setDescripcion] = useState("")
  const [monto, setMonto] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descripcion || !monto) return

    setLoading(true)
    try {
      const fecha = new Date()
      await onAgregarIngreso({
        tipo,
        descripcion,
        monto: Number.parseFloat(monto),
        fecha,
        mes: fecha.toISOString().slice(0, 7),
      })

      setDescripcion("")
      setMonto("")
      setMostrarForm(false)
    } catch (error) {
      console.error("Error al agregar ingreso:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Agregar Ingreso</span>
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as "sueldo" | "extra")}
                className="input-field"
              >
                <option value="sueldo">Sueldo</option>
                <option value="extra">Ingreso Extra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (CLP)</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="input-field"
                placeholder="800000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input-field"
              placeholder="Ej: Sueldo enero, Venta freelance, etc."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "Agregando..." : "Agregar"}
            </button>
            <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
