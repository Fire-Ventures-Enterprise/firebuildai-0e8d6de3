import { ArrowRight, Check, Package, Calculator, Clock, DollarSign, Briefcase, Users, Smartphone, BarChart3, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export default function DrywallPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-slate-500/10 via-background to-slate-500/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-8 w-8 text-slate-500" />
                <span className="text-slate-500 font-semibold text-lg">For Drywall Contractors</span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text text-transparent">
                  Build Smooth
                </span>{" "}
                Operations
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Streamline your drywall business from hanging to finishing. FireBuild helps you manage 
                installations, track materials, and deliver flawless results on every project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-slate-500 to-slate-600 hover:opacity-90 text-white w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-xl shadow-2xl p-8 border border-slate-500/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="font-semibold">Quick Estimate Preview</h3>
                    <DollarSign className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Project Type</span>
                      <span className="font-semibold">Commercial</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Wall Coverage</span>
                      <span className="font-semibold">5,000 sq ft</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Finish Level</span>
                      <span className="font-semibold">Level 4</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold">Estimate Range</span>
                      <span className="text-xl font-bold text-slate-500">$15,000 - $22,000</span>
                    </div>
                  </div>
                  <Button className="w-full bg-slate-500 hover:bg-slate-600 text-white">
                    Create Professional Estimate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Complete Drywall Management Solution
            </h2>
            <p className="text-xl text-muted-foreground">
              From hanging to taping to finishing - manage every phase
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Material Estimator</h3>
              <p className="text-muted-foreground">
                Calculate sheets, mud, tape, and fasteners needed for any project size
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phase Tracking</h3>
              <p className="text-muted-foreground">
                Manage hanging, taping, mudding, sanding, and texture application phases
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Level Pricing</h3>
              <p className="text-muted-foreground">
                Set different rates for Level 0-5 finishes and specialty textures
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Texture Library</h3>
              <p className="text-muted-foreground">
                Catalog and price different texture patterns and finishing techniques
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crew Scheduling</h3>
              <p className="text-muted-foreground">
                Coordinate hangers, tapers, and finishers across multiple job sites
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-500/10">
              <div className="h-12 w-12 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Production Metrics</h3>
              <p className="text-muted-foreground">
                Track square footage per day and crew productivity rates
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Designed for Drywall Professionals
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Multi-Phase Management</h3>
                    <p className="text-muted-foreground">
                      Track progress through hanging, taping, coating, and finishing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Level-Based Estimating</h3>
                    <p className="text-muted-foreground">
                      Price jobs accurately based on finish level requirements
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Moisture & Inspection Tracking</h3>
                    <p className="text-muted-foreground">
                      Document moisture readings and inspection results
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Punch List Management</h3>
                    <p className="text-muted-foreground">
                      Track and resolve touch-ups and repair items efficiently
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-xl border border-slate-500/20">
              <h3 className="text-2xl font-bold mb-6">Why Drywall Contractors Choose FireBuild</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-500 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Accurate Takeoffs</h4>
                    <p className="text-sm text-muted-foreground">
                      Room-by-room calculations with openings and waste factors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-500 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Quality Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Track finish levels and document quality at each phase
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Crew Coordination</h4>
                    <p className="text-sm text-muted-foreground">
                      Schedule specialized crews for each phase of work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-slate-500/10 to-slate-600/10 rounded-2xl p-12 border border-slate-500/20">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Streamline Your Drywall Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join leading drywall contractors who've improved efficiency with FireBuild
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-slate-500 to-slate-600 hover:opacity-90 text-white">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}