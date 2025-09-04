-- Create function for generating work order tokens
CREATE OR REPLACE FUNCTION public.create_work_order_token(
  p_work_order_id uuid, 
  p_ttl_hours int DEFAULT 48
)
RETURNS text
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_token text := encode(gen_random_bytes(24), 'base64');
  v_hash text := encode(digest(v_token, 'sha256'), 'hex');
BEGIN
  -- Insert token with hash
  INSERT INTO work_order_tokens(work_order_id, token_hash, expires_at)
  VALUES (p_work_order_id, v_hash, now() + make_interval(hours => p_ttl_hours));
  
  RETURN v_token;
END $$;

-- Create function for submitting work order report via token
CREATE OR REPLACE FUNCTION public.submit_work_order_report_by_token(
  p_token text,
  p_notes text,
  p_labor_hours numeric,
  p_materials_used jsonb,
  p_photos jsonb,
  p_signatures jsonb
) 
RETURNS boolean
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_token_row RECORD;
  v_wo_id UUID;
BEGIN
  -- Find valid token
  SELECT * INTO v_token_row 
  FROM work_order_tokens
  WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
  AND expires_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  v_wo_id := v_token_row.work_order_id;

  -- Create or update report
  INSERT INTO work_order_reports (
    work_order_id, completed_at, notes, labor_hours,
    materials_used, photos, signatures
  )
  VALUES (
    v_wo_id, NOW(), p_notes, COALESCE(p_labor_hours, 0),
    COALESCE(p_materials_used, '[]'::jsonb),
    COALESCE(p_photos, '[]'::jsonb),
    COALESCE(p_signatures, '[]'::jsonb)
  )
  ON CONFLICT (work_order_id) DO UPDATE SET
    completed_at = NOW(),
    notes = EXCLUDED.notes,
    labor_hours = EXCLUDED.labor_hours,
    materials_used = EXCLUDED.materials_used,
    photos = EXCLUDED.photos,
    signatures = EXCLUDED.signatures,
    updated_at = NOW();

  -- Update work order status
  UPDATE work_orders 
  SET status = 'completed', updated_at = NOW()
  WHERE id = v_wo_id;

  RETURN TRUE;
END $$;