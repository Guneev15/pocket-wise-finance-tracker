import { BudgetList } from "@/components/budgets/BudgetList";

export default function Budgets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
      </div>

      <BudgetList />
    </div>
  );
}
