// src/lib/expenses.ts 
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Expense, Income, MonthlySummary } from "@/types";

// Configuración común para consultas
const createQuery = (collectionName: "incomes" | "expenses", userId: string, month?: string) => {
  const baseQuery = query(
    collection(db, collectionName),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );

  if (month) {
    return query(
      collection(db, collectionName),
      where("userId", "==", userId),
      where("month", "==", month),
      orderBy("date", "desc")
    );
  }
  return baseQuery;
};

// Income functions
export const addIncome = async (income: Omit<Income, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "incomes"), {
      ...income,
      date: Timestamp.fromDate(income.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding income:", error);
    throw error;
  }
};

export const getIncomes = async (userId: string, month?: string): Promise<Income[]> => {
  try {
    const q = createQuery("incomes", userId, month);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as Income[];
  } catch (error) {
    console.error("Error getting incomes:", error);
    throw error;
  }
};

// Expense functions
export const addExpense = async (expense: Omit<Expense, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      ...expense,
      date: Timestamp.fromDate(expense.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getExpenses = async (userId: string, month?: string): Promise<Expense[]> => {
  try {
    const q = createQuery("expenses", userId, month);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as Expense[];
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

export const markExpenseAsPaid = async (expenseId: string, paid: boolean) => {
  try {
    const expenseRef = doc(db, "expenses", expenseId)
    await updateDoc(expenseRef, { paid })
  } catch (error) {
    console.error("Error updating expense:", error)
    throw error
  }
}

export const deleteExpense = async (expenseId: string) => {
  try {
    await deleteDoc(doc(db, "expenses", expenseId))
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw error
  }
}

// Function to calculate monthly summary
export const calculateMonthlySummary = (incomes: Income[], expenses: Expense[]): MonthlySummary => {
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalPaidExpenses = expenses.filter((expense) => expense.paid).reduce((sum, expense) => sum + expense.amount, 0)

  const available = totalIncome - totalPaidExpenses
  const spentPercentage = totalIncome > 0 ? (totalPaidExpenses / totalIncome) * 100 : 0

  return {
    month: new Date().toISOString().slice(0, 7), // format YYYY-MM
    totalIncome,
    totalExpenses,
    totalPaidExpenses,
    available,
    spentPercentage,
  }
}
