import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Receipt, Calculator, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface InvoiceFinancial {
  id: string;
  invoice_number: string;
  customer_name?: string;
  total: number;
  total_expenses: number;
  gross_profit: number;
  profit_margin: number;
  overhead_percentage: number;
  net_profit: number;
  status: string;
  created_at: string;
}

interface Expense {
  id: string;
  invoice_id?: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  date: string;
}

export default function FinancialAnalyticsPage() {
  const [invoices, setInvoices] = useState<InvoiceFinancial[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Fetch invoices with financial data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices_enhanced')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (invoiceError) throw invoiceError;
      setInvoices(invoiceData || []);

      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.user.id)
        .order('date', { ascending: false });

      if (expenseError) throw expenseError;
      setExpenses(expenseData || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalGrossProfit = invoices.reduce((sum, inv) => sum + Number(inv.gross_profit || 0), 0);
  const totalNetProfit = invoices.reduce((sum, inv) => sum + Number(inv.net_profit || 0), 0);
  const averageMargin = invoices.length > 0 
    ? invoices.reduce((sum, inv) => sum + Number(inv.profit_margin || 0), 0) / invoices.length 
    : 0;

  // Get expense breakdown by category
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  // Filter invoices by profit margin
  const lowMarginInvoices = invoices.filter(inv => Number(inv.profit_margin) < 20);
  const highMarginInvoices = invoices.filter(inv => Number(inv.profit_margin) >= 40);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading financial analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Analytics</h1>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {invoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} expenses recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGrossProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Before overhead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Calculator className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNetProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After overhead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            {averageMargin >= 30 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profitability" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="alerts">Profit Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{invoice.invoice_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.customer_name || 'No customer'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="font-medium">${Number(invoice.total).toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Expenses</div>
                        <div className="font-medium">${Number(invoice.total_expenses || 0).toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Net Profit</div>
                        <div className="font-medium text-green-600">
                          ${Number(invoice.net_profit || 0).toFixed(2)}
                        </div>
                      </div>
                      <Badge
                        variant={Number(invoice.profit_margin) >= 30 ? "default" : "destructive"}
                      >
                        {Number(invoice.profit_margin || 0).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expenseByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {expenses.filter(e => e.category === category).length} expenses
                      </span>
                    </div>
                    <div className="font-medium">${amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-muted-foreground">
                        {expense.vendor || 'No vendor'} • {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">${Number(expense.amount).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {lowMarginInvoices.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Low Margin Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowMarginInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{invoice.invoice_number}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {invoice.customer_name}
                        </span>
                      </div>
                      <Badge variant="destructive">
                        {Number(invoice.profit_margin).toFixed(1)}% margin
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {highMarginInvoices.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  High Performing Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {highMarginInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{invoice.invoice_number}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {invoice.customer_name}
                        </span>
                      </div>
                      <Badge className="bg-green-600">
                        {Number(invoice.profit_margin).toFixed(1)}% margin
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}