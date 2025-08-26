import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  const addStage = () => {
    onChange([...stages, { description: '', percentage: 0, amount: 0 }]);
  };

  const removeStage = (index: number) => {
    onChange(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, field: keyof PaymentStage, value: any) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate amount if percentage is set
    if (field === 'percentage' && paymentMethod === 'percentage') {
      updated[index].amount = totalAmount * (value / 100);
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
          <Button type="button" size="sm" onClick={addStage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Stage
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No payment stages defined. Add stages to structure payment milestones.
          </p>
        ) : (
          <>
            {stages.map((stage, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Stage {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="e.g., Initial deposit, Upon completion"
                      value={stage.description}
                      onChange={(e) => updateStage(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Percentage (%)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      value={stage.percentage}
                      onChange={(e) => updateStage(index, 'percentage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      value={stage.amount?.toFixed(2)}
                      readOnly={paymentMethod === 'percentage'}
                      onChange={(e) => paymentMethod === 'fixed' && updateStage(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label>Milestone</Label>
                    <Input
                      placeholder="e.g., Framing complete"
                      value={stage.milestone}
                      onChange={(e) => updateStage(index, 'milestone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
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
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={stage.due_date}
                          onSelect={(date) => date && updateStage(index, 'due_date', date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Percentage:</span>
                <span className={getTotalPercentage() !== 100 ? 'text-destructive' : ''}>
                  {getTotalPercentage()}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
              {getTotalPercentage() !== 100 && (
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