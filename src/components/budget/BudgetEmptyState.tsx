import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BudgetEmptyStateProps {
  onAddBudget: () => void;
}

export function BudgetEmptyState({ onAddBudget }: BudgetEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-8 text-center border rounded-lg bg-muted/10">
      <div className="mb-4 p-3 rounded-full bg-muted">
        <PlusCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No budgets yet</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        Create your first budget to track your expenses and stay on top of your financial goals.
      </p>
      <Button onClick={onAddBudget}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Budget
      </Button>
    </div>
  );
}
