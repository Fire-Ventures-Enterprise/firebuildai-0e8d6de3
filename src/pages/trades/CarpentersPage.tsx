import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Hammer, 
  Check, 
  Ruler, 
  Package, 
  FileText, 
  ArrowRight,
  Scissors,
  Grid3x3,
  Layers,
  Home,
  Building,
  Drill
} from "lucide-react";
import { useEffect } from "react";

export const CarpentersPage = () => {
  useEffect(() => {
    document.title = "Carpentry Contractor Software - Project Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Carpentry contractor software with cut lists, material ordering, and custom millwork tracking. Manage carpentry projects, track materials, and grow your woodworking business.');
    }
  }, []);

  const benefits = [
    "Automated cut list generation from plans",
    "Material ordering with waste optimization",
    "Custom millwork and cabinet tracking",
    "Lumber price tracking and updates",
    "3D modeling integration",
    "Shop drawings and detail management",
    "Installation scheduling and coordination",
    "Quality control checklists"
  ];

  const features = [
    {
      icon: Scissors,
      title: "Cut Lists",
      description: "Generate optimized cut lists from plans with minimal waste and automatic material calculations."
    },
    {
      icon: Package,
      title: "Material Ordering",
      description: "Track lumber, hardware, and supplies with automatic reorder points and supplier price comparisons."
    },
    {
      icon: Grid3x3,
      title: "Custom Millwork",
      description: "Manage custom cabinet and millwork projects with shop drawings and finish schedules."
    },
    {
      icon: Ruler,
      title: "Measurement Tools",
      description: "Digital takeoffs, measurement calculators, and conversion tools for accurate estimates."
    }
  ];

  // Custom Drill icon component
  const Drill = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h3a1 1 0 0 1 1 1v5h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2v3a1 1 0 0 1-1 1h-3"/>
      <path d="M5 12V8a1 1 0 0 1 1-1h8v4"/>
      <path d="M3 16h11v4H9v2H5v-2H3z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
                <Hammer className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">Carpenters</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Carpentry Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete carpentry business management with cut lists, material tracking, 
                and custom millwork tools. Build your carpentry business efficiently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
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
                  <p className="text-2xl font-bold text-foreground">40%</p>
                  <p className="text-sm text-muted-foreground">Less Waste</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">50%</p>
                  <p className="text-sm text-muted-foreground">Faster Quotes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">30%</p>
                  <p className="text-sm text-muted-foreground">More Projects</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-amber-600/5 border-amber-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Projects</h3>
                    <Hammer className="h-4 w-4 text-amber-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Custom Kitchen Cabinets</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Fabrication</span>
                      </div>
                      <p className="text-xs text-muted-foreground">32 doors • Shaker style • White oak</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div>Cut: ✓</div>
                        <div>Assembly: 60%</div>
                        <div>Finish: Pending</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Deck Construction</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">On Site</span>
                      </div>
                      <p className="text-xs text-muted-foreground">400 sq ft • Composite decking</p>
                      <p className="text-xs text-muted-foreground mt-1">Materials: Delivered ✓</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Finish Carpentry</span>
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Crown molding • 2,800 LF</p>
                      <p className="text-xs text-muted-foreground mt-1">Start: Tomorrow</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Board Feet Used</span>
                      <span className="font-semibold">3,450 BF</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Material Cost</span>
                      <span className="font-semibold">$18,200</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-amber-600 text-white p-3 rounded-full">
                <Hammer className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Professional Carpenters
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
              Carpentry-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for framing, finish carpentry, and custom millwork professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-amber-600" />
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
            All Carpentry Services Covered
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-lg font-semibold mb-2">Framing</h3>
              <p className="text-sm text-muted-foreground">
                Residential and commercial framing projects
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Layers className="h-12 w-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-lg font-semibold mb-2">Finish Work</h3>
              <p className="text-sm text-muted-foreground">
                Trim, molding, and detailed finish carpentry
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-lg font-semibold mb-2">Custom Millwork</h3>
              <p className="text-sm text-muted-foreground">
                Cabinets, built-ins, and custom woodwork
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Build Your Carpentry Business Better
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join carpenters who reduce material waste by 40% with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-amber-600 hover:bg-amber-700">
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