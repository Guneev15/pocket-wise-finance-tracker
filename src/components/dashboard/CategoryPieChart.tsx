
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const categoryData = [
  { name: "Housing", value: 1200, color: "#22c55e" },
  { name: "Food", value: 600, color: "#3b82f6" },
  { name: "Transportation", value: 300, color: "#f97316" },
  { name: "Entertainment", value: 200, color: "#a855f7" },
  { name: "Utilities", value: 500, color: "#ec4899" },
  { name: "Others", value: 400, color: "#64748b" },
];

export function CategoryPieChart() {
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
