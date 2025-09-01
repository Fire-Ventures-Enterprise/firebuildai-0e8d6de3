import React from "react";
import type { InvoicePayment } from "@/types/sales";
import { Watermark } from "@/components/po/Watermark";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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
  contract_required?: boolean;
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
  contractUrl?: string;
};

export function InvoicePrintSheet({ 
  invoice: inv, 
  items, 
  payments = [], 
  company, 
  watermarkText,
  contractUrl
}: Props) {
  const subtotal = inv.subtotal ?? 0;
  const tax = inv.tax_amount ?? 0;
  const total = inv.total ?? 0;
  const paid = payments.reduce((a, p) => a + (p.amount ?? 0), 0);
  const balance = Math.max(0, total - paid);

  const getProvince = () => {
    // Check customer's province first, then company's province
    const province = (inv as any).service_province || 
                    (inv as any).customer_province ||
                    company.address?.match(/\b(ON|Ontario|BC|British Columbia|AB|Alberta|QC|Quebec|NS|Nova Scotia|NB|New Brunswick|MB|Manitoba|SK|Saskatchewan|PE|Prince Edward Island|NL|Newfoundland)\b/i)?.[0] ||
                    'Ontario';
    
    // Normalize province names
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

  const getContractTitle = () => {
    const province = getProvince();
    if (province === 'Ontario') return 'Ontario Contract Agreement';
    if (['British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province)) {
      return `${province} Contract Agreement`;
    }
    // For US states or other countries
    return 'Service Contract Agreement';
  };

  const getContractName = () => {
    const province = getProvince();
    if (province === 'Ontario') return 'Ontario Construction Service Agreement';
    if (['British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province)) {
      return `${province} Construction Service Agreement`;
    }
    return 'Construction Service Agreement';
  };

  const getJurisdiction = () => {
    const province = getProvince();
    if (['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'Saskatchewan', 'Prince Edward Island', 'Newfoundland and Labrador'].includes(province)) {
      return province;
    }
    // Check if US state
    const state = (inv as any).service_state;
    if (state) return state;
    
    return 'local';
  };

  return (
    <div id="invoice-sheet" className="invoice-surface relative p-6 max-w-[900px] mx-auto" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
      {watermarkText && <Watermark text={watermarkText} />}

      <style dangerouslySetInnerHTML={{ __html: `
        #invoice-sheet, #invoice-sheet * {
          color: #0f172a !important;
        }
        #invoice-sheet .text-muted-foreground,
        #invoice-sheet .text-muted,
        #invoice-sheet .text-gray-600,
        #invoice-sheet .text-gray-500,
        #invoice-sheet .text-gray-700 {
          color: #64748b !important;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          #invoice-sheet, #invoice-sheet * { color: #000 !important; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 6px; color: #000 !important; }
          .table th { background: #f7f7f7; color: #000 !important; }
          .joist .item-block { page-break-inside: avoid; }
        }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 6px; color: #0f172a !important; }
        .table th { background: #f7f7f7; color: #0f172a !important; }
        /* Joist layout */
        .joist .item-row td { vertical-align: top; color: #0f172a !important; }
        .joist .item-title { width: 100%; color: #0f172a !important; }
        .joist .num { text-align: right; white-space: nowrap; color: #0f172a !important; }
        .joist .item-desc td { border-top: 0; }
        .joist .desc {
          font-size: 12px; color: #64748b !important; padding: 6px;
          white-space: pre-wrap; /* keep line breaks */
        }
        .joist .section {
          background: #fafafa; font-weight: 600; color: #0f172a !important;
        }
      ` }} />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: '#0f172a' }}>Invoice</h2>
          <div className="text-sm" style={{ color: '#64748b' }}>Invoice #: {inv.invoice_number ?? inv.id}</div>
          <div className="text-sm" style={{ color: '#64748b' }}>Issue Date: {new Date(inv.issue_date).toLocaleDateString()}</div>
          {inv.due_date && <div className="text-sm" style={{ color: '#64748b' }}>Due Date: {new Date(inv.due_date).toLocaleDateString()}</div>}
        </div>
        <div className="text-right">
          <div className="text-sm" style={{ color: '#64748b' }}>From</div>
          <div className="font-medium" style={{ color: '#0f172a' }}>{company.name}</div>
          {company.address && <div className="text-sm" style={{ color: '#64748b' }}>{company.address}</div>}
          {company.phone && <div className="text-sm" style={{ color: '#64748b' }}>{company.phone}</div>}
          {company.email && <div className="text-sm" style={{ color: '#64748b' }}>{company.email}</div>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-sm" style={{ color: '#64748b' }}>Bill To</div>
          <div className="font-medium" style={{ color: '#0f172a' }}>{inv.client?.name ?? "—"}</div>
          {inv.client?.email && <div className="text-sm" style={{ color: '#64748b' }}>{inv.client.email}</div>}
          {inv.client?.address && <div className="text-sm" style={{ color: '#64748b' }}>{inv.client.address}</div>}
        </div>
        <div>
          <div className="text-sm" style={{ color: '#64748b' }}>Service Address</div>
          <div className="text-sm" style={{ color: '#64748b' }}>{(inv as any).service_address ?? "Same as billing address"}</div>
        </div>
      </div>

      <h3 className="mt-6 mb-2 font-medium" style={{ color: '#0f172a' }}>Line Items</h3>
      <table className="table text-sm joist">
        <thead>
          <tr>
            <th style={{ color: '#0f172a' }}>Item</th>
            <th className="num" style={{ color: '#0f172a' }}>Rate</th>
            <th className="num" style={{ color: '#0f172a' }}>Qty</th>
            <th className="num" style={{ color: '#0f172a' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => {
            // Title from optional i.title, otherwise first line of description
            const firstLine = (i as any).title ?? ((i.description ?? "").split(/\r?\n/)[0] || `Item ${idx + 1}`);
            // Details are "description" minus first line  
            const rest = (i.description ?? "");
            const details = rest.startsWith(firstLine) ? rest.slice(firstLine.length).trim() : rest;

            return (
              <React.Fragment key={i.id ?? idx}>
                {/* Item Row */}
                <tr className="item-row item-block">
                  <td className="item-title">
                    <div className="font-medium" style={{ color: '#0f172a' }}>{firstLine}</div>
                  </td>
                  <td className="num" style={{ color: '#0f172a' }}>${i.unit_price.toFixed(2)}</td>
                  <td className="num" style={{ color: '#0f172a' }}>{i.quantity}</td>
                  <td className="num" style={{ color: '#0f172a' }}>${i.line_total.toFixed(2)}</td>
                </tr>

                {/* Optional Description Row */}
                {details && (
                  <tr className="item-desc item-block">
                    <td colSpan={4}>
                      <div className="desc" style={{ color: '#64748b' }}>{details}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-3 text-sm">
        <div className="w-64">
          <div className="flex justify-between" style={{ color: '#0f172a' }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between" style={{ color: '#0f172a' }}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold" style={{ color: '#0f172a' }}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between" style={{ color: '#0f172a' }}><span>Paid</span><span>${paid.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold" style={{ color: '#0f172a' }}><span>Balance Due</span><span>${balance.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Contract Section */}
      {inv.contract_required && (
        <div 
          className="mt-6 border border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => window.open(contractUrl || '#', '_blank')}
        >
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2" style={{ color: '#0f172a' }}>
            <FileText className="h-5 w-5" style={{ color: '#64748b' }} />
            {getContractTitle()}
          </h3>
          <p className="text-sm mb-3" style={{ color: '#64748b' }}>
            By accepting this invoice, you agree to the attached {getContractName()} which includes payment terms, warranties, and legal protections under {getJurisdiction()} law.
          </p>
          <Button variant="link" className="p-0 h-auto" style={{ color: '#3b82f6' }}>
            View Full Contract →
          </Button>
        </div>
      )}

      {inv.notes && (
        <>
          <h3 className="mt-6 mb-2 font-medium" style={{ color: '#0f172a' }}>Notes</h3>
          <div className="text-sm whitespace-pre-wrap" style={{ color: '#64748b' }}>{inv.notes}</div>
        </>
      )}
    </div>
  );
}