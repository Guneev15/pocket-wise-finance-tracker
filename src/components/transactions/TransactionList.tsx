import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowDown, 
  ArrowUp, 
  Coffee, 
  Home, 
  ShoppingCart, 
  Truck, 
  Zap,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock transaction data
const demoTransactions = [
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
  { 
    id: 7, 
    title: "Freelance Payment", 
    amount: 450, 
    date: "2023-04-10", 
    category: "Income",
    icon: ArrowUp,
  },
  { 
    id: 8, 
    title: "Internet Bill", 
    amount: -80, 
    date: "2023-04-12", 
    category: "Utilities",
    icon: Zap,
  },
  { 
    id: 9, 
    title: "Restaurant Dinner", 
    amount: -65.20, 
    date: "2023-04-15", 
    category: "Food",
    icon: Coffee,
  },
  { 
    id: 10, 
    title: "Gas Station", 
    amount: -45, 
    date: "2023-04-18", 
    category: "Transportation",
    icon: Truck,
  },
];

export function TransactionList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Filter transactions based on search term, category, and type
  const filteredTransactions = demoTransactions.filter((transaction) => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || transaction.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesType = 
      typeFilter === "all" || 
      (typeFilter === "income" && transaction.amount > 0) || 
      (typeFilter === "expense" && transaction.amount < 0);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get all unique categories from transactions
  const categories = ["all", ...new Set(demoTransactions.map(t => t.category.toLowerCase()))];

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Transactions</CardTitle>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[200px]"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                          transaction.amount > 0 ? "bg-budget-green-100" : "bg-budget-red-100"
                        )}>
                          <transaction.icon className={cn(
                            "h-4 w-4",
                            transaction.amount > 0 ? "text-budget-green-600" : "text-budget-red-600"
                          )} />
                        </div>
                        {transaction.title}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      transaction.amount > 0 ? "text-budget-green-600" : "text-budget-red-600"
                    )}>
                      {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
