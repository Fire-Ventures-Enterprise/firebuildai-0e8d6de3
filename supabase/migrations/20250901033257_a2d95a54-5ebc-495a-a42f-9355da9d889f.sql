-- Check if we need to add invoice_id column to expenses
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES public.invoices_enhanced(id);

-- Now fix the trigger function properly
CREATE OR REPLACE FUNCTION public.calculate_invoice_profit()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Calculate total expenses for the invoice
  NEW.total_expenses := COALESCE((
    SELECT SUM(total) 
    FROM public.expenses 
    WHERE invoice_id = NEW.id
  ), 0);
  
  -- Calculate gross profit
  NEW.gross_profit := NEW.total - NEW.total_expenses;
  
  -- Calculate profit margin (as percentage)
  IF NEW.total > 0 THEN
    NEW.profit_margin := ROUND((NEW.gross_profit / NEW.total * 100)::numeric, 2);
  ELSE
    NEW.profit_margin := 0;
  END IF;
  
  -- Calculate net profit (after overhead)
  NEW.net_profit := NEW.gross_profit - (NEW.total * NEW.overhead_percentage / 100);
  
  RETURN NEW;
END;
$function$;