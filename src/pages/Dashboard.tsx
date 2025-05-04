import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BudgetProgressList } from "@/components/dashboard/BudgetProgressList";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { authService } from "@/services/auth";
import { transactionService } from "@/services/transactions";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please log in to view your dashboard");
      navigate("/login");
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      let user;
      try {
        const maybePromise = authService.getCurrentUser();
        user = typeof maybePromise === "object" && typeof (maybePromise as any).then === "function"
          ? await maybePromise
          : maybePromise;
      } catch {
        user = null;
      }

      if (!user || typeof user !== 'object' || !('id' in user)) {
        toast.error("Please log in to view your dashboard");
        navigate("/login");
        return;
      }

      // Load transactions to calculate totals
      const userTransactions = await transactionService.getTransactions(String(user.id));

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
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <OverviewChart />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <CategoryPieChart />
        <BudgetProgressList />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <RecentTransactions />
      </div>
    </div>
  );
}
