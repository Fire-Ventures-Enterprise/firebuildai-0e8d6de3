import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Printer, CreditCard, QrCode } from "lucide-react";
import { RecordPaymentDialog } from "./RecordPaymentDialog";
import { CollectPaymentDialog } from "./CollectPaymentDialog";
import { QrPayDialog } from "./QrPayDialog";
import { downloadPdfFromNode } from "@/lib/pdf";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceHeaderActionsProps {
  invoice: any;
  onPaymentRecorded?: () => void;
}

export function InvoiceHeaderActions({ invoice, onPaymentRecorded }: InvoiceHeaderActionsProps) {
  const location = useLocation();
  const isPortal = location.pathname.startsWith("/portal/");
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false);
  const [qrPayOpen, setQrPayOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual company settings
  const allowAdminCharge = false; // settings?.payments?.allow_admin_collect_card
  const allowQrPay = true; // settings?.payments?.allow_admin_qr_pay

  const balance = (invoice.total || 0) - (invoice.paid_amount || 0);
  const hasBalance = balance > 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      await downloadPdfFromNode("invoice-print-root", `Invoice_${invoice.invoice_number}.pdf`);
    } catch (error) {
      notify.error("Failed to generate PDF");
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-invoice-payment", {
        body: {
          invoiceId: invoice.id,
          amount: balance,
          customerEmail: invoice.customer_email,
          invoiceNumber: invoice.invoice_number
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      notify.error("Failed to start payment", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPortal) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        {hasBalance && (
          <Button 
            onClick={handleStripePayment}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {loading ? "Processing..." : `Pay $${balance.toFixed(2)}`}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        
        {hasBalance && (
          <>
            <Button variant="secondary" onClick={() => setRecordPaymentOpen(true)}>
              Record Payment
            </Button>
            
            {allowAdminCharge && (
              <Button variant="secondary" onClick={() => setCollectPaymentOpen(true)}>
                <CreditCard className="w-4 h-4 mr-2" />
                Collect Payment
              </Button>
            )}
            
            {allowQrPay && (
              <Button variant="secondary" onClick={() => setQrPayOpen(true)}>
                <QrCode className="w-4 h-4 mr-2" />
                QR Pay
              </Button>
            )}
          </>
        )}
      </div>

      <RecordPaymentDialog
        open={recordPaymentOpen}
        onOpenChange={setRecordPaymentOpen}
        invoice={invoice}
        onSuccess={() => {
          onPaymentRecorded?.();
          setRecordPaymentOpen(false);
        }}
      />

      <CollectPaymentDialog
        open={collectPaymentOpen}
        onOpenChange={setCollectPaymentOpen}
        invoice={invoice}
        onSuccess={() => {
          onPaymentRecorded?.();
          setCollectPaymentOpen(false);
        }}
      />

      <QrPayDialog
        open={qrPayOpen}
        onOpenChange={setQrPayOpen}
        invoice={invoice}
      />
    </>
  );
}