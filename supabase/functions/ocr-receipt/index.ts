import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface RequestBody {
  storagePath: string;
  expenseId: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const body = await req.json() as RequestBody;
    console.log("Processing OCR for expense:", body.expenseId);

    // Download the image from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("receipts")
      .download(body.storagePath);

    if (downloadError || !fileData) {
      console.error("Failed to download file:", downloadError);
      return new Response(
        JSON.stringify({ error: "File not found" }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Convert blob to base64 for processing
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // For now, use a simple regex-based parser
    // In production, integrate with Google Vision API or AWS Textract
    const text = await fileData.text().catch(() => "");
    
    // Simple OCR text parsing (this would be replaced by actual OCR)
    const parsed = parseReceiptText(text);
    
    // Update the expense receipt with parsed data
    const { error: updateError } = await supabase
      .from("expense_receipts")
      .update({ 
        ocr_json: { raw: text, base64_sample: base64.substring(0, 100) }, 
        parsed 
      })
      .eq("expense_id", body.expenseId)
      .eq("storage_path", body.storagePath);

    if (updateError) {
      console.error("Failed to update expense receipt:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("OCR processing complete for expense:", body.expenseId);
    return new Response(
      JSON.stringify({ parsed }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("OCR processing error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function parseReceiptText(text: string): {
  vendor?: string;
  date?: string;
  total?: number;
  tax?: number;
  subtotal?: number;
} {
  // This is a placeholder parser - in production, use actual OCR results
  const lines = text.split('\n').filter(line => line.trim());
  
  const parsed: any = {};
  
  // Try to find vendor (usually first non-empty line)
  if (lines.length > 0) {
    parsed.vendor = lines[0].trim().substring(0, 100);
  }
  
  // Try to find date patterns
  const datePattern = /\b(20\d{2}[-/\.]\d{1,2}[-/\.]\d{1,2}|\d{1,2}[-/\.]\d{1,2}[-/\.]20\d{2})\b/;
  const dateMatch = text.match(datePattern);
  if (dateMatch) {
    parsed.date = dateMatch[0];
  }
  
  // Try to find total amount
  const totalPattern = /total[:\s]*\$?([\d,]+\.?\d*)/i;
  const totalMatch = text.match(totalPattern);
  if (totalMatch) {
    parsed.total = parseFloat(totalMatch[1].replace(/[^\d.]/g, ''));
  }
  
  // Try to find tax amount
  const taxPattern = /(?:tax|hst|gst|pst)[:\s]*\$?([\d,]+\.?\d*)/i;
  const taxMatch = text.match(taxPattern);
  if (taxMatch) {
    parsed.tax = parseFloat(taxMatch[1].replace(/[^\d.]/g, ''));
  }
  
  // Try to find subtotal
  const subtotalPattern = /sub\s*total[:\s]*\$?([\d,]+\.?\d*)/i;
  const subtotalMatch = text.match(subtotalPattern);
  if (subtotalMatch) {
    parsed.subtotal = parseFloat(subtotalMatch[1].replace(/[^\d.]/g, ''));
  }
  
  // If we have total and tax but no subtotal, calculate it
  if (parsed.total && parsed.tax && !parsed.subtotal) {
    parsed.subtotal = parsed.total - parsed.tax;
  }
  
  return parsed;
}