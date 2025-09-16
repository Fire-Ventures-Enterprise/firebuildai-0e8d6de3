-- Enable pgcrypto extension if not already enabled (already done in previous migration)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add sequence_data column to estimates table for storing sequenced line items
ALTER TABLE estimates 
ADD COLUMN IF NOT EXISTS sequence_data JSONB DEFAULT '[]'::jsonb;

-- Also ensure the digest column is removed as it's not needed (was a misunderstanding in the guidance)
ALTER TABLE estimates 
DROP COLUMN IF EXISTS digest;