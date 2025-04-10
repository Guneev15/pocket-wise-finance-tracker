
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";

export function CategoryPieChart() {
  const [categoryData, setCategoryData] = useState([
    { name: "No Data", value: 1, color: "#cbd5e1" }
  ]);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("user");
    if (!currentUser) return;

    const user = JSON.parse(currentUser);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userData = users.find((u: any) => u.id === user.id);
    
    // If user has transaction data, update chart
    if (userData && userData.transactions && userData.transactions.length > 0) {
      // Group transactions by category
      const categoryMap = new Map();
      const colors = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ec4899", "#64748b"];
      
      let colorIndex = 0;
      userData.categories.forEach((cat: any) => {
        categoryMap.set(cat.id, {
          name: cat.name,
          value: 0,
          color: cat.color || colors[colorIndex % colors.length]
        });
        colorIndex++;
      });
      
      // Sum amounts by category for expense transactions
      userData.transactions
        .filter((t: any) => t.type === 'expense')
        .forEach((t: any) => {
          if (categoryMap.has(t.categoryId)) {
            const category = categoryMap.get(t.categoryId);
            category.value += parseFloat(t.amount);
          }
        });
      
      // Convert to array and filter out categories with zero amount
      const chartData = Array.from(categoryMap.values())
        .filter(cat => cat.value > 0);
      
      if (chartData.length > 0) {
        setCategoryData(chartData);
      }
    }
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : `${name}`}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
