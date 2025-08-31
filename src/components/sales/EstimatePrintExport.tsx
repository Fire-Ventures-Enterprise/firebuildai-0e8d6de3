import { Button } from "@/components/ui/button";
import { EstimatePrintSheet } from "./EstimatePrintSheet";
import { downloadPdfFromNode } from "@/lib/pdf";
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
  
  const exportPdf = () => {
    downloadPdfFromNode("estimate-print-root", `Estimate_${props.estimate.estimate_number ?? props.estimate.id}.pdf`);
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