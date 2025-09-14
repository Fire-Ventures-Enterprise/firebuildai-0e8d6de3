import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  FileSearch, 
  Check, 
  FileText, 
  Calculator, 
  DollarSign, 
  ArrowRight,
  Upload,
  Building,
  TrendingUp,
  Shield,
  Image,
  FileCheck
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const XactimatePage = () => {
  useEffect(() => {
    document.title = "Xactimate Integration for Restoration Contractors | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Seamless Xactimate integration for restoration contractors. Import ESX files, manage supplements, sync with insurance carriers, and track profitability with FireBuild.');
    }
  }, []);

  const benefits = [
    "One-click Xactimate file import (ESX format)",
    "Visual line item editor with drag-and-drop",
    "Automatic photo attachment to line items",
    "Real-time pricing updates from Xactimate",
    "Insurance carrier direct submission",
    "Supplement tracking and management",
    "Progress billing based on completion percentage",
    "Detailed profit margin analysis by category"
  ];

  const features = [
    {
      icon: Upload,
      title: "Instant Import",
      description: "Import Xactimate files in seconds. All line items, pricing, and RCV/ACV values transfer automatically."
    },
    {
      icon: Image,
      title: "Photo Documentation",
      description: "Link photos directly to line items for better documentation and faster insurance approvals."
    },
    {
      icon: Calculator,
      title: "Supplement Management",
      description: "Track supplements, change orders, and additions with automatic insurance carrier notifications."
    },
    {
      icon: TrendingUp,
      title: "Profit Analysis",
      description: "See real-time profit margins by category, room, and overall project to maximize profitability."
    }
  ];

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full">
                  <FileSearch className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium">Xactimate Integration</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Seamless{" "}
                  <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                    Xactimate Integration
                  </span>{" "}
                  for Restoration
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  Import, edit, and manage Xactimate estimates directly within FireBuild. 
                  Automatically convert to invoices, track progress, and sync with insurance carriers.
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
                    <p className="text-2xl font-bold text-foreground">90%</p>
                    <p className="text-sm text-muted-foreground">Faster Import</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">100%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">35%</p>
                    <p className="text-sm text-muted-foreground">Higher Margins</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-cyan-600/5 border-cyan-500/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Xactimate Estimate</h3>
                      <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Imported</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Claim #: 2024-WATER-4521</p>
                      <p className="text-sm text-muted-foreground">Insured: Johnson Residence</p>
                      <p className="text-sm text-muted-foreground">Carrier: State Farm</p>
                    </div>
                    
                    <div className="pt-4 border-t space-y-3">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Water Mitigation</span>
                          <span className="font-medium">$8,450</span>
                        </div>
                        <div className="text-xs text-muted-foreground">42 line items</div>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Structural Repairs</span>
                          <span className="font-medium">$15,220</span>
                        </div>
                        <div className="text-xs text-muted-foreground">68 line items</div>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Contents</span>
                          <span className="font-medium">$3,890</span>
                        </div>
                        <div className="text-xs text-muted-foreground">24 line items</div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>RCV Total</span>
                        <span className="text-cyan-600">$27,560</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>ACV</span>
                        <span>$22,048</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="absolute -top-4 -right-4 bg-cyan-500 text-white p-3 rounded-full">
                  <FileSearch className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Restoration Contractors Choose FireBuild
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
                Complete Xactimate Integration
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage insurance restoration projects efficiently.
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

        {/* Insurance Integration */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Direct Insurance Carrier Integration
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
                <h3 className="text-lg font-semibold mb-2">Carrier Submission</h3>
                <p className="text-sm text-muted-foreground">
                  Submit directly to State Farm, Allstate, and more
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <FileCheck className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
                <h3 className="text-lg font-semibold mb-2">Automatic Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time status updates and approval tracking
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
                <h3 className="text-lg font-semibold mb-2">Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Meet all carrier requirements and documentation standards
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Streamline Your Restoration Business
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join restoration contractors who process claims 90% faster with FireBuild.
              Start your 30-day free trial with no credit card required.
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
                  Back to Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};