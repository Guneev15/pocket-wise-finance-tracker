
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

const savingsData = [
  { month: "Jan", savings: 200, goal: 300 },
  { month: "Feb", savings: 350, goal: 300 },
  { month: "Mar", savings: 300, goal: 300 },
  { month: "Apr", savings: 500, goal: 300 },
  { month: "May", savings: 450, goal: 300 },
  { month: "Jun", savings: 400, goal: 300 },
  { month: "Jul", savings: 600, goal: 500 },
  { month: "Aug", savings: 550, goal: 500 },
  { month: "Sep", savings: 700, goal: 500 },
  { month: "Oct", savings: 650, goal: 500 },
  { month: "Nov", savings: 800, goal: 500 },
  { month: "Dec", savings: 900, goal: 500 },
];

export function SavingsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Savings Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={savingsData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, undefined]}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.6}
              name="Actual Savings"
            />
            <Area
              type="monotone"
              dataKey="goal"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Savings Goal"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
