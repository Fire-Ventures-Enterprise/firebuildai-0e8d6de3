import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Paintbrush, 
  CheckCircle2, 
  Palette,
  Calculator,
  Camera,
  Clock,
  FileText,
  Droplets,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function PaintersPage() {
  useEffect(() => {
    document.title = "Painter Software | FireBuild - Estimate Paint & Manage Projects";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional painting contractor software. Calculate paint quantities, track project phases, manage color specifications, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Automated paint quantity calculations",
    "Color matching and specification tracking",
    "Multi-phase project management",
    "Photo documentation and progress tracking",
    "Surface area measurements and room mapping"
  ];

  const features = [
    {
      icon: Calculator,
      title: "Paint Calculator",
      description: "Automatically calculate paint quantities based on surface area, coats needed, and coverage rates."
    },
    {
      icon: Palette,
      title: "Color Management",
      description: "Track paint colors, brands, finishes, and custom mixes with digital color swatches and specs."
    },
    {
      icon: Camera,
      title: "Before/After Photos",
      description: "Document project progress with organized photo galleries and side-by-side comparisons."
    },
    {
      icon: FileText,
      title: "Phase Tracking",
      description: "Manage prep work, priming, painting, and touch-ups with detailed phase scheduling."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 mb-6">
                <Paintbrush className="h-4 w-4" />
                <span className="text-sm font-medium">Painters</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Transform Your Painting Business with{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Smart Tools
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional painting software for accurate estimates, paint calculations, 
                color management, and project tracking. Handle residential and commercial 
                projects while getting paid instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-purple-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-purple-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-purple-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Paintbrush className="h-5 w-5" />
                    <span className="font-semibold">Project Overview</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Interior - 3 Bedroom Home</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Office Building Exterior</span>
                      <span className="text-sm font-semibold text-yellow-500">Painting</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Restaurant Interior</span>
                      <span className="text-sm font-semibold text-blue-500">Prep Work</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-semibold">7 Projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Painters Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Painters Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Solution */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Painting Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to estimate paint quantities, manage color specifications, 
              track project phases, and grow your painting business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Built for Professional Painters
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Surface Prep Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Document prep work, repairs, and priming requirements
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Mobile Estimating</h3>
              <p className="text-sm text-muted-foreground">
                Measure rooms, calculate paint, and create estimates on-site
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Job Costing</h3>
              <p className="text-sm text-muted-foreground">
                Track labor, materials, and overhead for accurate pricing
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-purple-500/10 via-background to-background border-purple-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Painting Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of painting contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline">
                  See All Features
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
}