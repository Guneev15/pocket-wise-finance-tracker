
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const categoryData = [
  { 
    category: "Housing", 
    thisMonth: 1200, 
    lastMonth: 1200, 
    average: 1190 
  },
  { 
    category: "Food", 
    thisMonth: 600, 
    lastMonth: 550, 
    average: 580 
  },
  { 
    category: "Transport", 
    thisMonth: 300, 
    lastMonth: 320, 
    average: 310 
  },
  { 
    category: "Utilities", 
    thisMonth: 500, 
    lastMonth: 480, 
    average: 490 
  },
  { 
    category: "Entertainment", 
    thisMonth: 200, 
    lastMonth: 180, 
    average: 220 
  },
  { 
    category: "Shopping", 
    thisMonth: 350, 
    lastMonth: 400, 
    average: 375 
  },
];

export function CategoryComparisonChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 70,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `₹${value}`}
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis 
              dataKey="category" 
              type="category" 
              scale="band" 
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Bar 
              dataKey="thisMonth" 
              fill="#22c55e" 
              name="This Month" 
              radius={[0, 4, 4, 0]} 
            />
            <Bar 
              dataKey="lastMonth" 
              fill="#3b82f6" 
              name="Last Month" 
              radius={[0, 4, 4, 0]} 
            />
            <Bar 
              dataKey="average" 
              fill="#a855f7" 
              name="Average" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
