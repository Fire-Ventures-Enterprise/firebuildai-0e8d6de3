import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Home, 
  CheckCircle2, 
  Cloud,
  Camera,
  FileText,
  Shield,
  Calculator,
  Ruler,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function RoofersPage() {
  useEffect(() => {
    document.title = "Roofing Software | FireBuild - Manage Roofing Projects & Weather";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete roofing contractor software. Track weather, manage materials, create aerial measurements, handle insurance claims, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Weather tracking and job scheduling integration",
    "Aerial measurement and material calculations",
    "Insurance claim documentation and supplements",
    "Photo documentation with before/after comparisons",
    "Material ordering and waste tracking"
  ];

  const features = [
    {
      icon: Cloud,
      title: "Weather Integration",
      description: "Real-time weather tracking with automatic rescheduling and customer notifications for weather delays."
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Capture and organize progress photos, damage documentation, and before/after comparisons for claims."
    },
    {
      icon: Ruler,
      title: "Measurement Tools",
      description: "Aerial roof measurements, slope calculations, and automatic material quantity estimates."
    },
    {
      icon: Shield,
      title: "Insurance Management",
      description: "Streamline insurance claims, supplements, and adjustor communications with built-in templates."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 mb-6">
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Roofers</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Elevate Your Roofing Business with{" "}
                <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                  Smart Software
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional roofing software with weather tracking, aerial measurements, 
                material management, and insurance claim tools. Handle residential and 
                commercial projects while getting paid faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-red-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-red-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-red-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Home className="h-5 w-5" />
                    <span className="font-semibold">Project Dashboard</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Residential Re-roof</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Storm Damage Repair</span>
                      <span className="text-sm font-semibold text-yellow-500">Weather Hold</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Commercial Flat Roof</span>
                      <span className="text-sm font-semibold text-blue-500">In Progress</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-semibold">12 Projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Roofers Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Roofers Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
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
              Complete Roofing Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage roofing projects, handle weather delays, 
              process insurance claims, and grow your roofing business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-red-500" />
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
            Built for Roofing Contractors
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">Material Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Calculate shingles, underlayment, and accessories with waste factors
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">Field App</h3>
              <p className="text-sm text-muted-foreground">
                Measure roofs, capture damage photos, and create estimates on-site
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">Production Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor crew productivity, material usage, and job profitability
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-red-500/10 via-background to-background border-red-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Roofing Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of roofing contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90">
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