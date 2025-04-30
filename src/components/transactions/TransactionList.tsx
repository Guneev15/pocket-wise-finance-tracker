<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Transaction } from '@/services/types';
import { transactionService } from '@/services/transactions';
import { auth } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { transactionService } from "@/services/transactions";
import { authService } from "@/services/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD

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
=======
import { TransactionForm } from "./TransactionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "income", label: "Income" },
  { value: "housing", label: "Housing" },
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "healthcare", label: "Healthcare" },
  { value: "shopping", label: "Shopping" },
  { value: "personal", label: "Personal" },
  { value: "education", label: "Education" },
  { value: "savings", label: "Savings" },
  { value: "debt", label: "Debt" },
  { value: "other", label: "Other" },
];

export function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      toast.error("Please log in to view transactions");
      navigate("/login");
      return;
    }

    loadTransactions();
  }, [navigate]);

  const loadTransactions = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        toast.error("Please log in to view transactions");
        navigate("/login");
        return;
      }

      const userTransactions = await transactionService.getTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const result = await transactionService.deleteTransaction(transactionId);
      if (result.success) {
        toast.success(result.message);
        loadTransactions();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleTransactionAdded = () => {
    setIsDialogOpen(false);
    loadTransactions(); // Refresh transactions after adding a new one
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || transaction.category === category;
    const matchesType = type === "all" || transaction.type === type;
    return matchesSearch && matchesCategory && matchesType;
  });

  if (isLoading) {
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
    return <div>Loading transactions...</div>;
  }

  return (
<<<<<<< HEAD
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
=======
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={handleTransactionAdded} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{transaction.description || "No description"}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                          )}
                          <span className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}>
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
  );
}