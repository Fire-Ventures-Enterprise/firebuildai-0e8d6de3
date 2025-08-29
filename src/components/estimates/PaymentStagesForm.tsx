import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Percent, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PaymentStage {
  description: string;
  percentage?: number;
  amount?: number;
  milestone?: string;
  due_date?: Date;
}

interface PaymentStagesFormProps {
  stages: PaymentStage[];
  onChange: (stages: PaymentStage[]) => void;
  totalAmount: number;
}

export default function PaymentStagesForm({ stages, onChange, totalAmount }: PaymentStagesFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'percentage' | 'fixed'>('percentage');

  // Initialize payment method based on existing stages
  useEffect(() => {
    if (stages.length > 0) {
      // Check if stages have percentages defined
      const hasPercentages = stages.some(s => s.percentage && s.percentage > 0);
      const hasAmounts = stages.some(s => s.amount && s.amount > 0);
      
      if (hasPercentages) {
        setPaymentMethod('percentage');
      } else if (hasAmounts) {
        setPaymentMethod('fixed');
      }
    }
  }, []);

  const addStage = () => {
    const newStage: PaymentStage = {
      description: '',
      percentage: paymentMethod === 'percentage' ? 0 : undefined,
      amount: paymentMethod === 'fixed' ? 0 : undefined,
      milestone: '',
      due_date: undefined
    };
    onChange([...stages, newStage]);
  };

  const removeStage = (index: number) => {
    onChange(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, field: keyof PaymentStage, value: any) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate amount if percentage is set
    if (field === 'percentage' && paymentMethod === 'percentage') {
      const percentage = parseFloat(value) || 0;
      updated[index].percentage = percentage;
      updated[index].amount = totalAmount * (percentage / 100);
    }
    
    // Calculate percentage if amount is set
    if (field === 'amount' && paymentMethod === 'fixed') {
      const amount = parseFloat(value) || 0;
      updated[index].amount = amount;
      updated[index].percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    }
    
    onChange(updated);
  };

  const getTotalPercentage = () => {
    return stages.reduce((sum, stage) => sum + (stage.percentage || 0), 0);
  };

  const getTotalAmount = () => {
    return stages.reduce((sum, stage) => sum + (stage.amount || 0), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment Stages</span>
          <Button type="button" size="sm" onClick={addStage} variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Stage
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Method Toggle */}
        {stages.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Label>Payment Method:</Label>
            <ToggleGroup 
              type="single" 
              value={paymentMethod} 
              onValueChange={(value) => {
                if (value) {
                  setPaymentMethod(value as 'percentage' | 'fixed');
                  // Update all stages when switching methods
                  const updated = stages.map(stage => {
                    if (value === 'percentage') {
                      const percentage = stage.percentage || (totalAmount > 0 ? (stage.amount || 0) / totalAmount * 100 : 0);
                      return { ...stage, percentage, amount: totalAmount * (percentage / 100) };
                    } else {
                      const amount = stage.amount || (totalAmount * (stage.percentage || 0) / 100);
                      return { ...stage, amount, percentage: totalAmount > 0 ? amount / totalAmount * 100 : 0 };
                    }
                  });
                  onChange(updated);
                }
              }}
              className="bg-background"
            >
              <ToggleGroupItem value="percentage" aria-label="Percentage">
                <Percent className="h-4 w-4 mr-1" />
                Percentage
              </ToggleGroupItem>
              <ToggleGroupItem value="fixed" aria-label="Fixed Amount">
                <DollarSign className="h-4 w-4 mr-1" />
                Fixed Amount
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        
        {stages.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No payment stages defined. Click "Add Stage" to structure payment milestones.
          </p>
        ) : (
          <>
            {stages.map((stage, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-background">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">Stage {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStage(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Input
                      id={`description-${index}`}
                      placeholder="e.g., Initial deposit, Upon completion"
                      value={stage.description || ''}
                      onChange={(e) => updateStage(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethod === 'percentage' ? (
                      <div>
                        <Label htmlFor={`percentage-${index}`}>Percentage (%)</Label>
                        <Input
                          id={`percentage-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0"
                          value={stage.percentage || ''}
                          onChange={(e) => updateStage(index, 'percentage', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor={`amount-${index}`}>Amount ($)</Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={stage.amount || ''}
                          onChange={(e) => updateStage(index, 'amount', e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor={`milestone-${index}`}>Milestone</Label>
                      <Input
                        id={`milestone-${index}`}
                        placeholder="e.g., Framing complete"
                        value={stage.milestone || ''}
                        onChange={(e) => updateStage(index, 'milestone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !stage.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {stage.due_date ? format(stage.due_date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={stage.due_date}
                          onSelect={(date) => date && updateStage(index, 'due_date', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Percentage:</span>
                <span className={cn(
                  "font-medium",
                  getTotalPercentage() > 100 ? 'text-destructive' : 
                  getTotalPercentage() === 100 ? 'text-green-600' : ''
                )}>
                  {getTotalPercentage().toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">${getTotalAmount().toFixed(2)}</span>
              </div>
              {getTotalPercentage() !== 100 && getTotalPercentage() > 0 && (
                <p className="text-xs text-destructive mt-2">
                  Warning: Total percentage should equal 100%
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}