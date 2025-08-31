import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReviewRequestData {
  to: string;
  customerName: string;
  reviewLinks: {
    google?: string;
    facebook?: string;
    yelp?: string;
    custom?: string;
    customName?: string;
  };
  customMessage?: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, customerName, reviewLinks, customMessage, requestId }: ReviewRequestData = await req.json();

    // Build review links HTML
    let reviewLinksHtml = '';
    if (reviewLinks.google) {
      reviewLinksHtml += `
        <a href="${reviewLinks.google}" style="display: inline-block; margin: 10px; padding: 12px 24px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 6px;">
          Review on Google
        </a>
      `;
    }
    if (reviewLinks.facebook) {
      reviewLinksHtml += `
        <a href="${reviewLinks.facebook}" style="display: inline-block; margin: 10px; padding: 12px 24px; background-color: #1877F2; color: white; text-decoration: none; border-radius: 6px;">
          Review on Facebook
        </a>
      `;
    }
    if (reviewLinks.yelp) {
      reviewLinksHtml += `
        <a href="${reviewLinks.yelp}" style="display: inline-block; margin: 10px; padding: 12px 24px; background-color: #FF1A1A; color: white; text-decoration: none; border-radius: 6px;">
          Review on Yelp
        </a>
      `;
    }
    if (reviewLinks.custom && reviewLinks.customName) {
      reviewLinksHtml += `
        <a href="${reviewLinks.custom}" style="display: inline-block; margin: 10px; padding: 12px 24px; background-color: #6B7280; color: white; text-decoration: none; border-radius: 6px;">
          Review on ${reviewLinks.customName}
        </a>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Reviews <onboarding@resend.dev>",
      to: [to],
      subject: "We'd love your feedback!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${customerName},</h2>
          
          <p>Thank you for choosing us for your recent project! We hope you're satisfied with our work.</p>
          
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          
          <p>Your feedback is incredibly valuable to us. If you have a moment, we'd greatly appreciate if you could share your experience by leaving a review on one of these platforms:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            ${reviewLinksHtml}
          </div>
          
          <p>Your review helps other customers make informed decisions and helps us improve our services.</p>
          
          <p>Thank you for your time and for trusting us with your project!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
          
          <p style="font-size: 12px; color: #666;">
            If you'd prefer not to receive review requests in the future, please let us know.
          </p>
        </div>
      `,
    });

    console.log("Review request email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-review-request function:", error);
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