-- Add missing columns to invoices_enhanced for new features
ALTER TABLE public.invoices_enhanced
ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS signatures jsonb DEFAULT '[]'::jsonb;

-- Also ensure the invoice_photos, invoice_attachments, and invoice_signatures tables exist
-- These are already created but let's ensure they're set up correctly

-- Update the invoice_signatures table if needed to ensure it has all necessary columns
ALTER TABLE public.invoice_signatures
ADD COLUMN IF NOT EXISTS signature_required boolean DEFAULT true;