import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  HardHat, 
  CheckCircle2, 
  Users, 
  Calendar,
  FileText,
  TrendingUp,
  Shield,
  Clock,
  BarChart3,
  Building
} from "lucide-react";

export default function GeneralContractorsPage() {
  useEffect(() => {
    document.title = "General Contractor Software | FireBuild - Manage Multiple Subs & Projects";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete construction management software for general contractors. Manage multiple subs, track progress, and deliver projects on time and budget.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Manage multiple subs and trades efficiently",
    "Track project progress in real-time",
    "Generate professional proposals and contracts",
    "Automated payment reminders and collections",
    "Integrate with QuickBooks and accounting software"
  ];

  const features = [
    {
      icon: Users,
      title: "Subcontractor Management",
      description: "Track all your subs, manage contracts, and coordinate schedules from one central dashboard."
    },
    {
      icon: Calendar,
      title: "Project Scheduling",
      description: "Visual project timelines with Gantt charts, resource allocation, and automated notifications."
    },
    {
      icon: FileText,
      title: "Document Control",
      description: "Store and manage blueprints, permits, contracts, and change orders in one secure location."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track project profitability, labor costs, and material expenses with detailed reporting."
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 mb-6">
                <HardHat className="h-4 w-4" />
                <span className="text-sm font-medium">General Contractors</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Manage Multiple Projects with{" "}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Total Control
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Professional construction management software built for GCs. Coordinate subs, 
                track progress, manage documents, and get paid faster with automated invoicing 
                and instant payment processing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90">
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
                  <div className="text-2xl font-bold text-orange-500">2x</div>
                  <div className="text-muted-foreground">Faster payments</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-orange-500">70%</div>
                  <div className="text-muted-foreground">Time saved</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-orange-500">$0</div>
                  <div className="text-muted-foreground">Setup costs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-lg bg-card border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Building className="h-5 w-5" />
                    <span className="font-semibold">Project Dashboard</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Office Complex - Phase 2</span>
                      <span className="text-sm font-semibold text-green-500">65% Complete</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Retail Center Renovation</span>
                      <span className="text-sm font-semibold text-yellow-500">32% Complete</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Medical Building</span>
                      <span className="text-sm font-semibold text-blue-500">Planning</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Subs</span>
                      <span className="font-semibold">24 Teams</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GCs Love Our Software */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why General Contractors Love Our Software
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
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
              Complete Construction Management for GCs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage complex projects, coordinate multiple trades, 
              and ensure profitable project delivery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-orange-500" />
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
            Built for How GCs Work
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Project Profitability</h3>
              <p className="text-sm text-muted-foreground">
                Track costs, change orders, and margins in real-time
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Risk Management</h3>
              <p className="text-sm text-muted-foreground">
                Insurance tracking, compliance monitoring, and safety docs
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor labor hours, equipment usage, and productivity
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-orange-500/10 via-background to-background border-orange-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Managing Projects More Efficiently Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of general contractors who save 10+ hours per week while 
              getting paid 2x faster with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90">
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