import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

export function OverviewChart() {
  const [chartData, setChartData] = useState([
    { name: "Jan", income: 0, expenses: 0 },
    { name: "Feb", income: 0, expenses: 0 },
    { name: "Mar", income: 0, expenses: 0 },
    { name: "Apr", income: 0, expenses: 0 },
    { name: "May", income: 0, expenses: 0 },
    { name: "Jun", income: 0, expenses: 0 },
    { name: "Jul", income: 0, expenses: 0 },
    { name: "Aug", income: 0, expenses: 0 },
    { name: "Sep", income: 0, expenses: 0 },
    { name: "Oct", income: 0, expenses: 0 },
    { name: "Nov", income: 0, expenses: 0 },
    { name: "Dec", income: 0, expenses: 0 },
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
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyData = monthNames.map((name, index) => {
        const monthTransactions = userData.transactions.filter((t: any) => {
          const date = new Date(t.date);
          return date.getMonth() === index;
        });
        
        const income = monthTransactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
          
        const expenses = monthTransactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
          
        return {
          name,
          income,
          expenses
        };
      });
      
      setChartData(monthlyData);
    }
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `₹${value}`}
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="#16a34a"
              fill="#22c55e"
              fillOpacity={0.6}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="#dc2626"
              fill="#ef4444"
              fillOpacity={0.6}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
