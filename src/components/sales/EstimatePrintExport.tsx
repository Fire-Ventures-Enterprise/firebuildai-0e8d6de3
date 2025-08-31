import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { EstimatePrintSheet } from "./EstimatePrintSheet";
import type { Estimate, EstimateItem } from "@/types/sales";

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

export function EstimatePrintExport(props: Props) {
  const print = () => window.print();
  
  const exportPdf = async () => {
    const node = document.getElementById("estimate-print-root");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const img = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const r = Math.min(pw / canvas.width, ph / canvas.height);
    pdf.addImage(img, "PNG", (pw - canvas.width * r)/2, 20, canvas.width * r, canvas.height * r, undefined, "FAST");
    pdf.save(`Estimate_${props.estimate.estimate_number ?? props.estimate.id}.pdf`);
  };

  return (
    <div className="space-y-3">
      <div className="no-print flex gap-2 justify-end">
        <Button variant="secondary" onClick={print}>Print</Button>
        <Button onClick={exportPdf}>Download PDF</Button>
      </div>
      <EstimatePrintSheet {...props} />
    </div>
  );
}