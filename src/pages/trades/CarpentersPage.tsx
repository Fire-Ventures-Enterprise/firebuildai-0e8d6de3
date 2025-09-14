import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Hammer, 
  CheckCircle2, 
  Ruler,
  Package,
  FileText,
  Calculator,
  Camera,
  Layers,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function CarpentersPage() {
  useEffect(() => {
    document.title = "Carpenter Software | FireBuild - Manage Custom Builds & Renovations";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional carpentry contractor software. Manage custom builds, track materials, optimize cuts, handle renovations, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Material optimization and cut list generation",
    "Custom millwork and cabinet tracking",
    "3D visualization and design tools",
    "Lumber pricing and inventory management",
    "Project template library for common builds"
  ];

  const features = [
    {
      icon: Ruler,
      title: "Material Optimization",
      description: "Generate optimized cut lists, minimize waste, and calculate board feet automatically."
    },
    {
      icon: Package,
      title: "Inventory Tracking",
      description: "Track lumber inventory, hardware stock, and automatically reorder when supplies run low."
    },
    {
      icon: Layers,
      title: "Project Templates",
      description: "Save and reuse templates for decks, framing, cabinets, and other common carpentry projects."
    },
    {
      icon: Calculator,
      title: "Cost Estimation",
      description: "Accurate material and labor calculations with built-in markup and waste factors."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/10 text-amber-600 mb-6">
                <Hammer className="h-4 w-4" />
                <span className="text-sm font-medium">Carpenters</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Build Better with{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Smart Carpentry Software
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional carpentry software for custom builds and renovations. 
                Optimize material usage, track projects, manage millwork, and get 
                paid instantly with integrated payment processing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-amber-600">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-amber-600">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-amber-600">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Hammer className="h-5 w-5" />
                    <span className="font-semibold">Project Dashboard</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Custom Kitchen Cabinets</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Deck Construction</span>
                      <span className="text-sm font-semibold text-yellow-500">Framing</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Home Addition</span>
                      <span className="text-sm font-semibold text-blue-500">Planning</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Projects</span>
                      <span className="font-semibold">6 Builds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Carpenters Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Carpenters Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
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
              Complete Carpentry Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage custom builds, optimize materials, 
              track projects, and grow your carpentry business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-amber-600" />
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
            Built for Professional Carpenters
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-amber-600/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Cut Lists</h3>
              <p className="text-sm text-muted-foreground">
                Generate detailed cut lists with optimization for minimal waste
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-amber-600/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Progress Photos</h3>
              <p className="text-sm text-muted-foreground">
                Document builds with organized photo galleries and annotations
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-amber-600/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Job Profitability</h3>
              <p className="text-sm text-muted-foreground">
                Track material costs, labor hours, and project margins
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-amber-600/10 via-background to-background border-amber-600/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Building Your Carpentry Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of carpentry contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:opacity-90">
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