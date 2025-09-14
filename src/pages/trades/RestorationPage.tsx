import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  AlertCircle, 
  Shield, 
  Droplets, 
  Flame, 
  Wind, 
  FileText, 
  Clock,
  CheckCircle,
  Phone,
  Camera,
  TrendingUp,
  Users
} from "lucide-react";

export default function RestorationPage() {
  useEffect(() => {
    document.title = "Restoration Services Software | FireBuild - Emergency Response & Claims Management";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Complete restoration management software for emergency cleanup, water damage, fire restoration, and insurance claims. 24/7 dispatch and real-time tracking.');
    }
  }, []);

  const benefits = [
    "24/7 emergency dispatch and response tracking",
    "Insurance claim documentation and management",
    "Before/after photo documentation with timestamps",
    "Real-time job status updates for clients",
    "Automated moisture readings and tracking",
    "Equipment inventory and deployment management",
    "Subcontractor coordination for large projects",
    "Compliance tracking for industry standards"
  ];

  const features = [
    {
      icon: AlertCircle,
      title: "Emergency Dispatch",
      description: "24/7 call handling with automated dispatch to available crews and real-time response tracking"
    },
    {
      icon: FileText,
      title: "Insurance Integration",
      description: "Direct insurance carrier connections with automated claim filing and documentation"
    },
    {
      icon: Camera,
      title: "Loss Documentation",
      description: "Comprehensive photo/video capture with timestamping and categorization by damage type"
    },
    {
      icon: Droplets,
      title: "Moisture Tracking",
      description: "Digital moisture mapping with daily readings and drying progress reports"
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Real-time updates for property owners with progress photos and completion timelines"
    },
    {
      icon: TrendingUp,
      title: "Job Costing",
      description: "Accurate cost tracking with Xactimate integration for precise insurance estimates"
    }
  ];

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-full mb-6">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Emergency Response Ready</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Restoration Services
                </span>
                <br />
                Management Software
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                From emergency dispatch to final invoice, manage water damage, fire restoration, 
                mold remediation, and disaster recovery projects with complete insurance integration.
              </p>

              <div className="flex gap-4 justify-center mb-12">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90">
                    <Phone className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">&lt;30min</div>
                  <div className="text-sm text-muted-foreground">Average dispatch time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Insurance approval rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">3x Faster</div>
                  <div className="text-sm text-muted-foreground">Claim processing</div>
                </div>
              </div>
            </div>

            {/* Preview Image */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 p-8">
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Emergency Response Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm">
                      <AlertCircle className="h-4 w-4" />
                      3 Active Emergencies
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-semibold">Water Damage</div>
                        <div className="text-sm text-muted-foreground">123 Oak St - In Progress</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <Flame className="h-8 w-8 text-orange-600" />
                      <div>
                        <div className="font-semibold">Fire Restoration</div>
                        <div className="text-sm text-muted-foreground">456 Elm Ave - Dispatched</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <Wind className="h-8 w-8 text-gray-600" />
                      <div>
                        <div className="font-semibold">Storm Damage</div>
                        <div className="text-sm text-muted-foreground">789 Pine Rd - Assessment</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Restoration Companies Love Our Software
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Complete Emergency Response Management
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                          <Icon className="h-6 w-6 text-red-600" />
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
          </div>
        </section>

        {/* Restoration Types Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Built for All Restoration Types
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Droplets className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Water Damage</h3>
                  <p className="text-sm text-muted-foreground">
                    Flood, pipe burst, and moisture remediation
                  </p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Flame className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fire & Smoke</h3>
                  <p className="text-sm text-muted-foreground">
                    Fire damage and smoke odor removal
                  </p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Wind className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Storm Damage</h3>
                  <p className="text-sm text-muted-foreground">
                    Wind, hail, and natural disaster recovery
                  </p>
                </Card>
                
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Mold Remediation</h3>
                  <p className="text-sm text-muted-foreground">
                    Mold removal and prevention services
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Restoration Business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of restoration companies managing emergencies more efficiently with FireBuild.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90">
                    Start Free 14-Day Trial
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    View All Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}