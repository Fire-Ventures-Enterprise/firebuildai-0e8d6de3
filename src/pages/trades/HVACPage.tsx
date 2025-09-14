import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Wind, 
  CheckCircle2, 
  Thermometer,
  Calendar,
  FileCheck,
  Wrench,
  AlertTriangle,
  Shield,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function HVACPage() {
  useEffect(() => {
    document.title = "HVAC Software | FireBuild - Service Management & Maintenance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete HVAC contractor software. Schedule maintenance, track equipment, manage service agreements, handle repairs, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Automated maintenance scheduling and reminders",
    "Equipment tracking with service histories",
    "Service agreement management and renewals",
    "Load calculations and system sizing tools",
    "Parts inventory and warranty tracking"
  ];

  const features = [
    {
      icon: Thermometer,
      title: "Load Calculations",
      description: "Built-in Manual J load calculations, duct sizing, and equipment selection tools."
    },
    {
      icon: Calendar,
      title: "Maintenance Contracts",
      description: "Track service agreements, schedule preventive maintenance, and automate renewal reminders."
    },
    {
      icon: Shield,
      title: "Warranty Management",
      description: "Track equipment warranties, parts coverage, and manufacturer registration requirements."
    },
    {
      icon: Wrench,
      title: "Service History",
      description: "Complete equipment histories with repairs, replacements, and maintenance records."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 mb-6">
                <Wind className="h-4 w-4" />
                <span className="text-sm font-medium">HVAC</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Keep Your HVAC Business Running with{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Smart Tools
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional HVAC software for service management, maintenance scheduling, 
                equipment tracking, and load calculations. Handle installations, repairs, 
                and service agreements while getting paid instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-cyan-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-cyan-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-cyan-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Wind className="h-5 w-5" />
                    <span className="font-semibold">Service Schedule</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">AC Unit Installation</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Furnace Maintenance</span>
                      <span className="text-sm font-semibold text-yellow-500">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Emergency Repair</span>
                      <span className="text-sm font-semibold text-red-500">Priority</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Service Contracts</span>
                      <span className="font-semibold">156 Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why HVAC Contractors Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why HVAC Contractors Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
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
              Complete HVAC Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to schedule maintenance, track equipment, 
              manage service agreements, and grow your HVAC business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-cyan-500" />
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
            Built for HVAC Professionals
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-2">Emergency Dispatch</h3>
              <p className="text-sm text-muted-foreground">
                24/7 emergency call handling with priority routing
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-8 w-8 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-2">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                EPA certifications, refrigerant tracking, and permit management
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-2">Performance Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track technician productivity, first-call resolution, and revenue
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-cyan-500/10 via-background to-background border-cyan-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your HVAC Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of HVAC contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90">
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