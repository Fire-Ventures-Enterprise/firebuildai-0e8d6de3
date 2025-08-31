import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, FileText, Calendar, Package, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { RecordPaymentDialog } from "./RecordPaymentDialog";
import { PayByCardButton } from "./PayByCardButton";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentHistory } from "./PaymentHistory";
import { PurchaseOrders } from "@/services/purchaseOrders";
import type { PurchaseOrderWithJoins, PoPayment } from "@/domain/db";
import { outstanding as getOutstanding } from "@/utils/po";

interface PurchaseOrderDetailProps {
  purchaseOrder: PurchaseOrderWithJoins;
  onRefresh: () => void;
}

export function PurchaseOrderDetail({ purchaseOrder, onRefresh }: PurchaseOrderDetailProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payments, setPayments] = useState<PoPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  
  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentHistory = await PurchaseOrders.getPayments(purchaseOrder.id);
        setPayments(paymentHistory);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [purchaseOrder.id]);

  // Update purchaseOrder with fetched payments for calculations
  const poWithPayments = { ...purchaseOrder, payments };
  const paidAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstanding = getOutstanding(poWithPayments);
  const isPaid = purchaseOrder.payment_status === 'paid';
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      submitted: "default",
      approved: "default",
      closed: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };
  
  const getPaymentBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "destructive",
      partial: "secondary",
      paid: "default",
      cancelled: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">PO #{purchaseOrder.po_number}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {purchaseOrder.vendor?.name || 'Unknown Vendor'}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(purchaseOrder.status)}
              {getPaymentBadge(purchaseOrder.payment_status || 'pending')}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">${purchaseOrder.total?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="font-semibold">${paidAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="font-semibold text-orange-600">
                  ${outstanding.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">
                  {purchaseOrder.due_date 
                    ? format(new Date(purchaseOrder.due_date), 'MMM dd, yyyy')
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          {purchaseOrder.items && purchaseOrder.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Line Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Rate</th>
                      <th className="text-right p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrder.items.map((item, idx) => (
                      <tr key={item.id || idx} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="text-right p-3">{item.qty}</td>
                        <td className="text-right p-3">${item.unit_price?.toFixed(2)}</td>
                        <td className="text-right p-3 font-medium">
                          ${item.line_total?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={3} className="text-right p-3 font-semibold">
                        Subtotal:
                      </td>
                      <td className="text-right p-3 font-semibold">
                        ${purchaseOrder.subtotal?.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right p-3 font-semibold">
                        Tax:
                      </td>
                      <td className="text-right p-3 font-semibold">
                        ${purchaseOrder.tax?.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right p-3 font-semibold text-lg">
                        Total:
                      </td>
                      <td className="text-right p-3 font-semibold text-lg">
                        ${purchaseOrder.total?.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Payment Actions */}
          {!isPaid && outstanding > 0 && (
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setPaymentDialogOpen(true)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Record Payment
              </Button>
              
              <PayByCardButton
                poId={purchaseOrder.id}
                poNumber={purchaseOrder.po_number || ''}
                amountCents={Math.round(outstanding * 100)}
                onSuccess={onRefresh}
              />
            </div>
          )}

          {/* Notes */}
          {purchaseOrder.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{purchaseOrder.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <PaymentSummary po={poWithPayments} />

      {/* Payment History */}
      {!loadingPayments && (
        <PaymentHistory 
          rows={[...payments].sort((a, b) => (a.paid_at > b.paid_at ? 1 : -1))} 
        />
      )}

      <RecordPaymentDialog
        poId={purchaseOrder.id}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        outstanding={outstanding}
        onDone={() => {
          onRefresh();
          // Also refresh payments
          PurchaseOrders.getPayments(purchaseOrder.id).then(setPayments);
        }}
      />
    </div>
  );
}