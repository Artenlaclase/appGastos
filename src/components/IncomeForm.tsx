// src/componets/IcomeForm.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

interface Props {
  onAddIncome: (income: {
    type: "salary" | "extra"
    description: string
    amount: number
    date: Date
    month: string
  }) => Promise<void>
}

export default function IncomeForm({ onAddIncome }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<"salary" | "extra">("salary")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    setLoading(true)
    try {
      const date = new Date()
      await onAddIncome({
        type,
        description,
        amount: Number.parseFloat(amount),
        date,
        month: date.toISOString().slice(0, 7),
      })

      setDescription("")
      setAmount("")
      setShowForm(false)
    } catch (error) {
      console.error("Error adding income:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Income</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Income</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "salary" | "extra")}
                className="input-field"
              >
                <option value="salary">Salary</option>
                <option value="extra">Extra Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (CLP)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="800000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="e.g: January salary, Freelance sale, etc."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "Adding..." : "Add"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
