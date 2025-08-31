import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadPdfFromNode(nodeId: string, filename: string) {
  const el = document.getElementById(nodeId);
  if (!el) throw new Error(`PDF root not found: ${nodeId}`);
  const canvas = await html2canvas(el, { scale: 2, useCORS: true });
  const img = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const r = Math.min(pw / canvas.width, ph / canvas.height);
  const w = canvas.width * r;
  const h = canvas.height * r;

  pdf.addImage(img, "PNG", (pw - w) / 2, 20, w, h, undefined, "FAST");
  pdf.save(filename);
}