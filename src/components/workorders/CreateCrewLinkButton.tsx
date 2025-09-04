import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "qrcode";
import { createWorkOrderToken } from "@/services/workOrders";
import { toast } from "sonner";
import { Link, QrCode } from "lucide-react";

export function CreateCrewLinkButton({ workOrderId }: { workOrderId: string }) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string>();
  const [qr, setQr] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function createLink() {
    setLoading(true);
    try {
      const token = await createWorkOrderToken(workOrderId);
      const url = `${location.origin}/portal/work-order/${encodeURIComponent(token)}`;
      setLink(url);
      setQr(await QRCode.toDataURL(url, { width: 256, margin: 1 }));
      setOpen(true);
    } catch (e: any) {
      toast.error(e.message || "Could not create link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={createLink} disabled={loading} variant="outline">
        <Link className="mr-2 h-4 w-4" />
        Create Crew Link
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Crew Access Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            {qr && (
              <div className="flex justify-center">
                <img src={qr} alt="Work Order QR Code" className="border rounded" />
              </div>
            )}
            <div className="p-2 bg-muted rounded text-xs break-all">{link}</div>
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                onClick={() => {
                  if (link) {
                    navigator.clipboard.writeText(link);
                    toast.success("Link copied to clipboard");
                  }
                }}
              >
                Copy Link
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => link && window.open(link, "_blank")}
              >
                Open Link
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link provides crew access to the work order without showing any pricing information. 
              Valid for 48 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}