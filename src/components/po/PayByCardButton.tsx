import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Get publishable key from environment or hardcode for testing
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface PayByCardButtonProps {
  poId: string;
  poNumber: string;
  amountCents: number;
  onSuccess?: () => void;
}

export function PayByCardButton({ poId, poNumber, amountCents, onSuccess }: PayByCardButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripePromise) {
      notify.error("Stripe is not configured. Please add your Stripe publishable key.");
      return;
    }

    try {
      setLoading(true);
      
      // Create payment intent via edge function
      const { data, error } = await supabase.functions.invoke('create-po-payment-intent', {
        body: { 
          po_id: poId, 
          amount_cents: amountCents 
        }
      });
      
      if (error) throw error;
      if (!data?.clientSecret) throw new Error("Failed to create payment intent");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");
      
      // Use Stripe's payment element or redirect to checkout
      const { error: confirmError } = await stripe.confirmPayment({
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/app/purchase-orders?payment=success&po=${poNumber}`,
        },
      });
      
      if (confirmError) {
        throw confirmError;
      }
      
      // If we get here, payment is being processed
      notify.info("Processing payment...");
      
    } catch (error: any) {
      console.error('Payment error:', error);
      notify.error("Payment failed", error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  if (!STRIPE_PUBLISHABLE_KEY) {
    return null; // Don't show button if Stripe is not configured
  }

  return (
    <Button 
      variant="default" 
      onClick={handlePayment}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          Pay by Card
        </>
      )}
    </Button>
  );
}