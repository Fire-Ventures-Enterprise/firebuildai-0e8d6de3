import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractorAccountSetup } from "@/components/contractors/ContractorAccountSetup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, History, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ContractorSettingsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoadingPayouts(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("contractor_payouts")
        .select(`
          *,
          invoices_enhanced:invoice_id (
            invoice_number,
            customer_name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoadingPayouts(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contractor Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your contractor account and view payment history
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">
            <Settings className="h-4 w-4 mr-2" />
            Account Setup
          </TabsTrigger>
          <TabsTrigger value="payouts">
            <History className="h-4 w-4 mr-2" />
            Payout History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <ContractorAccountSetup />
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                View all payments received through Stripe Connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayouts ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading payouts...
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payouts yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {format(new Date(payout.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {payout.invoices_enhanced?.invoice_number || "N/A"}
                        </TableCell>
                        <TableCell>
                          {payout.invoices_enhanced?.customer_name || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${payout.amount.toFixed(2)} {payout.currency}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payout.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}