/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "./types";
import { toast } from "sonner";

// Add proper interface for transaction data
export interface TransactionData {
  type: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  userId: number | string;
}

// Define clear return type
export interface TransactionResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

const TRANSACTIONS_KEY = "budgetwise_transactions";

export const transactionService = {
  getTransactions: async (userId: string): Promise<unknown[]> => {
    try {
      try {
        // First try API endpoint
        const response = await fetch(
          `http://localhost:5001/api/transactions?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("API_NOT_FOUND");
          }
          throw new Error(
            `Failed to fetch transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (apiError) {
        // If API fails, fall back to localStorage
        console.warn(
          "API endpoint unavailable, falling back to localStorage for transactions"
        );

        // Get transactions from localStorage
        const transactions = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );

        // Filter by userId
        return transactions.filter(
          (transaction: any) =>
            transaction &&
            transaction.userId &&
            transaction.userId.toString() === userId.toString()
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
      return [];
    }
  },

  addTransaction: async (
    transaction: TransactionData
  ): Promise<TransactionResult> => {
    try {
      try {
        // Try API endpoint first
        const response = await fetch("http://localhost:5001/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(transaction),
        });

        if (response.status === 404) {
          throw new Error("API_NOT_FOUND");
        }

        if (!response.ok) {
          let errorMessage = `Failed with status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.warn("Could not parse error response", parseError);
          }

          throw new Error(errorMessage);
        }

        // Handle empty responses safely
        const text = await response.text();
        const data = text ? JSON.parse(text) : { success: true };

        return {
          success: true,
          data,
        };
      } catch (apiError: any) {
        // Fall back to localStorage if API not available
        if (
          apiError.message === "API_NOT_FOUND" ||
          (apiError instanceof TypeError &&
            apiError.message.includes("Failed to fetch"))
        ) {
          console.warn(
            "API endpoint not available, falling back to localStorage for transactions"
          );

          // Get existing transactions
          const transactions = JSON.parse(
            localStorage.getItem("transactions") || "[]"
          );

          // Create new transaction with ID
          const newTransaction = {
            ...transaction,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };

          // Add to storage
          transactions.push(newTransaction);
          localStorage.setItem("transactions", JSON.stringify(transactions));

          // Update user's transactions in session data if using local auth
          try {
            const currentUser = JSON.parse(
              localStorage.getItem("currentUser") || "null"
            );
            if (currentUser && currentUser.id === transaction.userId) {
              // Add to user's transactions list
              if (!Array.isArray(currentUser.transactions)) {
                currentUser.transactions = [];
              }
              currentUser.transactions.push(newTransaction);
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }
          } catch (userUpdateError) {
            console.warn(
              "Could not update user's transactions",
              userUpdateError
            );
          }

          return {
            success: true,
            data: newTransaction,
          };
        }

        throw apiError;
      }
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  },

  deleteTransaction: async (
    transactionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(TRANSACTIONS_KEY) || "[]"
      );
      const updatedTransactions = transactions.filter(
        (transaction: Transaction) => transaction.id !== transactionId
      );
      localStorage.setItem(
        TRANSACTIONS_KEY,
        JSON.stringify(updatedTransactions)
      );
      return { success: true, message: "Transaction deleted successfully" };
    } catch (error) {
      return { success: false, message: "Failed to delete transaction" };
    }
  },
};
