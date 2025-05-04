import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { authService } from "@/services/auth";
import { transactionService } from "@/services/transactions";
import { toast } from "sonner";
import { Transaction } from "@/services/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

      setTransactions(userTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <OverviewChart transactions={transactions ?? []} />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <CategoryPieChart transactions={transactions ?? []} />
      </div>
    </div>
  );
}
