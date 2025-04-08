
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const budgetData = [
  { category: "Housing", spent: 1200, budget: 1500, percentage: 80 },
  { category: "Food", spent: 600, budget: 600, percentage: 100 },
  { category: "Transportation", spent: 300, budget: 400, percentage: 75 },
  { category: "Entertainment", spent: 200, budget: 150, percentage: 133 },
  { category: "Utilities", spent: 500, budget: 600, percentage: 83 },
];

export function BudgetProgressList() {
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

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.category}</span>
                <span className={getBudgetStatusColor(item.percentage)}>
                  ${item.spent} / ${item.budget}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Progress 
                  value={Math.min(item.percentage, 100)} 
                  className="h-2" 
                  indicatorClassName={getProgressColor(item.percentage)}
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
