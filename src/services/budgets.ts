import { toast } from "sonner";
import { authService } from "./auth";
import { User } from "./types";

interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  createdAt: string;
}

const BUDGETS_KEY = "budgetwise_budgets";

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    try {
      // First try API endpoint
      const response = await fetch(`http://localhost:5001/api/budgets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API_NOT_FOUND");
        }
        throw new Error(`Failed to fetch budgets: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (apiError) {
      toast.error("Failed to fetch budgets");
      throw new Error(apiError);
    }
  },

  addBudget: async (budget: {
    category: string;
    amount: number;
    month: string;
    year: string;
  }) => {
    // Try API endpoint first
    const response = await fetch("http://localhost:5001/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ ...budget }),
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

  async deleteBudget(
    budgetId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const budgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || "[]");
      const filteredBudgets = budgets.filter(
        (budget: Budget) => budget.id !== budgetId
      );
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(filteredBudgets));

      return {
        success: true,
        message: "Budget deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete budget",
      };
    }
  },

  async updateBudget(
    budgetId: string,
    updates: Partial<Budget>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const budgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || "[]");
      const index = budgets.findIndex(
        (budget: Budget) => budget.id === budgetId
      );

      if (index === -1) {
        return {
          success: false,
          message: "Budget not found",
        };
      }

      budgets[index] = { ...budgets[index], ...updates };
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));

      return {
        success: true,
        message: "Budget updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update budget",
      };
    }
  },
};
