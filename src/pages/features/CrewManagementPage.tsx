import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Users, 
  Check, 
  Clock, 
  MapPin, 
  Shield, 
  TrendingUp, 
  UserCheck, 
  Calendar, 
  ArrowRight,
  Briefcase,
  DollarSign,
  AlertCircle,
  BarChart3
} from "lucide-react";
import { useEffect } from "react";

export const CrewManagementPage = () => {
  useEffect(() => {
    document.title = "Crew Management Software for Construction | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage construction crews, track time, coordinate subcontractors, and monitor productivity. Complete crew management software for contractors.');
    }
  }, []);

  const benefits = [
    "GPS time tracking with automatic clock in/out",
    "Real-time crew location and status monitoring",
    "Subcontractor management and coordination",
    "Digital timesheets with approval workflow",
    "Skill-based crew assignment and scheduling",
    "Productivity analytics per crew member",
    "Automated payroll integration and reporting",
    "Safety compliance and certification tracking"
  ];

  const features = [
    {
      icon: Clock,
      title: "Time & Attendance",
      description: "Track hours accurately with GPS verification. Generate timesheets automatically and reduce payroll errors by 90%."
    },
    {
      icon: MapPin,
      title: "Real-Time Location",
      description: "Know where your crews are at all times. Monitor job site arrivals, departures, and time spent on location."
    },
    {
      icon: UserCheck,
      title: "Subcontractor Portal",
      description: "Give subcontractors their own portal to submit timesheets, invoices, and track their own crews."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track productivity metrics, job completion rates, and identify your top performers with detailed reports."
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
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Crew Management</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Complete{" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Crew Management
                </span>
                {" "}Solution
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Track time, manage subcontractors, and coordinate your entire team efficiently. 
                Real-time visibility into crew productivity and project progress.
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
                  <p className="text-2xl font-bold text-foreground">90%</p>
                  <p className="text-sm text-muted-foreground">Less Payroll Errors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3hrs</p>
                  <p className="text-sm text-muted-foreground">Saved Weekly</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">GPS Verified</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-orange-600/5 border-orange-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Today's Crew Status</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Live</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Team Alpha</p>
                          <p className="text-xs text-muted-foreground">Kitchen Renovation - Site A</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">8:00 AM</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Team Beta</p>
                          <p className="text-xs text-muted-foreground">Bathroom Remodel - Site B</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">7:45 AM</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Subcontractor - Electric</p>
                          <p className="text-xs text-muted-foreground">Panel Upgrade - Site C</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">En Route</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">12</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-xs text-muted-foreground">On Break</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">Off Duty</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Contractors Love Our Crew Management
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
              Manage Your Workforce Efficiently
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete tools to track, manage, and optimize your crew performance.
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

      {/* Management Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Manage Teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Assign crews based on skills, availability, and location
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Payroll Integration</h3>
              <p className="text-sm text-muted-foreground">
                Export timesheets directly to QuickBooks or ADP
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor certifications, safety training, and licenses
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Managing Your Crew Better Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of contractors who save 3+ hours weekly on crew management.
            Start your 30-day free trial with no credit card required.
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
                Back to Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};