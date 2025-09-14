import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  HardHat, 
  Check, 
  Users, 
  FileText, 
  Calendar, 
  ArrowRight,
  Briefcase,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  Layers
} from "lucide-react";
import { useEffect } from "react";

export const GeneralContractorsPage = () => {
  useEffect(() => {
    document.title = "Construction Management Software for General Contractors | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete construction management software for general contractors. Manage projects, coordinate subcontractors, track progress, and deliver projects on time and budget.');
    }
  }, []);

  const benefits = [
    "Complete project management from bid to completion",
    "Subcontractor coordination and communication tools",
    "Real-time progress tracking with photo documentation",
    "Change order management and approval workflows",
    "Budget tracking and cost control analytics",
    "Document management for permits and contracts",
    "Safety compliance and inspection tracking",
    "Client portal for transparency and updates"
  ];

  const features = [
    {
      icon: Briefcase,
      title: "Project Management",
      description: "Manage multiple projects simultaneously with Gantt charts, milestones, and critical path tracking."
    },
    {
      icon: Users,
      title: "Subcontractor Coordination",
      description: "Coordinate all trades efficiently with scheduling tools, communication hub, and payment tracking."
    },
    {
      icon: FileText,
      title: "Document Control",
      description: "Centralize all project documents, RFIs, submittals, and change orders in one secure location."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor project progress in real-time with daily reports, photo documentation, and percentage complete."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full">
                <HardHat className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">General Contractors</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Built for{" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  General Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete construction management platform designed for GCs. Manage projects, 
                coordinate subs, track progress, and deliver on time and budget.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">30%</p>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">95%</p>
                  <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">25%</p>
                  <p className="text-sm text-muted-foreground">Profit Increase</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-orange-600/5 border-orange-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Projects</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Live</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Office Complex - Phase 2</p>
                          <p className="text-xs text-muted-foreground">12 subs • $2.4M budget</p>
                        </div>
                        <span className="text-xs text-green-600">68% Complete</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Retail Renovation</p>
                          <p className="text-xs text-muted-foreground">8 subs • $850K budget</p>
                        </div>
                        <span className="text-xs text-blue-600">45% Complete</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Multi-Family Housing</p>
                          <p className="text-xs text-muted-foreground">15 subs • $5.2M budget</p>
                        </div>
                        <span className="text-xs text-yellow-600">12% Complete</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">6</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Subs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$12M</p>
                      <p className="text-xs text-muted-foreground">Pipeline</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full">
                <HardHat className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why General Contractors Choose FireBuild
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Complete Construction Management Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage complex construction projects from start to finish.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Capabilities for GCs
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Master Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Coordinate all trades with master schedules and critical path management
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Budget Control</h3>
              <p className="text-sm text-muted-foreground">
                Track costs, manage change orders, and maintain profit margins
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
              <p className="text-sm text-muted-foreground">
                Ensure compliance, track insurance, and manage safety protocols
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of general contractors who deliver projects on time and on budget with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-orange-600 hover:bg-orange-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Back to Industries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};