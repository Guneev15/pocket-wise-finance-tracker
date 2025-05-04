import { TransactionList } from "@/components/transactions/TransactionList";

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <TransactionList />
    </div>
  );
}
