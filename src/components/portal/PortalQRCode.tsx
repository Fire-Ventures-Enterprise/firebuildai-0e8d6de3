import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, ExternalLink } from "lucide-react";

interface PortalQRCodeProps {
  url: string;
  label?: string;
  size?: number;
  className?: string;
}

export function PortalQRCode({ 
  url, 
  label = "Scan to view online",
  size = 128,
  className = ""
}: PortalQRCodeProps) {
  const [qrImage, setQrImage] = useState<string>();

  useEffect(() => {
    QRCode.toDataURL(url, { 
      width: size, 
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then(setQrImage).catch(console.error);
  }, [url, size]);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {qrImage ? (
        <img 
          src={qrImage} 
          className="border rounded"
          style={{ width: size * 0.75, height: size * 0.75 }}
          alt="Portal QR Code" 
        />
      ) : (
        <div 
          className="bg-muted rounded flex items-center justify-center"
          style={{ width: size * 0.75, height: size * 0.75 }}
        >
          <QrCode className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          {label}
        </div>
        <div className="text-xs text-muted-foreground break-all font-mono">
          {url}
        </div>
      </div>
    </div>
  );
}