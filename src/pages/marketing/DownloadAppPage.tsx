import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { Apple, Chrome, Download, Smartphone, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { R } from "@/routes/routeMap";

const LINKS = {
  ANDROID_APK: "https://cdn.firebuildai.com/app/firebuildai-latest.apk", // Host versioned APKs
  GOOGLE_PLAY: "", // Future: https://play.google.com/store/apps/details?id=com.firebuildai.app
  IOS_STORE: "", // Future: https://apps.apple.com/app/id1234567890
  IOS_TESTFLIGHT: "", // Optional TestFlight invite link
  PWA_URL: "https://app.firebuildai.com", // Installable PWA fallback
};

function isAndroid() { return /Android/i.test(navigator.userAgent); }
function isIOS() { return /iPhone|iPad|iPod/i.test(navigator.userAgent); }

export default function DownloadAppPage() {
  const [qr, setQr] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Pick best target for this visitor
  const targetUrl = useMemo(() => {
    if (isAndroid()) return LINKS.GOOGLE_PLAY || LINKS.ANDROID_APK || LINKS.PWA_URL;
    if (isIOS()) return LINKS.IOS_STORE || LINKS.IOS_TESTFLIGHT || LINKS.PWA_URL;
    return LINKS.PWA_URL; // Desktop → show QR + PWA/open app
  }, []);

  useEffect(() => { 
    QRCode.toDataURL(targetUrl, { 
      width: 256, 
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then(setQr); 
  }, [targetUrl]);

  const showPlay = Boolean(LINKS.GOOGLE_PLAY);
  const showApk = Boolean(LINKS.ANDROID_APK);
  const showStore = Boolean(LINKS.IOS_STORE);
  const showTF = Boolean(LINKS.IOS_TESTFLIGHT);

  const copyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={R.home} className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/c78f53fd-e549-485e-a133-aad2f54a5823.png" 
                alt="FireBuildAI" 
                className="h-8" 
              />
              <span className="text-xl font-bold">FireBuild</span>
            </Link>
            <Link to={R.login}>
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Get the FireBuildAI App
              </h1>
              <p className="text-xl text-muted-foreground">
                Install on your phone to capture receipts, manage jobs, create estimates, 
                and sync seamlessly with your desktop.
              </p>
            </div>

            {/* Android Buttons */}
            {isAndroid() && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Android</h3>
                </div>
                
                {showPlay ? (
                  <a href={LINKS.GOOGLE_PLAY} className="block">
                    <Button className="w-full h-14 text-base" size="lg">
                      <Chrome className="mr-2 h-5 w-5" />
                      Get it on Google Play
                    </Button>
                  </a>
                ) : showApk ? (
                  <a href={LINKS.ANDROID_APK} download className="block">
                    <Button className="w-full h-14 text-base" size="lg">
                      <Download className="mr-2 h-5 w-5" />
                      Download Android APK
                    </Button>
                  </a>
                ) : (
                  <a href={LINKS.PWA_URL} className="block">
                    <Button variant="secondary" className="w-full h-14 text-base" size="lg">
                      <Smartphone className="mr-2 h-5 w-5" />
                      Open Web App
                    </Button>
                  </a>
                )}
                
                {!showPlay && (
                  <p className="text-sm text-muted-foreground">
                    Play Store version coming soon. Download APK for immediate access.
                  </p>
                )}
              </Card>
            )}

            {/* iOS Buttons */}
            {isIOS() && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">iOS</h3>
                </div>
                
                {showStore ? (
                  <a href={LINKS.IOS_STORE} className="block">
                    <Button className="w-full h-14 text-base" size="lg">
                      <Apple className="mr-2 h-5 w-5" />
                      Download on App Store
                    </Button>
                  </a>
                ) : showTF ? (
                  <a href={LINKS.IOS_TESTFLIGHT} className="block">
                    <Button className="w-full h-14 text-base" size="lg">
                      <Apple className="mr-2 h-5 w-5" />
                      Join TestFlight Beta
                    </Button>
                  </a>
                ) : (
                  <a href={LINKS.PWA_URL} className="block">
                    <Button variant="secondary" className="w-full h-14 text-base" size="lg">
                      <Smartphone className="mr-2 h-5 w-5" />
                      Open Web App
                    </Button>
                  </a>
                )}
                
                {!showStore && (
                  <p className="text-sm text-muted-foreground">
                    App Store version coming soon. Use web app for immediate access.
                  </p>
                )}
              </Card>
            )}

            {/* Desktop/Unknown */}
            {!isAndroid() && !isIOS() && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Access FireBuildAI</h3>
                </div>
                
                <a href={targetUrl} className="block">
                  <Button className="w-full h-14 text-base" size="lg">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Open App
                  </Button>
                </a>
                
                <p className="text-sm text-muted-foreground">
                  Or scan the QR code with your phone's camera to download
                </p>
              </Card>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Offline Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Push Notifications</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Camera Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">GPS Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Biometric Security</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="p-8 w-full max-w-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Scan to Download</h3>
                </div>
                
                {qr && (
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg">
                      <img src={qr} width={240} height={240} alt="Download QR Code" />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">How to install:</p>
                  <ol className="space-y-1">
                    <li>1. Open camera on your phone</li>
                    <li>2. Point at this QR code</li>
                    <li>3. Tap the notification</li>
                    <li>4. Install or add to home screen</li>
                  </ol>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={copyLink}
                >
                  {copySuccess ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </Card>

            {/* Version Info */}
            <Card className="p-4 w-full max-w-sm bg-muted/50">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Current Version:</span>
                  <span className="font-mono">1.2.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Build Date:</span>
                  <span className="font-mono">Dec 31, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-mono">com.firebuildai.app</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of contractors who are streamlining their operations with FireBuildAI
            </p>
            <Link to={R.signup}>
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}