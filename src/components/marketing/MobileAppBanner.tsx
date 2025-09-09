import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Apple, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCode from 'qrcode';

export const MobileAppBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    // Generate QR code for the app download link
    const generateQR = async () => {
      try {
        // This would be your actual app store URL
        const appUrl = 'https://2c86a246-efc9-41cc-aae2-dc1f5ae58ed8.lovableproject.com';
        const dataUrl = await QRCode.toDataURL(appUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQR();
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-transparent border-b border-border/50 px-4 py-3 relative">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Get the FireBuild AI mobile app for iOS and Android!
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQRModal(true)}
              className="bg-orange-200 hover:bg-orange-300 text-orange-900 border-orange-300"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowQRModal(false)}>
          <Card className="max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Smartphone className="h-12 w-12 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Download FireBuild AI</h2>
                <p className="text-muted-foreground">
                  Scan the QR code with your phone camera to download the app
                </p>
              </div>

              {qrCodeDataUrl && (
                <div className="flex justify-center py-4">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <img src={qrCodeDataUrl} alt="Download QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or download from</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <Apple className="mr-2 h-4 w-4" />
                    App Store
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h14c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-14c-.83 0-1.5-.67-1.5-1.5zM16.5 9L13 5.5 9.5 9 6 13.5l3.5 3.5L13 13.5l3.5 3.5z"/>
                    </svg>
                    Google Play
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Available for iOS 13+ and Android 8+
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};