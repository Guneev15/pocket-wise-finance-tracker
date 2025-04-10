
import { BarChart, PieChart, IndianRupee, CreditCard, ArrowDown, ArrowUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BudgetProgressList } from "@/components/dashboard/BudgetProgressList";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { BudgetForm } from "@/components/budgets/BudgetForm";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <TransactionForm />
          <BudgetForm />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value="₹0.00"
          icon={<IndianRupee className="h-4 w-4 text-primary" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Month's Income"
          value="₹0.00"
          icon={<ArrowUp className="h-4 w-4 text-budget-green-600" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Month's Expenses"
          value="₹0.00"
          icon={<ArrowDown className="h-4 w-4 text-budget-red-600" />}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Budget Status"
          value="0% Used"
          icon={<CreditCard className="h-4 w-4 text-budget-blue-600" />}
        />
      </div>
      
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
