import type { InvoicePayment } from "@/types/sales";
import { Watermark } from "@/components/po/Watermark";

type ClientRef = {
  id: string;
  name?: string | null;
  email?: string | null;
  address?: string | null;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number | null;
  line_total: number;
};

type Invoice = {
  id: string;
  invoice_number?: string | null;
  issue_date: string;
  due_date?: string | null;
  subtotal: number;
  tax_amount: number;
  total: number;
  notes?: string | null;
  client?: ClientRef | null;
  service_address?: string | null;
};

type Company = { 
  name: string; 
  address?: string; 
  phone?: string; 
  email?: string;
};

type Props = {
  invoice: Invoice;
  items: InvoiceItem[];
  payments?: InvoicePayment[];
  company: Company;
  watermarkText?: string;
};

export function InvoicePrintSheet({ 
  invoice: inv, 
  items, 
  payments = [], 
  company, 
  watermarkText 
}: Props) {
  const subtotal = inv.subtotal ?? 0;
  const tax = inv.tax_amount ?? 0;
  const total = inv.total ?? 0;
  const paid = payments.reduce((a, p) => a + (p.amount ?? 0), 0);
  const balance = Math.max(0, total - paid);

  return (
    <div id="invoice-print-root" className="relative bg-white text-black p-6 max-w-[900px] mx-auto">
      {watermarkText && <Watermark text={watermarkText} />}

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 6px; }
        }
      `}</style>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Invoice</h2>
          <div className="text-sm opacity-70">Invoice #: {inv.invoice_number ?? inv.id}</div>
          <div className="text-sm opacity-70">Issue Date: {new Date(inv.issue_date).toLocaleDateString()}</div>
          {inv.due_date && <div className="text-sm opacity-70">Due Date: {new Date(inv.due_date).toLocaleDateString()}</div>}
        </div>
        <div className="text-right">
          <div className="text-sm opacity-60">From</div>
          <div className="font-medium">{company.name}</div>
          {company.address && <div className="text-sm">{company.address}</div>}
          {company.phone && <div className="text-sm">{company.phone}</div>}
          {company.email && <div className="text-sm">{company.email}</div>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-sm opacity-60">Bill To</div>
          <div className="font-medium">{inv.client?.name ?? "—"}</div>
          {inv.client?.email && <div className="text-sm">{inv.client.email}</div>}
          {inv.client?.address && <div className="text-sm">{inv.client.address}</div>}
        </div>
        <div>
          <div className="text-sm opacity-60">Service Address</div>
          <div className="text-sm">{(inv as any).service_address ?? "Same as billing address"}</div>
        </div>
      </div>

      <h3 className="mt-6 mb-2 font-medium">Line Items</h3>
      <table className="table text-sm">
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Tax %</th><th>Amount</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.description}</td>
              <td>{i.quantity}</td>
              <td>${i.unit_price.toFixed(2)}</td>
              <td>{i.tax_rate ?? 0}</td>
              <td>${i.line_total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-3 text-sm">
        <div className="w-64">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Paid</span><span>${paid.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold"><span>Balance Due</span><span>${balance.toFixed(2)}</span></div>
        </div>
      </div>

      {inv.notes && (
        <>
          <h3 className="mt-6 mb-2 font-medium">Notes</h3>
          <div className="text-sm whitespace-pre-wrap">{inv.notes}</div>
        </>
      )}
    </div>
  );
}