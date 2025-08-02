// src/components/ExpenseForm.tsx

"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

interface Props {
  onAddExpense: (expense: {
    type: "fixed" | "variable"
    category: string
    description: string
    amount: number
    paid: boolean
    date: Date
    month: string
  }) => Promise<void>
}

const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Clothing",
  "Others",
]

export default function ExpenseForm({ onAddExpense }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<"fixed" | "variable">("variable")
  const [category, setCategory] = useState("Others")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    setLoading(true)
    try {
      const date = new Date()
      await onAddExpense({
        type,
        category,
        description,
        amount: Number.parseFloat(amount),
        paid,
        date,
        month: date.toISOString().slice(0, 7),
      })

      setDescription("")
      setAmount("")
      setPaid(false)
      setShowForm(false)
    } catch (error) {
      console.error("Error adding expense:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "fixed" | "variable")}
                className="input-field"
              >
                <option value="fixed">Fixed Expense</option>
                <option value="variable">Variable Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (CLP)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="50000"
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
              placeholder="e.g: Rent, Groceries, Gas, etc."
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="paid"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">
              Mark as paid
            </label>
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
