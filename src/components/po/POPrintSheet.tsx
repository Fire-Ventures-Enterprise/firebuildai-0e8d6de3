import type { PurchaseOrderWithJoins, PoPayment, PurchaseOrderItem } from "@/domain/db";
import { Badge } from "@/components/ui/badge";

type Props = {
  po: PurchaseOrderWithJoins;
  items?: PurchaseOrderItem[];
  payments?: PoPayment[];
  receiptThumbs?: string[]; // signed urls
};

export const POPrintSheet = ({ 
  po, 
  items = po.items ?? [], 
  payments = po.payments ?? [], 
  receiptThumbs = [] 
}: Props) => {
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = po.total - totalPaid;

  return (
    <div id="po-print-root" className="bg-background text-foreground p-6 print:p-4 print:bg-white print:text-black max-w-[900px] mx-auto">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          #po-print-root { width: 100%; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          .table th { background: #f5f5f5; font-weight: 600; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        }
      `}</style>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Purchase Order</h2>
          <div className="text-sm text-muted-foreground">PO Number: <span className="font-medium text-foreground">{po.po_number ?? po.id}</span></div>
          <div className="text-sm text-muted-foreground">Created: {new Date(po.created_at).toLocaleDateString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Vendor</div>
          <div className="font-semibold">{po.vendor?.name ?? "—"}</div>
          <div className="text-sm text-muted-foreground">{po.vendor?.email ?? ""}</div>
          <div className="text-sm text-muted-foreground">{po.vendor?.phone ?? ""}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/20 rounded-lg print:bg-gray-50">
        <div className="text-sm space-y-1">
          <div><span className="text-muted-foreground">Job:</span> <span className="font-medium">{po.job?.name ?? po.job_id}</span></div>
          <div><span className="text-muted-foreground">Expected Delivery:</span> <span className="font-medium">{po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : "—"}</span></div>
          <div><span className="text-muted-foreground">Terms:</span> <span className="font-medium">{po.terms ?? "—"}</span></div>
        </div>
        <div className="text-sm space-y-1 text-right">
          <div>
            <span className="text-muted-foreground">Approval Status:</span>{" "}
            <Badge variant={po.status === 'approved' ? 'default' : po.status === 'closed' ? 'secondary' : 'outline'} className="ml-2 print:border print:border-gray-400">
              {po.status}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Payment Status:</span>{" "}
            <Badge variant={po.payment_status === 'paid' ? 'default' : po.payment_status === 'partial' ? 'secondary' : 'outline'} className="ml-2 print:border print:border-gray-400">
              {po.payment_status}
            </Badge>
          </div>
          <div><span className="text-muted-foreground">Total:</span> <span className="font-bold text-lg">${po.total.toFixed(2)}</span></div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Line Items</h3>
      <table className="table w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left">Description</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Rate</th>
            <th className="text-center">Tax %</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="border-b">
              <td>{i.description}</td>
              <td className="text-center">{i.qty}</td>
              <td className="text-right">${i.unit_price.toFixed(2)}</td>
              <td className="text-center">{i.tax_rate ?? 0}%</td>
              <td className="text-right font-medium">${i.line_total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${po.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${po.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>Total</span>
            <span>${po.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Payment History</h3>
      <table className="table w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left">Date</th>
            <th className="text-left">Method</th>
            <th className="text-left">Reference</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? payments.map(p => (
            <tr key={p.id} className="border-b">
              <td>{new Date(p.paid_at).toLocaleDateString()}</td>
              <td className="capitalize">{p.method?.replace('_', ' ') ?? "—"}</td>
              <td>{p.reference ?? "—"}</td>
              <td className="text-right font-medium">${p.amount.toFixed(2)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center text-muted-foreground py-4">No payments recorded</td>
            </tr>
          )}
        </tbody>
        {payments.length > 0 && (
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={3} className="text-right">Total Paid:</td>
              <td className="text-right">${totalPaid.toFixed(2)}</td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={3} className="text-right">Outstanding:</td>
              <td className="text-right">${outstanding.toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      {!!receiptThumbs.length && (
        <>
          <h3 className="text-lg font-semibold mb-3">Receipt Attachments</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {receiptThumbs.slice(0, 6).map((u, idx) => (
              <div key={idx} className="border rounded overflow-hidden">
                <img src={u} alt={`Receipt ${idx + 1}`} className="w-full h-40 object-cover" />
              </div>
            ))}
          </div>
        </>
      )}

      {po.notes && (
        <>
          <h3 className="text-lg font-semibold mb-3">Notes</h3>
          <div className="text-sm whitespace-pre-wrap p-4 bg-muted/20 rounded-lg print:bg-gray-50">{po.notes}</div>
        </>
      )}

      <div className="mt-8 pt-4 border-t text-xs text-muted-foreground print:text-gray-600">
        <div className="flex justify-between">
          <span>Generated on {new Date().toLocaleString()}</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};