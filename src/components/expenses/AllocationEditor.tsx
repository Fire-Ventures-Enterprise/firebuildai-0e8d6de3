import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { ExpenseAllocation } from "@/domain/expenses";
import { supabase } from "@/integrations/supabase/client";

interface AllocationEditorProps {
  allocations: ExpenseAllocation[];
  onChange: (allocations: ExpenseAllocation[]) => void;
  totalAmount: number;
  disabled?: boolean;
}

interface Job {
  id: string;
  title: string;
  status: string;
}

export function AllocationEditor({ 
  allocations, 
  onChange, 
  totalAmount,
  disabled = false 
}: AllocationEditorProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [usePercentage, setUsePercentage] = useState(true);
  const [isGeneralExpense, setIsGeneralExpense] = useState(allocations.length === 0);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("id, title, status")
      .in("status", ["active", "planning", "in_progress"])
      .order("title");
    
    if (data) {
      setJobs(data);
    }
  };

  const addAllocation = () => {
    const newAllocation: ExpenseAllocation = {
      job_id: undefined,
      percent: usePercentage ? 0 : null,
      amount: usePercentage ? null : 0,
      cost_code: null,
    };
    onChange([...allocations, newAllocation]);
  };

  const updateAllocation = (index: number, updates: Partial<ExpenseAllocation>) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], ...updates };
    
    // Auto-balance percentages if using percentage mode
    if (usePercentage && updates.percent !== undefined) {
      const totalPercent = updated.reduce((sum, a) => sum + (a.percent || 0), 0);
      
      if (totalPercent > 100) {
        // Scale down other allocations proportionally
        const excess = totalPercent - 100;
        const otherIndices = updated.map((_, i) => i).filter(i => i !== index);
        const otherTotal = otherIndices.reduce((sum, i) => sum + (updated[i].percent || 0), 0);
        
        if (otherTotal > 0) {
          otherIndices.forEach(i => {
            const ratio = (updated[i].percent || 0) / otherTotal;
            updated[i].percent = Math.max(0, (updated[i].percent || 0) - excess * ratio);
          });
        }
      }
    }
    
    onChange(updated);
  };

  const removeAllocation = (index: number) => {
    onChange(allocations.filter((_, i) => i !== index));
  };

  const toggleGeneralExpense = (general: boolean) => {
    setIsGeneralExpense(general);
    if (general) {
      onChange([]);
    } else if (allocations.length === 0) {
      addAllocation();
    }
  };

  const totalAllocated = usePercentage
    ? allocations.reduce((sum, a) => sum + (a.percent || 0), 0)
    : allocations.reduce((sum, a) => sum + (a.amount || 0), 0);

  const remaining = usePercentage
    ? 100 - totalAllocated
    : totalAmount - totalAllocated;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label>Expense Allocation</Label>
        <div className="flex items-center gap-2">
          <Switch
            checked={!isGeneralExpense}
            onCheckedChange={(checked) => toggleGeneralExpense(!checked)}
            disabled={disabled}
          />
          <span className="text-sm text-muted-foreground">
            {isGeneralExpense ? 'General Expense' : 'Allocate to Jobs'}
          </span>
        </div>
      </div>

      {!isGeneralExpense && (
        <>
          <div className="flex items-center gap-2">
            <Switch
              checked={usePercentage}
              onCheckedChange={setUsePercentage}
              disabled={disabled}
            />
            <span className="text-sm text-muted-foreground">
              Use {usePercentage ? 'Percentage' : 'Fixed Amount'}
            </span>
          </div>

          <div className="space-y-3">
            {allocations.map((allocation, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Job</Label>
                  <Select
                    value={allocation.job_id || ""}
                    onValueChange={(value) => updateAllocation(index, { job_id: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <Label className="text-xs">
                    {usePercentage ? 'Percent' : 'Amount'}
                  </Label>
                  <Input
                    type="number"
                    value={usePercentage ? (allocation.percent || '') : (allocation.amount || '')}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (usePercentage) {
                        updateAllocation(index, { percent: value, amount: null });
                      } else {
                        updateAllocation(index, { amount: value, percent: null });
                      }
                    }}
                    placeholder={usePercentage ? "0%" : "$0"}
                    disabled={disabled}
                  />
                </div>

                <div className="w-24">
                  <Label className="text-xs">Cost Code</Label>
                  <Input
                    value={allocation.cost_code || ''}
                    onChange={(e) => updateAllocation(index, { cost_code: e.target.value || null })}
                    placeholder="Optional"
                    disabled={disabled}
                  />
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeAllocation(index)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={addAllocation}
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Allocation
            </Button>

            <div className="text-sm">
              <span className="text-muted-foreground">
                {usePercentage ? 'Total:' : 'Allocated:'}
              </span>
              <span className={`ml-2 font-medium ${Math.abs(remaining) > 0.01 ? 'text-destructive' : 'text-green-600'}`}>
                {usePercentage 
                  ? `${totalAllocated.toFixed(1)}%` 
                  : `$${totalAllocated.toFixed(2)}`
                }
              </span>
              {Math.abs(remaining) > 0.01 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({usePercentage 
                    ? `${remaining.toFixed(1)}% remaining` 
                    : `$${remaining.toFixed(2)} remaining`
                  })
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}