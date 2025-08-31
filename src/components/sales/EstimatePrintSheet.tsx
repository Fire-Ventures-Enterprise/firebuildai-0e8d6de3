import React from "react";
import type { Estimate, EstimateItem } from "@/types/sales";
import { Watermark } from "@/components/po/Watermark";

type ClientRef = {
  id: string;
  name?: string | null;
  email?: string | null;
  address?: string | null;
};

type Company = { 
  name: string; 
  address?: string; 
  phone?: string; 
  email?: string;
};

type Props = {
  estimate: Estimate & { 
    client?: ClientRef | null; 
    service_address?: string | null;
  };
  items: EstimateItem[];
  company: Company;
  contractTitle?: string;
  contractUrl?: string;
  contractHtml?: string;
  watermarkText?: string;
};

export function EstimatePrintSheet({
  estimate: est,
  items,
  company,
  contractTitle,
  contractUrl,
  contractHtml,
  watermarkText,
}: Props) {
  const subtotal = est.subtotal ?? 0;
  const taxAmount = est.tax_amount ?? 0;
  const total = est.total ?? 0;
  const deposit = est.deposit_required ?? 0;

  return (
    <div id="estimate-print-root" className="relative bg-white text-black p-6 max-w-[900px] mx-auto">
      {watermarkText && <Watermark text={watermarkText} />}

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 6px; }
          .table th { background: #f7f7f7; }
          .joist .item-block { page-break-inside: avoid; }
        }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 6px; }
        .table th { background: #f7f7f7; }
        /* Joist layout */
        .joist .item-row td { vertical-align: top; }
        .joist .item-title { width: 100%; }
        .joist .num { text-align: right; white-space: nowrap; }
        .joist .item-desc td { border-top: 0; }
        .joist .desc {
          font-size: 12px; opacity: .88; padding: 6px;
          white-space: pre-wrap; /* keep line breaks */
        }
        .joist .section {
          background: #fafafa; font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Estimate</h2>
          <div className="text-sm opacity-70">Estimate #: {est.estimate_number ?? est.id}</div>
          <div className="text-sm opacity-70">Issue Date: {new Date(est.issue_date).toLocaleDateString()}</div>
          {est.expiry_date && (
            <div className="text-sm opacity-70">Expiration Date: {new Date(est.expiry_date).toLocaleDateString()}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm opacity-60">From</div>
          <div className="font-medium">{company.name}</div>
          {company.address && <div className="text-sm">{company.address}</div>}
          {company.phone && <div className="text-sm">{company.phone}</div>}
          {company.email && <div className="text-sm">{company.email}</div>}
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <div className="text-sm opacity-60">Bill To</div>
          <div className="font-medium">{est.client?.name ?? "—"}</div>
          {est.client?.email && <div className="text-sm">{est.client.email}</div>}
          {est.client?.address && <div className="text-sm">{est.client.address}</div>}
        </div>
        <div>
          <div className="text-sm opacity-60">Service Address</div>
          <div className="text-sm">{(est as any).service_address ?? "Same as billing address"}</div>
        </div>
      </div>

      {/* Scope */}
      {est.scope && (
        <>
          <h3 className="mt-6 mb-2 font-medium">Scope of Work</h3>
          <div className="p-3 border rounded text-sm whitespace-pre-wrap">{est.scope}</div>
        </>
      )}

      {/* Items */}
      <h3 className="mt-6 mb-2 font-medium">Line Items</h3>
      <table className="table text-sm joist">
        <thead>
          <tr>
            <th>Item</th>
            <th className="num">Rate</th>
            <th className="num">Qty</th>
            <th className="num">Amount</th>
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
                    <div className="font-medium">{firstLine}</div>
                  </td>
                  <td className="num">${i.unit_price.toFixed(2)}</td>
                  <td className="num">{i.quantity}</td>
                  <td className="num">${i.line_total.toFixed(2)}</td>
                </tr>

                {/* Optional Description Row */}
                {details && (
                  <tr className="item-desc item-block">
                    <td colSpan={4}>
                      <div className="desc">{details}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Totals + Deposit */}
      <div className="flex justify-end mt-3 text-sm">
        <div className="w-64">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${taxAmount.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          {deposit > 0 && (
            <div className="flex justify-between">
              <span className="opacity-80">Deposit Required</span>
              <span className="font-medium">${deposit.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contract */}
      {(contractTitle || est.contract_title) && (
        <div className="mt-6 p-3 border rounded">
          <div className="flex items-center gap-2">
            <span className="font-medium">{contractTitle ?? est.contract_title ?? "Contract"}</span>
          </div>
          <div className="text-sm mt-2">
            By accepting this estimate, you agree to the attached Service Agreement which includes payment terms,
            warranties, and legal protections under applicable law.
          </div>
          {contractUrl && (
            <div className="mt-2 text-sm">
              <a href={contractUrl} className="text-blue-600 underline" target="_blank">View Full Contract →</a>
            </div>
          )}
          {contractHtml && (
            <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: contractHtml }} />
          )}
        </div>
      )}

      {/* Notes */}
      {est.notes && (
        <>
          <h3 className="mt-6 mb-2 font-medium">Notes</h3>
          <div className="text-sm whitespace-pre-wrap">{est.notes}</div>
        </>
      )}
    </div>
  );
}