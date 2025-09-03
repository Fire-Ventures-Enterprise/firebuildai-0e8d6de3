import { Resend } from "npm:resend@2.0.0";

interface EmailOptions {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
  headers?: Record<string, string>;
}

interface SendResult {
  id: string;
  provider: string;
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Normalize email addresses
export function normalizeEmail(email: string | string[]): string[] {
  if (Array.isArray(email)) {
    return email.map(e => e.trim().toLowerCase()).filter(validateEmail);
  }
  return [email.trim().toLowerCase()].filter(validateEmail);
}

// Send via Resend
export async function sendViaProvider(options: EmailOptions): Promise<SendResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  
  // Get from addresses from env
  const fromAddress = options.subject.toLowerCase().includes('invoice') || 
                     options.subject.toLowerCase().includes('payment') ||
                     options.subject.toLowerCase().includes('receipt')
    ? Deno.env.get("EMAIL_FROM_BILLING") || "billing@firebuildai.com"
    : Deno.env.get("EMAIL_FROM") || "no-reply@firebuildai.com";

  const replyTo = options.replyTo || Deno.env.get("EMAIL_REPLY_TO") || "support@firebuildai.com";

  try {
    const result = await resend.emails.send({
      from: `FireBuild.ai <${fromAddress}>`,
      to: normalizeEmail(options.to),
      cc: options.cc ? normalizeEmail(options.cc) : undefined,
      bcc: options.bcc ? normalizeEmail(options.bcc) : undefined,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: replyTo,
      attachments: options.attachments,
      headers: {
        ...options.headers,
        'X-Entity-Ref-ID': crypto.randomUUID(), // For tracking
      }
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to send email");
    }

    return {
      id: result.data?.id || crypto.randomUUID(),
      provider: 'resend'
    };
  } catch (error: any) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Retry logic with exponential backoff
export async function sendWithRetry(
  options: EmailOptions,
  maxRetries: number = 3
): Promise<SendResult> {
  let lastError: Error | null = null;
  const delays = [30000, 120000, 600000]; // 30s, 2m, 10m

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await sendViaProvider(options);
    } catch (error: any) {
      lastError = error;
      console.error(`Email send attempt ${attempt + 1} failed:`, error.message);

      if (attempt < maxRetries) {
        const delay = delays[attempt] || 600000;
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Failed to send email after retries");
}