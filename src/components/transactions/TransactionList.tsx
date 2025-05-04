import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Trash2, Edit2, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
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
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
 

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
    setIsLoading(true);
    try {
      // Handle potential async getCurrentUser with proper error handling
      let user;
      try {
        const maybePromise = authService.getCurrentUser();
        user = typeof maybePromise === "object" && typeof (maybePromise as any).then === "function"
          ? await maybePromise
          : maybePromise;
      } catch {
        user = null;
      }

      // Type guard to ensure user has id property
      if (!user || typeof user !== 'object' || !('id' in user)) {
        toast.error("Please log in to view transactions");
        navigate("/login");
        return;
      }

      const userTransactions = await transactionService.getTransactions(String(user.id));
      
      // Sort transactions by date (newest first)
      userTransactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // Calculate income and expense totals
      let income = 0;
      let expense = 0;
      
      userTransactions.forEach(transaction => {
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

  const handleTransactionAdded = async() => {
    setIsDialogOpen(false);
    await loadTransactions(); // Refresh transactions after adding a new one
    toast.success("Transaction list refreshed");
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || transaction.category === category;
    const matchesType = type === "all" || transaction.type === type;
    return matchesSearch && matchesCategory && matchesType;
  });

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
            <div className="text-2xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₹{totalExpense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalExpense / (totalIncome + totalExpense || 1)) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <div className={`h-4 w-4 ${(totalIncome - totalExpense) >= 0 ? "bg-green-500" : "bg-red-500"} rounded-full`}></div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(totalIncome - totalExpense) >= 0 ? "text-green-500" : "text-red-500"}`}>
              ₹{(totalIncome - totalExpense).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current balance
            </p>
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
    </div>
  );
}