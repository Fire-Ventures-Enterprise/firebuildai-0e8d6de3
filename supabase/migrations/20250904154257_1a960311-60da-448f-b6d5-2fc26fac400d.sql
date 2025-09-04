-- Create storage bucket for work orders if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-orders', 'work-orders', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for uploading work order files
CREATE POLICY "Users can upload work order files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'work-orders' AND
  (auth.uid() IN (
    SELECT user_id FROM work_orders 
    WHERE id::text = (string_to_array(name, '/'))[1]
  ))
);

-- RLS policy for viewing work order files
CREATE POLICY "Users can view their work order files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'work-orders' AND
  (auth.uid() IN (
    SELECT user_id FROM work_orders 
    WHERE id::text = (string_to_array(name, '/'))[1]
  ))
);

-- RLS policy for public access via token (for crew members)
CREATE POLICY "Public can upload to work orders via valid token"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'work-orders' AND
  EXISTS (
    SELECT 1 FROM work_order_tokens
    WHERE work_order_id::text = (string_to_array(name, '/'))[1]
    AND expires_at > NOW()
  )
);

-- RLS policy for public viewing via token
CREATE POLICY "Public can view work order files via valid token"
ON storage.objects FOR SELECT
TO anon
USING (
  bucket_id = 'work-orders' AND
  EXISTS (
    SELECT 1 FROM work_order_tokens
    WHERE work_order_id::text = (string_to_array(name, '/'))[1]
    AND expires_at > NOW()
  )
);