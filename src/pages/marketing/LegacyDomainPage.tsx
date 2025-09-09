import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Rocket, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const LegacyDomainPage = () => {
  const [countdown, setCountdown] = useState(10);
  const newDomain = "https://firebuild.ai";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect after countdown
          window.location.href = newDomain;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur">
          <CardContent className="p-12">
            {/* Logo and Announcement */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl mb-6 animate-pulse">
                <Rocket className="h-10 w-10 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">We've Moved!</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                FireBuild is Now FireBuild.ai
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                We've upgraded to a new domain that better reflects our AI-powered platform for contractors.
                You'll be redirected automatically in {countdown} seconds.
              </p>
            </div>

            {/* Benefits of the change */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg mb-3">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Faster Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Improved infrastructure for lightning-fast load times
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg mb-3">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Enhanced Security</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade protection for your business data
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg mb-3">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">AI-First Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge AI features to automate your workflow
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = newDomain}
                className="group"
              >
                Go to FireBuild.ai Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Update bookmarks reminder
                  alert("Don't forget to update your bookmarks to firebuild.ai!");
                  window.location.href = newDomain;
                }}
              >
                Update My Bookmarks
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-10 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> All your data, accounts, and settings remain exactly the same.
                <br />
                This is just a domain change to better serve you.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                If you're not redirected automatically, please visit{" "}
                <a href={newDomain} className="text-primary hover:underline">
                  firebuild.ai
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};