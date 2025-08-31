import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EstimateOpenPage() {
  const { token } = useParams<{ token: string }>();
  const searchParams = new URLSearchParams(window.location.search);
  const portalUrl = `${window.location.origin}/portal/estimate/${token}${window.location.search}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = portalUrl;
    }, 1800);
    return () => clearTimeout(timer);
  }, [portalUrl]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
      <div className="max-w-xl text-center space-y-6">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/c78f53fd-e549-485e-a133-aad2f54a5823.png" 
            alt="FireBuildAI" 
            className="h-12 opacity-90"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Opening your estimate…</h1>
          <p className="text-muted-foreground">
            You'll be redirected to the secure portal in a moment. Click below if it doesn't load automatically.
          </p>
        </div>
        <a 
          href={portalUrl} 
          className="inline-block rounded-lg bg-primary text-primary-foreground font-semibold px-6 py-3 hover:bg-primary/90 transition-colors"
        >
          Open Secure Portal
        </a>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Redirecting to secure portal...</span>
        </div>
      </div>
    </div>
  );
}