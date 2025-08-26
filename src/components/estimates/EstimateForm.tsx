import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import PaymentStagesForm from './PaymentStagesForm';

interface EstimateFormProps {
  estimate?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function EstimateForm({ estimate, onSave, onCancel }: EstimateFormProps) {
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [customers, setCustomers] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<any[]>([{ description: '', quantity: 1, rate: 0 }]);
  const [paymentStages, setPaymentStages] = useState<any[]>([]);
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [depositType, setDepositType] = useState<'percentage' | 'fixed'>('percentage');

  useEffect(() => {
    fetchCustomers();
    if (estimate) {
      // Load existing estimate data
      setValue('estimate_number', estimate.estimate_number);
      setValue('customer_id', estimate.customer_id);
      setValue('scope_of_work', estimate.scope_of_work);
      setValue('notes', estimate.notes);
      setValue('terms_conditions', estimate.terms_conditions);
      setValue('tax_rate', estimate.tax_rate || 13);
      setValue('deposit_percentage', estimate.deposit_percentage);
      setValue('deposit_amount', estimate.deposit_amount);
      setLineItems(estimate.items || []);
      setPaymentStages(estimate.payment_stages || []);
      setIssueDate(new Date(estimate.issue_date));
      if (estimate.expiration_date) {
        setExpirationDate(new Date(estimate.expiration_date));
      }
    } else {
      // Generate new estimate number
      generateEstimateNumber();
    }
  }, [estimate]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user?.id)
      .order('company_name', { ascending: true });
    
    if (!error && data) {
      setCustomers(data);
    }
  };

  const generateEstimateNumber = async () => {
    const { count } = await supabase
      .from('estimates')
      .select('*', { count: 'exact' })
      .eq('user_id', user?.id);
    
    const nextNumber = (count || 0) + 1;
    setValue('estimate_number', `EST-${String(nextNumber).padStart(5, '0')}`);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    const taxRate = watch('tax_rate') || 13;
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateDepositAmount = () => {
    const total = calculateTotal();
    if (depositType === 'percentage') {
      const percentage = watch('deposit_percentage') || 0;
      return total * (percentage / 100);
    } else {
      return watch('deposit_amount') || 0;
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const estimateData = {
        ...data,
        user_id: user?.id,
        issue_date: issueDate.toISOString(),
        expiration_date: expirationDate?.toISOString(),
        subtotal: calculateSubtotal(),
        tax_amount: calculateTax(),
        total: calculateTotal(),
        deposit_amount: calculateDepositAmount(),
        status: 'draft'
      };

      if (estimate) {
        // Update existing estimate
        const { error } = await supabase
          .from('estimates')
          .update(estimateData)
          .eq('id', estimate.id);
        
        if (error) throw error;
        
        // Update line items
        await supabase
          .from('estimate_items')
          .delete()
          .eq('estimate_id', estimate.id);
      } else {
        // Create new estimate
        const { data: newEstimate, error } = await supabase
          .from('estimates')
          .insert(estimateData)
          .select()
          .single();
        
        if (error) throw error;
        
        // Add line items
        const items = lineItems.map((item, index) => ({
          estimate_id: newEstimate.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
          sort_order: index
        }));
        
        await supabase.from('estimate_items').insert(items);
        
        // Add payment stages
        if (paymentStages.length > 0) {
          const stages = paymentStages.map((stage, index) => ({
            estimate_id: newEstimate.id,
            stage_number: index + 1,
            description: stage.description,
            percentage: stage.percentage,
            amount: stage.amount,
            milestone: stage.milestone,
            due_date: stage.due_date
          }));
          
          await supabase.from('payment_stages').insert(stages);
        }
      }
      
      onSave(estimateData);
    } catch (error) {
      console.error('Error saving estimate:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimate_number">Estimate Number</Label>
              <Input 
                id="estimate_number" 
                {...register('estimate_number', { required: true })}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="customer_id">Customer</Label>
              <Select onValueChange={(value) => setValue('customer_id', value)} defaultValue={estimate?.customer_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company_name || `${customer.first_name} ${customer.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={(date) => date && setIssueDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="scope_of_work">Scope of Work</Label>
            <Textarea 
              id="scope_of_work"
              {...register('scope_of_work')}
              rows={4}
              placeholder="Describe the work to be performed..."
            />
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Line Items</span>
                <Button type="button" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lineItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-right">
                <div>Subtotal: ${calculateSubtotal().toFixed(2)}</div>
                <div className="flex items-center justify-end gap-2">
                  <Label htmlFor="tax_rate">Tax Rate (%):</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    className="w-20"
                    {...register('tax_rate')}
                    defaultValue={13}
                  />
                </div>
                <div>Tax: ${calculateTax().toFixed(2)}</div>
                <div className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Deposit Type</Label>
                <Select value={depositType} onValueChange={(value: 'percentage' | 'fixed') => setDepositType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {depositType === 'percentage' ? (
                <div>
                  <Label htmlFor="deposit_percentage">Deposit Percentage (%)</Label>
                  <Input
                    id="deposit_percentage"
                    type="number"
                    {...register('deposit_percentage')}
                    placeholder="e.g., 30"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="deposit_amount">Deposit Amount ($)</Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    {...register('deposit_amount')}
                    placeholder="e.g., 500"
                  />
                </div>
              )}
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">Deposit Amount: <strong>${calculateDepositAmount().toFixed(2)}</strong></p>
              </div>
            </CardContent>
          </Card>
          
          <PaymentStagesForm
            stages={paymentStages}
            onChange={setPaymentStages}
            totalAmount={calculateTotal()}
          />
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Additional notes for the customer..."
            />
          </div>
          
          <div>
            <Label htmlFor="terms_conditions">Terms & Conditions</Label>
            <Textarea
              id="terms_conditions"
              {...register('terms_conditions')}
              rows={6}
              defaultValue="1. Payment terms: Net 30 days
2. All work is subject to Ontario Construction Laws
3. Changes to scope require written approval
4. Warranty: 2 years on workmanship
5. Client must provide site access as scheduled"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {estimate ? 'Update Estimate' : 'Create Estimate'}
        </Button>
      </div>
    </form>
  );
}