import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Home, 
  Check, 
  Cloud, 
  Calculator, 
  Shield, 
  ArrowRight,
  Umbrella,
  FileCheck,
  Camera,
  BarChart3,
  AlertCircle,
  Calendar
} from "lucide-react";
import { useEffect } from "react";

export const RoofersPage = () => {
  useEffect(() => {
    document.title = "Roofing Contractor Software - Project Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Roofing contractor software with material calculators, weather tracking, and warranty management. Manage roofing projects, track warranties, and grow your roofing business.');
    }
  }, []);

  const benefits = [
    "Aerial measurement integration for accurate estimates",
    "Material calculators for shingles, underlayment, and accessories",
    "Weather tracking with automatic rescheduling",
    "Warranty management and registration",
    "Storm damage assessment tools",
    "Insurance claim documentation",
    "Safety compliance tracking",
    "Drone inspection integration"
  ];

  const features = [
    {
      icon: Calculator,
      title: "Material Calculators",
      description: "Calculate squares, bundles, and accessories with waste factors for accurate material ordering."
    },
    {
      icon: Cloud,
      title: "Weather Tracking",
      description: "Monitor weather conditions and automatically reschedule jobs when rain or high winds are forecast."
    },
    {
      icon: Shield,
      title: "Warranty Management",
      description: "Track manufacturer warranties, register installations, and manage warranty claims efficiently."
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Document roof conditions, damage, and completed work with organized photo galleries."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full">
                <Home className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Roofers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Roofing Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete roofing business management with material calculators, weather tracking, 
                and warranty management. Scale your roofing business efficiently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
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
                  <p className="text-2xl font-bold text-foreground">50%</p>
                  <p className="text-sm text-muted-foreground">Faster Estimates</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Zero</p>
                  <p className="text-sm text-muted-foreground">Weather Delays</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Warranty Tracked</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-red-500/5 to-red-600/5 border-red-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Projects</h3>
                    <Umbrella className="h-4 w-4 text-blue-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Complete Tear-Off</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Clear</span>
                      </div>
                      <p className="text-xs text-muted-foreground">35 squares • Architectural shingles</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs">Day 2 of 3</span>
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Storm Damage Repair</span>
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">Rain PM</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Insurance claim • 18 squares</p>
                      <p className="text-xs text-yellow-600 mt-1">⚠️ Rescheduled to Thursday</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Commercial Flat Roof</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">TPO membrane • 5,000 sq ft</p>
                      <p className="text-xs text-muted-foreground mt-1">Start: Monday</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-semibold">8 roofs</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Weather Clear</span>
                      <span className="font-semibold text-green-600">3 days</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full">
                <Home className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Professional Roofers
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
              Roofing-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed specifically for residential and commercial roofing contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-red-500" />
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

      {/* Roofing Services */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Roofing Services Supported
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Inspections</h3>
              <p className="text-sm text-muted-foreground">
                Detailed inspection reports with photos and recommendations
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Storm Damage</h3>
              <p className="text-sm text-muted-foreground">
                Insurance claim documentation and adjuster coordination
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Maintenance</h3>
              <p className="text-sm text-muted-foreground">
                Scheduled maintenance programs and service agreements
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500/10 to-red-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Raise the Roof on Your Business Growth
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join roofing contractors who complete 50% more jobs with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-red-600 hover:bg-red-700">
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