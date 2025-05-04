/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from "./types";
import { toast } from "sonner";

// Add proper interface for transaction data
export interface TransactionData {
  type: string;
  amount: number;
  date: string;
  category_id: string;
  description: string;
  user_id: number | string;
}

// Define clear return type
export interface TransactionResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

const TRANSACTIONS_KEY = "budgetwise_transactions";

export const transactionService = {
  getTransactions: async (user_id: string): Promise<unknown[]> => {
    try {
      // First try API endpoint
      const response = await fetch(
        `http://localhost:5001/api/transactions?user_id=${user_id}`,
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
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (apiError) {
      toast.error("Failed to fetch transactions");
      throw new Error(apiError);
    }
  },

  addTransaction: async (
    transaction: TransactionData
  ): Promise<TransactionResult> => {
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
  },

  deleteTransaction: async (
    transactionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await fetch(`http://localhost:5001/api/transactions/${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return { success: true, message: "Transaction deleted successfully" };
    } catch (error) {
      return { success: false, message: "Failed to delete transaction" };
    }
  },
};
