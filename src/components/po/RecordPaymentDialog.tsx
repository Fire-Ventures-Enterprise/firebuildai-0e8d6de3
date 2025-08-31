import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { poPaymentSchema } from "@/domain/validators";
import { PurchaseOrders } from "@/services/purchaseOrders";
import { ReceiptUpload } from "./ReceiptUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { notify } from "@/lib/notify";

type Props = { 
  poId: string; 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  outstanding: number; 
  onDone?: () => void; 
};

export function RecordPaymentDialog({ poId, open, onOpenChange, outstanding, onDone }: Props) {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  
  const form = useForm<{ amount: number; method: any; paid_at?: string; reference?: string | null; }>({
    resolver: zodResolver(poPaymentSchema),
    defaultValues: { 
      amount: Math.max(0, outstanding), 
      method: "bank_transfer",
      paid_at: new Date().toISOString().split('T')[0] // Today's date
    },
  });

  const submit = async (v: any) => {
    try {
      setBusy(true);
      const payment = await PurchaseOrders.recordPayment(
        poId, 
        v.amount, 
        v.method, 
        v.reference ?? undefined, 
        v.paid_at
      );
      
      // Store payment ID for receipt upload
      if (payment?.id) {
        setPaymentId(payment.id);
      }
      
      notify.success("Payment recorded");
      
      // Don't close dialog yet if there's a payment ID (user might want to upload receipt)
      if (!payment?.id) {
        onOpenChange(false);
        onDone?.();
      }
    } catch (e) {
      notify.error("Failed to record payment", e);
    } finally {
      setBusy(false);
    }
  };

  const handleReceiptUploaded = () => {
    setPaymentId(null);
    onOpenChange(false);
    onDone?.();
  };

  // Reset payment ID when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPaymentId(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {paymentId ? "Payment Recorded - Upload Receipt?" : "Record Payment"}
          </DialogTitle>
        </DialogHeader>
        
        {!paymentId ? (
          <form className="space-y-3" onSubmit={form.handleSubmit(submit)}>
            <div>
              <Label>Amount</Label>
              <Input type="number" step="0.01" {...form.register("amount", { valueAsNumber: true })} />
              {form.formState.errors.amount && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.amount.message}</p>
              )}
            </div>
            <div>
              <Label>Method</Label>
              <Select defaultValue={form.getValues("method")} onValueChange={(v) => form.setValue("method", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.method && (
                <p className="text-destructive text-sm mt-1">{String(form.formState.errors.method.message)}</p>
              )}
            </div>
            <div>
              <Label>Payment Date</Label>
              <Input type="date" {...form.register("paid_at")} />
              {form.formState.errors.paid_at && (
                <p className="text-destructive text-sm mt-1">{String(form.formState.errors.paid_at.message)}</p>
              )}
            </div>
            <div>
              <Label>Reference (optional)</Label>
              <Input placeholder="Cheque # / E-transfer ref / Note" {...form.register("reference")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving..." : "Save Payment"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Would you like to upload a receipt for this payment?
            </p>
            <ReceiptUpload 
              poId={poId}
              paymentId={paymentId}
              onUploaded={handleReceiptUploaded}
              multiple={false}
            />
            <DialogFooter>
              <Button onClick={handleReceiptUploaded}>
                Skip & Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}