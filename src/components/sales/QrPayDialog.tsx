import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, ExternalLink } from "lucide-react";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";

interface QrPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
}

export function QrPayDialog({ open, onOpenChange, invoice }: QrPayDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [checkoutUrl, setCheckoutUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const balance = (invoice.total || 0) - (invoice.paid_amount || 0);

  useEffect(() => {
    if (!open) {
      setQrDataUrl(undefined);
      setCheckoutUrl(undefined);
      return;
    }

    generateQrCode();
  }, [open, invoice.id]);

  const generateQrCode = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke("create-invoice-checkout-session", {
        body: { invoice_id: invoice.id }
      });

      if (response.error) throw response.error;
      
      const { url, expires_at } = response.data;
      if (!url) throw new Error("No checkout URL received");

      setCheckoutUrl(url);
      
      // Generate QR code
      const qr = await QRCode.toDataURL(url, { 
        width: 256, 
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(qr);
    } catch (error) {
      notify.error("Failed to generate QR code", error);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (checkoutUrl) {
      navigator.clipboard.writeText(checkoutUrl);
      notify.success("Payment link copied to clipboard");
    }
  };

  const openLink = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Payment - ${balance.toFixed(2)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center py-4">
          {loading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-sm text-muted-foreground">Generating QR code...</p>
            </div>
          ) : qrDataUrl ? (
            <>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={qrDataUrl} 
                  alt="Scan to pay" 
                  className="mx-auto"
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Customer scans this code with their phone camera to pay
              </p>

              <div className="flex justify-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={openLink}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link
                </Button>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  The invoice will be automatically marked as paid once the customer completes payment
                </p>
              </div>
            </>
          ) : (
            <div className="py-8">
              <p className="text-sm text-muted-foreground">Failed to generate QR code</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}