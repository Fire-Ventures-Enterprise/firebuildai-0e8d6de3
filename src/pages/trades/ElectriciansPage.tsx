import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Check, 
  AlertCircle, 
  Shield, 
  Calendar, 
  ArrowRight,
  Wrench,
  FileCheck,
  BarChart3,
  Clock,
  Cpu,
  Lightbulb
} from "lucide-react";
import { useEffect } from "react";

export const ElectriciansPage = () => {
  useEffect(() => {
    document.title = "Electrical Contractor Software - Service Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Electrical contractor software for service calls, panel schedules, and material tracking. Manage electrical projects, track inventory, and grow your electrical business.');
    }
  }, []);

  const benefits = [
    "Service call dispatch and routing optimization",
    "Panel schedule templates and documentation",
    "Material tracking with automatic reorder alerts",
    "Code compliance and permit management",
    "Electrical load calculations and diagrams",
    "Emergency service priority scheduling",
    "Voltage drop calculations built-in",
    "Safety inspection checklists"
  ];

  const features = [
    {
      icon: AlertCircle,
      title: "Service Call Management",
      description: "Dispatch electricians efficiently with priority routing for emergency calls and service requests."
    },
    {
      icon: Cpu,
      title: "Panel Schedules",
      description: "Create and manage panel schedules with load calculations, circuit tracking, and breaker assignments."
    },
    {
      icon: Wrench,
      title: "Material Tracking",
      description: "Track wire, fixtures, and components with automatic reorder points and supplier integration."
    },
    {
      icon: Shield,
      title: "Code Compliance",
      description: "Stay up-to-date with NEC codes, local regulations, and inspection requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Electricians</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Electrical Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete electrical contractor management software. Handle service calls, 
                create panel schedules, track materials, and ensure code compliance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700">
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
                  <p className="text-2xl font-bold text-foreground">45%</p>
                  <p className="text-sm text-muted-foreground">Faster Service</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Code Compliant</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">30%</p>
                  <p className="text-sm text-muted-foreground">More Jobs</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border-yellow-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Today's Service Calls</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Active</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Panel Upgrade</span>
                        <span className="text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded">Emergency</span>
                      </div>
                      <p className="text-xs text-muted-foreground">200A Service • Downtown</p>
                      <p className="text-xs text-muted-foreground mt-1">ETA: 9:00 AM</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Commercial Lighting</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">LED Retrofit • Office Building</p>
                      <p className="text-xs text-muted-foreground mt-1">ETA: 1:00 PM</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Outlet Installation</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">In Progress</span>
                      </div>
                      <p className="text-xs text-muted-foreground">4 GFCI Outlets • Residential</p>
                      <p className="text-xs text-muted-foreground mt-1">Tech: Mike S.</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Jobs Today</span>
                      <span className="font-semibold">8 calls</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Electricians Active</span>
                      <span className="font-semibold">4 techs</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-white p-3 rounded-full">
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built Specifically for Electrical Contractors
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
              Electrical-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for the unique needs of electrical contractors and service companies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-yellow-500" />
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

      {/* Electrical Tools */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Professional Electrical Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Load Calculations</h3>
              <p className="text-sm text-muted-foreground">
                Automatic load calculations with NEC compliance checks
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Permit Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Manage permits, inspections, and compliance documentation
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Energy Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Calculate energy savings for LED retrofits and upgrades
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Power Up Your Electrical Business
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join electricians who complete 45% more service calls with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-yellow-600 hover:bg-yellow-700">
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