import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Paintbrush, 
  Check, 
  Palette, 
  Droplets, 
  Calendar, 
  ArrowRight,
  Image,
  FileText,
  Clock,
  Home,
  Building
} from "lucide-react";
import { useEffect } from "react";

// Custom icons not available in lucide-react
const Calculator = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="8" x2="16" y1="10" y2="10"/>
    <path d="M16 14h.01"/>
    <path d="M16 18h.01"/>
    <path d="M12 14h.01"/>
    <path d="M12 18h.01"/>
    <path d="M8 14h.01"/>
    <path d="M8 18h.01"/>
  </svg>
);

const Spray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/>
    <path d="m19 9-3 3"/>
    <path d="M5 9l3 3"/>
    <rect x="7" y="13" width="10" height="8" rx="1"/>
    <path d="M9 17h6"/>
  </svg>
);

export const PaintersPage = () => {
  useEffect(() => {
    document.title = "Painting Contractor Software - Project Management | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Painting contractor software with color management, surface tracking, and spray schedules. Manage painting projects, track materials, and grow your painting business.');
    }
  }, []);

  const benefits = [
    "Digital color management and matching",
    "Surface area calculators for accurate estimates",
    "Spray schedule optimization",
    "Paint inventory tracking with automatic reorders",
    "Before/after photo documentation",
    "Multi-coat project tracking",
    "Lead-safe certification management",
    "Customer color approval workflows"
  ];

  const features = [
    {
      icon: Palette,
      title: "Color Management",
      description: "Digital color swatches, customer approvals, and paint brand cross-references for perfect matches."
    },
    {
      icon: Calculator,
      title: "Surface Tracking",
      description: "Calculate paint coverage for walls, ceilings, and trim with automatic waste factors."
    },
    {
      icon: Spray,
      title: "Spray Schedules",
      description: "Optimize spray painting schedules for maximum efficiency and minimal overspray."
    },
    {
      icon: Image,
      title: "Photo Documentation",
      description: "Capture before, progress, and after photos with color-accurate documentation."
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full">
                <Paintbrush className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Painters</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Software for{" "}
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Painting Contractors
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Complete painting business management with color tools, surface tracking, 
                and project scheduling. Transform your painting business digitally.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
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
                  <p className="text-2xl font-bold text-foreground">60%</p>
                  <p className="text-sm text-muted-foreground">Faster Quotes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">95%</p>
                  <p className="text-sm text-muted-foreground">Color Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">40%</p>
                  <p className="text-sm text-muted-foreground">More Projects</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Projects</h3>
                    <Palette className="h-4 w-4 text-purple-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Interior - 4BR House</span>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">Prep</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#E8DCC4' }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#9CA3AF' }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}></div>
                        <span className="text-xs text-muted-foreground">SW Accessible Beige</span>
                      </div>
                      <p className="text-xs text-muted-foreground">3,200 sq ft • 2 coats</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Commercial Exterior</span>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">Painting</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#1E3A8A' }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#F3F4F6' }}></div>
                        <span className="text-xs text-muted-foreground">Corporate Blue</span>
                      </div>
                      <p className="text-xs text-muted-foreground">8,500 sq ft • Spray application</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Cabinet Refinishing</span>
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: '#374151' }}></div>
                        <span className="text-xs text-muted-foreground">Charcoal Gray</span>
                      </div>
                      <p className="text-xs text-muted-foreground">32 doors • Lacquer finish</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This Week</span>
                      <span className="font-semibold">12 projects</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Paint Used</span>
                      <span className="font-semibold">186 gallons</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-full">
                <Paintbrush className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Designed for Professional Painters
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
              Painting-Specific Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools built specifically for residential and commercial painting contractors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    {feature.icon === Calculator ? <Calculator /> : 
                     feature.icon === Spray ? <Spray /> :
                     <feature.icon className="h-6 w-6 text-purple-500" />}
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
            All Painting Services Covered
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Residential</h3>
              <p className="text-sm text-muted-foreground">
                Interior, exterior, and specialty finishes for homes
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Commercial</h3>
              <p className="text-sm text-muted-foreground">
                Office buildings, retail spaces, and industrial coatings
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Droplets className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Specialty</h3>
              <p className="text-sm text-muted-foreground">
                Faux finishes, murals, and decorative painting
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Paint a Brighter Future for Your Business
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join painting contractors who complete 40% more projects with FireBuild.
            Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-purple-600 hover:bg-purple-700">
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