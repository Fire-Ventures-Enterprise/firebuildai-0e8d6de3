import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Smartphone, RefreshCw, Loader2, Clock } from "lucide-react";
import { getMobilePairingLink } from "@/services/pairing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function MobilePairingQRCode() {
  const [qrImage, setQrImage] = useState<string>();
  const [pairingCode, setPairingCode] = useState<string>();
  const [expiresAt, setExpiresAt] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    try {
      setLoading(true);
      const { pairUrl, token, expiresAt } = await getMobilePairingLink();
      
      setPairingCode(token);
      setExpiresAt(new Date(expiresAt).toLocaleTimeString());
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(pairUrl, { 
        width: 256, 
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrImage(qrDataUrl);
    } catch (error) {
      console.error("Error generating pairing link:", error);
      toast({
        title: "Error",
        description: "Failed to generate pairing QR code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <Card className="p-6 max-w-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Pair Your Mobile Device</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : qrImage ? (
          <>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <img 
                src={qrImage} 
                alt="Pairing QR Code" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pairing Code:</span>
                <span className="font-mono font-bold">{pairingCode}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {expiresAt}
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={generate}
              disabled={loading}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Code
            </Button>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Open your phone's camera app</p>
              <p>2. Scan this QR code</p>
              <p>3. You'll be signed in automatically</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Failed to generate QR code</p>
            <Button onClick={generate} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}