import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { TransactionForm } from "./TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Transaction, User } from "@/services/types";
import { categoryService } from "@/services/categories";

export function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fetchCategories = async () => {
    const user = await authService.getCurrentUser();
    const result = (await categoryService.getCategories(user.id)) as
      | any[]
      | {
          message: string;
        };
    if (Array.isArray(result)) {
      const categories = result?.map((category) => ({
        label: category.name,
        value: category.category_id,
      }));
      setCategoryOptions(categories || []);
    } else {
      toast.error(result.message || "Failed to fetch categories");
      console.error("Category fetch error:", result.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [navigate]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Handle potential async getCurrentUser with proper error handling
      const user = await authService.getCurrentUser();

      const userTransactions = (await transactionService.getTransactions(
        String(user.user_id)
      )) as Transaction[];

      // Sort transactions by date (newest first)
      userTransactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Calculate income and expense totals
      let income = 0;
      let expense = 0;

      userTransactions.forEach((transaction) => {
        if (transaction.type === "income") {
          income += Number(transaction.amount);
        } else if (transaction.type === "expense") {
          expense += Number(transaction.amount);
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const result = await transactionService.deleteTransaction(transactionId);
      if (result.success) {
        await loadTransactions();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleTransactionAdded = async () => {
    setIsDialogOpen(false);
    await loadTransactions(); // Refresh transactions after adding a new one
    toast.success("Transaction list refreshed");
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ₹{totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {(
                (totalIncome / (totalIncome + totalExpense || 1)) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ₹{totalExpense.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (totalExpense / (totalIncome + totalExpense || 1)) *
                100
              ).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <div
              className={`h-4 w-4 ${
                totalIncome - totalExpense >= 0 ? "bg-green-500" : "bg-red-500"
              } rounded-full`}
            ></div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalIncome - totalExpense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{(totalIncome - totalExpense).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Only one Transaction card with one Add Transaction button */}
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
          {/* Search and filter controls */}
          <div className="space-y-4">
            {/* Transactions table */}
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
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell>
                          {format(
                            new Date(transaction.created_at),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.description || "No description"}
                        </TableCell>
                        <TableCell>{transaction.category_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={
                                transaction.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              ₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(transaction.transaction_id)
                            }
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
    </div>
  );
}
