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

// Helper functions
const formatMonth = (date: Date) => date.toISOString().slice(0, 7);

function getUserCollectionPath(userId: string, collectionName: "incomes" | "expenses"): string {
  return `users/${userId}/${collectionName}`;
}

const createQuery = (collectionName: "incomes" | "expenses", userId: string, month?: string) => {
  const path = getUserCollectionPath(userId, collectionName);
  const baseQuery = query(
    collection(db, path),
    orderBy("date", "desc")
  );

  return month ? query(baseQuery, where("month", "==", month)) : baseQuery;
};

// Income Operations
export const addIncome = async (income: Omit<Income, "id">): Promise<string> => {
  try {
    if (!income.userId) throw new Error("User ID is required");
    
    const docRef = await addDoc(collection(db, getUserCollectionPath(income.userId, "incomes")), {
      ...income,
      date: Timestamp.fromDate(income.date),
      month: formatMonth(income.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding income:", error);
    throw new Error("Failed to add income");
  }
};

export const getIncomes = async (userId: string, month?: string): Promise<Income[]> => {
  if (!userId) throw new Error("User ID is required");

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
    throw new Error("Failed to get incomes");
  }
};

// Expense Operations
export const addExpense = async (expense: Omit<Expense, "id">): Promise<string> => {
  try {
    if (!expense.userId) throw new Error("User ID is required");

    const docRef = await addDoc(collection(db, getUserCollectionPath(expense.userId, "expenses")), {
      ...expense,
      paid: expense.paid || false,
      date: Timestamp.fromDate(expense.date),
      month: formatMonth(expense.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }
};

export const getExpenses = async (userId: string, month?: string): Promise<Expense[]> => {
  if (!userId) throw new Error("User ID is required");

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
    throw new Error("Failed to get expenses");
  }
};

export const updateExpense = async (
  expenseId: string, 
  updates: Partial<Omit<Expense, "id" | "userId">>,
  userId: string
): Promise<void> => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!expenseId) throw new Error("Expense ID is required");

    const expenseRef = doc(db, getUserCollectionPath(userId, "expenses"), expenseId);
    await updateDoc(expenseRef, updates);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense");
  }
};

export const updateExpensePaidStatus = async (
  expenseId: string, 
  paid: boolean,
  userId: string
): Promise<void> => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!expenseId) throw new Error("Expense ID is required");

    const expenseRef = doc(db, getUserCollectionPath(userId, "expenses"), expenseId);
    await updateDoc(expenseRef, { paid });
  } catch (error) {
    console.error("Error updating expense paid status:", error);
    throw new Error("Failed to update expense status");
  }
};


export const deleteExpense = async (expenseId: string, userId: string): Promise<void> => {
  try {
    if (!userId) throw new Error("User ID is required");
    
    await deleteDoc(doc(db, getUserCollectionPath(userId, "expenses"), expenseId));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense");
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

  const available = totalIncome - totalExpenses; // Changed from totalPaidExpenses to totalExpenses
  const spentPercentage = totalIncome > 0 
    ? (totalExpenses / totalIncome) * 100 
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

// Combined Data Fetching
export const getMonthlyData = async (userId: string, month: string): Promise<{
  incomes: Income[];
  expenses: Expense[];
  summary: MonthlySummary;
}> => {
  if (!userId) throw new Error("User ID is required");
  if (!month) throw new Error("Month is required");

  try {
    const [incomes, expenses] = await Promise.all([
      getIncomes(userId, month),
      getExpenses(userId, month),
    ]);
    
    return {
      incomes,
      expenses,
      summary: calculateMonthlySummary(incomes, expenses),
    };
  } catch (error) {
    console.error("Error getting monthly data:", error);
    throw new Error("Failed to get monthly data");
  }
};