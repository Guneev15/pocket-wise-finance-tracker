
import { toast } from "sonner";

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
  type: 'income' | 'expense';
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

// Mock API implementation with localStorage
// In a real app, this would make actual API calls to a backend
export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get existing users or initialize empty array
          const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
          
          // Check if email already exists
          if (existingUsers.some((user: any) => user.email === email)) {
            reject(new Error("An account with this email already exists"));
            return;
          }
          
          // Create new user with default empty data
          const userId = Date.now().toString();
          const newUser = { 
            id: userId, 
            name, 
            email, 
            password, // In a real app, this would be hashed
            transactions: [],
            budgets: [],
            categories: [
              { id: "cat1", name: "Housing", icon: "home", color: "#4CAF50" },
              { id: "cat2", name: "Food", icon: "utensils", color: "#2196F3" },
              { id: "cat3", name: "Transportation", icon: "car", color: "#FF9800" },
              { id: "cat4", name: "Entertainment", icon: "film", color: "#9C27B0" },
              { id: "cat5", name: "Utilities", icon: "zap", color: "#607D8B" },
              { id: "cat6", name: "Shopping", icon: "shopping-bag", color: "#E91E63" },
              { id: "cat7", name: "Healthcare", icon: "activity", color: "#00BCD4" },
              { id: "cat8", name: "Personal", icon: "user", color: "#795548" }
            ]
          };
          
          // Save to users array
          existingUsers.push(newUser);
          localStorage.setItem("users", JSON.stringify(existingUsers));
          
          const userInfo: User = {
            id: userId,
            name,
            email
          };
          
          resolve(userInfo);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },
  
  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get users from localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find((u: any) => u.email === email && u.password === password);
          
          if (user) {
            const userInfo: User = {
              id: user.id,
              name: user.name,
              email: user.email
            };
            resolve(userInfo);
          } else {
            reject(new Error("Invalid credentials"));
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },
  
  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        
        if (user && user.transactions) {
          resolve(user.transactions);
        } else {
          resolve([]);
        }
      }, 500);
    });
  },
  
  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex((u: any) => u.id === transaction.userId);
          
          if (userIndex === -1) {
            reject(new Error("User not found"));
            return;
          }
          
          const newTransaction = {
            ...transaction,
            id: Date.now().toString()
          };
          
          // Add transaction to user's transactions
          if (!users[userIndex].transactions) {
            users[userIndex].transactions = [];
          }
          
          users[userIndex].transactions.push(newTransaction);
          localStorage.setItem("users", JSON.stringify(users));
          
          resolve(newTransaction);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },
  
  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex((u: any) => u.id === userId);
          
          if (userIndex === -1) {
            reject(new Error("User not found"));
            return;
          }
          
          if (!users[userIndex].transactions) {
            resolve();
            return;
          }
          
          users[userIndex].transactions = users[userIndex].transactions.filter(
            (t: Transaction) => t.id !== transactionId
          );
          
          localStorage.setItem("users", JSON.stringify(users));
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },
  
  // Budgets
  async getBudgets(userId: string): Promise<Budget[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        
        if (user && user.budgets) {
          resolve(user.budgets);
        } else {
          resolve([]);
        }
      }, 500);
    });
  },
  
  async addBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const userIndex = users.findIndex((u: any) => u.id === budget.userId);
          
          if (userIndex === -1) {
            reject(new Error("User not found"));
            return;
          }
          
          const newBudget = {
            ...budget,
            id: Date.now().toString()
          };
          
          // Add budget to user's budgets
          if (!users[userIndex].budgets) {
            users[userIndex].budgets = [];
          }
          
          // Check if budget for this category/month/year already exists
          const existingBudgetIndex = users[userIndex].budgets.findIndex(
            (b: Budget) => b.categoryId === budget.categoryId && 
                        b.month === budget.month && 
                        b.year === budget.year
          );
          
          if (existingBudgetIndex !== -1) {
            // Update existing budget
            users[userIndex].budgets[existingBudgetIndex].amount = budget.amount;
          } else {
            // Add new budget
            users[userIndex].budgets.push(newBudget);
          }
          
          localStorage.setItem("users", JSON.stringify(users));
          
          resolve(newBudget);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },
  
  // Categories
  async getCategories(userId: string): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        
        if (user && user.categories) {
          resolve(user.categories);
        } else {
          // Return default categories if none exist
          const defaultCategories = [
            { id: "cat1", name: "Housing", icon: "home", color: "#4CAF50" },
            { id: "cat2", name: "Food", icon: "utensils", color: "#2196F3" },
            { id: "cat3", name: "Transportation", icon: "car", color: "#FF9800" },
            { id: "cat4", name: "Entertainment", icon: "film", color: "#9C27B0" },
            { id: "cat5", name: "Utilities", icon: "zap", color: "#607D8B" },
            { id: "cat6", name: "Shopping", icon: "shopping-bag", color: "#E91E63" },
            { id: "cat7", name: "Healthcare", icon: "activity", color: "#00BCD4" },
            { id: "cat8", name: "Personal", icon: "user", color: "#795548" }
          ];
          resolve(defaultCategories);
        }
      }, 500);
    });
  },
  
  // Reports
  async getMonthlySummary(userId: string, year: number): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        
        if (!user || !user.transactions || user.transactions.length === 0) {
          // Return empty data
          const emptyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expense: 0,
            savings: 0
          }));
          resolve(emptyData);
          return;
        }
        
        // Process transactions to create monthly summary
        const monthlySummary = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = i + 1;
          
          const monthTransactions = user.transactions.filter((t: Transaction) => {
            const date = new Date(t.date);
            return date.getFullYear() === year && date.getMonth() + 1 === monthIndex;
          });
          
          const income = monthTransactions
            .filter((t: Transaction) => t.type === 'income')
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
            
          const expense = monthTransactions
            .filter((t: Transaction) => t.type === 'expense')
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
            
          return {
            month: monthIndex,
            income,
            expense,
            savings: income - expense
          };
        });
        
        resolve(monthlySummary);
      }, 500);
    });
  },
  
  async getCategoryBreakdown(userId: string, month: number, year: number): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.id === userId);
        
        if (!user || !user.transactions || !user.categories) {
          resolve([]);
          return;
        }
        
        // Filter transactions for the specific month and year
        const monthTransactions = user.transactions.filter((t: Transaction) => {
          const date = new Date(t.date);
          return date.getFullYear() === year && 
                 date.getMonth() + 1 === month && 
                 t.type === 'expense';
        });
        
        if (monthTransactions.length === 0) {
          resolve([]);
          return;
        }
        
        // Group by category
        const categoryMap = new Map();
        user.categories.forEach((cat: Category) => {
          categoryMap.set(cat.id, {
            categoryId: cat.id,
            name: cat.name,
            color: cat.color,
            amount: 0
          });
        });
        
        // Sum amounts by category
        monthTransactions.forEach((t: Transaction) => {
          if (categoryMap.has(t.categoryId)) {
            const category = categoryMap.get(t.categoryId);
            category.amount += t.amount;
          }
        });
        
        // Convert to array and filter out categories with zero amount
        const breakdown = Array.from(categoryMap.values())
          .filter(cat => cat.amount > 0);
        
        resolve(breakdown);
      }, 500);
    });
  }
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  const message = error.message || "An error occurred";
  toast.error(message);
  console.error(error);
  return message;
};
