import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51234567890"); // TODO: Use actual publishable key

interface CollectPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onSuccess?: () => void;
}

function PaymentForm({ invoice, onSuccess, onClose }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/app/invoices/${invoice.id}?payment=success`,
        },
        redirect: "if_required"
      });

      if (error) {
        notify.error(error.message || "Payment failed");
      } else {
        notify.success("Payment successful!");
        onSuccess?.();
      }
    } catch (error) {
      notify.error("Payment error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Charge Card"}
        </Button>
      </div>
    </form>
  );
}

export function CollectPaymentDialog({ open, onOpenChange, invoice, onSuccess }: CollectPaymentDialogProps) {
  const [clientSecret, setClientSecret] = useState<string>();
  const balance = (invoice.total || 0) - (invoice.paid_amount || 0);

  // Create payment intent when dialog opens
  useEffect(() => {
    if (!open) return;
    
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("create-invoice-payment-intent", {
          body: { 
            invoice_id: invoice.id,
            amount: Math.round(balance * 100) // Convert to cents
          }
        });
        
        if (error) throw error;
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        notify.error("Failed to initialize payment", error);
        onOpenChange(false);
      }
    })();
  }, [open, invoice.id, balance]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Collect Card Payment</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Amount to charge: <strong>${balance.toFixed(2)}</strong>
          </p>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                invoice={invoice} 
                onSuccess={onSuccess}
                onClose={() => onOpenChange(false)}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              Initializing payment...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}