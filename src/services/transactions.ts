interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description?: string;
  userId: string;
}

const TRANSACTIONS_KEY = 'budgetwise_transactions';

export const transactionService = {
  // Get all transactions for the current user
  getTransactions: (userId: string): Promise<Transaction[]> => {
    return new Promise((resolve) => {
      try {
        const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        const userTransactions = transactions.filter((t: Transaction) => t.userId === userId);
        resolve(userTransactions);
      } catch (error) {
        resolve([]);
      }
    });
  },

  // Add a new transaction
  addTransaction: (transaction: Omit<Transaction, 'id'>): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      try {
        const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        
        // Create new transaction with ID
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };

        // Add to transactions array
        transactions.push(newTransaction);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

        // Dispatch storage event to notify other tabs
        window.dispatchEvent(new Event('storage'));

        resolve({ success: true, message: 'Transaction added successfully!' });
      } catch (error) {
        resolve({ success: false, message: 'Failed to add transaction' });
      }
    });
  },

  // Delete a transaction
  deleteTransaction: (transactionId: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      try {
        const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        const filteredTransactions = transactions.filter((t: Transaction) => t.id !== transactionId);
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTransactions));

        // Dispatch storage event to notify other tabs
        window.dispatchEvent(new Event('storage'));

        resolve({ success: true, message: 'Transaction deleted successfully!' });
      } catch (error) {
        resolve({ success: false, message: 'Failed to delete transaction' });
      }
    });
  },

  // Update a transaction
  updateTransaction: (transactionId: string, updates: Partial<Transaction>): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      try {
        const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        const index = transactions.findIndex((t: Transaction) => t.id === transactionId);
        
        if (index === -1) {
          resolve({ success: false, message: 'Transaction not found' });
          return;
        }

        transactions[index] = { ...transactions[index], ...updates };
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

        // Dispatch storage event to notify other tabs
        window.dispatchEvent(new Event('storage'));

        resolve({ success: true, message: 'Transaction updated successfully!' });
      } catch (error) {
        resolve({ success: false, message: 'Failed to update transaction' });
      }
    });
  },

  // Get transactions summary
  getSummary: (userId: string) => {
    return new Promise((resolve) => {
      try {
        const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        const userTransactions = transactions.filter((t: Transaction) => t.userId === userId);
        
        const income = userTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = userTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = income - expenses;

        resolve({
          income,
          expenses,
          balance
        });
      } catch (error) {
        resolve({
          income: 0,
          expenses: 0,
          balance: 0
        });
      }
    });
  }
}; 