import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SalesPublic } from "@/services/salesPublic";
import { notify } from "@/lib/notify";
import { InvoicePrintSheet } from "@/components/sales/InvoicePrintSheet";
import { InvoiceHeaderActions } from "@/components/sales/InvoiceHeaderActions";
import "@/styles/invoice.css";

export default function InvoicePortalPage() {
  const { token } = useParams<{ token: string }>();
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await SalesPublic.getInvoiceByToken(token);
        setInv(data);
      } catch (error) {
        notify.error("Failed to load invoice", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading…</div>;
  if (!inv) return <div className="flex items-center justify-center min-h-screen">Invoice not found</div>;

  const paid = (inv.payments ?? []).reduce((a: number, p: any) => a + (p.amount ?? 0), 0);
  const balance = Math.max(0, (inv.total ?? 0) - paid);

  const downloadPdf = async () => {
    const node = document.getElementById("invoice-print-root");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const r = Math.min(pw / canvas.width, ph / canvas.height);
    pdf.addImage(img, "PNG", (pw - canvas.width * r)/2, 20, canvas.width * r, canvas.height * r, undefined, "FAST");
    pdf.save(`Invoice_${inv.invoice_number ?? inv.id}.pdf`);
  };

  const payNow = async () => {
    notify.info("Online payment feature coming soon. Please contact us to arrange payment.");
  };

  return (
    <div className="max-w-[950px] mx-auto p-4 space-y-4">
      <div className="no-print flex justify-end gap-2">
        <Button variant="secondary" onClick={downloadPdf}>Download PDF</Button>
        {balance > 0 && <Button onClick={payNow}>Pay ${balance.toFixed(2)}</Button>}
      </div>

      <InvoicePrintSheet
        invoice={inv}
        items={inv.items ?? []}
        payments={inv.payments ?? []}
        company={{ name: "FireBuildAI" }}
        watermarkText={balance <= 0 ? "PAID" : ""}
      />
    </div>
  );
}