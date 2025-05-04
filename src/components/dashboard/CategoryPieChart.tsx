import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { Transaction } from "@/services/types";
import { authService } from "@/services/auth";
import { categoryService } from "@/services/categories";
import { toast } from "sonner";

const colors = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#64748b",
];
export function CategoryPieChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [chartData, setChartData] = useState([
    { name: "No Data", value: 1, color: "#cbd5e1" },
  ]);

  const [categories, setCategories] = useState<
    { label: string; value: string; color: string }[]
  >([]);

  const fetchCategories = async () => {
    const user = await authService.getCurrentUser();
    const result = (await categoryService.getCategories(user.id)) as
      | any[]
      | { message: string };

    if (Array.isArray(result)) {
      const mapped = result.map((category, index) => ({
        label: category.name,
        value: category.category_id,
        color: colors[index % colors.length],
      }));
      setCategories(mapped);
    } else {
      toast.error(result.message || "Failed to fetch categories");
      console.error("Category fetch error:", result.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!transactions || transactions.length === 0 || categories.length === 0)
      return;

    const sumByCategory: Record<
      string,
      { name: string; value: number; color: string }
    > = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = categories.find((c) => c.value === t.category_id);
        if (cat) {
          if (!sumByCategory[cat.value]) {
            sumByCategory[cat.value] = {
              name: cat.label,
              value: 0,
              color: cat.color,
            };
          }
          sumByCategory[cat.value].value += parseFloat(t.amount.toString());
        }
      });

    const finalData = Object.values(sumByCategory).filter(
      (item) => item.value > 0
    );

    setChartData(
      finalData.length > 0
        ? finalData
        : [{ name: "No Data", value: 1, color: "#cbd5e1" }]
    );
  }, [transactions, categories]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
