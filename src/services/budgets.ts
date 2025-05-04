import { authService } from "./auth";
import { User } from "./types";

interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  createdAt: string;
}

const BUDGETS_KEY = "budgetwise_budgets";

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    const user = authService.getCurrentUser() as unknown as User;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const budgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || "[]");
    return budgets.filter((budget: Budget) => budget.userId === user.id);
  },

  async addBudget(
    budget: Omit<Budget, "id" | "userId" | "createdAt">
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = authService.getCurrentUser() as unknown as User;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const budgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || "[]");
      const newBudget: Budget = {
        ...budget,
        id: crypto.randomUUID(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      budgets.push(newBudget);
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));

      return {
        success: true,
        message: "Budget added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add budget",
      };
    }
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
