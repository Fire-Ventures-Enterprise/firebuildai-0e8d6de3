import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { R } from '@/routes/routeMap';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CameraCapture } from "@/components/expenses/CameraCapture";
import { AllocationEditor } from "@/components/expenses/AllocationEditor";
import { MileageForm } from "@/components/expenses/MileageForm";
import { 
  createExpense, 
  uploadReceipt, 
  getExpenseCategories,
  initializeExpenseCategories,
  saveMileageLog
} from "@/services/expenses";
import type { ExpenseInput, ExpenseCategory, MileageLog } from "@/domain/expenses";
import { supabase } from "@/integrations/supabase/client";

export default function ExpensesNewPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const [expense, setExpense] = useState<Partial<ExpenseInput>>({
    txn_date: new Date().toISOString().split('T')[0],
    currency: 'CAD',
    subtotal: 0,
    tax: 0,
    allocations: [],
    status: 'draft',
  });
  
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [mileageLog, setMileageLog] = useState<Partial<MileageLog>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Initialize categories if needed
      await initializeExpenseCategories();
      
      // Load categories
      const cats = await getExpenseCategories();
      setCategories(cats);
      
      // Load vendors
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id, name")
        .order("name");
      
      if (vendorData) {
        setVendors(vendorData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setExpense(prev => ({ ...prev, category_id: categoryId }));
    
    // If mileage category, calculate subtotal from mileage log
    if (category?.is_mileage && mileageLog.distance_km) {
      const amount = (mileageLog.distance_km || 0) * (mileageLog.rate_per_km || 0.68);
      setExpense(prev => ({ ...prev, subtotal: amount, tax: 0 }));
    }
  };

  const handleReceiptCapture = async (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Receipts ready",
      description: `${files.length} receipt(s) will be uploaded when you save`,
    });
  };

  const handleSubmit = async (status: 'draft' | 'submitted' = 'submitted') => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      // Create expense
      const expenseId = await createExpense({
        ...expense as ExpenseInput,
        user_id: user.id,
        status,
      });
      
      // Upload receipts
      for (const file of uploadedFiles) {
        await uploadReceipt(expenseId, file);
      }
      
      // Save mileage log if applicable
      if (selectedCategory?.is_mileage && mileageLog.distance_km) {
        await saveMileageLog(expenseId, mileageLog);
      }
      
      toast({
        title: "Success",
        description: `Expense ${status === 'draft' ? 'saved as draft' : 'submitted'}`,
      });
      
      navigate(R.expensesLegacy);
    } catch (error) {
      console.error("Error creating expense:", error);
      toast({
        title: "Error",
        description: "Failed to create expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = (expense.subtotal || 0) + (expense.tax || 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(R.expensesLegacy)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">New Expense</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Receipt Capture */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Receipt Capture</h2>
          <CameraCapture 
            onCapture={handleReceiptCapture}
            isProcessing={loading}
          />
        </Card>

        {/* Basic Details */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-medium">Expense Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={expense.txn_date}
                onChange={(e) => setExpense(prev => ({ ...prev, txn_date: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Category</Label>
              <Select
                value={expense.category_id}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Vendor</Label>
              <Select
                value={expense.vendor_id || ''}
                onValueChange={(value) => setExpense(prev => ({ ...prev, vendor_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Payment Method</Label>
              <Select
                value={expense.payment_method || ''}
                onValueChange={(value: any) => setExpense(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="etransfer">E-Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="ach">ACH/Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Mileage Form (if applicable) */}
        {selectedCategory?.is_mileage && (
          <MileageForm
            mileageLog={mileageLog}
            onChange={setMileageLog}
            disabled={loading}
          />
        )}

        {/* Amount Details */}
        {!selectedCategory?.is_mileage && (
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-medium">Amount</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Subtotal</Label>
                <Input
                  type="number"
                  value={expense.subtotal || ''}
                  onChange={(e) => setExpense(prev => ({ 
                    ...prev, 
                    subtotal: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label>Tax</Label>
                <Input
                  type="number"
                  value={expense.tax || ''}
                  onChange={(e) => setExpense(prev => ({ 
                    ...prev, 
                    tax: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label>Total</Label>
                <div className="text-2xl font-bold text-primary mt-2">
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Job Allocation */}
        <AllocationEditor
          allocations={expense.allocations || []}
          onChange={(allocations) => setExpense(prev => ({ ...prev, allocations }))}
          totalAmount={total}
          disabled={loading}
        />

        {/* Notes */}
        <Card className="p-6 space-y-4">
          <Label>Notes</Label>
          <Textarea
            value={expense.notes || ''}
            onChange={(e) => setExpense(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add any additional notes..."
            rows={3}
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('submitted')}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Submit Expense
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}