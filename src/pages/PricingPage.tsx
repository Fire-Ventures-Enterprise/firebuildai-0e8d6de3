import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for independent contractors",
    features: [
      "Up to 10 active jobs",
      "Unlimited estimates & invoices",
      "Basic scheduling",
      "Mobile app access",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing construction businesses",
    features: [
      "Unlimited active jobs",
      "Advanced scheduling & dispatch",
      "Team management (up to 10 users)",
      "QuickBooks integration",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large contractors & teams",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "Custom training & onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const PricingPage = () => {
  useEffect(() => {
    document.title = "Pricing - Construction Management Software | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Simple, transparent pricing for construction management software. Start your 30-day free trial. No credit card required.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded" />
              <span className="font-bold text-xl">FireBuild</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-foreground">
                Pricing
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your construction business. All plans include a 30-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`p-6 relative ${
                  plan.popular 
                    ? 'border-primary shadow-xl scale-105' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.cta === "Contact Sales" ? "/contact" : "/signup"}>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Do I need a credit card to start the free trial?
                </h3>
                <p className="text-muted-foreground">
                  No! Start your 30-day free trial without any credit card. We'll only ask for payment details when you're ready to subscribe.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any differences.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What happens to my data if I cancel?
                </h3>
                <p className="text-muted-foreground">
                  Your data remains accessible for 90 days after cancellation. You can export all your data at any time.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Do you offer discounts for annual billing?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Save 20% when you pay annually. That's like getting 2 months free every year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of contractors who are streamlining their operations with FireBuild.
          </p>
          <Link to="/signup">
            <Button size="lg" className="min-w-[200px]">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};