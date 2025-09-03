import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'lock_override' | 'change_order' | 'auto_lock';
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  userEmail: string;
  adminEmail?: string;
  details: {
    overrideBy?: string;
    changeOrderNumber?: string;
    changeOrderAmount?: number;
    reason?: string;
    timestamp: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: notificationRequest }: { data: NotificationRequest } = await req.json();
    console.log("Processing notification:", notificationRequest);

    // Get user profile to check notification preferences
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("notify_on_invoice_override, notify_on_change_order, company_name")
      .eq("id", user.id)
      .single();

    // Check notification preferences
    if (notificationRequest.type === 'lock_override' && !profile?.notify_on_invoice_override) {
      return new Response(
        JSON.stringify({ message: "Notification preference disabled for overrides" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (notificationRequest.type === 'change_order' && !profile?.notify_on_change_order) {
      return new Response(
        JSON.stringify({ message: "Notification preference disabled for change orders" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const companyName = profile?.company_name || "Your Company";
    const emailTo = [notificationRequest.userEmail];
    
    // Add admin email if provided
    if (notificationRequest.adminEmail) {
      emailTo.push(notificationRequest.adminEmail);
    }

    let subject = "";
    let htmlContent = "";

    switch (notificationRequest.type) {
      case 'lock_override':
        subject = `⚠️ Invoice Lock Override - ${notificationRequest.invoiceNumber}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Invoice Lock Override Alert</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #991b1b; margin: 0; font-weight: bold;">
                  ⚠️ Security Notice: An invoice lock has been overridden
                </p>
              </div>
              
              <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px;">Override Details:</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Invoice Number:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Customer:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Overridden By:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.details.overrideBy || 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Timestamp:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${new Date(notificationRequest.details.timestamp).toLocaleString()}</td>
                </tr>
                ${notificationRequest.details.reason ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Reason:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.details.reason}</td>
                </tr>
                ` : ''}
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px;">
                <p style="color: #92400e; margin: 0;">
                  <strong>Action Required:</strong> Please review the invoice changes and ensure they comply with your company's policies.
                </p>
              </div>
            </div>
            
            <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 12px;">
                This is an automated notification from ${companyName} • FireBuildAI.com
              </p>
            </div>
          </div>
        `;
        break;

      case 'change_order':
        subject = `📋 New Change Order - ${notificationRequest.invoiceNumber}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Change Order Created</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: #f0f9ff; border: 1px solid #60a5fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #1e40af; margin: 0; font-weight: bold;">
                  📋 A new change order has been created for approval
                </p>
              </div>
              
              <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px;">Change Order Details:</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Invoice Number:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Change Order #:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.details.changeOrderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Customer:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Amount:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 18px; font-weight: bold;">$${notificationRequest.details.changeOrderAmount?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Created On:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${new Date(notificationRequest.details.timestamp).toLocaleString()}</td>
                </tr>
                ${notificationRequest.details.reason ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Reason:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.details.reason}</td>
                </tr>
                ` : ''}
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
                <p style="color: #14532d; margin: 0;">
                  <strong>Next Steps:</strong> The customer needs to approve and sign this change order before work can proceed.
                </p>
              </div>
            </div>
            
            <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 12px;">
                This is an automated notification from ${companyName} • FireBuildAI.com
              </p>
            </div>
          </div>
        `;
        break;

      case 'auto_lock':
        subject = `🔒 Invoice Auto-Locked - ${notificationRequest.invoiceNumber}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Invoice Auto-Locked</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <p style="color: #92400e; margin: 0; font-weight: bold;">
                  🔒 This invoice has been automatically locked after the override period
                </p>
              </div>
              
              <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px;">Lock Details:</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Invoice Number:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Customer:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${notificationRequest.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">Locked At:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${new Date(notificationRequest.details.timestamp).toLocaleString()}</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px;">
                <p style="color: #4b5563; margin: 0;">
                  <strong>Note:</strong> To make changes to this invoice, you'll need to create a change order or use the override passphrase.
                </p>
              </div>
            </div>
            
            <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 12px;">
                This is an automated notification from ${companyName} • FireBuildAI.com
              </p>
            </div>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "FireBuildAI.com <onboarding@resend.dev>",
      to: emailTo,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invoice-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);