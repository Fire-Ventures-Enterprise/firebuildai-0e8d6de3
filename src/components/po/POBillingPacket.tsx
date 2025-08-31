import { useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { PurchaseOrderWithJoins } from "@/domain/db";
import { POPrintSheet } from "./POPrintSheet";
import { buildWatermark } from "@/utils/poWatermark";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { notify } from "@/lib/notify";

type PacketPO = PurchaseOrderWithJoins & {
  receiptThumbs?: string[]; // signed
};

type Props = {
  companyName?: string;
  title?: string;
  orders: PacketPO[];
  watermarkAll?: boolean;
};

export function POBillingPacket({ 
  companyName, 
  title = "Billing Packet", 
  orders, 
  watermarkAll = false 
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    const rows = orders.map(po => {
      const paid = (po.payments ?? []).reduce((a, p) => a + (p.amount ?? 0), 0);
      const out  = Math.max(0, (po.total ?? 0) - paid);
      return { po, paid, out };
    });
    const totals = rows.reduce((acc, r) => {
      acc.total += r.po.total ?? 0;
      acc.paid  += r.paid;
      acc.out   += r.out;
      return acc;
    }, { total: 0, paid: 0, out: 0 });
    return { rows, totals };
  }, [orders]);

  async function nodeToPdfPage(pdf: jsPDF, el: HTMLElement) {
    const canvas = await html2canvas(el, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });
    const img = canvas.toDataURL("image/png", 1.0);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    pdf.addImage(img, "PNG", (pageWidth - w) / 2, 20, w, h, undefined, "FAST");
  }

  async function exportPdf() {
    try {
      notify.info("Generating billing packet PDF...");
      
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      // 1) Cover
      const cover = document.getElementById("po-packet-cover");
      if (!cover) {
        notify.error("Could not find cover sheet");
        return;
      }
      await nodeToPdfPage(pdf, cover);

      // 2) Each PO
      const pages = Array.from(rootRef.current?.querySelectorAll(".po-packet-page") ?? []) as HTMLElement[];
      for (let i = 0; i < pages.length; i++) {
        pdf.addPage();
        await nodeToPdfPage(pdf, pages[i]);
      }

      pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
      notify.success("Billing packet exported successfully");
    } catch (error) {
      notify.error("Failed to export billing packet", error);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No purchase orders selected for billing packet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-print flex justify-end">
        <Button onClick={exportPdf} className="gap-2">
          <FileText className="h-4 w-4" />
          Export Packet PDF
        </Button>
      </div>

      {/* COVER SHEET (visible node) */}
      <div id="po-packet-cover" className="bg-background text-foreground p-6 max-w-[900px] mx-auto border rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {companyName && <div className="text-muted-foreground mb-4">{companyName}</div>}
        <div className="text-sm text-muted-foreground mb-4">
          Generated on {new Date().toLocaleString()}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {["PO #","Vendor","Job","Approval","Payment","Total","Paid","Outstanding"].map(h => (
                  <th key={h} className="text-left border p-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.rows.map(({ po, paid, out }) => (
                <tr key={po.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium">{po.po_number ?? po.id.slice(0, 8)}</td>
                  <td className="border p-2">{po.vendor?.name ?? "—"}</td>
                  <td className="border p-2">{po.job?.name ?? "—"}</td>
                  <td className="border p-2 capitalize">{po.status}</td>
                  <td className="border p-2 capitalize">{po.payment_status}</td>
                  <td className="border p-2 text-right">${po.total?.toFixed(2)}</td>
                  <td className="border p-2 text-right">${paid.toFixed(2)}</td>
                  <td className="border p-2 text-right font-medium">${out.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted font-semibold">
                <td className="border p-2" colSpan={5}>Totals</td>
                <td className="border p-2 text-right">${summary.totals.total.toFixed(2)}</td>
                <td className="border p-2 text-right">${summary.totals.paid.toFixed(2)}</td>
                <td className="border p-2 text-right">${summary.totals.out.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>This packet contains {orders.length} purchase order{orders.length > 1 ? 's' : ''}.</p>
          <p>Each order detail page follows this summary.</p>
        </div>
      </div>

      {/* INDIVIDUAL PO PAGES (hidden container we snapshot) */}
      <div ref={rootRef} className="space-y-8">
        {orders.map((po) => (
          <div key={po.id} className="po-packet-page">
            <POPrintSheet
              po={po}
              items={po.items ?? []}
              payments={po.payments ?? []}
              receiptThumbs={po.receiptThumbs ?? []}
              watermarkText={watermarkAll ? buildWatermark(po, companyName) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}