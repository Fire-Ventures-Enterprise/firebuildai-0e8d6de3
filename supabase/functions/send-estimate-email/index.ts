import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { render as renderEmail } from "npm:@react-email/render@0.0.17";
import BrandedEstimateEmail from "./BrandedEstimateEmail.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

interface SendEstimateRequest {
  estimateId: string;
  action?: "created" | "reminder" | "expiring";
}

// React Email Component
function EstimateEmail({ company, client, estimate, portalUrl, depositUrl, items = [] }: any) {
  const preview = `Estimate ${estimate.number} — Deposit ${estimate.deposit} to approve`;

  const safeItems = items.slice(0, 5).map((i: any, idx: number) => {
    const first = (i.title ?? ((i.description ?? "").split(/\r?\n/)[0] || `Item ${idx + 1}`)).trim();
    const rest = (i.description ?? "");
    const details = rest.startsWith(first) ? rest.slice(first.length).trim() : rest;
    return { ...i, title: first, details };
  });

  return React.createElement(Html, {},
    React.createElement(Head, {}),
    React.createElement(Preview, {}, preview),
    React.createElement(Tailwind, {},
      React.createElement(Body, { className: "bg-[#f6f7fb] text-[#111827] m-0 p-0" },
        React.createElement(Container, { className: "mx-auto my-6 w-full max-w-[640px] bg-white rounded-lg overflow-hidden" },
          // Header
          React.createElement(Section, { className: "bg-[#111827] text-white p-6" },
            React.createElement(Row, {},
              React.createElement(Column, {},
                company.logoUrl ? 
                  React.createElement(Img, { src: company.logoUrl, width: "120", alt: company.name }) :
                  React.createElement(Heading, { as: "h2", className: "text-white m-0 text-xl" }, company.name)
              ),
              React.createElement(Column, { align: "right" },
                React.createElement("span", { className: "inline-block rounded-full bg-[#dbeafe] text-[#1e3a8a] text-xs px-2 py-1" }, "Estimate")
              )
            )
          ),
          // Title
          React.createElement(Section, { className: "p-6" },
            React.createElement(Heading, { as: "h1", className: "text-[22px] leading-7 m-0" }, `Estimate ${estimate.number}`),
            React.createElement(Text, { className: "text-[#6b7280] m-0 mt-1" }, "Please review and approve by paying the deposit.")
          ),
          // Parties
          React.createElement(Section, { className: "px-6 -mt-3" },
            React.createElement(Row, {},
              React.createElement(Column, {},
                React.createElement(Text, { className: "text-xs text-[#6b7280] m-0" }, "From"),
                React.createElement(Text, { className: "m-0 font-semibold" }, company.name),
                company.address && React.createElement(Text, { className: "m-0 text-sm" }, company.address),
                company.phone && React.createElement(Text, { className: "m-0 text-sm" }, company.phone),
                company.email && React.createElement(Text, { className: "m-0 text-sm" }, company.email)
              ),
              React.createElement(Column, { align: "right" },
                React.createElement(Text, { className: "text-xs text-[#6b7280] m-0" }, "Bill To"),
                React.createElement(Text, { className: "m-0 font-semibold" }, client.name),
                client.email && React.createElement(Text, { className: "m-0 text-sm" }, client.email),
                estimate.serviceAddress && React.createElement(React.Fragment, {},
                  React.createElement(Text, { className: "text-xs text-[#6b7280] m-0 mt-2" }, "Service Address"),
                  React.createElement(Text, { className: "m-0 text-sm" }, estimate.serviceAddress)
                )
              )
            )
          ),
          // Dates
          React.createElement(Section, { className: "px-6 -mt-3" },
            React.createElement(Row, {},
              React.createElement(Column, {},
                React.createElement(Text, { className: "text-xs text-[#6b7280] m-0" }, "Issue Date"),
                React.createElement(Text, { className: "m-0 font-semibold" }, estimate.issueDate)
              ),
              React.createElement(Column, { align: "right" },
                React.createElement(Text, { className: "text-xs text-[#6b7280] m-0" }, "Expiration Date"),
                React.createElement(Text, { className: "m-0 font-semibold" }, estimate.expiryDate ?? "—")
              )
            )
          ),
          // Totals
          React.createElement(Section, { className: "px-6" },
            React.createElement("table", { width: "100%" },
              React.createElement("tbody", {},
                React.createElement("tr", {},
                  React.createElement("td", { className: "py-1 text-[#6b7280] text-sm" }, "Subtotal"),
                  React.createElement("td", { className: "py-1 text-right text-sm" }, estimate.subtotal)
                ),
                React.createElement("tr", {},
                  React.createElement("td", { className: "py-1 text-[#6b7280] text-sm" }, "Tax"),
                  React.createElement("td", { className: "py-1 text-right text-sm" }, estimate.tax)
                ),
                React.createElement("tr", {},
                  React.createElement("td", { className: "py-1 font-semibold" }, "Total"),
                  React.createElement("td", { className: "py-1 text-right font-semibold" }, estimate.total)
                ),
                React.createElement("tr", {},
                  React.createElement("td", { className: "py-1 text-[#2563eb]" }, "Deposit Required"),
                  React.createElement("td", { className: "py-1 text-right font-semibold text-[#2563eb]" }, estimate.deposit)
                )
              )
            )
          ),
          // Actions
          React.createElement(Section, { className: "px-6 -mt-2" },
            React.createElement(Row, {},
              React.createElement(Column, {},
                React.createElement(Button, {
                  href: depositUrl,
                  className: "bg-[#1f6feb] text-white font-semibold rounded-md px-5 py-3"
                }, "Pay Deposit")
              ),
              React.createElement(Column, { align: "right" },
                React.createElement(Button, {
                  href: portalUrl,
                  className: "bg-[#e5e7eb] text-[#111827] font-semibold rounded-md px-5 py-3"
                }, "View Details")
              )
            )
          ),
          // Contract
          (estimate.contractTitle || estimate.contractUrl) && React.createElement(React.Fragment, {},
            React.createElement(Hr, { className: "mx-6 border-[#e5e7eb]" }),
            React.createElement(Section, { className: "px-6 pb-6" },
              React.createElement(Heading, { as: "h3", className: "text-base m-0" }, estimate.contractTitle ?? "Service Agreement"),
              React.createElement(Text, { className: "text-sm text-[#374151] m-0 mt-1" }, 
                "By paying the deposit, you agree to the Service Agreement including payment terms and warranties."
              ),
              estimate.contractUrl && React.createElement(Text, { className: "m-0 mt-2" },
                React.createElement(Link, { href: estimate.contractUrl }, "View Full Contract →")
              )
            )
          ),
          // Footer
          React.createElement(Hr, { className: "mx-6 border-[#e5e7eb]" }),
          React.createElement(Section, { className: "p-6 pt-3" },
            React.createElement(Text, { className: "text-center text-xs text-[#6b7280] m-0" },
              `Questions? Reply to this email or contact ${company.phone ?? ""} • ${company.email ?? ""}`,
              React.createElement("br", {}),
              `${company.name} — ${company.address ?? ""}`
            )
          )
        )
      )
    )
  );
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
        style: 'currency',
        currency: 'USD',
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
    
    // Generate URLs with UTM tracking
    const landingUrl = `${siteUrl}/open/estimate/${estimate.public_token}?utm_source=email&utm_medium=estimate&utm_campaign=${encodeURIComponent(estimate.estimate_number)}`;
    const portalUrl = `${siteUrl}/portal/estimate/${estimate.public_token}?utm_source=email&utm_medium=estimate`;
    const payUrl = `${siteUrl}/api/process-deposit?estimate_token=${estimate.public_token}&return_url=${encodeURIComponent(portalUrl)}`;
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

    // Company info with defaults
    const companyName = profile?.company_name || "Your Company";
    const companyEmail = user?.email || "info@company.com";
    const companyPhone = profile?.phone || "(555) 123-4567";
    const companyAddress = profile?.address || "123 Main St, City, ST 12345";

    // Prepare branded email props
    const brandedEmailProps = {
      company: {
        name: companyName,
        logoUrl: `${siteUrl}/lovable-uploads/a384a2f8-9029-4efd-b9db-d6facfe2369c.png`,
        siteUrl: siteUrl,
        address: companyAddress,
        phone: companyPhone,
        email: companyEmail
      },
      client: {
        name: estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`,
        email: estimate.customer?.email
      },
      estimate: {
        number: estimate.estimate_number,
        issueDate: formatDate(estimate.issue_date),
        expiryDate: estimate.expiration_date ? formatDate(estimate.expiration_date) : undefined,
        subtotal: formatCurrency(estimate.subtotal),
        tax: formatCurrency(estimate.tax_amount),
        total: formatCurrency(estimate.total),
        deposit: formatCurrency(estimate.deposit_amount || 0),
        serviceAddress: estimate.service_address || estimate.customer?.address
      },
      landUrl: landingUrl,
      portalUrl: portalUrl,
      payUrl: payUrl,
      items: estimate.items?.slice(0, 5).map((item: any, idx: number) => {
        const title = item.description?.split('\n')[0] || `Item ${idx + 1}`;
        const details = item.description?.replace(title, '').trim();
        return {
          title,
          qty: item.quantity || 1,
          unit: formatCurrency(item.rate || 0),
          amount: formatCurrency(item.amount || 0),
          details: details || undefined
        };
      }) || []
    };

    // Render HTML and plain text
    const html = renderEmail(React.createElement(BrandedEstimateEmail, brandedEmailProps), { pretty: true });
    
    const plainText = `Estimate ${brandedEmailProps.estimate.number}

Total: ${brandedEmailProps.estimate.total}
Deposit required to approve: ${brandedEmailProps.estimate.deposit}

Pay deposit: ${payUrl}
View details: ${landingUrl}

Issue date: ${brandedEmailProps.estimate.issueDate}
Expires: ${brandedEmailProps.estimate.expiryDate ?? "-"}

${companyName} • ${siteUrl}`;

    // Email subject based on action
    const subjects = {
      created: `Your Estimate ${estimate.estimate_number} — Deposit ${formatCurrency(estimate.deposit_amount || 0)} to approve`,
      reminder: `Reminder: Estimate ${estimate.estimate_number} awaiting approval`,
      expiring: `Estimate ${estimate.estimate_number} expires soon — Secure your booking`
    };

    // Send email with verified domain
    const fromEmail = `${companyName} <estimates@firebuildai.com>`;
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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