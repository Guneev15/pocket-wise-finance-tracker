
import { MonthlySpendingChart } from "@/components/reports/MonthlySpendingChart";
import { CategoryComparisonChart } from "@/components/reports/CategoryComparisonChart";
import { SavingsChart } from "@/components/reports/SavingsChart";
import { IncomeTrendsChart } from "@/components/reports/IncomeTrendsChart";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
          <div className="w-full sm:w-[180px]">
            <Label htmlFor="time-period" className="mb-1 block">Time Period</Label>
            <Select defaultValue="month">
              <SelectTrigger id="time-period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <IncomeTrendsChart />
        <CategoryComparisonChart />
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <MonthlySpendingChart />
        <SavingsChart />
      </div>
    </div>
  );
}
