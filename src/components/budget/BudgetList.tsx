import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BudgetEmptyState } from './BudgetEmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BudgetForm } from './BudgetForm';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Budget {
  id: string;
  name: string;
  amount: number;
}

export function BudgetList() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudgetId, setNewBudgetId] = useState<string | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        toast.error('Please log in to view budgets');
        navigate('/login');
        return;
      }

      const localUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (localUser && Array.isArray(localUser.budgets)) {
        setBudgets(localUser.budgets);
      } else {
        setBudgets([]);
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBudget = (newBudget: Budget) => {
    console.log('Adding new budget:', newBudget);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (currentUser) {
        const existingBudgets = Array.isArray(currentUser.budgets) ? currentUser.budgets : [];
        const updatedBudgets = [...existingBudgets, newBudget];

        currentUser.budgets = updatedBudgets;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        setBudgets(updatedBudgets);
        setNewBudgetId(newBudget.id);
        setTimeout(() => setNewBudgetId(null), 3000);
        toast.success('Budget added successfully!');
      } else {
        console.error('No user found in localStorage');
        toast.error('Failed to update budgets: no user found.');
      }
    } catch (error) {
      console.error('Error updating budgets in localStorage:', error);
      toast.error('Error saving budget');
    }

    setIsDialogOpen(false);
  };

  const debugLocalStorage = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      console.log('DEBUG - Current user in localStorage:', currentUser);
      if (currentUser?.budgets) {
        console.log('DEBUG - Budgets in localStorage:', currentUser.budgets);
      } else {
        console.log('DEBUG - No budgets found in localStorage');
      }
    } catch (error) {
      console.error('DEBUG - Error reading localStorage:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      debugLocalStorage();
    }
  }, [isLoading]);

  const openBudgetDialog = () => {
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budgets</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={debugLocalStorage}>
            Debug Storage
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
              </DialogHeader>
              <BudgetForm onSuccess={handleAddBudget} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <BudgetEmptyState onAddBudget={openBudgetDialog} />
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className={`p-4 border rounded-md transition-all ${
                  newBudgetId === budget.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{budget.name}</h3>
                  {newBudgetId === budget.id && (
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Budget Amount:</p>
                  <p className="font-semibold">${budget.amount.toFixed(2)}</p>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Budget Progress:</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full h-2 bg-muted mt-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
