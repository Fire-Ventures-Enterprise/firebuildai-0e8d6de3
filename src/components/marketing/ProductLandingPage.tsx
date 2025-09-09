import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Rocket, Bell, Users, Star, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ProductLandingPageProps {
  productName: string;
  productTagline: string;
  productDescription: string;
  features: string[];
  subdomain: string;
  accentColor?: string;
  icon?: React.ElementType;
  betaFeatures?: string[];
}

export function ProductLandingPage({
  productName,
  productTagline,
  productDescription,
  features,
  subdomain,
  accentColor = "hsl(var(--primary))",
  icon: Icon = Rocket,
  betaFeatures = [],
}: ProductLandingPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      // Store the beta interest in the database
      const { error } = await supabase
        .from("beta_registrations")
        .insert([
          {
            email,
            product: productName,
            subdomain,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already on the waitlist!");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the beta program! We'll notify you when it launches.");
        setEmail("");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full" />
              <Icon className="h-16 w-16 text-primary relative" />
            </div>
          </div>
          
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {productName}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            {productTagline}
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
            {productDescription}
          </p>

          {/* Email Signup Form */}
          <Card className="max-w-md mx-auto mb-12 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Join the Beta Program
              </CardTitle>
              <CardDescription>
                Be the first to experience {productName} and shape its future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Joining..." : "Get Early Access"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Join 500+ contractors already on the waitlist
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What's Coming
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Beta Features Section */}
          {betaFeatures.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-center mb-8">
                Exclusive Beta Features
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {betaFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <Star className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Beta Program Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Free access during beta period</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Direct input on feature development</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Lifetime discount when we launch</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Priority support and onboarding</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">
          Coming to <span className="font-semibold text-foreground">{subdomain}.firebuild.ai</span>
        </p>
        <Button variant="outline" asChild>
          <a href="/">
            Return to FireBuild
          </a>
        </Button>
      </div>
    </div>
  );
}