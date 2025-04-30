import { Transaction } from './types';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

export const transactionService = {
  async addTransaction(userId: string, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date || new Date().toISOString(),
          type: transaction.type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const savedTransaction = await response.json();
      toast.success('Transaction added successfully');
      return savedTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  },

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      throw error;
    }
  }
}; 