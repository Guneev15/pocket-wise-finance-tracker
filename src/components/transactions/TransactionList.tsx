import { useEffect, useState } from 'react';
import { Transaction } from '@/services/types';
import { transactionService } from '@/services/transactions';
import { auth } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowDown, 
  ArrowUp, 
  Coffee, 
  Home, 
  ShoppingCart, 
  Truck, 
  Zap,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const user = await auth.getCurrentUser();
      if (user) {
        const userTransactions = await transactionService.getTransactions(user.id);
        setTransactions(userTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await auth.getCurrentUser();
      if (!user) {
        toast.error('Please log in to add transactions');
        return;
      }

      if (!amount || !description || !categoryId) {
        toast.error('Please fill in all fields');
        return;
      }

      const newTransaction = {
        amount: parseFloat(amount),
        description,
        categoryId,
        type,
        date: new Date().toISOString()
      };

      await transactionService.addTransaction(user.id, newTransaction);
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategoryId('');
      
      // Reload transactions
      loadTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            required
          >
            <option value="">Select Category</option>
            {/* Add your categories here */}
          </Select>
          <Select
            value={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>
        <Button type="submit">Add Transaction</Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
