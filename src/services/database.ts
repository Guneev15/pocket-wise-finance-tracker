import { Transaction, Budget, Category, UserData } from './types';
import { toast } from 'sonner';

export const db = {
  async init() {
    try {
      // Initialize local storage with default data if not exists
      if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
      }
      if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
      }
      if (!localStorage.getItem('budgets')) {
        localStorage.setItem('budgets', JSON.stringify([]));
      }
      if (!localStorage.getItem('categories')) {
        const defaultCategories = [
          { id: 'income', name: 'Income', icon: 'wallet', color: '#4CAF50', type: 'income' },
          { id: 'expense', name: 'Expense', icon: 'credit-card', color: '#F44336', type: 'expense' }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
      }
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      toast.error('Failed to initialize local storage');
      return false;
    }
  },

  async addTransaction(userId: string, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const newTransaction = {
        ...transaction,
        id: transaction.id || Date.now().toString(),
        userId,
        createdAt: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      return newTransaction as Transaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      
      return transactions
        .filter((t: Transaction) => t.userId === userId)
        .map((t: Transaction) => ({
          ...t,
          category: categories.find((c: Category) => c.id === t.categoryId)
        }))
        .sort((a: Transaction, b: Transaction) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },

  async addBudget(userId: string, budget: Partial<Budget>): Promise<Budget> {
    try {
      const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const newBudget = {
        ...budget,
        id: budget.id || Date.now().toString(),
        userId,
        spent: 0,
        createdAt: new Date().toISOString()
      };
      
      budgets.push(newBudget);
      localStorage.setItem('budgets', JSON.stringify(budgets));
      
      return newBudget as Budget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  },

  async getBudgets(userId: string): Promise<Budget[]> {
    try {
      const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      
      return budgets
        .filter((b: Budget) => b.userId === userId)
        .map((b: Budget) => ({
          ...b,
          category: categories.find((c: Category) => c.id === b.categoryId)
        }))
        .sort((a: Budget, b: Budget) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  }
}; 