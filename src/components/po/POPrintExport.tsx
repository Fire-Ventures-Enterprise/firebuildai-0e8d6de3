import { Button } from "@/components/ui/button";
import { POPrintSheet } from "./POPrintSheet";
import { Printer, Download } from "lucide-react";
import type { PurchaseOrderWithJoins, PoPayment, PurchaseOrderItem } from "@/domain/db";
import { notify } from "@/lib/notify";

type Props = {
  po: PurchaseOrderWithJoins;
  items?: PurchaseOrderItem[];
  payments?: PoPayment[];
  receiptThumbs?: string[]; // signed URLs
};

export function POPrintExport({ po, items, payments, receiptThumbs }: Props) {
  const print = () => {
    window.print();
  };

  const exportPdf = async () => {
    try {
      // Dynamic imports to reduce initial bundle size
      const [html2canvas, jsPDF] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);

      const node = document.getElementById("po-print-root");
      if (!node) {
        notify.error("Could not find print content");
        return;
      }

      // Show loading state
      notify.info("Generating PDF...");

      const canvas = await html2canvas.default(node, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const img = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF.default({ 
        orientation: "portrait", 
        unit: "pt", 
        format: "a4" 
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit content to page
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;

      pdf.addImage(img, "PNG", (pageWidth - w) / 2, 20, w, h, undefined, "FAST");
      pdf.save(`PO_${po.po_number ?? po.id}.pdf`);
      
      notify.success("PDF exported successfully");
    } catch (error) {
      notify.error("Failed to export PDF", error);
    }
  };

  // Render the sheet (visible) + provide buttons
  return (
    <div className="space-y-4">
      <div className="no-print flex gap-2 justify-end">
        <Button variant="secondary" onClick={print} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={exportPdf} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <POPrintSheet po={po} items={items} payments={payments} receiptThumbs={receiptThumbs} />
    </div>
  );
}