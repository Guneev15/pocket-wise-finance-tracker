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
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      const userTransactions = (await transactionService.getTransactions(
        String(user.id)
      )) as unknown as {
        id: string;
        user_id: string;
        type: string;
        amount: string;
        category: string;
        date: string;
      }[];

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
