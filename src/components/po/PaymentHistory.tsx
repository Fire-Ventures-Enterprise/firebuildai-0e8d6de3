import type { PoPayment } from "@/domain/db";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function PaymentHistory({ rows }: { rows: PoPayment[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mt-4">
        <div className="font-medium mb-2">Payment History</div>
        <div className="text-sm text-muted-foreground p-4 border rounded-lg">
          No payments recorded yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="font-medium mb-2">Payment History</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{new Date(p.paid_at).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">
                {p.method?.replace('_', ' ') || '—'}
              </TableCell>
              <TableCell>{p.reference ?? "—"}</TableCell>
              <TableCell className="text-right font-medium">${p.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}