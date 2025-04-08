
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const incomeData = [
  { month: "Jan", income: 4000, expenses: 2400, savings: 1600 },
  { month: "Feb", income: 3500, expenses: 2100, savings: 1400 },
  { month: "Mar", income: 4200, expenses: 2800, savings: 1400 },
  { month: "Apr", income: 4100, expenses: 2600, savings: 1500 },
  { month: "May", income: 4800, expenses: 3000, savings: 1800 },
  { month: "Jun", income: 4400, expenses: 3200, savings: 1200 },
  { month: "Jul", income: 5000, expenses: 3500, savings: 1500 },
  { month: "Aug", income: 4800, expenses: 3300, savings: 1500 },
  { month: "Sep", income: 5200, expenses: 3500, savings: 1700 },
  { month: "Oct", income: 5500, expenses: 3700, savings: 1800 },
  { month: "Nov", income: 5800, expenses: 3900, savings: 1900 },
  { month: "Dec", income: 6000, expenses: 4100, savings: 1900 },
];

export function IncomeTrendsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Income vs Expenses Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={incomeData}
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
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Savings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
