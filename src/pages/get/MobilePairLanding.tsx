import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobilePairLanding() {
  const params = new URLSearchParams(window.location.search);
  const actionLink = params.get("al") || "";
  const pairingToken = params.get("pt") || "";

  useEffect(() => {
    // Try to open the action link after a short delay
    // This gives time for any app deep link handlers to respond
    if (actionLink) {
      const timer = setTimeout(() => {
        window.location.href = actionLink;
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [actionLink]);

  if (!actionLink) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="max-w-lg space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-destructive">Invalid Link</h1>
          <p className="text-muted-foreground">
            This pairing link is invalid or has expired. Please generate a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <div className="max-w-lg space-y-6 text-center">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/a384a2f8-9029-4efd-b9db-d6facfe2369c.png" 
            alt="FireBuild.ai"
            className="h-12 opacity-90" 
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Pairing Your Device</h1>
          <p className="text-muted-foreground">
            You're being signed in securely...
          </p>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If the app doesn't open automatically, tap the button below:
          </p>
          
          <Button 
            size="lg"
            onClick={() => window.location.href = actionLink}
            className="w-full max-w-xs"
          >
            Continue to App
          </Button>
        </div>
        
        {pairingToken && (
          <div className="text-xs text-muted-foreground">
            Pairing code: <span className="font-mono font-bold">{pairingToken}</span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground pt-4">
          This link securely signs you in on this device and expires in 10 minutes.
        </div>
      </div>
    </div>
  );
}