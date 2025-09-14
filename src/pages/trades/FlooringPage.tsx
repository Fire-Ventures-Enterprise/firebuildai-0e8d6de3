import { ArrowRight, Check, Layers, Calculator, Clock, DollarSign, Briefcase, Users, Smartphone, BarChart3, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export default function FlooringPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-teal-500/10 via-background to-teal-500/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Layers className="h-8 w-8 text-teal-500" />
                <span className="text-teal-500 font-semibold text-lg">For Flooring Contractors</span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                  Lay the Foundation
                </span>{" "}
                for Business Success
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Streamline your flooring business with FireBuild's comprehensive management platform. 
                From material calculations to installation scheduling, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90 text-white w-full sm:w-auto">
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
              <div className="bg-card rounded-xl shadow-2xl p-8 border border-teal-500/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="font-semibold">Material Calculator</h3>
                    <Calculator className="h-5 w-5 text-teal-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Room Area</span>
                      <span className="font-semibold">450 sq ft</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Material Type</span>
                      <span className="font-semibold">Luxury Vinyl</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Waste Factor</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold">Total Needed</span>
                      <span className="text-xl font-bold text-teal-500">495 sq ft</span>
                    </div>
                  </div>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                    Generate Estimate
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
              Everything You Need to Manage Your Flooring Business
            </h2>
            <p className="text-xl text-muted-foreground">
              From initial measurements to final installation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Material Calculator</h3>
              <p className="text-muted-foreground">
                Accurately calculate materials needed with waste factors for different flooring types
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Scheduling</h3>
              <p className="text-muted-foreground">
                Manage installation timelines, subfloor prep, and finishing schedules efficiently
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Quotes</h3>
              <p className="text-muted-foreground">
                Generate professional quotes with material costs, labor, and installation details
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pattern Library</h3>
              <p className="text-muted-foreground">
                Store and manage different flooring patterns and installation methods
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crew Management</h3>
              <p className="text-muted-foreground">
                Assign installation teams based on flooring type expertise and availability
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-teal-500/10">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profit Tracking</h3>
              <p className="text-muted-foreground">
                Monitor job profitability with material costs and labor tracking
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
                Built for Modern Flooring Contractors
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-teal-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Material Optimization</h3>
                    <p className="text-muted-foreground">
                      Minimize waste with smart calculations for different room layouts
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-teal-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Installation Tracking</h3>
                    <p className="text-muted-foreground">
                      Monitor progress from subfloor prep to final finishing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-teal-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Warranty Management</h3>
                    <p className="text-muted-foreground">
                      Track product warranties and installation guarantees
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="h-6 w-6 text-teal-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Sample Inventory</h3>
                    <p className="text-muted-foreground">
                      Manage your showroom samples and track customer selections
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-xl border border-teal-500/20">
              <h3 className="text-2xl font-bold mb-6">Why Flooring Pros Choose FireBuild</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-500 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Accurate Measurements</h4>
                    <p className="text-sm text-muted-foreground">
                      Room-by-room calculations with transitions and trim
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-500 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pattern Planning</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualize and plan complex installation patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Multi-Phase Projects</h4>
                    <p className="text-sm text-muted-foreground">
                      Coordinate removal, prep, installation, and finishing
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
          <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-2xl p-12 border border-teal-500/20">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Flooring Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of flooring contractors who've streamlined their operations with FireBuild
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90 text-white">
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