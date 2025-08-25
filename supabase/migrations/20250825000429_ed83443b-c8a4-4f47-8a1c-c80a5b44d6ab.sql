-- Create payment history table
CREATE TABLE public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- succeeded, pending, failed
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_payment_history_subscriber_id ON public.payment_history(subscriber_id);
CREATE INDEX idx_payment_history_payment_date ON public.payment_history(payment_date);

-- Enable RLS
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment history
CREATE POLICY "Users can view their own payment history" 
ON public.payment_history 
FOR SELECT 
USING (
  subscriber_id IN (
    SELECT id FROM public.subscribers 
    WHERE user_id = auth.uid()
  )
);

-- Allow edge functions to insert payment records
CREATE POLICY "Edge functions can insert payments" 
ON public.payment_history 
FOR INSERT 
WITH CHECK (true);

-- Update subscribers table to track more details
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'inactive'; -- active, trialing, canceled, past_due, unpaid

-- Add index for Stripe subscription ID
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_subscription_id ON public.subscribers(stripe_subscription_id);

-- Update profiles table to better track trial status
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial'; -- trial, active, expired, canceled

-- Create function to automatically update trial status
CREATE OR REPLACE FUNCTION public.update_trial_and_subscription_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update expired trials in profiles
  UPDATE public.profiles
  SET 
    trial_status = 'expired',
    subscription_status = 'expired',
    updated_at = now()
  WHERE 
    trial_ends_at < now() 
    AND trial_status = 'active'
    AND is_subscribed = false;

  -- Update subscription status based on subscribers table
  UPDATE public.profiles p
  SET 
    subscription_status = s.status,
    is_subscribed = (s.status = 'active'),
    updated_at = now()
  FROM public.subscribers s
  WHERE 
    p.id = s.user_id
    AND s.status != p.subscription_status;
END;
$$;