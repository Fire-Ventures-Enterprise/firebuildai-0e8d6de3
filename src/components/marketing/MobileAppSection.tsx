import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, QrCode, Apple, Chrome } from "lucide-react";
import QRCode from "qrcode";

export function MobileAppSection() {
  const [qrImage, setQrImage] = useState<string>();
  
  // For now, both links redirect to the download page
  // Replace these with actual app store links when native apps are ready
  const iosAppLink = "/download"; // Future: https://apps.apple.com/...
  const androidAppLink = "/download"; // Future: https://play.google.com/...
  const webAppLink = "/download";
  
  useEffect(() => {
    // Generate QR code for mobile download page
    QRCode.toDataURL(webAppLink, { 
      width: 200, 
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then(setQrImage);
  }, []);
  
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Take FireBuild Everywhere
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access your business on the go. Available on all devices - manage jobs, 
            create estimates, and track expenses from anywhere.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Download Options */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">Download Mobile App</h3>
              </div>
              
              <p className="text-muted-foreground">
                Get the full FireBuild experience optimized for mobile devices. 
                Native apps coming soon to app stores!
              </p>
              
              <div className="space-y-4">
                {/* iOS App Store Button */}
                <a 
                  href={iosAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-14 relative overflow-hidden group"
                  >
                    <Apple className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </Button>
                </a>
                
                {/* Google Play Button */}
                <a 
                  href={androidAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-14 relative overflow-hidden group"
                  >
                    <Chrome className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Get it on</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </Button>
                </a>
                
                {/* Web App Button */}
                <a 
                  href={webAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full gap-2 h-14">
                    <Download className="h-5 w-5" />
                    Open Web App Now
                  </Button>
                </a>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Available Now:</strong> Full web app works on all mobile browsers
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Coming Q1 2025:</strong> Native iOS & Android apps with offline support
                </p>
              </div>
            </div>
          </Card>
          
          {/* QR Code Section */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">Scan to Download</h3>
              </div>
              
              <p className="text-muted-foreground">
                Scan this QR code with your phone's camera to instantly access FireBuild
              </p>
              
              {qrImage && (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <img 
                      src={qrImage} 
                      alt="Download QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold">1.</span>
                  <span>Open your phone's camera app</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold">2.</span>
                  <span>Point it at this QR code</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold">3.</span>
                  <span>Tap the notification to open FireBuild</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-semibold">4.</span>
                  <span>Add to home screen for app-like experience</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Works Offline</h4>
            <p className="text-sm text-muted-foreground">
              Continue working even without internet connection
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Instant Updates</h4>
            <p className="text-sm text-muted-foreground">
              Always get the latest features automatically
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Quick Access</h4>
            <p className="text-sm text-muted-foreground">
              Add to home screen for one-tap access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}