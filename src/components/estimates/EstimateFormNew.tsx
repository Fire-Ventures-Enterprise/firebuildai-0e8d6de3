import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DraggableLineItems } from "@/components/forms/DraggableLineItems";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const estimateFormSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  issue_date: z.string(),
  expiration_date: z.string().optional(),
  scope_of_work: z.string().optional(),
  deposit_amount: z.coerce.number().optional(),
  deposit_percentage: z.coerce.number().optional(),
  notes: z.string().optional(),
  terms_conditions: z.string().optional(),
  contract_attached: z.boolean().default(true),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    qty: z.coerce.number().min(1, "Quantity must be at least 1"),
    unit_price: z.coerce.number().min(0, "Rate must be non-negative"),
    tax_rate: z.coerce.number().optional(),
  })).min(1, "At least one line item is required"),
});

type EstimateFormData = z.infer<typeof estimateFormSchema>;

interface EstimateFormNewProps {
  initialData?: any;
  onSubmit: (data: EstimateFormData) => Promise<void>;
  onCancel: () => void;
}

export function EstimateFormNew({ initialData, onSubmit, onCancel }: EstimateFormNewProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EstimateFormData>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || "",
      issue_date: initialData?.issue_date || new Date().toISOString().split('T')[0],
      expiration_date: initialData?.expiration_date || "",
      scope_of_work: initialData?.scope_of_work || "",
      deposit_amount: initialData?.deposit_amount || 0,
      deposit_percentage: initialData?.deposit_percentage || 0,
      notes: initialData?.notes || "",
      terms_conditions: initialData?.terms_conditions || "Payment terms: Net 30 days\nWork is warranted for 1 year from completion",
      contract_attached: initialData?.contract_attached ?? true,
      items: initialData?.items?.map((item: any) => ({
        description: item.description,
        qty: item.quantity || item.qty,
        unit_price: item.rate || item.unit_price,
      })) || [{ description: "", qty: 1, unit_price: 0 }],
    },
  });

  const itemsFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("first_name");

    setCustomers(data || []);
  };

  const handleSubmit = async (data: EstimateFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchItems = form.watch("items");
  const subtotal = watchItems?.reduce((sum, item) => sum + (item.qty * item.unit_price), 0) || 0;
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} 
                        {customer.company_name && ` - ${customer.company_name}`}
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
            name="issue_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiration_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="scope_of_work"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope of Work</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the work to be performed..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Line Items</FormLabel>
          <DraggableLineItems
            form={form}
            fa={itemsFieldArray}
            title="Line Items"
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (13%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms_conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms & Conditions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Terms and conditions..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contract_attached"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Attach Contract</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Include standard construction contract with this estimate
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Estimate" : "Create Estimate"}
          </Button>
        </div>
      </form>
    </Form>
  );
}