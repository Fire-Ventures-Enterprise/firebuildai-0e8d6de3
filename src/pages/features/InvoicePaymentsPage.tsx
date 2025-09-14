import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  Check, 
  CreditCard, 
  Smartphone,
  Shield,
  TrendingUp,
  FileCheck,
  Clock,
  ArrowRight
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const InvoicePaymentsPage = () => {
  useEffect(() => {
    document.title = "Construction Invoice Software - Get Paid 2x Faster | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional invoice software for contractors. Accept online payments, track outstanding balances, and get paid 2x faster with automated payment reminders and instant payment processing.');
    }
  }, []);

  const benefits = [
    "Get paid 2x faster with online payments",
    "Accept credit cards, ACH, and digital payments",
    "Automatic payment reminders reduce late payments by 70%",
    "Real-time payment tracking and notifications",
    "Secure payment processing with bank-level encryption",
    "Instant deposit notifications",
    "Partial payment and deposit tracking",
    "Integration with QuickBooks and accounting software"
  ];

  const features = [
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Accept credit cards, debit cards, ACH transfers, and digital wallets. Give customers flexibility in how they pay."
    },
    {
      icon: Clock,
      title: "Automated Reminders",
      description: "Set up automatic payment reminders that send before and after due dates. Reduce collection calls by 80%."
    },
    {
      icon: Shield,
      title: "Secure Processing",
      description: "PCI-compliant payment processing with bank-level encryption keeps your business and customers protected."
    },
    {
      icon: TrendingUp,
      title: "Cash Flow Analytics",
      description: "Track outstanding invoices, payment trends, and cash flow projections in real-time dashboards."
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Invoice & Get Paid</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Get Paid Faster with{" "}
                <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  Smart Invoicing
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Professional invoicing software built for contractors. Send invoices, accept online payments, 
                and get paid 2x faster with automated reminders and instant payment processing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
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
                  <p className="text-2xl font-bold text-foreground">2x</p>
                  <p className="text-sm text-muted-foreground">Faster Payments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">70%</p>
                  <p className="text-sm text-muted-foreground">Less Late Payments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$0</p>
                  <p className="text-sm text-muted-foreground">Setup Fees</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Invoice #INV-2024-042</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Paid</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Customer: ABC Construction</p>
                    <p className="text-sm text-muted-foreground">Project: Office Renovation</p>
                    <p className="text-sm text-muted-foreground">Due Date: March 15, 2024</p>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span>$45,000</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax (13%)</span>
                        <span>$5,850</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-green-600">$50,850</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Received
                  </Button>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Contractors Love Our Invoice Software
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
              Complete Payment Solution for Contractors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to send professional invoices, accept payments, and manage your cash flow efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-green-500" />
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

      {/* Payment Methods */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Accept Payments Your Way
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Credit & Debit Cards</h3>
              <p className="text-sm text-muted-foreground">
                Accept all major cards with competitive processing rates
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">ACH Bank Transfers</h3>
              <p className="text-sm text-muted-foreground">
                Lower fees for larger invoices with direct bank transfers
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Digital Wallets</h3>
              <p className="text-sm text-muted-foreground">
                Accept Apple Pay, Google Pay, and other digital payments
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500/10 to-green-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Getting Paid Faster Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of contractors who get paid 2x faster with FireBuild invoicing.
            Start your 30-day free trial with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-green-600 hover:bg-green-700">
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