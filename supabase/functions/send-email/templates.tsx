import {
  Body, Button, Column, Container, Head, Heading, Hr, Html,
  Img, Link, Preview, Row, Section, Tailwind, Text
} from "npm:@react-email/components@0.0.27";
import * as React from "npm:react@18.3.1";

// Shared layout component
interface LayoutProps {
  preview: string;
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  children: React.ReactNode;
}

export function EmailLayout({ preview, company, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-900 m-0 p-0">
          <Container className="mx-auto my-6 w-full max-w-[680px] bg-white rounded-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <Section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <Row>
                <Column>
                  {company.logoUrl ? (
                    <Img src={company.logoUrl} alt={company.name} width="140" height="40" style={{ maxHeight: "40px", objectFit: "contain" }} />
                  ) : (
                    <Heading as="h2" className="text-xl m-0 text-white">{company.name}</Heading>
                  )}
                </Column>
              </Row>
            </Section>

            {/* Content */}
            {children}

            {/* Footer */}
            <Hr className="border-gray-200 my-0" />
            <Section className="px-6 py-4 bg-gray-50">
              <Text className="text-center text-xs text-gray-600 m-0">
                {company.phone && <span>{company.phone} • </span>}
                {company.email && <span>{company.email} • </span>}
                <Link href={company.siteUrl} className="text-blue-600">{company.siteUrl}</Link>
                {company.address && <><br/>{company.address}</>}
              </Text>
              <Text className="text-center text-xs text-gray-500 mt-2">
                © {new Date().getFullYear()} {company.name}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// Estimate Email Template
export interface EstimateEmailProps {
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  customer: {
    name: string;
    email?: string;
  };
  estimate: {
    number: string;
    issueDate: string;
    expiryDate?: string;
    subtotal: string;
    tax: string;
    total: string;
    deposit: string;
    serviceAddress?: string;
  };
  portalUrl: string;
  acceptUrl: string;
  pdfUrl?: string;
  customMessage?: string;
}

export function EstimateEmail(props: EstimateEmailProps) {
  const { company, customer, estimate, portalUrl, acceptUrl, pdfUrl, customMessage } = props;
  const preview = `Estimate ${estimate.number} - Deposit ${estimate.deposit} to approve`;

  return (
    <EmailLayout preview={preview} company={company}>
      <Section className="px-6 py-6">
        <Heading as="h1" className="text-2xl m-0 mb-4">Estimate {estimate.number}</Heading>
        <Text className="text-gray-700 m-0 mb-4">
          Hi {customer.name},
        </Text>
        {customMessage ? (
          <Text className="text-gray-700 m-0 mb-4">{customMessage}</Text>
        ) : (
          <Text className="text-gray-700 m-0 mb-4">
            Your estimate is ready for review. You can approve it by paying the required deposit.
          </Text>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="text-sm text-gray-600 py-1">Issue Date:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{estimate.issueDate}</td>
              </tr>
              {estimate.expiryDate && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Valid Until:</td>
                  <td className="text-sm text-gray-900 py-1 text-right">{estimate.expiryDate}</td>
                </tr>
              )}
              {estimate.serviceAddress && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Service Address:</td>
                  <td className="text-sm text-gray-900 py-1 text-right">{estimate.serviceAddress}</td>
                </tr>
              )}
              <tr><td colSpan={2}><Hr className="my-2 border-gray-200" /></td></tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Subtotal:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{estimate.subtotal}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Tax:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{estimate.tax}</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-gray-900 py-1">Total:</td>
                <td className="text-sm font-semibold text-gray-900 py-1 text-right">{estimate.total}</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-blue-600 py-1">Deposit Required:</td>
                <td className="text-sm font-semibold text-blue-600 py-1 text-right">{estimate.deposit}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Column align="center">
            <Button
              href={portalUrl}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              View Estimate
            </Button>
          </Column>
          <Column align="center">
            <Button
              href={acceptUrl}
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              Accept & Pay Deposit
            </Button>
          </Column>
          {pdfUrl && (
            <Column align="center">
              <Button
                href={pdfUrl}
                className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
              >
                Download PDF
              </Button>
            </Column>
          )}
        </Row>

        <Text className="text-xs text-gray-500 text-center">
          Having trouble with the buttons? Copy and paste this link into your browser:<br/>
          <Link href={portalUrl} className="text-blue-600">{portalUrl}</Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Invoice Email Template
export interface InvoiceEmailProps {
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  customer: {
    name: string;
    email?: string;
  };
  invoice: {
    number: string;
    issueDate: string;
    dueDate?: string;
    subtotal: string;
    tax: string;
    total: string;
    balance: string;
    serviceAddress?: string;
  };
  portalUrl: string;
  payUrl: string;
  pdfUrl?: string;
  customMessage?: string;
  qrPayEnabled?: boolean;
}

export function InvoiceEmail(props: InvoiceEmailProps) {
  const { company, customer, invoice, portalUrl, payUrl, pdfUrl, customMessage, qrPayEnabled } = props;
  const preview = `Invoice ${invoice.number} - Due ${invoice.dueDate || 'on receipt'}`;

  return (
    <EmailLayout preview={preview} company={company}>
      <Section className="px-6 py-6">
        <Heading as="h1" className="text-2xl m-0 mb-4">Invoice {invoice.number}</Heading>
        <Text className="text-gray-700 m-0 mb-4">
          Hi {customer.name},
        </Text>
        {customMessage ? (
          <Text className="text-gray-700 m-0 mb-4">{customMessage}</Text>
        ) : (
          <Text className="text-gray-700 m-0 mb-4">
            Your invoice is ready. Please review and submit payment by the due date.
          </Text>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="text-sm text-gray-600 py-1">Issue Date:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{invoice.issueDate}</td>
              </tr>
              {invoice.dueDate && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Due Date:</td>
                  <td className="text-sm text-gray-900 py-1 text-right font-semibold">{invoice.dueDate}</td>
                </tr>
              )}
              {invoice.serviceAddress && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Service Address:</td>
                  <td className="text-sm text-gray-900 py-1 text-right">{invoice.serviceAddress}</td>
                </tr>
              )}
              <tr><td colSpan={2}><Hr className="my-2 border-gray-200" /></td></tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Subtotal:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{invoice.subtotal}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Tax:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{invoice.tax}</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-gray-900 py-1">Total:</td>
                <td className="text-sm font-semibold text-gray-900 py-1 text-right">{invoice.total}</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-red-600 py-1">Balance Due:</td>
                <td className="text-sm font-semibold text-red-600 py-1 text-right">{invoice.balance}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {qrPayEnabled && (
          <Text className="text-sm text-gray-600 text-center mb-4">
            💡 Tip: You can also pay instantly by scanning the QR code on the invoice portal
          </Text>
        )}

        {/* Action Buttons */}
        <Row className="mb-4">
          <Column align="center">
            <Button
              href={portalUrl}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              View Invoice
            </Button>
          </Column>
          <Column align="center">
            <Button
              href={payUrl}
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              Pay Now
            </Button>
          </Column>
          {pdfUrl && (
            <Column align="center">
              <Button
                href={pdfUrl}
                className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
              >
                Download PDF
              </Button>
            </Column>
          )}
        </Row>

        <Text className="text-xs text-gray-500 text-center">
          Having trouble with the buttons? Copy and paste this link into your browser:<br/>
          <Link href={portalUrl} className="text-blue-600">{portalUrl}</Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}

// PO Email Template
export interface POEmailProps {
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  vendor: {
    name: string;
    email?: string;
  };
  po: {
    number: string;
    issueDate: string;
    dueDate?: string;
    subtotal: string;
    tax: string;
    total: string;
    notes?: string;
  };
  portalUrl: string;
  pdfUrl?: string;
  customMessage?: string;
}

export function POEmail(props: POEmailProps) {
  const { company, vendor, po, portalUrl, pdfUrl, customMessage } = props;
  const preview = `Purchase Order ${po.number} from ${company.name}`;

  return (
    <EmailLayout preview={preview} company={company}>
      <Section className="px-6 py-6">
        <Heading as="h1" className="text-2xl m-0 mb-4">Purchase Order {po.number}</Heading>
        <Text className="text-gray-700 m-0 mb-4">
          Hi {vendor.name},
        </Text>
        {customMessage ? (
          <Text className="text-gray-700 m-0 mb-4">{customMessage}</Text>
        ) : (
          <Text className="text-gray-700 m-0 mb-4">
            We're sending you this purchase order for the requested items/services. Please review and confirm receipt.
          </Text>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="text-sm text-gray-600 py-1">PO Number:</td>
                <td className="text-sm text-gray-900 py-1 text-right font-semibold">{po.number}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Issue Date:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{po.issueDate}</td>
              </tr>
              {po.dueDate && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Required By:</td>
                  <td className="text-sm text-gray-900 py-1 text-right">{po.dueDate}</td>
                </tr>
              )}
              <tr><td colSpan={2}><Hr className="my-2 border-gray-200" /></td></tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Subtotal:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{po.subtotal}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Tax:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{po.tax}</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-gray-900 py-1">Total:</td>
                <td className="text-sm font-semibold text-gray-900 py-1 text-right">{po.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {po.notes && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <Text className="text-sm text-gray-700 m-0 font-semibold">Notes:</Text>
            <Text className="text-sm text-gray-700 m-0">{po.notes}</Text>
          </div>
        )}

        {/* Action Buttons */}
        <Row className="mb-4">
          <Column align="center">
            <Button
              href={portalUrl}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              View Purchase Order
            </Button>
          </Column>
          {pdfUrl && (
            <Column align="center">
              <Button
                href={pdfUrl}
                className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
              >
                Download PDF
              </Button>
            </Column>
          )}
        </Row>

        <Text className="text-xs text-gray-500 text-center">
          Having trouble with the buttons? Copy and paste this link into your browser:<br/>
          <Link href={portalUrl} className="text-blue-600">{portalUrl}</Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Payment Receipt Template
export interface PaymentReceiptProps {
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  customer: {
    name: string;
    email?: string;
  };
  payment: {
    invoiceNumber: string;
    amount: string;
    method: string;
    date: string;
    transactionId?: string;
    remainingBalance?: string;
  };
  portalUrl: string;
}

export function PaymentReceiptEmail(props: PaymentReceiptProps) {
  const { company, customer, payment, portalUrl } = props;
  const preview = `Payment received for Invoice ${payment.invoiceNumber}`;

  return (
    <EmailLayout preview={preview} company={company}>
      <Section className="px-6 py-6">
        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 rounded-full p-3 mb-3">
            <Text className="text-3xl m-0">✅</Text>
          </div>
          <Heading as="h1" className="text-2xl m-0">Payment Received!</Heading>
        </div>

        <Text className="text-gray-700 m-0 mb-4">
          Hi {customer.name},
        </Text>
        <Text className="text-gray-700 m-0 mb-4">
          Thank you for your payment. This email confirms that we've received your payment for Invoice {payment.invoiceNumber}.
        </Text>

        {/* Payment Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td className="text-sm text-gray-600 py-1">Invoice Number:</td>
                <td className="text-sm text-gray-900 py-1 text-right font-semibold">{payment.invoiceNumber}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Amount Paid:</td>
                <td className="text-sm text-green-600 py-1 text-right font-semibold">{payment.amount}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Payment Method:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{payment.method}</td>
              </tr>
              <tr>
                <td className="text-sm text-gray-600 py-1">Date:</td>
                <td className="text-sm text-gray-900 py-1 text-right">{payment.date}</td>
              </tr>
              {payment.transactionId && (
                <tr>
                  <td className="text-sm text-gray-600 py-1">Transaction ID:</td>
                  <td className="text-sm text-gray-900 py-1 text-right">{payment.transactionId}</td>
                </tr>
              )}
              {payment.remainingBalance && payment.remainingBalance !== "$0.00" && (
                <>
                  <tr><td colSpan={2}><Hr className="my-2 border-gray-200" /></td></tr>
                  <tr>
                    <td className="text-sm font-semibold text-orange-600 py-1">Remaining Balance:</td>
                    <td className="text-sm font-semibold text-orange-600 py-1 text-right">{payment.remainingBalance}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="text-center mb-4">
          <Button
            href={portalUrl}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
          >
            View Invoice Details
          </Button>
        </div>

        <Text className="text-sm text-gray-600 text-center">
          Please keep this receipt for your records.
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Reminder Email Template
export interface ReminderEmailProps {
  company: {
    name: string;
    logoUrl?: string;
    siteUrl: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  customer: {
    name: string;
    email?: string;
  };
  type: 'estimate_expiring' | 'invoice_due' | 'invoice_overdue';
  document: {
    number: string;
    dueDate?: string;
    expiryDate?: string;
    amount: string;
    daysUntil?: number;
    daysOverdue?: number;
  };
  portalUrl: string;
  actionUrl: string;
}

export function ReminderEmail(props: ReminderEmailProps) {
  const { company, customer, type, document, portalUrl, actionUrl } = props;
  
  let preview = '';
  let heading = '';
  let message = '';
  let buttonText = '';
  let urgencyClass = 'bg-yellow-50';
  
  switch (type) {
    case 'estimate_expiring':
      preview = `Reminder: Estimate ${document.number} expires soon`;
      heading = 'Estimate Expiring Soon';
      message = `Your estimate ${document.number} will expire in ${document.daysUntil} days. Please review and accept it before ${document.expiryDate} to secure these rates.`;
      buttonText = 'Review Estimate';
      urgencyClass = 'bg-yellow-50';
      break;
    case 'invoice_due':
      preview = `Reminder: Invoice ${document.number} due soon`;
      heading = 'Invoice Payment Due Soon';
      message = `Invoice ${document.number} for ${document.amount} is due in ${document.daysUntil} days (${document.dueDate}). Please submit payment to avoid late fees.`;
      buttonText = 'Pay Now';
      urgencyClass = 'bg-orange-50';
      break;
    case 'invoice_overdue':
      preview = `Urgent: Invoice ${document.number} is overdue`;
      heading = 'Invoice Payment Overdue';
      message = `Invoice ${document.number} for ${document.amount} is now ${document.daysOverdue} days overdue. Please submit payment immediately to avoid service interruption.`;
      buttonText = 'Pay Now';
      urgencyClass = 'bg-red-50';
      break;
  }

  return (
    <EmailLayout preview={preview} company={company}>
      <Section className="px-6 py-6">
        <div className={`${urgencyClass} rounded-lg p-4 mb-4`}>
          <Heading as="h1" className="text-xl m-0 mb-2">{heading}</Heading>
          <Text className="text-gray-700 m-0">
            Hi {customer.name},
          </Text>
          <Text className="text-gray-700 m-0">
            {message}
          </Text>
        </div>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Column align="center">
            <Button
              href={actionUrl}
              className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              {buttonText}
            </Button>
          </Column>
          <Column align="center">
            <Button
              href={portalUrl}
              className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              View Details
            </Button>
          </Column>
        </Row>

        <Text className="text-xs text-gray-500 text-center">
          Having trouble with the buttons? Copy and paste this link into your browser:<br/>
          <Link href={actionUrl} className="text-blue-600">{actionUrl}</Link>
        </Text>

        <Text className="text-sm text-gray-600 text-center mt-4">
          Questions? Reply to this email or call us at {company.phone}
        </Text>
      </Section>
    </EmailLayout>
  );
}