/* eslint-disable no-useless-catch */
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5001/api";

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  categoryName?: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  categoryName?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

// API implementation with backend
export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      // Store the token in localStorage
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async addTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add transaction");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
    } catch (error) {
      throw error;
    }
  },

  // Categories
  async getCategories(userId: string): Promise<Category[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Budgets
  async getBudgets(userId: string): Promise<Budget[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async addBudget(budget: Omit<Budget, "id">): Promise<Budget> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add budget");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Analytics
  async getMonthlySummary(userId: string, year: number): Promise<unknown[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/transactions/summary?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch monthly summary");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async getCategoryBreakdown(
    userId: string,
    month: number,
    year: number
  ): Promise<unknown[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/transactions/breakdown?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch category breakdown");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export const handleApiError = (error: { message?: string }) => {
  console.error("API Error:", error);
  toast.error(error.message || "Something went wrong");
};
