
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Coffee, Home, ShoppingCart, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const transactionData = [
  { 
    id: 1, 
    title: "Rent Payment", 
    amount: -1200, 
    date: "2023-04-01", 
    category: "Housing",
    icon: Home,
  },
  { 
    id: 2, 
    title: "Salary", 
    amount: 3500, 
    date: "2023-04-01", 
    category: "Income",
    icon: ArrowUp,
  },
  { 
    id: 3, 
    title: "Grocery Shopping", 
    amount: -85.75, 
    date: "2023-04-03", 
    category: "Food",
    icon: ShoppingCart,
  },
  { 
    id: 4, 
    title: "Electricity Bill", 
    amount: -125.30, 
    date: "2023-04-05", 
    category: "Utilities",
    icon: Zap,
  },
  { 
    id: 5, 
    title: "Coffee Shop", 
    amount: -4.50, 
    date: "2023-04-06", 
    category: "Food",
    icon: Coffee,
  },
  { 
    id: 6, 
    title: "Uber", 
    amount: -12.50, 
    date: "2023-04-07", 
    category: "Transportation",
    icon: Truck,
  },
];

export function RecentTransactions() {
  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactionData.map((transaction) => (
            <div key={transaction.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                transaction.amount > 0 ? "bg-budget-green-100" : "bg-budget-red-100"
              )}>
                <transaction.icon className={cn(
                  "h-5 w-5",
                  transaction.amount > 0 ? "text-budget-green-600" : "text-budget-red-600"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
              </div>
              <div className={cn(
                "font-semibold text-right",
                transaction.amount > 0 ? "text-budget-green-600" : "text-budget-red-600"
              )}>
                {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
