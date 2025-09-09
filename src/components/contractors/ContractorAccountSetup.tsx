import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2, CheckCircle, AlertCircle, Building2, Info, FileText, Shield, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ContractorAccountSetupProps {
  onAccountCreated?: () => void;
}

export function ContractorAccountSetup({ onAccountCreated }: ContractorAccountSetupProps = {}) {
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
          onAccountCreated?.();
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
        setTimeout(() => {
          checkExistingAccount();
          onAccountCreated?.();
        }, 2000);
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
    <Card className="bg-card/50 border-muted">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-xl">Contractor Payment Account</CardTitle>
            <CardDescription className="text-sm">
              Connect your Stripe account to receive payments directly
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {account ? (
          <div className="space-y-6">
            {/* Account Status */}
            <Alert className={account.payouts_enabled && account.charges_enabled ? "border-green-500/20 bg-green-500/10" : "border-yellow-500/20 bg-yellow-500/10"}>
              {account.payouts_enabled && account.charges_enabled ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600">Account Active</AlertTitle>
                  <AlertDescription>
                    Your contractor account is set up and ready to receive payments.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-600">Setup Incomplete</AlertTitle>
                  <AlertDescription>
                    Please complete your Stripe account setup to start receiving payments.
                  </AlertDescription>
                </>
              )}
            </Alert>

            {/* Account Details */}
            <div className="space-y-4 rounded-lg border border-border/50 bg-background/50 p-4">
              <div className="grid gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                  <p className="font-medium mt-1">{account.email}</p>
                </div>
                {account.business_name && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Business Name</Label>
                    <p className="font-medium mt-1">{account.business_name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Stripe Account ID</Label>
                  <p className="font-mono text-sm mt-1 text-muted-foreground">{account.stripe_account_id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                  <div className="mt-1">{getStatusBadge()}</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {(!account.payouts_enabled || !account.charges_enabled) && (
              <Button 
                onClick={handleContinueOnboarding} 
                disabled={loading} 
                className="w-full"
                size="lg"
              >
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
          <div className="space-y-6">
            {/* No Account Alert */}
            <Alert className="border-muted bg-muted/20">
              <Info className="h-4 w-4" />
              <AlertTitle>No Account Found</AlertTitle>
              <AlertDescription>
                Create a contractor account to start receiving payments directly to your bank.
              </AlertDescription>
            </Alert>

            {/* Account Creation Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contractor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 bg-background/50"
                />
              </div>
              
              <div>
                <Label htmlFor="business" className="text-sm font-medium">
                  Business Name (Optional)
                </Label>
                <Input
                  id="business"
                  placeholder="Your Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1.5 bg-background/50"
                />
              </div>
              
              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country" className="mt-1.5 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Create Account Button */}
            <Button 
              onClick={handleCreateAccount} 
              disabled={loading} 
              className="w-full"
              size="lg"
            >
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
  );
}