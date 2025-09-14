import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Frame, Clock, Calculator, Users, Shield, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function WindowsPage() {
  const features = [
    {
      icon: Calculator,
      title: "Accurate Window Estimating",
      description: "Generate detailed quotes with window specifications, installation costs, and labor calculations"
    },
    {
      icon: Calendar,
      title: "Installation Scheduling",
      description: "Coordinate window deliveries and installation crews with smart scheduling tools"
    },
    {
      icon: Frame,
      title: "Product Catalog Management",
      description: "Maintain your window inventory with pricing, specifications, and availability tracking"
    },
    {
      icon: Clock,
      title: "Warranty Tracking",
      description: "Manage manufacturer warranties and installation guarantees in one place"
    },
    {
      icon: Users,
      title: "Supplier Integration",
      description: "Connect with window manufacturers and distributors for real-time pricing and availability"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Track installation quality with photo documentation and customer sign-offs"
    }
  ];

  const benefits = [
    "Reduce estimation time by 75% with window-specific templates",
    "Increase sales conversion with professional digital proposals",
    "Track window orders from manufacturer to installation",
    "Manage multiple installation crews and subcontractors",
    "Streamline warranty claims and service calls",
    "Improve customer satisfaction with real-time project updates"
  ];

  const testimonial = {
    quote: "FireBuild transformed our window business. We can now handle 3x more installations with the same team, and our customers love the professional quotes and real-time updates.",
    author: "Michael Thompson",
    company: "ClearView Windows & Doors",
    metric: "200% increase in installation efficiency"
  };

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 px-4 py-2 rounded-full mb-6">
                <Frame className="h-5 w-5" />
                <span className="font-semibold">Window Sales & Installation Software</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                Streamline Your Window Business
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                From initial consultation to final installation, manage every aspect of your window replacement 
                and installation business with FireBuild's comprehensive software solution.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Schedule Demo
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">500+</div>
                  <div className="text-sm text-muted-foreground">Window Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">50K+</div>
                  <div className="text-sm text-muted-foreground">Windows Installed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Run Your Window Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Purpose-built tools for window contractors and installers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Window Contractors Choose FireBuild
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="p-8 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 border-indigo-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-600">Success Story</span>
                </div>
                <blockquote className="mb-6">
                  <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                  <footer>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    <div className="text-sm font-semibold text-indigo-600 mt-2">{testimonial.metric}</div>
                  </footer>
                </blockquote>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-400">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Window Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of window contractors who've streamlined their operations with FireBuild
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Talk to Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/80 mt-6">
              No credit card required • Full access to all features • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}