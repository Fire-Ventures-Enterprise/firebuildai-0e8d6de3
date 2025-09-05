import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink, RefreshCw, QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

interface CrewPortalLinkProps {
  workOrderId: string;
  open: boolean;
  onClose: () => void;
}

export function CrewPortalLink({ workOrderId, open, onClose }: CrewPortalLinkProps) {
  const [link, setLink] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (open && workOrderId) {
      generateLink();
    }
  }, [open, workOrderId]);
  
  const generateLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_work_order_token', {
        p_work_order_id: workOrderId
      });
      
      if (error) throw error;
      
      const url = `${window.location.origin}/portal/work-order/${data}`;
      setLink(url);
      
      // Generate QR code
      const qr = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qr);
    } catch (error: any) {
      toast.error("Failed to generate crew link");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const regenerateLink = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('regenerate_wo_token', {
        p_wo_id: workOrderId
      });
      
      if (error) throw error;
      
      const url = `${window.location.origin}/portal/work-order/${data}`;
      setLink(url);
      
      // Generate new QR code
      const qr = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qr);
      
      toast.success("New crew link generated");
    } catch (error: any) {
      toast.error("Failed to regenerate link");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };
  
  const openLink = () => {
    window.open(link, '_blank');
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="crew-link-dialog">
        <DialogHeader>
          <DialogTitle>Crew Access Link</DialogTitle>
          <DialogDescription>
            Share this link or QR code with your crew. They can access the work order without seeing pricing information.
            The link expires in 7 days.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code" className="border rounded-lg" />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="link">Crew Portal Link</Label>
            <div className="flex gap-2">
              <Input
                id="link"
                value={link}
                readOnly
                className="flex-1"
                data-testid="crew-link-input"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyLink}
                disabled={!link}
                data-testid="btn-copy-link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={openLink}
                disabled={!link}
                data-testid="btn-open-link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={regenerateLink}
              disabled={loading}
              data-testid="btn-regenerate-link"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Link
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}