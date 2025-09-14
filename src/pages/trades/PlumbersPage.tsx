import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Droplets, 
  Check, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  ArrowRight,
  Gauge,
  Shield,
  FileCheck,
  Phone,
  Home,
  DollarSign
} from "lucide-react";
import { useEffect } from "react";

export const PlumbersPage = () => {
  useEffect(() => {
    document.title = "Plumbing Contractor Software - Service Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Plumbing contractor software for emergency dispatch, fixture inventory, and service agreements. Manage plumbing projects efficiently and grow your plumbing business.');
    }
  }, []);

  const benefits = [
    "24/7 emergency dispatch with priority routing",
    "Fixture and parts inventory management",
    "Service agreement tracking and renewals",
    "Leak detection documentation tools",
    "Water heater service scheduling",
    "Drain cleaning job management",
    "Preventive maintenance contracts",
    "Video inspection report generation"
  ];

  const features = [
    {
      icon: AlertTriangle,
      title: "Emergency Dispatch",
      description: "Route emergency calls instantly with GPS tracking and customer notifications for water damage prevention."
    },
    {
      icon: Gauge,
      title: "Fixture Inventory",
      description: "Track faucets, valves, pipes, and fittings with barcode scanning and automatic reorder points."
    },
    {
      icon: FileCheck,
      title: "Service Agreements",
      description: "Manage annual service contracts, maintenance schedules, and automatic renewal reminders."
    },
    {
      icon: Shield,
      title: "Warranty Tracking",
      description: "Track manufacturer warranties, service guarantees, and parts replacement schedules."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Plumbers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Plumbing Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete plumbing business management software. Handle emergency calls, 
                manage inventory, track service agreements, and grow your plumbing business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
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
                  <p className="text-2xl font-bold text-foreground">15min</p>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">40%</p>
                  <p className="text-sm text-muted-foreground">More Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2x</p>
                  <p className="text-sm text-muted-foreground">Faster Billing</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Service Dashboard</h3>
                    <span className="text-sm bg-red-500/10 text-red-600 px-2 py-1 rounded">3 Emergency</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Burst Pipe - Emergency</span>
                        <Phone className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Main St • Water shut off needed</p>
                      <p className="text-xs text-red-600 mt-1">Dispatching: Tom (ETA 12 min)</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Water Heater Install</span>
                        <span className="text-xs text-blue-600">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">50 gal tank • Residential</p>
                      <p className="text-xs text-muted-foreground mt-1">2:00 PM - 5:00 PM</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Drain Cleaning</span>
                        <span className="text-xs text-green-600">In Progress</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Kitchen sink • Commercial</p>
                      <p className="text-xs text-muted-foreground mt-1">Tech: Sarah K.</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-red-600">3</p>
                        <p className="text-xs text-muted-foreground">Emergency</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">8</p>
                        <p className="text-xs text-muted-foreground">Scheduled</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">5</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full">
                <Droplets className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Designed for Professional Plumbers
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
              Plumbing-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools built for the unique needs of residential and commercial plumbing contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-500" />
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

      {/* Service Types */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Plumbing Services Covered
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Residential</h3>
              <p className="text-sm text-muted-foreground">
                Home repairs, renovations, and new construction plumbing
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Commercial</h3>
              <p className="text-sm text-muted-foreground">
                Office buildings, restaurants, and retail plumbing services
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Emergency</h3>
              <p className="text-sm text-muted-foreground">
                24/7 emergency response for leaks and water damage
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop Leaking Profits, Start Growing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join plumbers who respond to emergencies 60% faster with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-blue-600 hover:bg-blue-700">
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