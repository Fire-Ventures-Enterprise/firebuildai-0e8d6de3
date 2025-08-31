-- Create table for review requests
CREATE TABLE public.review_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices_enhanced(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'reviewed', 'declined')),
  sent_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  google_review_url TEXT,
  facebook_review_url TEXT,
  yelp_review_url TEXT,
  custom_review_url TEXT,
  review_platform TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own review requests" 
ON public.review_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own review requests" 
ON public.review_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review requests" 
ON public.review_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review requests" 
ON public.review_requests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_review_requests_user_id ON public.review_requests(user_id);
CREATE INDEX idx_review_requests_invoice_id ON public.review_requests(invoice_id);
CREATE INDEX idx_review_requests_status ON public.review_requests(status);

-- Add trigger for updated_at
CREATE TRIGGER update_review_requests_updated_at
BEFORE UPDATE ON public.review_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for review platforms configuration
CREATE TABLE public.review_platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  google_business_url TEXT,
  facebook_page_url TEXT,
  yelp_business_url TEXT,
  custom_platform_name TEXT,
  custom_platform_url TEXT,
  default_message TEXT,
  auto_send_after_payment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_platforms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own review platforms" 
ON public.review_platforms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own review platforms" 
ON public.review_platforms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review platforms" 
ON public.review_platforms 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_review_platforms_updated_at
BEFORE UPDATE ON public.review_platforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();