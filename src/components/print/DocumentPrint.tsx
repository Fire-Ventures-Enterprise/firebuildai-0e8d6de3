import React from "react";

/**
 * FireBuildAI — Print Templates (Invoice & Estimate)
 * TailwindCSS + print-first layout, clean and readable.
 *
 * Usage (example):
 * <InvoicePrint doc={sampleInvoice} />
 * <EstimatePrint doc={sampleEstimate} />
 */

// ---------------------------
// Types
// ---------------------------
export type OrgInfo = {
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type PartyInfo = {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
};

export type LineItem = {
  id: string;
  title: string; // short label
  description?: string; // long scope text (multiline)
  quantity: number;
  unit?: string; // hrs, pcs, etc
  rate: number; // unit price
  total: number; // computed
};

export type Money = { currency: "USD" | "CAD" | string; value: number };

export type BaseDoc = {
  kind: "INVOICE" | "ESTIMATE";
  number: string; // e.g. INV-00012 / EST-00012
  date: string; // ISO or pretty string
  dueDate?: string;
  statusLabel?: string; // Paid / Partial / Draft / Accepted etc.
  terms?: string; // footer terms & conditions
  notes?: string; // general notes
  org: OrgInfo;
  billTo: PartyInfo;
  items: LineItem[];
  subtotal: Money;
  discount?: Money; // optional
  tax?: Money; // optional
  total: Money;
  // Invoice-only payment summary
  paymentSummary?: {
    depositPaid?: Money;
    totalPaid?: Money;
    remainingDue?: Money;
  };
  // Signatures (optional)
  signatureLine?: boolean; // show signature area
};

// ---------------------------
// Utilities
// ---------------------------
const fmt = (m?: Money) =>
  typeof m === "object"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: m.currency || "USD",
      }).format(m.value || 0)
    : "-";

const fmtNum = (v: number) =>
  new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

// ---------------------------
// Shared Layout
// ---------------------------
const Title: React.FC<{ text: string }> = ({ text }) => (
  <h1 className="text-2xl font-semibold tracking-wide text-gray-900 text-center mt-2 mb-6 print:mt-0">
    {text}
  </h1>
);

const Divider: React.FC = () => <hr className="border-t border-gray-200 my-4" />;

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-700 mb-2">{children}</h3>
);

// ---------------------------
// Header Block
// ---------------------------
const HeaderBlock: React.FC<{ doc: BaseDoc }> = ({ doc }) => {
  const { org, billTo, number, date, dueDate, statusLabel } = doc;
  return (
    <header className="grid grid-cols-12 gap-6 items-start">
      {/* Left: Org */}
      <div className="col-span-6">
        <div className="flex items-start gap-3">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="h-10 w-auto object-contain" />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-200" />
          )}
          <div>
            <div className="text-base font-semibold text-gray-900">{org.name}</div>
            {org.address && <div className="text-xs text-gray-600 whitespace-pre-line">{org.address}</div>}
            {(org.phone || org.email) && (
              <div className="text-xs text-gray-600">
                {org.phone ? <span>{org.phone}</span> : null}
                {org.phone && org.email ? <span className="mx-1">•</span> : null}
                {org.email ? <span>{org.email}</span> : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Bill To + Meta */}
      <div className="col-span-6">
        <div className="flex justify-between">
          <div className="max-w-[60%]">
            <SectionHeading>Bill To</SectionHeading>
            <div className="text-sm font-medium text-gray-900">{billTo.name}</div>
            {billTo.address && <div className="text-xs text-gray-600 whitespace-pre-line">{billTo.address}</div>}
            {(billTo.phone || billTo.email) && (
              <div className="text-xs text-gray-600 mt-1">
                {billTo.phone ? <span>{billTo.phone}</span> : null}
                {billTo.phone && billTo.email ? <span className="mx-1">•</span> : null}
                {billTo.email ? <span>{billTo.email}</span> : null}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{doc.kind} #{number}</div>
            <div className="text-xs text-gray-600">Date: {date}</div>
            {dueDate && <div className="text-xs text-gray-600">Due: {dueDate}</div>}
            {statusLabel && (
              <div className="inline-block mt-1 text-[10px] px-2 py-1 rounded bg-gray-900 text-white print:bg-black">
                {statusLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ---------------------------
// Items Table
// ---------------------------
const ItemsTable: React.FC<{ items: LineItem[] }> = ({ items }) => (
  <table className="w-full text-sm align-top">
    <thead>
      <tr className="border-b border-gray-300">
        <th className="text-left py-2 pr-3 w-[64%] font-medium text-gray-700">Description</th>
        <th className="text-right py-2 px-3 w-[12%] font-medium text-gray-700">Rate</th>
        <th className="text-right py-2 px-3 w-[12%] font-medium text-gray-700">Qty</th>
        <th className="text-right py-2 pl-3 w-[12%] font-medium text-gray-700">Total</th>
      </tr>
    </thead>
    <tbody>
      {items.map((it) => (
        <tr key={it.id} className="border-b border-gray-200 break-inside-avoid">
          <td className="py-3 pr-3">
            <div className="font-medium text-gray-900">{it.title}</div>
            {it.description && (
              <div className="text-gray-700 whitespace-pre-line leading-relaxed mt-1">
                {it.description}
              </div>
            )}
          </td>
          <td className="py-3 px-3 text-right text-gray-900">{fmt({ currency: "USD", value: it.rate })}</td>
          <td className="py-3 px-3 text-right text-gray-900">
            {fmtNum(it.quantity)}{it.unit ? ` ${it.unit}` : ""}
          </td>
          <td className="py-3 pl-3 text-right font-medium text-gray-900">
            {fmt({ currency: "USD", value: it.total })}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ---------------------------
// Totals Block
// ---------------------------
const TotalsBlock: React.FC<{
  subtotal: Money;
  discount?: Money;
  tax?: Money;
  total: Money;
}> = ({ subtotal, discount, tax, total }) => (
  <div className="w-full grid grid-cols-2 gap-6 mt-4">
    <div />
    <div>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="py-1 text-gray-700">Subtotal</td>
            <td className="py-1 text-right text-gray-900">{fmt(subtotal)}</td>
          </tr>
          {discount && (
            <tr>
              <td className="py-1 text-gray-700">Discount</td>
              <td className="py-1 text-right text-gray-900">{fmt(discount)}</td>
            </tr>
          )}
          {tax && (
            <tr>
              <td className="py-1 text-gray-700">Tax</td>
              <td className="py-1 text-right text-gray-900">{fmt(tax)}</td>
            </tr>
          )}
          <tr className="border-t border-gray-300">
            <td className="py-2 font-semibold text-gray-900">Total</td>
            <td className="py-2 text-right font-semibold text-gray-900">{fmt(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// ---------------------------
// Payment Summary (Invoice-only)
// ---------------------------
const PaymentSummary: React.FC<{ summary?: BaseDoc["paymentSummary"] }> = ({ summary }) => {
  if (!summary) return null;
  const { depositPaid, totalPaid, remainingDue } = summary;
  return (
    <div className="mt-4 border border-gray-200 rounded p-3">
      <SectionHeading>Payment Summary</SectionHeading>
      <table className="w-full text-sm">
        <tbody>
          {depositPaid && (
            <tr>
              <td className="py-1 text-gray-700">Deposit Paid</td>
              <td className="py-1 text-right text-gray-900">{fmt(depositPaid)}</td>
            </tr>
          )}
          {totalPaid && (
            <tr>
              <td className="py-1 text-gray-700">Total Paid</td>
              <td className="py-1 text-right text-gray-900">{fmt(totalPaid)}</td>
            </tr>
          )}
          {remainingDue && (
            <tr className="border-t border-gray-200">
              <td className="py-2 font-medium text-gray-900">Remaining Balance</td>
              <td className="py-2 text-right font-semibold text-gray-900">{fmt(remainingDue)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ---------------------------
// Footer (Terms + Signature)
// ---------------------------
const Footer: React.FC<{ doc: BaseDoc }> = ({ doc }) => (
  <footer className="mt-6">
    {doc.notes && (
      <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed mb-3">{doc.notes}</div>
    )}
    {doc.terms && (
      <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{doc.terms}</div>
    )}
    {doc.signatureLine && (
      <div className="mt-10">
        <div className="h-[1px] bg-gray-300" />
        <div className="text-xs text-gray-600 mt-1">Signature</div>
      </div>
    )}
    <div className="text-center text-xs text-gray-500 mt-6">Thank you for your business.</div>
  </footer>
);

// ---------------------------
// Wrapper (Shared)
// ---------------------------
const Wrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="w-[840px] mx-auto bg-white text-gray-900 p-8 print:p-10 print:w-auto">
    <style>{`
      @page { size: A4; margin: 14mm; }
      @media print {
        html, body { background: #ffffff; }
        .page-break { page-break-after: always; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
      }
    `}</style>
    <Title text={title} />
    {children}
  </div>
);

// ---------------------------
// Public Components
// ---------------------------
export const DocumentPrint: React.FC<{ doc: BaseDoc }> = ({ doc }) => (
  <Wrapper title={doc.kind}>
    <HeaderBlock doc={doc} />
    <Divider />
    <ItemsTable items={doc.items} />
    <TotalsBlock subtotal={doc.subtotal} discount={doc.discount} tax={doc.tax} total={doc.total} />
    {doc.kind === "INVOICE" && <PaymentSummary summary={doc.paymentSummary} />}
    <Footer doc={doc} />
  </Wrapper>
);

export const InvoicePrint: React.FC<{ doc: Omit<BaseDoc, "kind"> }> = ({ doc }) => (
  <DocumentPrint doc={{ ...doc, kind: "INVOICE" }} />
);

export const EstimatePrint: React.FC<{ doc: Omit<BaseDoc, "kind"> }> = ({ doc }) => (
  <DocumentPrint doc={{ ...doc, kind: "ESTIMATE" }} />
);