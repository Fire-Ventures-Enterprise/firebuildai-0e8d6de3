import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Trees, 
  Check, 
  Calendar, 
  MapPin, 
  Truck, 
  ArrowRight,
  Leaf,
  Cloud,
  Sun,
  Flower,
  Sprout,
  Mountain
} from "lucide-react";
import { useEffect } from "react";

export const LandscapersPage = () => {
  useEffect(() => {
    document.title = "Landscaping Business Software - Project Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Landscaping business software with seasonal scheduling, route optimization, and equipment tracking. Manage landscaping projects, maintenance contracts, and grow your business.');
    }
  }, []);

  const benefits = [
    "Seasonal scheduling with automatic transitions",
    "Route optimization for maintenance crews",
    "Equipment tracking and maintenance schedules",
    "Plant database with care instructions",
    "Irrigation system management",
    "Snow removal route planning",
    "Chemical application tracking",
    "Recurring maintenance contracts"
  ];

  const features = [
    {
      icon: Calendar,
      title: "Seasonal Scheduling",
      description: "Automatically adjust schedules for spring cleanup, summer maintenance, fall cleanup, and winter services."
    },
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "Optimize daily routes for maintenance crews to minimize travel time and maximize efficiency."
    },
    {
      icon: Truck,
      title: "Equipment Tracking",
      description: "Track mowers, trucks, and equipment with maintenance schedules and usage logs."
    },
    {
      icon: Leaf,
      title: "Service Management",
      description: "Manage lawn care, pruning, fertilization, and all seasonal landscaping services."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
                <Trees className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Landscapers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  Landscaping Businesses
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete landscaping business management with seasonal scheduling, route optimization, 
                and equipment tracking. Grow your landscaping business efficiently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
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
                  <p className="text-2xl font-bold text-foreground">35%</p>
                  <p className="text-sm text-muted-foreground">More Properties</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">25%</p>
                  <p className="text-sm text-muted-foreground">Less Drive Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">90%</p>
                  <p className="text-sm text-muted-foreground">Customer Retention</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Today's Routes</h3>
                    <Sun className="h-4 w-4 text-yellow-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Route A - Residential</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-xs text-muted-foreground">12 properties • Mowing & trimming</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs">Progress</span>
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                        <span className="text-xs">7/12</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Route B - Commercial</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Starting</span>
                      </div>
                      <p className="text-xs text-muted-foreground">6 properties • Full service</p>
                      <p className="text-xs text-muted-foreground mt-1">Crew: Team 2 • ETA: 1:00 PM</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Installation - Smith Residence</span>
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">PM</span>
                      </div>
                      <p className="text-xs text-muted-foreground">New landscape design • 3:00 PM start</p>
                      <p className="text-xs text-green-600 mt-1">Materials delivered ✓</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">28</p>
                      <p className="text-xs text-muted-foreground">Properties</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">3</p>
                      <p className="text-xs text-muted-foreground">Crews</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">142mi</p>
                      <p className="text-xs text-muted-foreground">Total Route</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
                <Trees className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Professional Landscapers
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
              Landscaping-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for lawn care, landscaping, and snow removal businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-green-500" />
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
            All Landscaping Services Supported
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Lawn Care</h3>
              <p className="text-sm text-muted-foreground">
                Mowing, fertilization, aeration, and seasonal treatments
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Flower className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Landscape Design</h3>
              <p className="text-sm text-muted-foreground">
                Installation, hardscaping, and irrigation systems
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Mountain className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Snow Removal</h3>
              <p className="text-sm text-muted-foreground">
                Commercial and residential snow plowing and salting
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500/10 to-green-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Grow Your Landscaping Business Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join landscapers who service 35% more properties with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-green-600 hover:bg-green-700">
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