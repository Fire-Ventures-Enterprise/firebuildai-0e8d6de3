import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, AlertCircle, DollarSign } from "lucide-react";

interface ContractorPayoutProps {
  invoice: any;
  contractorAccount: any;
  onSuccess?: () => void;
}

export function ContractorPayout({ invoice, contractorAccount, onSuccess }: ContractorPayoutProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handlePayout = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > invoice.balance) {
      toast.error("Payout amount cannot exceed invoice balance");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-contractor-payout", {
        body: {
          invoiceId: invoice.id,
          connectedAccountId: contractorAccount.stripe_account_id,
          amount: parseFloat(amount),
          description: description || `Payment for invoice ${invoice.invoiceNumber}`
        }
      });

      if (error) throw error;

      toast.success(`Payout of $${amount} sent successfully`);
      setOpen(false);
      setAmount("");
      setDescription("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Payout error:", error);
      toast.error(error.message || "Failed to process payout");
    } finally {
      setLoading(false);
    }
  };

  if (!contractorAccount?.payouts_enabled) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Send className="h-4 w-4" />
        Send to Contractor
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Contractor Payout</DialogTitle>
            <DialogDescription>
              Transfer funds directly to the contractor's bank account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invoice Balance: ${invoice.balance.toFixed(2)}
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="amount">Payout Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Payment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Contractor Account</p>
                <p className="font-medium">{contractorAccount.business_name || contractorAccount.email}</p>
                <p className="text-xs text-muted-foreground">ID: {contractorAccount.stripe_account_id}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handlePayout} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}