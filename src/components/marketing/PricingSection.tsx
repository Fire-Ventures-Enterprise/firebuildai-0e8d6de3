import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for solo contractors and small crews",
    features: [
      "Up to 3 users",
      "Unlimited estimates & invoices",
      "Basic job scheduling",
      "Mobile app access",
      "Customer portal",
      "Email support",
    ],
    notIncluded: [
      "Advanced analytics",
      "QuickBooks integration",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing contractors ready to scale",
    features: [
      "Up to 10 users",
      "Everything in Starter",
      "Advanced analytics",
      "QuickBooks integration",
      "Custom branding",
      "Priority support",
      "Time tracking",
      "Document storage (10GB)",
    ],
    notIncluded: [
      "API access",
      "Dedicated account manager",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large contractors with complex needs",
    features: [
      "Unlimited users",
      "Everything in Professional",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited storage",
      "On-site training",
      "SLA guarantee",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            No setup fees. No hidden costs. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 ${
                plan.popular 
                  ? 'border-primary shadow-2xl scale-105' 
                  : 'border-border'
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">/month</span>
                  )}
                </div>

                <Link to={R.dashboard}>
                  <Button
                    className={`w-full ${
                      plan.popular ? '' : 'variant-outline'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Includes:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 opacity-50">
                          <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground line-through">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            All plans include a 30-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Need more than 10 users? Contact us for volume discounts.
          </p>
        </div>
      </div>
    </section>
  );
};