import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Trees, 
  CheckCircle2, 
  MapPin,
  Calendar,
  Cloud,
  Truck,
  Camera,
  Leaf,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function LandscapersPage() {
  useEffect(() => {
    document.title = "Landscaping Software | FireBuild - Design, Schedule & Maintain";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete landscaping business software. Design projects, schedule maintenance, track seasonal work, manage crews, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Seasonal scheduling and route optimization",
    "Design tools with plant databases",
    "Maintenance contract management",
    "Weather-based scheduling adjustments",
    "Material and equipment tracking"
  ];

  const features = [
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "Plan efficient routes for maintenance crews with GPS tracking and automated scheduling."
    },
    {
      icon: Leaf,
      title: "Plant Database",
      description: "Access comprehensive plant information, care requirements, and seasonal planning tools."
    },
    {
      icon: Calendar,
      title: "Seasonal Planning",
      description: "Schedule spring cleanups, summer maintenance, fall preparations, and winter services."
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      description: "Automatic rescheduling based on weather conditions with customer notifications."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 mb-6">
                <Trees className="h-4 w-4" />
                <span className="text-sm font-medium">Landscapers</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Grow Your Landscaping Business with{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Smart Software
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional landscaping software for design, scheduling, and maintenance. 
                Manage seasonal work, track crews, handle contracts, and get paid instantly 
                with integrated payment processing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-green-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Trees className="h-5 w-5" />
                    <span className="font-semibold">Schedule Overview</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Weekly Lawn Maintenance</span>
                      <span className="text-sm font-semibold text-green-500">8 Properties</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Garden Installation</span>
                      <span className="text-sm font-semibold text-yellow-500">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Spring Cleanup</span>
                      <span className="text-sm font-semibold text-blue-500">Scheduled</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Contracts</span>
                      <span className="font-semibold">42 Clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Landscapers Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Landscapers Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
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
              Complete Landscaping Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to design landscapes, schedule maintenance, 
              manage seasonal work, and grow your landscaping business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-green-500" />
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
            Built for Landscaping Professionals
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Crew Management</h3>
              <p className="text-sm text-muted-foreground">
                Track crew locations, equipment, and daily job assignments
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Project Photos</h3>
              <p className="text-sm text-muted-foreground">
                Document before/after transformations and seasonal changes
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Business Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track revenue by service type, season, and customer segments
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-green-500/10 via-background to-background border-green-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Landscaping Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of landscaping contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
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