// src/components/ExpenseForm.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import type { Expense } from "@/types"

interface Props {
  onAddExpense: (expense: Omit<Expense, "id" | "userId">) => Promise<void>
}

const categories: Expense["category"][] = [
  "Housing",
  "Transportation", 
  "Food",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Clothing",
  "Savings",
  "Investments",
  "Others",
]

export default function ExpenseForm({ onAddExpense }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<Expense["type"]>("variable")
  const [category, setCategory] = useState<Expense["category"]>("Others")
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
        month: date.toISOString().slice(0, 7) as `${number}-${number}`,
      })

      setDescription("")
      setAmount("")
      setPaid(false)
      setShowForm(false)
      toast.success('Gasto agregado correctamente')
    } catch (error) {
      console.error("Error adding expense:", error)
      toast.error('Error al agregar el gasto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Expense["type"])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fixed">Fixed Expense</option>
                <option value="variable">Variable Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Expense["category"])} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (CLP)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="paid" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Mark as paid
            </label>
          </div>

          <div className="flex space-x-3">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
