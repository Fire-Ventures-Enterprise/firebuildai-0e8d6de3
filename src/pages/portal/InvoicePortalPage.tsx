import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, CreditCard, Loader2 } from "lucide-react";
import { SalesPublic } from "@/services/salesPublic";
import { InvoicePrint, BaseDoc } from "@/components/print/DocumentPrint";
import { format } from "date-fns";
import { downloadPdfFromNode } from "@/lib/pdf";
import { toast } from "sonner";

export default function InvoicePortalPage() {
  const { token } = useParams<{ token: string }>();
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    SalesPublic.getInvoiceByToken(token)
      .then((data) => {
        setInv(data);
      })
      .catch((err) => {
        console.error("Failed to fetch invoice:", err);
        toast.error("Failed to load invoice");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  // Calculate payment summary
  const paid = inv.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
  const balance = inv.total - paid;

  // Transform invoice data to BaseDoc format
  const invoiceDoc: Omit<BaseDoc, "kind"> = {
    number: inv.invoice_number,
    date: format(new Date(inv.issue_date), "MMM dd, yyyy"),
    dueDate: inv.due_date ? format(new Date(inv.due_date), "MMM dd, yyyy") : undefined,
    statusLabel: balance <= 0 ? "PAID" : inv.status?.toUpperCase() || "DRAFT",
    org: {
      name: inv.company?.name || "Your Company",
      logoUrl: inv.company?.logo_url,
      address: inv.company?.address ? 
        `${inv.company.address}${inv.company.city ? `\n${inv.company.city}, ${inv.company.province || ""} ${inv.company.postal_code || ""}` : ""}`.trim() : 
        undefined,
      phone: inv.company?.phone,
      email: inv.company?.email,
    },
    billTo: {
      name: inv.customer_name || "Customer",
      address: inv.customer_address ? 
        `${inv.customer_address}${inv.customer_city ? `\n${inv.customer_city}, ${inv.customer_province || ""} ${inv.customer_postal_code || ""}` : ""}`.trim() :
        undefined,
      email: inv.customer_email,
      phone: inv.customer_phone,
    },
    items: (inv.items || []).map((item: any, idx: number) => ({
      id: item.id || `item-${idx}`,
      title: item.item_name || item.description || "Item",
      description: item.description !== item.item_name ? item.description : undefined,
      quantity: item.quantity || 1,
      unit: item.unit,
      rate: item.rate || 0,
      total: item.amount || 0,
    })),
    subtotal: { currency: "USD", value: inv.subtotal || 0 },
    discount: inv.discount_amount ? { currency: "USD", value: inv.discount_amount } : undefined,
    tax: inv.tax_amount ? { currency: "USD", value: inv.tax_amount } : undefined,
    total: { currency: "USD", value: inv.total || 0 },
    paymentSummary: {
      totalPaid: paid > 0 ? { currency: "USD", value: paid } : undefined,
      remainingDue: balance > 0 ? { currency: "USD", value: balance } : undefined,
    },
    notes: inv.notes,
    terms: inv.terms_conditions || "Payment due within terms specified. Thank you for your business.",
    signatureLine: false,
  };

  const downloadPdf = async () => {
    try {
      await downloadPdfFromNode("invoice-print", `Invoice-${inv.invoice_number}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download invoice");
    }
  };

  const payNow = async () => {
    if (!token) return;
    
    try {
      // TODO: Implement payment flow
      toast.info("Payment feature coming soon");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Invoice #{inv.invoice_number}</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={downloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {balance > 0 && (
              <Button onClick={payNow}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm" id="invoice-print">
          <InvoicePrint doc={invoiceDoc} />
        </div>
      </div>
    </div>
  );
}