import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { budgetService } from "@/services/budgets";
import { BudgetForm } from "./BudgetForm";
import { toast } from "sonner";

export function BudgetList() {
  const [budgets, setBudgets] = useState([]);

  const getBudgetStatusColor = (percentage: number) => {
    if (percentage < 70) return "text-budget-green-600";
    if (percentage < 90) return "text-budget-blue-600";
    if (percentage <= 100) return "text-yellow-600";
    return "text-budget-red-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return "bg-budget-green-600";
    if (percentage < 90) return "bg-budget-blue-600";
    if (percentage <= 100) return "bg-yellow-500";
    return "bg-budget-red-600";
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await budgetService.deleteBudget(id);
      await fetchBudgets();
      toast.success(response.message);
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response);
    } catch (error) {
      console.error("Error fetching budgets:", error.message);
    }
  };
  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Limits</CardTitle>
        <div className="mt-4 sm:mt-0">
          <BudgetForm onSuccess={fetchBudgets} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets?.map((budget) => {
            const amount = +budget.amount;
            const percentage = Math.round((budget.spent / amount) * 100);
            return (
              <Card key={budget.budget_id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{budget.category_name}</h3>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        getBudgetStatusColor(percentage)
                      )}
                    >
                      {percentage ?? 0}%
                    </div>
                  </div>

                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2 mb-4"
                    indicatorClassName={getProgressColor(percentage)}
                  />

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Spent</div>
                      <div className="font-semibold text-budget-red-600">
                        ₹{budget.spent ?? 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Budget</div>
                      <div className="font-semibold">
                        ₹{amount?.toFixed(2) ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    {percentage > 100 ? (
                      <div className="flex items-center text-budget-red-600">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span>
                          Exceeded by ₹{(budget.spent - amount).toFixed(2) ?? 0}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-budget-green-600">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        <span>
                          ₹{(amount - (budget.spent ?? 0)).toFixed(2) ?? 0}{" "}
                          remaining
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="destructive"
                    className="mt-4 w-full"
                    onClick={() => handleDelete(budget.budget_id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
