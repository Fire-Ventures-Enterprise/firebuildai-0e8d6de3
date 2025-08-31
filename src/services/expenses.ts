import { supabase } from "@/integrations/supabase/client";
import type { ExpenseInput, Expense, ExpenseCategory, ExpenseReceipt, MileageLog } from "@/domain/expenses";

// Initialize expense categories for new users
export async function initializeExpenseCategories() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");
  
  const { error } = await supabase.rpc('seed_expense_categories_for_user', {
    p_user_id: user.id
  });
  
  if (error) {
    console.error("Error seeding expense categories:", error);
  }
}

// Get all expense categories for the current user
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");
  
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");
  
  if (error) throw error;
  return data || [];
}

// Create a new expense with allocations
export async function createExpense(input: ExpenseInput): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");
  
  const { allocations, ...expenseData } = input;
  
  // Create the expense
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      ...expenseData,
      user_id: user.id,
      created_by: user.id
    } as any)
    .select("id")
    .single();
  
  if (error) throw error;
  const expense_id = data.id;

  // Create allocations if provided
  if (allocations && allocations.length > 0) {
    const allocationRows = allocations.map(a => ({ 
      expense_id, 
      ...a 
    }));
    
    const { error: allocError } = await supabase
      .from("expense_job_allocations")
      .insert(allocationRows);
    
    if (allocError) throw allocError;
  }
  
  return expense_id;
}

// Update an existing expense
export async function updateExpense(id: string, input: Partial<ExpenseInput>): Promise<void> {
  const { allocations, ...expenseData } = input;
  
  // Update expense
  const { error } = await supabase
    .from("expenses")
    .update(expenseData)
    .eq("id", id);
  
  if (error) throw error;
  
  // Update allocations if provided
  if (allocations) {
    // Delete existing allocations
    await supabase
      .from("expense_job_allocations")
      .delete()
      .eq("expense_id", id);
    
    // Insert new allocations
    if (allocations.length > 0) {
      const allocationRows = allocations.map(a => ({ 
        expense_id: id, 
        ...a 
      }));
      
      const { error: allocError } = await supabase
        .from("expense_job_allocations")
        .insert(allocationRows);
      
      if (allocError) throw allocError;
    }
  }
}

// Upload a receipt and trigger OCR
export async function uploadReceipt(expenseId: string, file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");
  
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${expenseId}/${crypto.randomUUID()}.${ext}`;
  
  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
  
  if (uploadError) throw uploadError;
  
  // Create receipt record
  const { error: insertError } = await supabase
    .from("expense_receipts")
    .insert({ 
      expense_id: expenseId, 
      storage_path: path, 
      mime: file.type 
    });
  
  if (insertError) throw insertError;
  
  // Trigger OCR (fire and forget)
  supabase.functions.invoke("ocr-receipt", {
    body: { 
      storagePath: path, 
      expenseId, 
      userId: user.id 
    }
  }).catch(err => console.error("OCR trigger failed:", err));
  
  return path;
}

// Get receipts for an expense
export async function getExpenseReceipts(expenseId: string): Promise<ExpenseReceipt[]> {
  const { data, error } = await supabase
    .from("expense_receipts")
    .select("*")
    .eq("expense_id", expenseId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data || []) as ExpenseReceipt[];
}

// Get signed URLs for receipts
export async function getReceiptUrls(receipts: ExpenseReceipt[]): Promise<Record<string, string>> {
  const urls: Record<string, string> = {};
  
  for (const receipt of receipts) {
    const { data } = await supabase.storage
      .from("receipts")
      .createSignedUrl(receipt.storage_path, 3600);
    
    if (data) {
      urls[receipt.id] = data.signedUrl;
    }
  }
  
  return urls;
}

// List expenses with filters
export async function listExpenses(filters: {
  jobId?: string;
  categoryId?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Expense[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");
  
  let query = supabase
    .from("expenses")
    .select(`
      *,
      category:expense_categories(*),
      receipts:expense_receipts(*),
      allocations:expense_job_allocations(*),
      mileage_log:mileage_logs(*)
    `)
    .eq("user_id", user.id);
  
  // Apply filters
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  
  if (filters.startDate) {
    query = query.gte("txn_date", filters.startDate);
  }
  
  if (filters.endDate) {
    query = query.lte("txn_date", filters.endDate);
  }
  
  if (filters.jobId) {
    // Get expenses allocated to this job
    const { data: allocations } = await supabase
      .from("expense_job_allocations")
      .select("expense_id")
      .eq("job_id", filters.jobId);
    
    if (allocations) {
      const expenseIds = allocations.map(a => a.expense_id);
      query = query.in("id", expenseIds);
    }
  }
  
  if (filters.search) {
    query = query.or(`notes.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order("txn_date", { ascending: false });
  
  if (error) throw error;
  return (data || []) as Expense[];
}

// Get a single expense with all details
export async function getExpense(id: string): Promise<Expense | null> {
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      *,
      category:expense_categories(*),
      receipts:expense_receipts(*),
      allocations:expense_job_allocations(*),
      mileage_log:mileage_logs(*)
    `)
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data as Expense;
}

// Delete an expense
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// Create or update mileage log for an expense
export async function saveMileageLog(expenseId: string, log: Partial<MileageLog>): Promise<void> {
  const { data: existing } = await supabase
    .from("mileage_logs")
    .select("id")
    .eq("expense_id", expenseId)
    .single();
  
  if (existing) {
    // Update existing log
    const { error } = await supabase
      .from("mileage_logs")
      .update(log)
      .eq("expense_id", expenseId);
    
    if (error) throw error;
  } else {
    // Create new log
    const { error } = await supabase
      .from("mileage_logs")
      .insert({
        expense_id: expenseId,
        ...log
      });
    
    if (error) throw error;
  }
}

// Get expense summary statistics
export async function getExpenseSummary(filters?: {
  startDate?: string;
  endDate?: string;
  jobId?: string;
}): Promise<{
  total: number;
  approved: number;
  pending: number;
  byCategory: Record<string, number>;
}> {
  const expenses = await listExpenses(filters || {});
  
  const summary = {
    total: 0,
    approved: 0,
    pending: 0,
    byCategory: {} as Record<string, number>,
  };
  
  for (const expense of expenses) {
    summary.total += expense.total;
    
    if (expense.status === 'approved') {
      summary.approved += expense.total;
    } else if (expense.status === 'submitted') {
      summary.pending += expense.total;
    }
    
    const categoryName = expense.category?.name || 'Other';
    summary.byCategory[categoryName] = (summary.byCategory[categoryName] || 0) + expense.total;
  }
  
  return summary;
}