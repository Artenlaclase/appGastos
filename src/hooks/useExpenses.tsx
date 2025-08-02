// src/hooks/useExpenses.ts
"use client"

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import type { Expense, Income, MonthlySummary } from "@/types";
import {
  getExpenses,
  getIncomes,
  calculateMonthlySummary,
  addExpense,
  addIncome,
  updateExpensePaidStatus // Cambiado de markExpenseAsPaid a updateExpensePaidStatus
} from "@/lib/expenses";

export const useExpenses = (month?: string) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizamos la función de carga para evitar recreaciones innecesarias
  const loadData = useCallback(async () => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [expensesData, incomesData] = await Promise.all([
        getExpenses(user.uid, month),
        getIncomes(user.uid, month)
      ]);

      setExpenses(expensesData);
      setIncomes(incomesData);
      setSummary(calculateMonthlySummary(incomesData, expensesData));
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [user, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addNewExpense = async (expense: Omit<Expense, "id" | "userId">) => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        ...expense,
        userId: user.uid,
      });
      await loadData();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Error al agregar gasto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addNewIncome = async (income: Omit<Income, "id" | "userId">) => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    try {
      await addIncome({
        ...income,
        userId: user.uid,
      });
      await loadData();
    } catch (err) {
      console.error("Error adding income:", err);
      setError("Error al agregar ingreso");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleExpensePaid = async (expenseId: string, paid: boolean) => {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    setLoading(true);
    try {
      await updateExpensePaidStatus(expenseId, paid, user.uid); // Pasar user.uid como tercer argumento
      await loadData();
    } catch (err) {
      console.error("Error updating expense:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    incomes,
    summary,
    loading,
    error,
    addNewExpense,
    addNewIncome,
    toggleExpensePaid,
    reload: loadData,
  };
};