import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractorAccountSetup } from "@/components/contractors/ContractorAccountSetup";
import { ContractorBusinessInfo } from "@/components/contractors/ContractorBusinessInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, History, Settings, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ContractorSettingsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState("payment");

  useEffect(() => {
    checkExistingAccount();
  }, []);

  useEffect(() => {
    if (activeTab === "payouts") {
      fetchPayouts();
    }
  }, [activeTab]);

  const checkExistingAccount = async () => {
    setChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("contractor_accounts")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setAccount(data);
        // If account exists, default to business tab
        setActiveTab("business");
      }
    } catch (error) {
      console.error("Error checking account:", error);
    } finally {
      setChecking(false);
    }
  };

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
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAccountUpdate = () => {
    checkExistingAccount();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg bg-card/50 border">
          <TabsTrigger value="business" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Payment Setup
          </TabsTrigger>
          <TabsTrigger value="payouts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-4 w-4 mr-2" />
            Payout History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-6">
          {checking ? (
            <Card className="bg-card/50 border-muted">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : account ? (
            <ContractorBusinessInfo account={account} onUpdate={handleAccountUpdate} />
          ) : (
            <Card className="bg-card/50 border-muted">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Please create a contractor account first in the Payment Setup tab.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <ContractorAccountSetup onAccountCreated={handleAccountUpdate} />
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card className="bg-card/50 border-muted">
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
                  No payouts yet. Complete your account setup to start receiving payments.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {format(new Date(payout.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="font-mono">
                            {payout.invoices_enhanced?.invoice_number || "—"}
                          </TableCell>
                          <TableCell>
                            {payout.invoices_enhanced?.customer_name || "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${payout.amount.toFixed(2)} {payout.currency}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payout.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}