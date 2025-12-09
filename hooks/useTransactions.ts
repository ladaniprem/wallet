// react custom hook file
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

// const API_URL = "https://wallet-api-yfnt.onrender.com/api/health";
//const API_URL = "http://localhost:5001/api/health";

interface Transaction {
  id: string;
  [key: string]: unknown;
}

interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      // API now returns array directly
      const transactions = Array.isArray(data) ? data : data.transactions || [];
      setTransactions(transactions);
      console.log(`✅ Fetched ${transactions.length} transactions`);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async (): Promise<void> => {
    try {
      // Backend route is mounted at /api/transactions/summary/:userId
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary({
        balance: Number(data?.balance ?? 0),
        income: Number(data?.income ?? 0),
        // Backend returns `expense`; frontend expects `expenses`
        expenses: Number((data?.expenses ?? data?.expense) ?? 0),
      });
      console.log("📊 Summary:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", (error as Error).message);
    }
  }, [loadData]);

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
