import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

interface SendEstimateRequest {
  estimateId: string;
  action?: "created" | "reminder" | "expiring";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { estimateId, action = "created" }: SendEstimateRequest = await req.json();
    
    console.log(`Sending estimate email for ${estimateId}, action: ${action}`);

    // Fetch estimate with all related data
    const { data: estimate, error: estimateError } = await supabaseClient
      .from("estimates")
      .select(`
        *,
        customer:customers(*),
        items:estimate_items(*)
      `)
      .eq("id", estimateId)
      .single();

    if (estimateError || !estimate) {
      throw new Error("Estimate not found");
    }

    // Get user/company info
    const { data: { user } } = await supabaseClient.auth.getUser();
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    // Format data for email
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric', 
        year: 'numeric'
      });
    };

    // Get site URL from environment or use default
    const siteUrl = Deno.env.get("SITE_URL") || "https://yourdomain.com";
    
    // Generate URLs
    const portalUrl = `${siteUrl}/portal/estimate/${estimate.public_token}`;
    const depositUrl = `${siteUrl}/portal/estimate/${estimate.public_token}?action=pay`;
    const contractUrl = estimate.contract_attached ? `${portalUrl}#contract` : portalUrl;

    // Get province/state for contract
    const getProvince = () => {
      const province = estimate.service_province || 
                      estimate.customer?.province || 
                      profile?.address?.match(/\b(ON|Ontario|BC|British Columbia|AB|Alberta|QC|Quebec|NS|Nova Scotia|NB|New Brunswick|MB|Manitoba|SK|Saskatchewan|PE|Prince Edward Island|NL|Newfoundland)\b/i)?.[0] ||
                      'Ontario';
      
      const provinceMap: Record<string, string> = {
        'ON': 'Ontario',
        'BC': 'British Columbia',
        'AB': 'Alberta',
        'QC': 'Quebec',
        'NS': 'Nova Scotia',
        'NB': 'New Brunswick',
        'MB': 'Manitoba',
        'SK': 'Saskatchewan',
        'PE': 'Prince Edward Island',
        'NL': 'Newfoundland and Labrador'
      };
      
      return provinceMap[province.toUpperCase()] || province;
    };

    const province = getProvince();
    const contractTitle = province === 'Ontario' ? 'Ontario Contract Agreement' : 
                         ['British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province) ?
                         `${province} Contract Agreement` : 'Service Contract Agreement';
    
    const contractName = province === 'Ontario' ? 'Ontario Construction Service Agreement' :
                        ['British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province) ?
                        `${province} Construction Service Agreement` : 'Construction Service Agreement';
    
    const jurisdiction = ['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province) ?
                        province : 'local';

    // Prepare top items for email (first 5)
    const topItems = estimate.items?.slice(0, 5).map((item: any) => {
      const firstLine = item.description?.split('\n')[0] || `Item`;
      const rest = item.description?.slice(firstLine.length).trim() || '';
      
      return {
        title: firstLine,
        details: rest,
        unit_price: formatCurrency(item.rate || 0),
        qty: item.quantity || 1,
        line_total: formatCurrency(item.amount || 0),
      };
    }) || [];

    // Company info with defaults
    const companyName = profile?.company_name || "Your Company";
    const companyEmail = user?.email || "info@company.com";
    const companyPhone = profile?.phone || "(555) 123-4567";
    const companyAddress = profile?.address || "123 Main St, City, ST 12345";

    // Email subject based on action
    const subjects = {
      created: `Your Estimate ${estimate.estimate_number} — Deposit $${formatCurrency(estimate.deposit_amount || 0)} to approve`,
      reminder: `Reminder: Estimate ${estimate.estimate_number} awaiting approval`,
      expiring: `Estimate ${estimate.estimate_number} expires soon — Secure your booking`
    };

    // Generate plain text version
    const plainText = `Hi ${estimate.customer?.first_name || estimate.customer?.company_name || 'Valued Customer'},

Your estimate ${estimate.estimate_number} from ${companyName} is ready.

Total: $${formatCurrency(estimate.total)} 
Deposit required to approve: $${formatCurrency(estimate.deposit_amount || 0)}

Review & approve (pay deposit): ${depositUrl}
View full details online: ${portalUrl}

Issue date: ${formatDate(estimate.issue_date)}
${estimate.expiration_date ? `Expires: ${formatDate(estimate.expiration_date)}` : ''}

Billing to: ${estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`}
${estimate.service_address ? `Service address: ${estimate.service_address}` : ''}

If you have questions, reply to this email.
${companyName} • ${companyPhone} • ${companyEmail}`;

    // Generate HTML version
    const html = generateHtmlEmail({
      estimate_number: estimate.estimate_number,
      company_name: companyName,
      company_logo_url: `${siteUrl}/logo.png`, // You can customize this
      company_address: companyAddress,
      company_phone: companyPhone,
      company_email: companyEmail,
      client_name: estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`,
      client_email: estimate.customer?.email,
      service_address: estimate.service_address || estimate.customer?.address || 'Not specified',
      issue_date: formatDate(estimate.issue_date),
      expiry_date: estimate.expiration_date ? formatDate(estimate.expiration_date) : 'No expiration',
      currency: '$',
      subtotal: formatCurrency(estimate.subtotal),
      tax: formatCurrency(estimate.tax_amount),
      total: formatCurrency(estimate.total),
      deposit_amount: formatCurrency(estimate.deposit_amount || 0),
      deposit_url: depositUrl,
      portal_url: portalUrl,
      contract_title: contractTitle,
      contract_url: contractUrl,
      contract_name: contractName,
      jurisdiction: jurisdiction,
      top_items: topItems,
    });

    // Send email
    const { data, error } = await resend.emails.send({
      from: `${companyName} <onboarding@resend.dev>`, // Replace with your verified domain
      to: [estimate.customer?.email],
      subject: subjects[action],
      html,
      text: plainText,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending estimate email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function generateHtmlEmail(data: any): string {
  // Build items HTML
  const itemsHtml = data.top_items.map((item: any) => `
    <tr>
      <td class="title">${item.title}</td>
      <td class="num">${data.currency}${item.unit_price}</td>
      <td class="num">${item.qty}</td>
      <td class="num">${data.currency}${item.line_total}</td>
    </tr>
    ${item.details ? `
    <tr>
      <td colspan="4" style="font-size:12px;color:#374151;padding:8px 8px 12px 8px;white-space:pre-wrap;">
        ${item.details}
      </td>
    </tr>
    ` : ''}
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Estimate ${data.estimate_number}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    /* Basic reset for email */
    body { margin:0; padding:0; background:#f6f7fb; color:#111827; -webkit-text-size-adjust:none; }
    table { border-collapse:collapse; }
    img { border:0; outline:none; text-decoration:none; display:block; }
    a { color:#1f6feb; text-decoration:none; }

    /* Container */
    .wrapper { width:100%; background:#f6f7fb; padding:24px 0; }
    .card { width:100%; max-width:640px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .p-24 { padding:24px; }
    .muted { color:#6b7280; }
    .h1 { font-size:22px; line-height:28px; margin:0; }
    .badge { display:inline-block; font-size:12px; color:#374151; background:#eef2ff; padding:4px 8px; border-radius:999px; }

    /* Buttons */
    .btn { display:inline-block; padding:12px 18px; border-radius:8px; font-weight:600; }
    .btn-primary { background:#1f6feb; color:#fff; }
    .btn-secondary { background:#e5e7eb; color:#111827; }

    /* Totals table */
    .totals td { padding:6px 0; font-size:14px; }
    .totals .label { color:#6b7280; }
    .totals .value { text-align:right; }
    .totals .total { font-weight:700; }

    /* "Expand details" (works in Apple/iOS Mail and some webmail) */
    /* Hidden checkbox hack */
    .toggle{display:none;}
    .toggle + label{display:inline-block; margin-top:8px; font-weight:600; cursor:pointer;}
    .toggle + label span{display:inline-block; padding:8px 12px; border-radius:8px; background:#e5e7eb; color:#111827;}
    .details{max-height:0; overflow:hidden; transition:max-height .25s ease; }
    .toggle:checked ~ .details{max-height:1200px;} /* large enough for content */

    /* Line items */
    .items thead th{font-size:12px; background:#f3f4f6; color:#374151; padding:8px; border:1px solid #e5e7eb;}
    .items td{font-size:14px; padding:8px; border:1px solid #e5e7eb; vertical-align:top;}
    .num{text-align:right; white-space:nowrap;}
    .title{font-weight:600;}

    /* Mobile */
    @media (max-width: 480px){
      .p-24 { padding:16px; }
      .actions td{display:block; width:100% !important; padding-bottom:8px;}
      .actions a{display:block; text-align:center;}
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="card" role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="p-24" style="background:#111827;">
          <table width="100%">
            <tr>
              <td>
                <span style="color:#fff;font-size:20px;font-weight:bold;">${data.company_name}</span>
              </td>
              <td align="right">
                <span class="badge" style="background:#dbeafe;color:#1e3a8a;">Estimate</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td class="p-24">
          <h1 class="h1">Estimate ${data.estimate_number}</h1>
          <p class="muted" style="margin:6px 0 0;">Please review your estimate and approve by paying the deposit.</p>
        </td>
      </tr>

      <!-- Parties -->
      <tr>
        <td class="p-24" style="padding-top:0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" valign="top">
                <div class="muted" style="font-size:12px;">From</div>
                <div style="font-weight:600;">${data.company_name}</div>
                <div style="font-size:14px;">${data.company_address}</div>
                <div style="font-size:14px;">${data.company_phone}</div>
                <div style="font-size:14px;">${data.company_email}</div>
              </td>
              <td width="50%" valign="top" align="right">
                <div class="muted" style="font-size:12px;">Bill To</div>
                <div style="font-weight:600;">${data.client_name}</div>
                <div style="font-size:14px;">${data.client_email}</div>
                <div class="muted" style="font-size:12px;margin-top:12px;">Service Address</div>
                <div style="font-size:14px;">${data.service_address}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Dates -->
      <tr>
        <td class="p-24" style="padding-top:0;">
          <table width="100%">
            <tr>
              <td class="muted" style="font-size:12px;">Issue Date<br><strong style="color:#111827;">${data.issue_date}</strong></td>
              <td align="right" class="muted" style="font-size:12px;">Expiration Date<br><strong style="color:#111827;">${data.expiry_date}</strong></td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Totals -->
      <tr>
        <td class="p-24" style="padding-top:0;">
          <table class="totals" width="100%">
            <tr><td class="label">Subtotal</td><td class="value">${data.currency}${data.subtotal}</td></tr>
            <tr><td class="label">Tax</td><td class="value">${data.currency}${data.tax}</td></tr>
            <tr><td class="label total">Total</td><td class="value total">${data.currency}${data.total}</td></tr>
            <tr><td class="label" style="color:#2563eb;">Deposit Required</td><td class="value" style="font-weight:700;color:#2563eb;">${data.currency}${data.deposit_amount}</td></tr>
          </table>
        </td>
      </tr>

      <!-- Actions -->
      <tr>
        <td class="p-24" style="padding-top:0;">
          <table class="actions" width="100%">
            <tr>
              <td align="left" style="padding-right:8px;">
                <a class="btn btn-primary" href="${data.deposit_url}" target="_blank" rel="noopener">Pay Deposit</a>
              </td>
              <td align="right" style="padding-left:8px;">
                <a class="btn btn-secondary" href="${data.portal_url}" target="_blank" rel="noopener">View Details</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Optional in-email expandable details (partial support) -->
      ${data.top_items.length > 0 ? `
      <tr>
        <td class="p-24" style="padding-top:0;">
          <!-- Hidden checkbox trick; unsupported clients will just ignore -->
          <input id="toggle-details" type="checkbox" class="toggle">
          <label for="toggle-details"><span>View details in email</span></label>
          <div class="details">
            <table class="items" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              <thead>
                <tr>
                  <th align="left">Item</th>
                  <th class="num">Rate</th>
                  <th class="num">Qty</th>
                  <th class="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="margin-top:12px;font-size:12px;color:#6b7280;">
              For the complete estimate, open the secure portal.
            </div>
          </div>
        </td>
      </tr>
      ` : ''}

      <!-- Contract note -->
      <tr>
        <td class="p-24" style="padding-top:0;">
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;cursor:pointer;background:#f9fafb;" onclick="window.open('${data.contract_url}', '_blank')">
            <div style="font-weight:600;display:flex;align-items:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              ${data.contract_title}
            </div>
            <div style="font-size:13px;color:#374151;margin-top:6px;">
              By paying the deposit, you agree to the attached ${data.contract_name}, including payment terms and warranties under ${data.jurisdiction} law.
            </div>
            <div style="margin-top:8px;">
              <a href="${data.contract_url}" target="_blank" rel="noopener" style="color:#1f6feb;text-decoration:none;">View Full Contract →</a>
            </div>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="p-24">
          <div class="muted" style="font-size:12px;text-align:center;">
            Questions? Reply to this email or contact ${data.company_phone} • ${data.company_email}<br>
            ${data.company_name} — ${data.company_address}
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}