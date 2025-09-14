import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Droplets, 
  CheckCircle2, 
  Wrench,
  Calendar,
  FileText,
  AlertCircle,
  Truck,
  Clock,
  DollarSign,
  Smartphone
} from "lucide-react";

export default function PlumbersPage() {
  useEffect(() => {
    document.title = "Plumber Software | FireBuild - Manage Service Calls & Installations";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete plumbing contractor software. Schedule service calls, track installations, manage maintenance contracts, and get paid faster.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Automated service call scheduling and dispatch",
    "Parts inventory and pricing management",
    "Maintenance contract tracking and renewals",
    "Mobile app for on-site estimates and invoicing",
    "Emergency call prioritization and routing"
  ];

  const features = [
    {
      icon: Truck,
      title: "Dispatch Management",
      description: "Optimize routing, track technicians in real-time, and dispatch the nearest available plumber."
    },
    {
      icon: Wrench,
      title: "Service Tracking",
      description: "Manage repairs, installations, and maintenance with detailed job histories and warranties."
    },
    {
      icon: AlertCircle,
      title: "Emergency Response",
      description: "24/7 emergency call handling with automated customer notifications and priority scheduling."
    },
    {
      icon: FileText,
      title: "Flat Rate Pricing",
      description: "Built-in flat rate price book with material costs, labor rates, and automatic markup calculations."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                <Droplets className="h-4 w-4" />
                <span className="text-sm font-medium">Plumbers</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Streamline Your Plumbing Business with{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Smart Tools
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional plumbing software for service calls, installations, and maintenance. 
                Manage dispatching, track inventory, handle emergencies, and get paid instantly 
                with integrated payment processing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-blue-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-blue-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-blue-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Droplets className="h-5 w-5" />
                    <span className="font-semibold">Service Schedule</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Water Heater Replacement</span>
                      <span className="text-sm font-semibold text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Emergency Leak Repair</span>
                      <span className="text-sm font-semibold text-red-500">Priority</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Bathroom Remodel</span>
                      <span className="text-sm font-semibold text-yellow-500">In Progress</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Today's Calls</span>
                      <span className="font-semibold">8 Services</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Plumbers Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Plumbers Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
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
              Complete Plumbing Business Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to run service calls, manage installations, 
              track maintenance contracts, and grow your plumbing business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-blue-500" />
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
            Built for Modern Plumbing Contractors
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Optimize routes and schedule jobs based on location and urgency
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Mobile App</h3>
              <p className="text-sm text-muted-foreground">
                Create estimates, capture photos, and collect payments on-site
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Instant Payments</h3>
              <p className="text-sm text-muted-foreground">
                Accept cards, ACH, and digital wallets with instant deposits
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-blue-500/10 via-background to-background border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Plumbing Business Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of plumbing contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90">
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