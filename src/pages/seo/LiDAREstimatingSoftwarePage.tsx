import { ArrowRight, Check, Smartphone, Zap, Ruler, CheckCircle, TrendingUp, Play, Clock, DollarSign, Award, Users, Scan, Home, HardHat, Layers, Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import lidarScanningImage from "@/assets/lidar-scanning-ipad.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LiDAREstimatingSoftwarePage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when LiDAR scanning launches.",
      });
      setEmail("");
    }
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FireBuild.ai LiDAR Estimating Software",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "LiDAR estimating software for contractors. Instantly measure rooms, roofs & surfaces with no tape measure required.",
    "operatingSystem": "iOS, Android",
    "screenshot": "https://firebuild.ai/images/lidar-screenshot.jpg",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "312"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is LiDAR estimating software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR estimating software uses your phone's built-in LiDAR or ARCore sensors to capture room, roof, or surface dimensions and auto-fill them into estimates."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need special hardware?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR is supported on iPhone Pro models and many newer Android phones with ARCore. FireBuild.ai works across both platforms."
        }
      },
      {
        "@type": "Question",
        "name": "Is this available now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR scanning is launching soon. You can join the waitlist today to get early access."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is LiDAR measuring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR can capture dimensions with centimeter-level accuracy, reducing errors compared to manual tape measures."
        }
      }
    ]
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                  LiDAR Estimating Software for Contractors
                </h1>
                <p className="text-xl text-muted-foreground">
                  Say goodbye to tape measures. Get instant, accurate dimensions with FireBuild.ai's upcoming LiDAR scanning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-8">
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo Preview
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">312+ contractors waiting</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual - LiDAR Scanning in Action */}
              <div className="relative">
                <Card className="aspect-[4/3] overflow-hidden border-2 border-primary/20">
                  <img 
                    src={lidarScanningImage} 
                    alt="LiDAR scanning through iPad showing room measurements"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Real-Time Measurement</h3>
                    <div className="flex gap-3 text-sm">
                      <span className="px-3 py-1 bg-primary/10 rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Active Scan
                      </span>
                      <span className="px-3 py-1 bg-primary/10 rounded-full">Wall: 12' 6"</span>
                      <span className="px-3 py-1 bg-primary/10 rounded-full">Area: 384 sq ft</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Why LiDAR for Contractors */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Faster, Smarter, More Accurate Estimates
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Contractors lose hours every week measuring rooms, roofs, and surfaces by hand. 
                LiDAR scanning changes that. With FireBuild.ai, you'll be able to:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ruler className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">📏 Scan Any Space</h3>
                  <p className="text-muted-foreground">
                    Instantly capture room dimensions, wall lengths, or roof pitches.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">⚡ Speed Up Estimates</h3>
                  <p className="text-muted-foreground">
                    No more manual entry — dimensions drop straight into your estimate.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">✅ Win More Jobs</h3>
                  <p className="text-muted-foreground">
                    Impress clients with fast, professional, and accurate quotes.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">💸 Avoid Costly Errors</h3>
                  <p className="text-muted-foreground">
                    Reduce re-measuring mistakes that eat into profits.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                From Phone Scan to Estimate in Seconds
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-lg">Open FireBuild.ai on Your Phone</h3>
                <p className="text-muted-foreground">Choose LiDAR Scan from the menu</p>
              </div>

              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-lg">Point & Scan</h3>
                <p className="text-muted-foreground">Walk the room or surface with your device</p>
              </div>

              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-lg">Instant Measurements</h3>
                <p className="text-muted-foreground">Accurate dimensions captured automatically</p>
              </div>

              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-lg">Auto-Filled Estimate</h3>
                <p className="text-muted-foreground">Numbers populate directly into your estimate template</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Real-World Use Cases */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                LiDAR Scanning Made for Contractors
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">🏠 Kitchen Remodels</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure walls, counters, backsplash areas instantly.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hammer className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">🛠️ Roofing & Siding</h3>
                  <p className="text-sm text-muted-foreground">
                    Capture roof pitch, eaves, and wall lengths in minutes.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">🪵 Flooring & Interiors</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan floor areas to generate material needs fast.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HardHat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">🧱 General Contracting</h3>
                  <p className="text-sm text-muted-foreground">
                    Eliminate manual tape work on multi-room projects.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4: Why FireBuild.ai vs. Other Apps */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Built for Contractors — Not Just Techies
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Clean & Simple</h3>
                      <p className="text-muted-foreground">
                        No overwhelming dashboards, just what you need.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">End-to-End Workflow</h3>
                      <p className="text-muted-foreground">
                        Estimates → Invoices → Work Orders → Payments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Made for North America</h3>
                      <p className="text-muted-foreground">
                        Handles US & Canadian taxes, provinces, and trade needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Future-Proof</h3>
                      <p className="text-muted-foreground">
                        With LiDAR, ARCore, and AI integrations coming, you'll never outgrow the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Card className="p-8 border-2 border-primary/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h3 className="font-semibold text-lg">Comparison</h3>
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-semibold">Feature</div>
                        <div className="text-center font-semibold text-primary">FireBuild.ai</div>
                        <div className="text-center font-semibold text-muted-foreground">Others</div>
                      </div>
                      
                      {[
                        ["LiDAR Scanning", "✓", "✗"],
                        ["Built for Trades", "✓", "✗"],
                        ["One-Click Estimates", "✓", "✗"],
                        ["Work Orders", "✓", "Limited"],
                        ["Client Portal", "✓", "✗"],
                        ["US/Canada Support", "✓", "Limited"],
                      ].map(([feature, us, them], index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-muted-foreground">{feature}</div>
                          <div className="text-center text-primary font-semibold">{us}</div>
                          <div className="text-center text-muted-foreground">{them}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Coming Soon - Be First in Line */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Get Early Access to LiDAR Scanning
              </h2>
              <p className="text-lg text-muted-foreground">
                FireBuild.ai is rolling out LiDAR scanning in upcoming updates. 
                Be first to experience faster, smarter estimating.
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
                No credit card required • Early bird pricing • Priority support
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                LiDAR Estimating FAQ
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">What is LiDAR estimating software?</span>
                </AccordionTrigger>
                <AccordionContent>
                  LiDAR estimating software uses your phone's built-in LiDAR or ARCore sensors to capture room, roof, or surface dimensions and auto-fill them into estimates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Do I need special hardware?</span>
                </AccordionTrigger>
                <AccordionContent>
                  LiDAR is supported on iPhone Pro models and many newer Android phones with ARCore. FireBuild.ai works across both platforms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Is this available now?</span>
                </AccordionTrigger>
                <AccordionContent>
                  LiDAR scanning is launching soon. You can join the waitlist today to get early access.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">How accurate is LiDAR measuring?</span>
                </AccordionTrigger>
                <AccordionContent>
                  LiDAR can capture dimensions with centimeter-level accuracy, reducing errors compared to manual tape measures.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Which trades benefit most from LiDAR scanning?</span>
                </AccordionTrigger>
                <AccordionContent>
                  All construction trades benefit, but especially roofers, flooring contractors, painters, kitchen/bath remodelers, and general contractors who need fast, accurate measurements for multiple rooms or surfaces.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Can I export measurements to other software?</span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes, FireBuild.ai will support exporting measurements to PDF, Excel, and direct integration with popular estimating formats.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">Does it work offline?</span>
                </AccordionTrigger>
                <AccordionContent>
                  The scanning feature works offline, but you'll need an internet connection to sync measurements to your FireBuild.ai account and generate estimates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">What's the pricing for LiDAR features?</span>
                </AccordionTrigger>
                <AccordionContent>
                  LiDAR scanning will be included in FireBuild.ai Pro plans. Early adopters who join the waitlist will receive special launch pricing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="p-8 sm:p-12 border-2 border-primary/20">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Ready to Estimate Smarter?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of contractors using FireBuild.ai — and be first to experience LiDAR scanning.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="px-8">
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link to="/signup">
                    <Button size="lg" variant="outline" className="px-8">
                      Try FireBuild.ai Free
                    </Button>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">312+</div>
                    <div className="text-sm text-muted-foreground">Contractors Waiting</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.8/5</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Q2 2025</div>
                    <div className="text-sm text-muted-foreground">Expected Launch</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">FireBuild.ai</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  The future of contractor estimating with LiDAR technology.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Features</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/features/estimates" className="text-muted-foreground hover:text-foreground">Estimates</Link></li>
                  <li><Link to="/features/invoicing" className="text-muted-foreground hover:text-foreground">Invoicing</Link></li>
                  <li><Link to="/features/scheduling" className="text-muted-foreground hover:text-foreground">Scheduling</Link></li>
                  <li><Link to="/lidar-estimating-software" className="text-muted-foreground hover:text-foreground">LiDAR Scanning</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/tutorials" className="text-muted-foreground hover:text-foreground">Tutorials</Link></li>
                  <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                  <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                  <li><Link to="/api-docs" className="text-muted-foreground hover:text-foreground">API Docs</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                  <li><Link to="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2024 FireBuild.ai. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
                <Link to="/status" className="text-muted-foreground hover:text-foreground">Status</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}