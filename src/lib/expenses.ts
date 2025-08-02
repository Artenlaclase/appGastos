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

// Helpers
const formatMonth = (date: Date) => date.toISOString().slice(0, 7);

function getUserCollectionPath(userId: string, collectionName: "incomes" | "expenses"): string {
  return `users/${userId}/${collectionName}`;
}

// Query Builder
const createQuery = (collectionName: "incomes" | "expenses", userId: string, month?: string) => {
  const path = getUserCollectionPath(userId, collectionName);
  const baseQuery = query(
    collection(db, path),
    orderBy("date", "desc")
  );

  return month ? query(baseQuery, where("month", "==", month)) : baseQuery;
};

// Income Operations
export const addIncome = async (userId: string, income: Omit<Income, "id" | "month">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollectionPath(userId, "incomes")), {
      ...income,
      userId,
      date: Timestamp.fromDate(income.date),
      month: formatMonth(income.date),
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
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        description: data.description,
        amount: data.amount,
        date: data.date.toDate(),
        month: data.month
      };
    });
  } catch (error) {
    console.error("Error getting incomes:", error);
    throw error;
  }
};

// Expense Operations
export const addExpense = async (userId: string, expense: Omit<Expense, "id" | "month" | "paid">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, getUserCollectionPath(userId, "expenses")), {
      ...expense,
      userId,
      paid: false, // Default value
      date: Timestamp.fromDate(expense.date),
      month: formatMonth(expense.date),
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
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        category: data.category,
        description: data.description,
        amount: data.amount,
        paid: data.paid,
        date: data.date.toDate(),
        month: data.month
      };
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

export const updateExpense = async (userId: string, expenseId: string, updates: Partial<Expense>): Promise<void> => {
  try {
    const expenseRef = doc(db, getUserCollectionPath(userId, "expenses"), expenseId);
    await updateDoc(expenseRef, updates);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (userId: string, expenseId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, getUserCollectionPath(userId, "expenses"), expenseId));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// Summary Operations
export const calculateMonthlySummary = (
  incomes: Income[], 
  expenses: Expense[]
): MonthlySummary => {
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPaidExpenses = expenses
    .filter(expense => expense.paid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const available = totalIncome - totalPaidExpenses;
  const spentPercentage = totalIncome > 0 
    ? (totalPaidExpenses / totalIncome) * 100 
    : 0;

  return {
    month: incomes[0]?.month || expenses[0]?.month || formatMonth(new Date()),
    totalIncome,
    totalExpenses,
    totalPaidExpenses,
    available,
    spentPercentage,
  };
};

// Additional Utility Functions
export const getMonthlyData = async (userId: string, month: string): Promise<{
  incomes: Income[];
  expenses: Expense[];
  summary: MonthlySummary;
}> => {
  const [incomes, expenses] = await Promise.all([
    getIncomes(userId, month),
    getExpenses(userId, month),
  ]);
  
  return {
    incomes,
    expenses,
    summary: calculateMonthlySummary(incomes, expenses),
  };
};