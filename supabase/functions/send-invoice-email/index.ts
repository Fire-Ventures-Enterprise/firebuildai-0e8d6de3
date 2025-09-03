import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-INVOICE-EMAIL] ${step}${detailsStr}`);
};

interface SendInvoiceRequest {
  invoiceId: string;
  customerEmail?: string;
  customerName?: string;
  invoiceNumber?: string;
  total?: number;
  dueDate?: string;
  action?: "created" | "reminder" | "overdue";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const requestData: SendInvoiceRequest = await req.json();
    logStep("Request data", requestData);

    const { 
      invoiceId, 
      customerEmail: providedEmail,
      customerName: providedName,
      invoiceNumber: providedNumber,
      total: providedTotal,
      dueDate: providedDueDate,
      action = "created" 
    } = requestData;

    // Fetch invoice with all related data
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from("invoices_enhanced")
      .select(`
        *,
        invoice_items_enhanced(*)
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      logStep("Invoice fetch error", invoiceError);
      throw new Error("Invoice not found");
    }

    logStep("Invoice fetched", { 
      invoiceNumber: invoice.invoice_number, 
      customerEmail: invoice.customer_email 
    });

    // Get user/company info
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: companyDetails } = await supabaseClient
      .from("company_details")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Use provided values or fall back to invoice data
    const customerEmail = providedEmail || invoice.customer_email;
    const customerName = providedName || invoice.customer_name || 'Customer';
    const invoiceNumber = providedNumber || invoice.invoice_number;
    const total = providedTotal || invoice.total || 0;
    const dueDate = providedDueDate || invoice.due_date;

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    // Format data for email
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    };

    const formatDate = (date: string) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric', 
        year: 'numeric'
      });
    };

    // Get site URL from environment or use default
    const siteUrl = Deno.env.get("SITE_URL") || "https://2c86a246-efc9-41cc-aae2-dc1f5ae58ed8.sandbox.lovable.dev";
    
    // Generate portal URL for invoice viewing and payment
    const portalUrl = `${siteUrl}/portal/invoice/${invoice.public_token}`;
    const paymentUrl = `${siteUrl}/portal/invoice/${invoice.public_token}#pay`;

    // Company info with fallbacks
    const companyName = companyDetails?.company_name || profile?.company_name || "FireBuildAI";
    const companyEmail = companyDetails?.email || user.email || "info@firebuildai.com";
    const companyPhone = companyDetails?.phone || profile?.phone || "(555) 123-4567";
    const companyAddress = companyDetails?.address ? 
      `${companyDetails.address}, ${companyDetails.city}, ${companyDetails.state} ${companyDetails.postal_code}` :
      "123 Main St, City, ST 12345";

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${companyName}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Invoice ${invoiceNumber}</p>
          </div>

          <!-- Main Content -->
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <!-- Greeting -->
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px;">
              ${action === 'created' ? 'New Invoice' : action === 'reminder' ? 'Invoice Reminder' : 'Invoice Overdue'}
            </h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Hello ${customerName},<br><br>
              ${action === 'created' ? 
                `We've prepared an invoice for the services provided. Please review the details below.` :
                action === 'reminder' ? 
                `This is a friendly reminder that your invoice is due soon. Please review and make payment at your earliest convenience.` :
                `This invoice is now overdue. Please make payment as soon as possible to avoid any service interruptions.`
              }
            </p>

            <!-- Invoice Details Box -->
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Invoice Number:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-weight: 600;">
                    ${invoiceNumber}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Issue Date:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937;">
                    ${formatDate(invoice.issue_date)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Due Date:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937; font-weight: 600;">
                    ${formatDate(dueDate)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 8px 0; color: #6b7280; border-top: 1px solid #e5e7eb;">Subtotal:</td>
                  <td style="padding: 12px 0 8px 0; text-align: right; color: #1f2937; border-top: 1px solid #e5e7eb;">
                    ${formatCurrency(invoice.subtotal || 0)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Tax:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937;">
                    ${formatCurrency(invoice.tax_amount || 0)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 600; border-top: 2px solid #e5e7eb;">
                    Total Due:
                  </td>
                  <td style="padding: 12px 0 0 0; text-align: right; color: #667eea; font-size: 20px; font-weight: 700; border-top: 2px solid #e5e7eb;">
                    ${formatCurrency(total)}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Service Details -->
            ${invoice.service_address ? `
            <div style="margin-bottom: 25px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0;">Service Location:</p>
              <p style="color: #1f2937; margin: 0;">
                ${invoice.service_address}<br>
                ${invoice.service_city ? `${invoice.service_city}, ${invoice.service_province} ${invoice.service_postal_code}` : ''}
              </p>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${portalUrl}" style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">
                View Invoice
              </a>
              ${invoice.balance > 0 ? `
              <a href="${paymentUrl}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">
                Pay Now
              </a>
              ` : ''}
            </div>

            <!-- Notes -->
            ${invoice.notes ? `
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-top: 20px;">
              <p style="color: #92400e; margin: 0; font-weight: 600; margin-bottom: 5px;">Notes:</p>
              <p style="color: #78350f; margin: 0; line-height: 1.5;">${invoice.notes}</p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; color: #9ca3af; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              Questions? Contact us:
            </p>
            <p style="margin: 0; font-size: 13px;">
              ${companyPhone} • ${companyEmail}<br>
              ${companyAddress}
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
              © ${new Date().getFullYear()} ${companyName} • Powered by FireBuildAI
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const plainText = `Invoice ${invoiceNumber}

${action === 'created' ? 'New Invoice' : action === 'reminder' ? 'Invoice Reminder' : 'Invoice Overdue'}

Hello ${customerName},

${action === 'created' ? 
  `We've prepared an invoice for the services provided.` :
  action === 'reminder' ? 
  `This is a friendly reminder that your invoice is due soon.` :
  `This invoice is now overdue. Please make payment as soon as possible.`
}

Invoice Details:
- Invoice Number: ${invoiceNumber}
- Issue Date: ${formatDate(invoice.issue_date)}
- Due Date: ${formatDate(dueDate)}
- Total Due: ${formatCurrency(total)}

View Invoice: ${portalUrl}
${invoice.balance > 0 ? `Pay Now: ${paymentUrl}` : ''}

${invoice.notes ? `Notes: ${invoice.notes}` : ''}

Questions? Contact us:
${companyPhone} • ${companyEmail}
${companyAddress}

© ${new Date().getFullYear()} ${companyName} • Powered by FireBuildAI`;

    // Email subject based on action
    const subjects = {
      created: `Invoice ${invoiceNumber} from ${companyName}`,
      reminder: `Reminder: Invoice ${invoiceNumber} Due ${formatDate(dueDate)}`,
      overdue: `Overdue Notice: Invoice ${invoiceNumber} - ${formatCurrency(total)}`
    };

    // Send email
    const fromEmail = `${companyName} <invoices@firebuildai.com>`;
    
    logStep("Sending email", { 
      to: customerEmail, 
      subject: subjects[action] 
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [customerEmail],
      subject: subjects[action],
      html: htmlContent,
      text: plainText,
    });

    if (error) {
      logStep("Resend error", error);
      throw error;
    }

    logStep("Email sent successfully", data);

    // Update invoice to mark as sent
    const { error: updateError } = await supabaseClient
      .from("invoices_enhanced")
      .update({
        sent_at: new Date().toISOString(),
        sent_by: user.id,
        sent_count: (invoice.sent_count || 0) + 1,
        last_sent_to: customerEmail,
        status: invoice.status === 'draft' ? 'sent' : invoice.status
      })
      .eq("id", invoiceId);

    if (updateError) {
      logStep("Warning: Failed to update invoice sent status", updateError);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    logStep("Error in function", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});