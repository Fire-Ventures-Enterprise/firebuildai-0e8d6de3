import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2, CheckCircle, AlertCircle, Building2 } from "lucide-react";

export function ContractorAccountSetup() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("CA");

  // Check for existing account on mount
  useEffect(() => {
    checkExistingAccount();
  }, []);

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
        setEmail(data.email);
        setBusinessName(data.business_name || "");
      }
    } catch (error) {
      console.error("Error checking account:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account", {
        body: { email, businessName, country }
      });

      if (error) throw error;

      if (data?.onboardingUrl) {
        toast.success("Account created! Redirecting to Stripe...");
        window.open(data.onboardingUrl, '_blank');
        
        // Refresh account status after a delay
        setTimeout(() => {
          checkExistingAccount();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error(error.message || "Failed to create contractor account");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOnboarding = async () => {
    if (!account?.stripe_account_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account", {
        body: { 
          email: account.email, 
          businessName: account.business_name,
          country: account.country 
        }
      });

      if (error) throw error;

      if (data?.onboardingUrl) {
        window.open(data.onboardingUrl, '_blank');
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to continue onboarding");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!account) return null;

    if (account.payouts_enabled && account.charges_enabled) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (account.status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Incomplete</Badge>;
    }
  };

  if (checking) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Contractor Payment Account</CardTitle>
                <CardDescription>
                  Connect your Stripe account to receive payments directly
                </CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="space-y-4">
              {account.payouts_enabled && account.charges_enabled ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Account Active</AlertTitle>
                  <AlertDescription>
                    Your contractor account is set up and ready to receive payments.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Setup Incomplete</AlertTitle>
                  <AlertDescription>
                    Please complete your Stripe account setup to start receiving payments.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{account.email}</p>
                </div>
                {account.business_name && (
                  <div>
                    <Label className="text-muted-foreground">Business Name</Label>
                    <p className="font-medium">{account.business_name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Account ID</Label>
                  <p className="font-mono text-sm">{account.stripe_account_id}</p>
                </div>
              </div>

              {(!account.payouts_enabled || !account.charges_enabled) && (
                <Button onClick={handleContinueOnboarding} disabled={loading} className="w-full">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  Continue Setup in Stripe
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Account Found</AlertTitle>
                <AlertDescription>
                  Create a contractor account to start receiving payments directly to your bank.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contractor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="business">Business Name (Optional)</Label>
                  <Input
                    id="business"
                    placeholder="Your Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Create Contractor Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}