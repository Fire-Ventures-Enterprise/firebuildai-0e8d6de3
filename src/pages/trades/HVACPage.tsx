import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Check, 
  Thermometer, 
  FileCheck, 
  Calendar, 
  ArrowRight,
  Wind,
  Snowflake,
  Flame,
  Settings,
  Shield,
  Clock
} from "lucide-react";
import { useEffect } from "react";

export const HVACPage = () => {
  useEffect(() => {
    document.title = "HVAC Contractor Software - Service Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'HVAC contractor software with service contracts, equipment database, and maintenance schedules. Manage heating and cooling projects, track equipment, and grow your HVAC business.');
    }
  }, []);

  const benefits = [
    "Service contract management and renewals",
    "Equipment database with service history",
    "Preventive maintenance scheduling",
    "Load calculations and system sizing",
    "Refrigerant tracking and EPA compliance",
    "Warranty registration and tracking",
    "Emergency service dispatch",
    "Energy efficiency analysis tools"
  ];

  const features = [
    {
      icon: FileCheck,
      title: "Service Contracts",
      description: "Manage annual service agreements with automatic renewal reminders and maintenance scheduling."
    },
    {
      icon: Settings,
      title: "Equipment Database",
      description: "Track all customer equipment with model numbers, serial numbers, and complete service history."
    },
    {
      icon: Calendar,
      title: "Maintenance Schedules",
      description: "Automated scheduling for filter changes, tune-ups, and seasonal maintenance visits."
    },
    {
      icon: Thermometer,
      title: "Load Calculations",
      description: "Manual J calculations, duct sizing, and equipment selection tools for accurate system design."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full">
                <Wrench className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium">HVAC</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                  HVAC Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete HVAC business management with service contracts, equipment tracking, 
                and maintenance scheduling. Keep customers comfortable year-round.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700">
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
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-sm text-muted-foreground">Contract Renewal</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">45%</p>
                  <p className="text-sm text-muted-foreground">More Service Calls</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">30min</p>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-cyan-600/5 border-cyan-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Service Dashboard</h3>
                    <div className="flex gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Snowflake className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">No Heat - Emergency</span>
                        <Wind className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Furnace not starting • -5°F outside</p>
                      <p className="text-xs text-red-600 mt-1">Tech dispatched: John (15 min)</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">AC Installation</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">3-ton split system • New construction</p>
                      <p className="text-xs text-muted-foreground mt-1">Tomorrow 8:00 AM</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">Maintenance Visit</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">In Progress</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Annual tune-up • Contract customer</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>Filter: ✓</div>
                        <div>Coils: ✓</div>
                        <div>Refrigerant: Testing</div>
                        <div>Report: Pending</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-cyan-600">247</p>
                        <p className="text-xs text-muted-foreground">Contracts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">18</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">92%</p>
                        <p className="text-xs text-muted-foreground">First-Time Fix</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-cyan-500 text-white p-3 rounded-full">
                <Wrench className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Designed for HVAC Professionals
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
              HVAC-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools built specifically for heating, cooling, and ventilation contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-cyan-500" />
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
            All HVAC Services Covered
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Flame className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
              <h3 className="text-lg font-semibold mb-2">Heating</h3>
              <p className="text-sm text-muted-foreground">
                Furnaces, boilers, heat pumps, and radiant systems
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Snowflake className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
              <h3 className="text-lg font-semibold mb-2">Cooling</h3>
              <p className="text-sm text-muted-foreground">
                Central AC, ductless systems, and commercial chillers
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Wind className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
              <h3 className="text-lg font-semibold mb-2">Ventilation</h3>
              <p className="text-sm text-muted-foreground">
                Indoor air quality, ductwork, and exhaust systems
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Keep Your HVAC Business Running Cool
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join HVAC contractors who complete 45% more service calls with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-cyan-600 hover:bg-cyan-700">
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