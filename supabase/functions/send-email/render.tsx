import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.27";
import { 
  EstimateEmail, 
  InvoiceEmail, 
  POEmail, 
  PaymentReceiptEmail,
  ReminderEmail,
  EstimateEmailProps,
  InvoiceEmailProps,
  POEmailProps,
  PaymentReceiptProps,
  ReminderEmailProps
} from "./templates.tsx";

export interface RenderResult {
  html: string;
  text: string;
}

// Convert HTML to plain text (basic conversion)
function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gs, '') // Remove style tags
    .replace(/<script[^>]*>.*?<\/script>/gs, '') // Remove script tags
    .replace(/<[^>]+>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
}

// Render email template
export async function renderEmail(template: string, payload: any): Promise<RenderResult> {
  let component: React.ReactElement;
  
  // Get base URLs from environment
  const appUrl = Deno.env.get("BASE_URL_APP") || "https://app.firebuildai.com";
  const siteUrl = Deno.env.get("BASE_URL_SITE") || "https://firebuildai.com";
  
  switch (template) {
    case 'estimate': {
      const props: EstimateEmailProps = {
        company: payload.company || {
          name: payload.companyName || "FireBuild.ai",
          logoUrl: payload.logoUrl,
          siteUrl: siteUrl,
          phone: payload.companyPhone,
          email: payload.companyEmail,
          address: payload.companyAddress
        },
        customer: {
          name: payload.customerName,
          email: payload.customerEmail
        },
        estimate: {
          number: payload.estimateNumber,
          issueDate: formatDate(payload.issueDate),
          expiryDate: payload.expiryDate ? formatDate(payload.expiryDate) : undefined,
          subtotal: formatCurrency(payload.subtotal),
          tax: formatCurrency(payload.tax),
          total: formatCurrency(payload.total),
          deposit: formatCurrency(payload.deposit),
          serviceAddress: payload.serviceAddress
        },
        portalUrl: `${appUrl}/portal/estimate/${payload.token}`,
        acceptUrl: `${appUrl}/portal/estimate/${payload.token}?action=accept`,
        pdfUrl: payload.pdfUrl,
        customMessage: payload.customMessage
      };
      component = React.createElement(EstimateEmail, props);
      break;
    }
    
    case 'invoice': {
      const props: InvoiceEmailProps = {
        company: payload.company || {
          name: payload.companyName || "FireBuild.ai",
          logoUrl: payload.logoUrl,
          siteUrl: siteUrl,
          phone: payload.companyPhone,
          email: payload.companyEmail,
          address: payload.companyAddress
        },
        customer: {
          name: payload.customerName,
          email: payload.customerEmail
        },
        invoice: {
          number: payload.invoiceNumber,
          issueDate: formatDate(payload.issueDate),
          dueDate: payload.dueDate ? formatDate(payload.dueDate) : undefined,
          subtotal: formatCurrency(payload.subtotal),
          tax: formatCurrency(payload.tax),
          total: formatCurrency(payload.total),
          balance: formatCurrency(payload.balance),
          serviceAddress: payload.serviceAddress
        },
        portalUrl: `${appUrl}/portal/invoice/${payload.token}`,
        payUrl: `${appUrl}/portal/invoice/${payload.token}?action=pay`,
        pdfUrl: payload.pdfUrl,
        customMessage: payload.customMessage,
        qrPayEnabled: payload.qrPayEnabled
      };
      component = React.createElement(InvoiceEmail, props);
      break;
    }
    
    case 'po': {
      const props: POEmailProps = {
        company: payload.company || {
          name: payload.companyName || "FireBuild.ai",
          logoUrl: payload.logoUrl,
          siteUrl: siteUrl,
          phone: payload.companyPhone,
          email: payload.companyEmail,
          address: payload.companyAddress
        },
        vendor: {
          name: payload.vendorName,
          email: payload.vendorEmail
        },
        po: {
          number: payload.poNumber,
          issueDate: formatDate(payload.issueDate),
          dueDate: payload.dueDate ? formatDate(payload.dueDate) : undefined,
          subtotal: formatCurrency(payload.subtotal),
          tax: formatCurrency(payload.tax),
          total: formatCurrency(payload.total),
          notes: payload.notes
        },
        portalUrl: `${appUrl}/po/${payload.token}`,
        pdfUrl: payload.pdfUrl,
        customMessage: payload.customMessage
      };
      component = React.createElement(POEmail, props);
      break;
    }
    
    case 'receipt': {
      const props: PaymentReceiptProps = {
        company: payload.company || {
          name: payload.companyName || "FireBuild.ai",
          logoUrl: payload.logoUrl,
          siteUrl: siteUrl,
          phone: payload.companyPhone,
          email: payload.companyEmail,
          address: payload.companyAddress
        },
        customer: {
          name: payload.customerName,
          email: payload.customerEmail
        },
        payment: {
          invoiceNumber: payload.invoiceNumber,
          amount: formatCurrency(payload.amount),
          method: payload.method,
          date: formatDate(payload.date),
          transactionId: payload.transactionId,
          remainingBalance: payload.remainingBalance ? formatCurrency(payload.remainingBalance) : undefined
        },
        portalUrl: `${appUrl}/portal/invoice/${payload.token}`
      };
      component = React.createElement(PaymentReceiptEmail, props);
      break;
    }
    
    case 'reminder': {
      const props: ReminderEmailProps = {
        company: payload.company || {
          name: payload.companyName || "FireBuild.ai",
          logoUrl: payload.logoUrl,
          siteUrl: siteUrl,
          phone: payload.companyPhone,
          email: payload.companyEmail,
          address: payload.companyAddress
        },
        customer: {
          name: payload.customerName,
          email: payload.customerEmail
        },
        type: payload.reminderType,
        document: {
          number: payload.documentNumber,
          dueDate: payload.dueDate ? formatDate(payload.dueDate) : undefined,
          expiryDate: payload.expiryDate ? formatDate(payload.expiryDate) : undefined,
          amount: formatCurrency(payload.amount),
          daysUntil: payload.daysUntil,
          daysOverdue: payload.daysOverdue
        },
        portalUrl: payload.reminderType.includes('estimate') 
          ? `${appUrl}/portal/estimate/${payload.token}`
          : `${appUrl}/portal/invoice/${payload.token}`,
        actionUrl: payload.reminderType.includes('estimate')
          ? `${appUrl}/portal/estimate/${payload.token}?action=accept`
          : `${appUrl}/portal/invoice/${payload.token}?action=pay`
      };
      component = React.createElement(ReminderEmail, props);
      break;
    }
    
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
  
  // Render to HTML
  const html = await renderAsync(component);
  
  // Generate plain text version
  const text = generatePlainText(template, payload);
  
  return { html, text };
}

// Generate plain text versions
function generatePlainText(template: string, payload: any): string {
  const appUrl = Deno.env.get("BASE_URL_APP") || "https://app.firebuildai.com";
  
  switch (template) {
    case 'estimate':
      return `
Estimate ${payload.estimateNumber}

Hi ${payload.customerName},

Your estimate is ready for review. You can approve it by paying the required deposit.

Issue Date: ${formatDate(payload.issueDate)}
${payload.expiryDate ? `Valid Until: ${formatDate(payload.expiryDate)}` : ''}
${payload.serviceAddress ? `Service Address: ${payload.serviceAddress}` : ''}

Subtotal: ${formatCurrency(payload.subtotal)}
Tax: ${formatCurrency(payload.tax)}
Total: ${formatCurrency(payload.total)}
Deposit Required: ${formatCurrency(payload.deposit)}

View Estimate: ${appUrl}/portal/estimate/${payload.token}
Accept & Pay: ${appUrl}/portal/estimate/${payload.token}?action=accept

${payload.customMessage || ''}

Questions? Reply to this email or call us.

${payload.companyName || 'FireBuild.ai'}
${payload.companyPhone || ''}
${payload.companyEmail || ''}
      `.trim();
      
    case 'invoice':
      return `
Invoice ${payload.invoiceNumber}

Hi ${payload.customerName},

Your invoice is ready. Please review and submit payment by the due date.

Issue Date: ${formatDate(payload.issueDate)}
${payload.dueDate ? `Due Date: ${formatDate(payload.dueDate)}` : 'Due on Receipt'}
${payload.serviceAddress ? `Service Address: ${payload.serviceAddress}` : ''}

Subtotal: ${formatCurrency(payload.subtotal)}
Tax: ${formatCurrency(payload.tax)}
Total: ${formatCurrency(payload.total)}
Balance Due: ${formatCurrency(payload.balance)}

View Invoice: ${appUrl}/portal/invoice/${payload.token}
Pay Now: ${appUrl}/portal/invoice/${payload.token}?action=pay

${payload.customMessage || ''}

Questions? Reply to this email or call us.

${payload.companyName || 'FireBuild.ai'}
${payload.companyPhone || ''}
${payload.companyEmail || ''}
      `.trim();
      
    case 'po':
      return `
Purchase Order ${payload.poNumber}

Hi ${payload.vendorName},

We're sending you this purchase order for the requested items/services. Please review and confirm receipt.

PO Number: ${payload.poNumber}
Issue Date: ${formatDate(payload.issueDate)}
${payload.dueDate ? `Required By: ${formatDate(payload.dueDate)}` : ''}

Subtotal: ${formatCurrency(payload.subtotal)}
Tax: ${formatCurrency(payload.tax)}
Total: ${formatCurrency(payload.total)}

${payload.notes ? `Notes: ${payload.notes}` : ''}

View Purchase Order: ${appUrl}/po/${payload.token}

${payload.customMessage || ''}

${payload.companyName || 'FireBuild.ai'}
${payload.companyPhone || ''}
${payload.companyEmail || ''}
      `.trim();
      
    case 'receipt':
      return `
Payment Received!

Hi ${payload.customerName},

Thank you for your payment. This email confirms that we've received your payment for Invoice ${payload.invoiceNumber}.

Invoice Number: ${payload.invoiceNumber}
Amount Paid: ${formatCurrency(payload.amount)}
Payment Method: ${payload.method}
Date: ${formatDate(payload.date)}
${payload.transactionId ? `Transaction ID: ${payload.transactionId}` : ''}
${payload.remainingBalance && payload.remainingBalance > 0 ? `Remaining Balance: ${formatCurrency(payload.remainingBalance)}` : ''}

View Invoice: ${appUrl}/portal/invoice/${payload.token}

Please keep this receipt for your records.

${payload.companyName || 'FireBuild.ai'}
${payload.companyPhone || ''}
${payload.companyEmail || ''}
      `.trim();
      
    case 'reminder':
      const isEstimate = payload.reminderType.includes('estimate');
      const urgency = payload.reminderType.includes('overdue') ? 'URGENT: ' : '';
      return `
${urgency}${isEstimate ? 'Estimate' : 'Invoice'} ${payload.documentNumber}

Hi ${payload.customerName},

${payload.reminderType === 'estimate_expiring' 
  ? `Your estimate ${payload.documentNumber} will expire in ${payload.daysUntil} days. Please review and accept it before ${formatDate(payload.expiryDate)} to secure these rates.`
  : payload.reminderType === 'invoice_due'
  ? `Invoice ${payload.documentNumber} for ${formatCurrency(payload.amount)} is due in ${payload.daysUntil} days (${formatDate(payload.dueDate)}). Please submit payment to avoid late fees.`
  : `Invoice ${payload.documentNumber} for ${formatCurrency(payload.amount)} is now ${payload.daysOverdue} days overdue. Please submit payment immediately to avoid service interruption.`
}

View Details: ${appUrl}/portal/${isEstimate ? 'estimate' : 'invoice'}/${payload.token}
${isEstimate ? 'Accept' : 'Pay'} Now: ${appUrl}/portal/${isEstimate ? 'estimate' : 'invoice'}/${payload.token}?action=${isEstimate ? 'accept' : 'pay'}

Questions? Reply to this email or call us.

${payload.companyName || 'FireBuild.ai'}
${payload.companyPhone || ''}
${payload.companyEmail || ''}
      `.trim();
      
    default:
      return 'Email content not available in plain text.';
  }
}