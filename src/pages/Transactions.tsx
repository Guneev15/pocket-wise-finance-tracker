
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="mt-4 sm:mt-0">
          <TransactionForm />
        </div>
      </div>
      
      <TransactionList />
    </div>
  );
}
