import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authService } from '@/services/auth';

const budgetFormSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  amount: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Budget amount must be a positive number"
  ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  onSuccess: (budget: any) => void;
}

export function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      amount: '',
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Create a new budget object
      const newBudget = {
        id: Date.now().toString(),
        name: data.name,
        amount: parseFloat(data.amount),
        createdAt: new Date().toISOString(),
        userId: currentUser.id
      };

      onSuccess(newBudget);
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Groceries, Rent, Entertainment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input {...field} className="pl-7" placeholder="0.00" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Budget"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
