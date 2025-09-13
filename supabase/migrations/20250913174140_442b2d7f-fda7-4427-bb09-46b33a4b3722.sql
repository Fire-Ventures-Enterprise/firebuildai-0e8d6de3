-- Complete Block 1: Company profiles table setup
ALTER TABLE company_profiles 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Update RLS policies for logo storage
CREATE POLICY "Users can upload their company logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' 
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;