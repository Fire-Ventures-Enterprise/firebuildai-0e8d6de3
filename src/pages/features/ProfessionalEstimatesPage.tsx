import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Check, 
  Zap, 
  Clock,
  DollarSign,
  Shield,
  Palette,
  Users,
  ArrowRight
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const ProfessionalEstimatesPage = () => {
  useEffect(() => {
    document.title = "Professional Estimates Software for Contractors | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create professional contractor estimates in minutes. Convert estimates to jobs instantly, track approval rates, and win more bids with FireBuild.ai estimate software.');
    }
  }, []);

  const benefits = [
    "Create estimates 75% faster than traditional methods",
    "Professional branded templates that win more jobs",
    "Instant conversion from estimate to job",
    "Digital signatures and acceptance tracking",
    "Automatic follow-up reminders",
    "Mobile-friendly customer portal",
    "Real-time notification when viewed",
    "Track estimate-to-job conversion rates"
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Creation",
      description: "Build detailed estimates in under 5 minutes with our smart templates and item database."
    },
    {
      icon: Palette,
      title: "Branded Templates",
      description: "Customize estimates with your logo, colors, and business information for a professional look."
    },
    {
      icon: Shield,
      title: "Legal Protection",
      description: "Include terms, conditions, and scope of work to protect your business legally."
    },
    {
      icon: Clock,
      title: "Automated Follow-ups",
      description: "Never lose a lead again with automatic reminder emails to pending estimates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Professional Estimates</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Win More Jobs with Professional{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Construction Estimates
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Create stunning, accurate estimates that convert prospects into paying customers. 
                Professional contractors using FireBuild close 40% more deals with our estimate software.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
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
                  <p className="text-2xl font-bold text-foreground">75%</p>
                  <p className="text-sm text-muted-foreground">Faster Creation</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">40%</p>
                  <p className="text-sm text-muted-foreground">Higher Close Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2x</p>
                  <p className="text-sm text-muted-foreground">Faster Payments</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Sample Estimate #2024-001</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Sent</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Customer: John Smith</p>
                    <p className="text-sm text-muted-foreground">Project: Kitchen Renovation</p>
                    <p className="text-sm text-muted-foreground">Total: $24,500</p>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Labor</span>
                        <span>$12,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Materials</span>
                        <span>$10,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Equipment</span>
                        <span>$2,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Contractors Choose Our Estimate Software
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
              Powerful Features for Modern Contractors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional estimates that win jobs and streamline your sales process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-500" />
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Creating Professional Estimates Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of contractors who are winning more jobs with professional estimates.
            No credit card required for your 30-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px]">
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