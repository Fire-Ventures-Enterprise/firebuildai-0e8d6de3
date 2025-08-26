-- Add invoice locking and change tracking features
ALTER TABLE public.invoices 
ADD COLUMN is_locked BOOLEAN DEFAULT true,
ADD COLUMN lock_reason TEXT DEFAULT 'Pending change order approval',
ADD COLUMN override_password TEXT,
ADD COLUMN last_override_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_override_by TEXT;

-- Create invoice change log table for audit trail
CREATE TABLE public.invoice_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  change_type TEXT NOT NULL, -- 'amount_change', 'item_added', 'item_removed', 'override_used', 'change_order_applied'
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  change_order_id UUID REFERENCES public.change_orders(id),
  override_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add fields to change orders for better tracking
ALTER TABLE public.change_orders
ADD COLUMN original_invoice_amount DECIMAL(10,2),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by TEXT;

-- Create function to check if invoice can be edited
CREATE OR REPLACE FUNCTION public.can_edit_invoice(
  invoice_id_param UUID,
  override_phrase TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  invoice_locked BOOLEAN;
  correct_override TEXT;
BEGIN
  -- Get invoice lock status
  SELECT is_locked, override_password 
  INTO invoice_locked, correct_override
  FROM public.invoices 
  WHERE id = invoice_id_param;
  
  -- If not locked, can edit
  IF NOT invoice_locked THEN
    RETURN true;
  END IF;
  
  -- Check if there's a pending approved change order
  IF EXISTS (
    SELECT 1 FROM public.change_orders 
    WHERE invoice_id = invoice_id_param 
    AND status = 'approved'
    AND approved_at > COALESCE(
      (SELECT MAX(created_at) FROM public.invoice_change_log 
       WHERE invoice_id = invoice_id_param 
       AND change_type = 'change_order_applied'),
      '1900-01-01'::timestamp
    )
  ) THEN
    RETURN true;
  END IF;
  
  -- Check override phrase
  IF override_phrase IS NOT NULL AND 
     LOWER(override_phrase) = LOWER(COALESCE(correct_override, 'accept changes')) THEN
    -- Log the override
    INSERT INTO public.invoice_change_log (
      invoice_id, user_id, change_type, description, override_used
    ) VALUES (
      invoice_id_param, 
      auth.uid(), 
      'override_used',
      'Invoice lock overridden with passphrase',
      true
    );
    
    -- Update override timestamp
    UPDATE public.invoices 
    SET last_override_at = now(),
        last_override_by = (SELECT email FROM auth.users WHERE id = auth.uid())
    WHERE id = invoice_id_param;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create trigger to prevent unauthorized invoice edits
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_invoice_edit()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  -- Skip check for new invoices
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  
  -- Check if invoice can be edited
  IF NOT can_edit_invoice(NEW.id, NULL) THEN
    -- Check if significant changes are being made
    IF OLD.subtotal != NEW.subtotal OR 
       OLD.tax_amount != NEW.tax_amount OR 
       OLD.total != NEW.total THEN
      RAISE EXCEPTION 'Invoice is locked. Create a change order or use override phrase to modify amounts.';
    END IF;
  END IF;
  
  -- Log the change if amounts changed
  IF OLD.total != NEW.total THEN
    INSERT INTO public.invoice_change_log (
      invoice_id, user_id, change_type, description, 
      old_value, new_value
    ) VALUES (
      NEW.id, 
      auth.uid(), 
      'amount_change',
      'Invoice total changed',
      jsonb_build_object('total', OLD.total),
      jsonb_build_object('total', NEW.total)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for invoice edits
CREATE TRIGGER check_invoice_edit_permission
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unauthorized_invoice_edit();

-- Create trigger for invoice item changes
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_item_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  parent_invoice_id UUID;
BEGIN
  -- Get the parent invoice ID
  IF TG_OP = 'DELETE' THEN
    parent_invoice_id := OLD.invoice_id;
  ELSE
    parent_invoice_id := NEW.invoice_id;
  END IF;
  
  -- Check if invoice can be edited
  IF NOT can_edit_invoice(parent_invoice_id, NULL) THEN
    RAISE EXCEPTION 'Invoice is locked. Create a change order or use override phrase to modify items.';
  END IF;
  
  -- Log the change
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_change_log (
      invoice_id, user_id, change_type, description, new_value
    ) VALUES (
      parent_invoice_id, 
      auth.uid(), 
      'item_added',
      'New item added to invoice',
      row_to_json(NEW)::jsonb
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.invoice_change_log (
      invoice_id, user_id, change_type, description, old_value
    ) VALUES (
      parent_invoice_id, 
      auth.uid(), 
      'item_removed',
      'Item removed from invoice',
      row_to_json(OLD)::jsonb
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.invoice_change_log (
      invoice_id, user_id, change_type, description, old_value, new_value
    ) VALUES (
      parent_invoice_id, 
      auth.uid(), 
      'item_modified',
      'Invoice item modified',
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for invoice items
CREATE TRIGGER check_invoice_item_permission
BEFORE INSERT OR UPDATE OR DELETE ON public.invoice_items
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unauthorized_item_change();

-- Enable RLS on invoice_change_log
ALTER TABLE public.invoice_change_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoice_change_log
CREATE POLICY "Users can view their own invoice changes" ON public.invoice_change_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_change_log.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own invoice changes" ON public.invoice_change_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_change_log.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Add notification settings to profiles for change tracking
ALTER TABLE public.profiles
ADD COLUMN notify_on_invoice_override BOOLEAN DEFAULT true,
ADD COLUMN notify_on_change_order BOOLEAN DEFAULT true;