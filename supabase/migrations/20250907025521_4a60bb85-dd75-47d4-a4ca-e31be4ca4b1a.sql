-- Create payment_links table for bank integration
CREATE TABLE public.payment_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_id UUID,
  purchase_order_id UUID,
  type TEXT NOT NULL CHECK (type IN ('receivable', 'payable')),
  bank_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  link_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reference_number TEXT NOT NULL,
  recipient_name TEXT,
  recipient_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own payment links"
ON public.payment_links
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment links"
ON public.payment_links
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment links"
ON public.payment_links
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment links"
ON public.payment_links
FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_payment_links_updated_at
BEFORE UPDATE ON public.payment_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();