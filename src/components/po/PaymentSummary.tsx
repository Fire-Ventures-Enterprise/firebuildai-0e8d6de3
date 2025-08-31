import type { PurchaseOrderWithJoins } from "@/domain/db";
import { paidToDate, outstanding, lastPayment } from "@/utils/po";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";

export function PaymentSummary({ po }: { po: PurchaseOrderWithJoins }) {
  const paid = paidToDate(po);
  const out = outstanding(po);
  const last = lastPayment(po);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "partial": return "secondary";
      case "cancelled": return "outline";
      default: return "destructive";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <FileText className="h-4 w-4" />
          Status
        </div>
        <Badge variant={getStatusVariant(po.payment_status || 'pending')}>
          {po.payment_status || 'pending'}
        </Badge>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <DollarSign className="h-4 w-4" />
          Paid to date
        </div>
        <div className="font-semibold">${paid.toFixed(2)}</div>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <DollarSign className="h-4 w-4" />
          Outstanding
        </div>
        <div className="font-semibold text-orange-600">${out.toFixed(2)}</div>
      </div>
      
      <div className="p-3 border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Calendar className="h-4 w-4" />
          Last payment
        </div>
        <div className="text-sm">
          {last ? (
            <>
              {new Date(last.paid_at).toLocaleDateString()}
              {last.method && (
                <span className="text-muted-foreground"> • {last.method.replace('_', ' ')}</span>
              )}
              {last.reference && (
                <span className="text-muted-foreground"> • {last.reference}</span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </div>
  );
}