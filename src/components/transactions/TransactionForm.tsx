import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { transactionService, TransactionResult } from "@/services/transactions";
import { authService } from "@/services/auth";
import { categoryService } from "@/services/categories";

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type",
  }),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  date: z.date({
    required_error: "Please select a date",
  }),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSuccess?: () => Promise<void>;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date(),
      category: "",
      description: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    const user = await authService.getCurrentUser();

    setIsLoading(true);

    try {
      // Ensure all required data is present and valid
      if (!data.category) {
        toast.error("Please select a category");
        setIsLoading(false);
        return;
      }

      // Show loading toast
      const loadingToastId = toast.loading("Adding transaction...");

      const result = await transactionService.addTransaction({
        type: data.type,
        amount: parseFloat(data.amount),
        date: format(data.date, "yyyy-MM-dd"),
        category_id: data.category || "",
        description: data.description || "",
        user_id: user.id,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (result.success) {
        toast.success("Transaction added successfully!");
        form.reset();
        setIsOpen(false);

        // Ensure the onSuccess callback is called to refresh the transaction list

        if (onSuccess) {
          console.log("Calling onSuccess callback");
          setTimeout(async () => {
            await onSuccess();
          }, 100); // Small delay to ensure state updates have processed
        }
      } else {
        toast.error(result.message || "Failed to add transaction");
        console.error("Transaction error:", result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
      console.error("Transaction submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    const user = await authService.getCurrentUser();
    const result = (await categoryService.getCategories(user.id)) as
      | any[]
      | {
          message: string;
        };
    if (Array.isArray(result)) {
      const categories = result?.map((category) => ({
        label: category.name,
        value: category.category_id,
      }));
      setCategoryOptions(categories || []);
    } else {
      toast.error(result.message || "Failed to fetch categories");
      console.error("Category fetch error:", result.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      <Input
                        {...field}
                        className="pl-7"
                        placeholder="0.00"
                        autoComplete="off"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
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
                    <Textarea
                      {...field}
                      placeholder="Add notes about this transaction"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
