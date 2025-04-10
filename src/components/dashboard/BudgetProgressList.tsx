
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function BudgetProgressList() {
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("user");
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(currentUser);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = users.find((u: any) => u.id === user.id);
    
    if (userData) {
      // If user has budgets, calculate progress
      if (userData.budgets && userData.budgets.length > 0 && userData.transactions) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        // Filter budgets for current month and year
        const currentBudgets = userData.budgets.filter((b: any) => 
          b.month === currentMonth && b.year === currentYear
        );
        
        if (currentBudgets.length > 0) {
          // Process budgets with categories
          const budgetsWithProgress = currentBudgets.map((budget: any) => {
            // Find category name
            const category = userData.categories.find((c: any) => c.id === budget.categoryId);
            const categoryName = category ? category.name : "Unknown Category";
            
            // Calculate spent amount for this category this month
            const spent = userData.transactions
              .filter((t: any) => {
                const date = new Date(t.date);
                return t.categoryId === budget.categoryId && 
                       t.type === 'expense' && 
                       date.getMonth() + 1 === currentMonth &&
                       date.getFullYear() === currentYear;
              })
              .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
            
            // Calculate percentage
            const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
            
            return {
              category: categoryName,
              spent,
              budget: budget.amount,
              percentage
            };
          });
          
          setBudgetData(budgetsWithProgress);
        } else {
          setBudgetData([]);
        }
      } else {
        setBudgetData([]);
      }
    }
    
    setLoading(false);
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading budgets...</p>
          </div>
        ) : budgetData.length > 0 ? (
          <div className="space-y-6">
            {budgetData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className={getBudgetStatusColor(item.percentage)}>
                    ₹{item.spent} / ₹{item.budget}
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
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
            <p>No budget data available</p>
            <p className="text-sm mt-1">Create budgets to track your spending</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
