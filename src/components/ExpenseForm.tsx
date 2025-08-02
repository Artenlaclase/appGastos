"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

interface Props {
  onAgregarGasto: (gasto: {
    tipo: "fijo" | "variable"
    categoria: string
    descripcion: string
    monto: number
    pagado: boolean
    fecha: Date
    mes: string
  }) => Promise<void>
}

const categorias = [
  "Vivienda",
  "Transporte",
  "Alimentación",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Otros",
]

export default function GastoForm({ onAgregarGasto }: Props) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipo, setTipo] = useState<"fijo" | "variable">("variable")
  const [categoria, setCategoria] = useState("Otros")
  const [descripcion, setDescripcion] = useState("")
  const [monto, setMonto] = useState("")
  const [pagado, setPagado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descripcion || !monto) return

    setLoading(true)
    try {
      const fecha = new Date()
      await onAgregarGasto({
        tipo,
        categoria,
        descripcion,
        monto: Number.parseFloat(monto),
        pagado,
        fecha,
        mes: fecha.toISOString().slice(0, 7),
      })

      setDescripcion("")
      setMonto("")
      setPagado(false)
      setMostrarForm(false)
    } catch (error) {
      console.error("Error al agregar gasto:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Gastos</h3>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Agregar Gasto</span>
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as "fijo" | "variable")}
                className="input-field"
              >
                <option value="fijo">Gasto Fijo</option>
                <option value="variable">Gasto Variable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-field">
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (CLP)</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="input-field"
                placeholder="50000"
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
              placeholder="Ej: Arriendo, Supermercado, Gasolina, etc."
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="pagado"
              checked={pagado}
              onChange={(e) => setPagado(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="pagado" className="ml-2 block text-sm text-gray-900">
              Marcar como pagado
            </label>
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
