import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { transactionService } from "@/services/transactions";
import { budgetService } from "@/services/budgets";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [budgetStatus, setBudgetStatus] = useState({
    total: 0,
    spent: 0,
    remaining: 0,
    percentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const calculateMetrics = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        toast.error("You must be logged in to view dashboard");
        navigate("/login");
        return;
      }

      // Reset all values to zero initially
      setTotalBalance(0);
      setMonthlyIncome(0);
      setMonthlyExpenses(0);
      setBudgetStatus({ total: 0, spent: 0, remaining: 0, percentage: 0 });

      // Get current month's transactions
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const [transactions, budgets] = await Promise.all([
        transactionService.getTransactions(user.id),
        budgetService.getBudgets()
      ]);

      // If no transactions or budgets, keep values at zero
      if (!transactions.length && !budgets.length) {
        setIsLoading(false);
        return;
      }

      // Filter transactions for current month
      const monthlyTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= firstDayOfMonth && transactionDate <= lastDayOfMonth;
      });

      // Calculate monthly income and expenses
      const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Calculate total balance
      const balance = transactions.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -Math.abs(t.amount));
      }, 0);

      // Calculate budget status
      const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
      const spentBudget = expenses;
      const remainingBudget = totalBudget - spentBudget;
      const percentage = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

      // Update state with calculated values
      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
      setTotalBalance(balance);
      setBudgetStatus({
        total: totalBudget,
        spent: spentBudget,
        remaining: remainingBudget,
        percentage
      });
    } catch (error) {
      console.error("Error calculating metrics:", error);
      toast.error("Failed to load dashboard data");
      // Reset values to zero on error
      setTotalBalance(0);
      setMonthlyIncome(0);
      setMonthlyExpenses(0);
      setBudgetStatus({ total: 0, spent: 0, remaining: 0, percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateMetrics();
    
    // Set up event listeners for storage changes
    const handleStorageChange = () => {
      calculateMetrics();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-budget-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Your current account balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Income this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Expenses this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetStatus.remaining.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {budgetStatus.percentage.toFixed(0)}% of ${budgetStatus.total.toFixed(2)} budget spent
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Transaction list will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 