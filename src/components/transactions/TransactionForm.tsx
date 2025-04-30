<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
<<<<<<< HEAD
import { Textarea } from "@/components/ui/textarea";
import { transactionService } from "@/services/transactions";
import { auth } from "@/services/auth";
=======
import { transactionService } from "@/services/transactions";
import { authService } from "@/services/auth";
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a

const categoryOptions = [
  { value: "income", label: "Income" },
  { value: "housing", label: "Housing" },
  { value: "food", label: "Food" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "healthcare", label: "Healthcare" },
  { value: "shopping", label: "Shopping" },
  { value: "personal", label: "Personal" },
  { value: "education", label: "Education" },
  { value: "savings", label: "Savings" },
  { value: "debt", label: "Debt" },
  { value: "other", label: "Other" },
];

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type",
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  description: z.string().optional(),
});

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
=======
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date(),
      category: "",
      description: "",
    },
  });

<<<<<<< HEAD
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      const user = await auth.getCurrentUser();
      if (!user) {
        toast.error('Please log in to add transactions');
        return;
      }

      await transactionService.addTransaction(user.id, {
        amount: parseFloat(values.amount),
        categoryId: values.category,
        description: values.description || '',
        date: values.date.toISOString(),
        type: values.type
      });

      form.reset();
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  }
=======
  useEffect(() => {
    // Check if user is authenticated when dialog opens
    if (isOpen && !authService.isAuthenticated()) {
      toast.error("Please log in to add transactions");
      setIsOpen(false);
      navigate("/login");
    }
  }, [isOpen, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = authService.getCurrentUser();
    if (!user) {
      toast.error("You must be logged in to add transactions");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await transactionService.addTransaction({
        type: form.getValues("type"),
        amount: parseFloat(form.getValues("amount")),
        date: format(form.getValues("date"), "yyyy-MM-dd"),
        category: form.getValues("category"),
        description: form.getValues("description"),
        userId: user.id
      });
      
      if (result.success) {
        toast.success("Transaction added successfully!");
        form.reset();
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message || "Failed to add transaction");
      }
    } catch (error) {
      toast.error("An error occurred while adding the transaction");
    } finally {
      setIsLoading(false);
    }
  };
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">₹</span>
                      <Input {...field} className="pl-7" placeholder="0.00" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add notes about this transaction" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
<<<<<<< HEAD
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Transaction"}
=======
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Transaction"}
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
