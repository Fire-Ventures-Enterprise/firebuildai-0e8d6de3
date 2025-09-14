import { ArrowRight, Check, Smartphone, Zap, Ruler, CheckCircle, TrendingUp, Target, Scan, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/SEOHead";

export default function LiDARScanningPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is LiDAR estimating available now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR scanning is coming Q1 2025. Join the waitlist for early access and special pricing."
        }
      }
    ]
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when LiDAR scanning is available.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEOHead 
        title="LiDAR Estimating Software | Construction Scanning - FireBuild.AI"
        description="LiDAR scanning for instant measurements. Create estimates 10x faster. Coming Q1 2025. Join waitlist for early access."
        keywords="lidar estimating software, construction lidar scanning, lidar measurement app"
        canonicalUrl="https://firebuild.ai/features/lidar-scanning"
        jsonLd={faqSchema}
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                FireBuild.ai
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/features">
                <Button variant="ghost">Features</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Scan className="h-4 w-4" />
              Coming Soon
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Next-Gen Contractor Estimates with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                LiDAR Scanning
              </span>
            </h1>
            <h2 className="text-2xl text-muted-foreground">
              Ditch the tape measure. Capture accurate room, roof, and surface dimensions in seconds — straight from your phone.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you're quoting a kitchen remodel, roof replacement, or flooring install, 
              FireBuild.ai will soon make measuring as simple as pointing your phone.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Ruler className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">📏 Measure Instantly</h3>
                <p className="text-muted-foreground">
                  Scan rooms, roofs, and surfaces with centimeter-level accuracy.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">⚡ Faster Estimates</h3>
                <p className="text-muted-foreground">
                  Auto-fill dimensions into your estimates, no manual input required.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">✅ Reduce Errors</h3>
                <p className="text-muted-foreground">
                  Eliminate costly re-measures and miscalculations.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">📲 Mobile First</h3>
                <p className="text-muted-foreground">
                  Works with iPhone (LiDAR) and Android (ARCore).
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Comparison Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">See the Difference</h2>
              <div className="space-y-8">
                {/* Old Way */}
                <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <span className="text-destructive font-bold">✗</span>
                      </div>
                      <h3 className="font-semibold text-lg">Old Way (Tape Measure)</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Takes 30-45 minutes per room
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Requires 2 people for accuracy
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Manual calculations prone to errors
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Paper notes get lost or damaged
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* New Way */}
                <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">New Way (LiDAR Scan)</h3>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        Complete room scan in 2-3 minutes
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        One person operation
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        Automatic calculations with AI
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        Digital measurements saved to cloud
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            {/* Visual Placeholder */}
            <div className="relative">
              <Card className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="h-32 w-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      Contractor holding phone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Digital overlay measurements appearing in real-time
                    </p>
                    <div className="flex gap-2 justify-center">
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                        Room: 12' x 14'
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                        Ceiling: 9'
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium">
                        384 sq ft
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How LiDAR Scanning Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to accurate measurements</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-lg">Open FireBuild.ai</h3>
              <p className="text-muted-foreground">
                Launch the app and select "LiDAR Scan" from your estimate tools
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-lg">Point & Scan</h3>
              <p className="text-muted-foreground">
                Hold your phone and slowly move around the space to capture dimensions
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-lg">Auto-Generate Estimate</h3>
              <p className="text-muted-foreground">
                Measurements automatically populate your estimate with material calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <Card className="p-8 sm:p-12 border-2 border-primary/20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Limited Early Access
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Be the first to try LiDAR scanning in FireBuild.ai
              </h2>
              <p className="text-lg text-muted-foreground">
                Join the waitlist today and get exclusive early access when we launch.
              </p>
              
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button type="submit" size="lg" className="px-8">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground">
                No credit card required • Be notified when available • Early bird pricing
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perfect for Every Trade</h2>
            <p className="text-lg text-muted-foreground">LiDAR scanning transforms estimates across all construction trades</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Kitchen Remodels", icon: "🔨", description: "Instantly measure cabinets, countertops, and floor space" },
              { title: "Roofing", icon: "🏠", description: "Calculate roof area, pitch, and material needs from ground level" },
              { title: "Flooring", icon: "📐", description: "Get precise room dimensions and automatic waste calculations" },
              { title: "Painting", icon: "🎨", description: "Measure wall surface area minus windows and doors" },
              { title: "HVAC", icon: "❄️", description: "Calculate ductwork runs and equipment sizing" },
              { title: "Landscaping", icon: "🌳", description: "Measure yard dimensions, slopes, and hardscape areas" },
            ].map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">FireBuild.ai</span>
              <span className="text-muted-foreground">© 2024</span>
            </div>
            <div className="flex gap-6">
              <Link to="/features" className="text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}