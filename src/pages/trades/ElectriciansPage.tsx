import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Zap, 
  CheckCircle2, 
  FileCheck,
  Calculator,
  Shield,
  Clock,
  Wrench,
  AlertTriangle,
  BarChart3,
  Smartphone
} from "lucide-react";

export default function ElectriciansPage() {
  useEffect(() => {
    document.title = "Electrician Software | FireBuild - Streamline Electrical Contracting";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional electrical contractor software. Manage permits, track installations, ensure compliance, and get paid faster with integrated invoicing.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Automated permit tracking and compliance",
    "Material cost calculators and markup tools",
    "Safety documentation and inspection reports",
    "Mobile app for field service management",
    "Integrate with electrical supply vendors"
  ];

  const features = [
    {
      icon: FileCheck,
      title: "Permit Management",
      description: "Track permit applications, approvals, and inspections with automated reminders and digital storage."
    },
    {
      icon: Calculator,
      title: "Load Calculations",
      description: "Built-in electrical load calculators, voltage drop calculations, and wire sizing tools."
    },
    {
      icon: Shield,
      title: "Safety Compliance",
      description: "NEC code reference, safety checklists, and OSHA compliance tracking for every job."
    },
    {
      icon: Wrench,
      title: "Service Management",
      description: "Schedule service calls, track maintenance contracts, and manage emergency repairs efficiently."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Electricians</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Power Up Your Electrical Business with{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                  Smart Software
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional electrical contractor software that handles permits, calculations, 
                safety compliance, and invoicing. Streamline installations and service calls 
                while ensuring code compliance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-yellow-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-yellow-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-yellow-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">Service Dashboard</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Panel Upgrade - 200A</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Commercial Rewiring</span>
                      <span className="text-sm font-semibold text-yellow-500">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">EV Charger Install</span>
                      <span className="text-sm font-semibold text-blue-500">Scheduled</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Today's Jobs</span>
                      <span className="font-semibold">5 Service Calls</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Electricians Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Electricians Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
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
              Complete Electrical Contractor Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage electrical installations, service calls, 
              and ensure code compliance while growing your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-yellow-500" />
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
            Built for Electrical Contractors
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold mb-2">Code Compliance</h3>
              <p className="text-sm text-muted-foreground">
                NEC code reference and automated compliance checking
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold mb-2">Mobile Field App</h3>
              <p className="text-sm text-muted-foreground">
                Access job details, capture photos, and invoice on-site
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-yellow-500" />
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
          <Card className="p-12 text-center bg-gradient-to-br from-yellow-500/10 via-background to-background border-yellow-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Electrical Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of electrical contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:opacity-90">
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