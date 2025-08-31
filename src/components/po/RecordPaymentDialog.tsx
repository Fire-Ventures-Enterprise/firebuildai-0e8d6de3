import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { poPaymentSchema } from "@/domain/validators";
import { PurchaseOrders } from "@/services/purchaseOrders";
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
  const form = useForm<{ amount: number; method: any; paid_at?: string; reference?: string | null; }>({
    resolver: zodResolver(poPaymentSchema),
    defaultValues: { amount: Math.max(0, outstanding), method: "bank_transfer" },
  });

  const submit = async (v: any) => {
    try {
      await PurchaseOrders.recordPayment(poId, v.amount, v.method, v.reference ?? undefined);
      // update high-level status heuristically
      await PurchaseOrders.setPayment(poId, v.amount >= outstanding ? "paid" : "partial", v.method);
      notify.success("Payment recorded");
      onOpenChange(false);
      onDone?.();
    } catch (e) {
      notify.error("Failed to record payment", e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
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
            <Label>Reference (optional)</Label>
            <Input placeholder="Cheque # / E-transfer ref / Note" {...form.register("reference")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}