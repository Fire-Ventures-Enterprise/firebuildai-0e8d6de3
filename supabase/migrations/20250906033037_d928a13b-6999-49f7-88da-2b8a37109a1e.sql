-- Enhanced Pricing System Tables
-- Supports both bulk and itemized pricing with overrides

-- Create enhanced estimates table with pricing configuration
CREATE TABLE IF NOT EXISTS public.enhanced_estimates_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  estimate_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected')),
  
  -- Customer information
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_province TEXT,
  customer_postal_code TEXT,
  
  -- Service location
  service_address TEXT,
  service_city TEXT,
  service_province TEXT,
  service_postal_code TEXT,
  
  -- Pricing configuration (stored as JSONB for flexibility)
  pricing_config JSONB NOT NULL DEFAULT '{
    "mode": "itemized",
    "showIndividualPrices": true,
    "showBulkBreakdown": false,
    "allowClientPriceView": true
  }',
  
  -- Bulk pricing fields
  bulk_total_price NUMERIC(10,2),
  bulk_price_description TEXT,
  
  -- Fee calculations
  management_fee_percentage NUMERIC(5,2),
  management_fee_fixed NUMERIC(10,2),
  permit_fee_amount NUMERIC(10,2),
  
  -- Calculated totals
  itemized_subtotal NUMERIC(10,2),
  bulk_price NUMERIC(10,2),
  management_fee NUMERIC(10,2),
  permit_fees NUMERIC(10,2),
  other_fees NUMERIC(10,2),
  
  -- Override totals
  subtotal_override NUMERIC(10,2),
  override_reason TEXT,
  
  -- Final calculations
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2),
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_amount NUMERIC(10,2),
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 13,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- Deposit
  deposit_amount NUMERIC(10,2),
  deposit_percentage NUMERIC(5,2),
  deposit_due TIMESTAMP WITH TIME ZONE,
  
  -- Dates
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional fields
  notes TEXT,
  private_notes TEXT,
  scope_of_work TEXT,
  contract_required BOOLEAN DEFAULT false,
  contract_attached BOOLEAN DEFAULT false,
  contract_text TEXT,
  signature_required BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(user_id, estimate_number)
);

-- Create enhanced estimate items table with pricing options
CREATE TABLE IF NOT EXISTS public.enhanced_estimate_items_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES public.enhanced_estimates_pricing(id) ON DELETE CASCADE,
  
  -- Basic item information
  item_name TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT, -- sq ft, linear ft, each, hours, etc.
  
  -- Itemized pricing fields
  rate NUMERIC(10,2),
  markup NUMERIC(10,2),
  markup_type TEXT CHECK (markup_type IN ('percentage', 'fixed')),
  markup_amount NUMERIC(10,2),
  tax BOOLEAN DEFAULT true,
  amount NUMERIC(10,2),
  
  -- Bulk pricing fields
  bulk_price_allocated NUMERIC(10,2),
  bulk_price_percentage NUMERIC(5,2),
  
  -- Override pricing
  price_override NUMERIC(10,2),
  override_reason TEXT,
  
  -- Item categorization
  item_type TEXT NOT NULL CHECK (item_type IN ('material', 'labor', 'equipment', 'subcontractor', 'fee', 'override')),
  construction_phase TEXT,
  sequencing_keywords TEXT[],
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_enhanced_estimates_pricing_user_id ON public.enhanced_estimates_pricing(user_id);
CREATE INDEX idx_enhanced_estimates_pricing_status ON public.enhanced_estimates_pricing(status);
CREATE INDEX idx_enhanced_estimates_pricing_customer_id ON public.enhanced_estimates_pricing(customer_id);
CREATE INDEX idx_enhanced_estimate_items_pricing_estimate_id ON public.enhanced_estimate_items_pricing(estimate_id);
CREATE INDEX idx_enhanced_estimate_items_pricing_item_type ON public.enhanced_estimate_items_pricing(item_type);

-- Enable Row Level Security
ALTER TABLE public.enhanced_estimates_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_estimate_items_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enhanced_estimates_pricing
CREATE POLICY "Users can view own enhanced estimates with pricing" 
ON public.enhanced_estimates_pricing 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enhanced estimates with pricing" 
ON public.enhanced_estimates_pricing 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enhanced estimates with pricing" 
ON public.enhanced_estimates_pricing 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own enhanced estimates with pricing" 
ON public.enhanced_estimates_pricing 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for enhanced_estimate_items_pricing
CREATE POLICY "Users can view own enhanced estimate items with pricing" 
ON public.enhanced_estimate_items_pricing 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.enhanced_estimates_pricing 
    WHERE id = enhanced_estimate_items_pricing.estimate_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create own enhanced estimate items with pricing" 
ON public.enhanced_estimate_items_pricing 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.enhanced_estimates_pricing 
    WHERE id = enhanced_estimate_items_pricing.estimate_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own enhanced estimate items with pricing" 
ON public.enhanced_estimate_items_pricing 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.enhanced_estimates_pricing 
    WHERE id = enhanced_estimate_items_pricing.estimate_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own enhanced estimate items with pricing" 
ON public.enhanced_estimate_items_pricing 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.enhanced_estimates_pricing 
    WHERE id = enhanced_estimate_items_pricing.estimate_id 
    AND user_id = auth.uid()
  )
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_enhanced_pricing_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enhanced_estimates_pricing_updated_at
BEFORE UPDATE ON public.enhanced_estimates_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_enhanced_pricing_updated_at_column();

CREATE TRIGGER update_enhanced_estimate_items_pricing_updated_at
BEFORE UPDATE ON public.enhanced_estimate_items_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_enhanced_pricing_updated_at_column();