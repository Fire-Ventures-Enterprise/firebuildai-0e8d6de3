import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Home, Building2, Wrench, ArrowRight, Clock, DollarSign, Users, BarChart3 } from "lucide-react";
import { useEffect } from "react";
import { campaignAnalytics } from "@/utils/campaignAnalytics";
import { getCampaignFromURL } from "@/utils/marketingStrategy";

export function IndustryLandingPage() {
  const campaign = getCampaignFromURL();
  const industry = campaign?.industry || 'residential';
  
  useEffect(() => {
    campaignAnalytics.initialize();
  }, []);

  const industryData = {
    residential: {
      title: "Transform Your Home Building Business with AI",
      subtitle: "Streamline residential construction projects from estimate to final invoice",
      icon: Home,
      color: "blue",
      features: [
        "Client communication portal for homeowner updates",
        "Project timeline management with photo documentation",
        "Budget tracking with real-time cost overrun alerts",
        "Before/after project galleries to showcase work",
        "Automated payment schedules and invoicing",
        "Material ordering and supplier management"
      ],
      benefits: [
        { icon: Clock, title: "Save 10+ Hours Weekly", description: "Automate repetitive tasks and documentation" },
        { icon: DollarSign, title: "Increase Margins by 15%", description: "Better cost tracking and change order management" },
        { icon: Users, title: "Boost Client Satisfaction", description: "Keep homeowners informed at every step" },
        { icon: BarChart3, title: "Scale Your Business", description: "Handle more projects without more overhead" }
      ],
      testimonial: {
        quote: "FireBuild transformed how we manage custom home projects. Our clients love the transparency, and we've increased our project capacity by 40%.",
        author: "Sarah Mitchell",
        company: "Mitchell Custom Homes",
        location: "Austin, TX"
      },
      cta: "Start Your 14-Day Free Trial",
      secondaryCta: "Watch 5-Minute Demo"
    },
    commercial: {
      title: "Scale Your Commercial Projects with Intelligent Automation",
      subtitle: "Enterprise-grade construction management for complex commercial builds",
      icon: Building2,
      color: "green",
      features: [
        "Multi-stakeholder communication and permissions",
        "Compliance tracking and documentation management",
        "Resource allocation across multiple projects",
        "Subcontractor management and coordination",
        "Progress billing and AIA documentation",
        "RFI and submittal workflow automation"
      ],
      benefits: [
        { icon: Clock, title: "Reduce Project Delays by 30%", description: "AI-powered scheduling and conflict detection" },
        { icon: DollarSign, title: "Improve Cash Flow", description: "Faster billing cycles and payment processing" },
        { icon: Users, title: "Coordinate Teams Efficiently", description: "Real-time collaboration for all stakeholders" },
        { icon: BarChart3, title: "Data-Driven Decisions", description: "Analytics dashboard for project insights" }
      ],
      testimonial: {
        quote: "Managing our $50M commercial development became seamless with FireBuild. The ROI was evident within the first month.",
        author: "Michael Chen",
        company: "Apex Construction Group",
        location: "San Francisco, CA"
      },
      cta: "Schedule Enterprise Demo",
      secondaryCta: "Download ROI Calculator"
    },
    'specialty-trades': {
      title: "Streamline Your Trade Business Operations",
      subtitle: "Built specifically for electricians, plumbers, HVAC, and specialty contractors",
      icon: Wrench,
      color: "orange",
      features: [
        "Work order management with mobile dispatch",
        "Client scheduling with automated reminders",
        "Invoice automation with parts markup",
        "Mobile field tools for technicians",
        "Inventory tracking and reorder alerts",
        "Service agreement management"
      ],
      benefits: [
        { icon: Clock, title: "Complete More Jobs Daily", description: "Optimized routing and scheduling" },
        { icon: DollarSign, title: "Get Paid Faster", description: "Invoice on-site with instant payment options" },
        { icon: Users, title: "Grow Your Team", description: "Easy onboarding and performance tracking" },
        { icon: BarChart3, title: "Track Profitability", description: "Job costing and margin analysis" }
      ],
      testimonial: {
        quote: "As an HVAC contractor, FireBuild helped us go from 5 to 15 technicians while actually reducing our admin work.",
        author: "Tony Rodriguez",
        company: "CoolAir HVAC Services",
        location: "Phoenix, AZ"
      },
      cta: "Get Started Today",
      secondaryCta: "See Mobile App Demo"
    }
  };

  const data = industryData[industry];
  const Icon = data.icon;

  const handleCTAClick = (ctaType: 'primary' | 'secondary') => {
    campaignAnalytics.trackConversion(ctaType === 'primary' ? 'trial' : 'demo');
    // Navigate to appropriate page
    if (ctaType === 'primary') {
      window.location.href = '/signup';
    } else {
      window.location.href = '/demo';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            
            <Badge variant="outline" className="mb-4">
              Trusted by 5,000+ {industry === 'specialty-trades' ? 'Trade Businesses' : `${industry} Contractors`}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {data.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {data.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleCTAClick('primary')}
                className="group"
              >
                {data.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleCTAClick('secondary')}
              >
                {data.secondaryCta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Run Your {industry === 'specialty-trades' ? 'Trade Business' : `${industry} Projects`}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            The FireBuild Advantage
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-8">
              <div className="text-center">
                <p className="text-lg md:text-xl mb-6 italic">
                  "{data.testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{data.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.testimonial.company} • {data.testimonial.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your {industry === 'specialty-trades' ? 'Trade Business' : `${industry} Business`}?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of contractors who are building smarter with FireBuild
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleCTAClick('primary')}
              className="group"
            >
              {data.cta}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => window.location.href = '/contact'}
            >
              Questions? Talk to Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}