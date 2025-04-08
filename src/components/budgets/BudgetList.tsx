
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const budgetData = [
  { 
    id: 1,
    category: "Housing", 
    spent: 1200, 
    budget: 1500, 
    percentage: 80,
    month: "April",
    year: "2023"
  },
  { 
    id: 2,
    category: "Food", 
    spent: 600, 
    budget: 600, 
    percentage: 100,
    month: "April",
    year: "2023"
  },
  { 
    id: 3,
    category: "Transportation", 
    spent: 300, 
    budget: 400, 
    percentage: 75,
    month: "April",
    year: "2023"
  },
  { 
    id: 4,
    category: "Entertainment", 
    spent: 200, 
    budget: 150, 
    percentage: 133,
    month: "April",
    year: "2023"
  },
  { 
    id: 5,
    category: "Utilities", 
    spent: 500, 
    budget: 600, 
    percentage: 83,
    month: "April",
    year: "2023"
  },
  { 
    id: 6,
    category: "Shopping", 
    spent: 350, 
    budget: 400, 
    percentage: 88,
    month: "April",
    year: "2023"
  },
  { 
    id: 7,
    category: "Healthcare", 
    spent: 150, 
    budget: 300, 
    percentage: 50,
    month: "April",
    year: "2023"
  },
  { 
    id: 8,
    category: "Personal", 
    spent: 80, 
    budget: 100, 
    percentage: 80,
    month: "April",
    year: "2023"
  },
];

export function BudgetList() {
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

  const month = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Limits</CardTitle>
        <div className="text-sm text-muted-foreground">
          {month} {year}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetData.map((budget) => (
            <Card key={budget.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{budget.category}</h3>
                  <div className={cn(
                    "text-sm font-medium",
                    getBudgetStatusColor(budget.percentage)
                  )}>
                    {budget.percentage}%
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className="h-2 mb-4" 
                  indicatorClassName={getProgressColor(budget.percentage)}
                />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Spent</div>
                    <div className="font-semibold text-budget-red-600">
                      ₹{budget.spent.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-semibold">₹{budget.budget.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  {budget.percentage > 100 ? (
                    <div className="flex items-center text-budget-red-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>Exceeded by ₹{(budget.spent - budget.budget).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-budget-green-600">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>₹{(budget.budget - budget.spent).toFixed(2)} remaining</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
