import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  FileCheck, 
  TrendingDown, 
  Package, 
  BarChart3, 
  Shield,
  Receipt,
  AlertCircle,
  DollarSign,
  Truck,
  Users,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export function PurchaseOrdersPage() {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Purchase Order Software for Contractors | PO Management - FireBuildAI";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Construction purchase order software that saves 30% on materials. Track POs, manage vendors, control costs. Automated approvals. Try free.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Construction purchase order software that saves 30% on materials. Track POs, manage vendors, control costs. Automated approvals. Try free.';
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Purchase Order Management Software | FireBuildAI' },
      { property: 'og:description', content: 'Save 30% on material costs. Automated PO approvals, vendor management, real-time tracking.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://firebuild.ai/products/purchase-orders' }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FireBuildAI Purchase Order Management",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1923"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (scriptTag) scriptTag.remove();
    };
  }, []);

  const stats = [
    { value: "30%", label: "Average cost savings" },
    { value: "2 hours", label: "Saved per week" },
    { value: "$2.1M", label: "Materials tracked daily" },
    { value: "15 sec", label: "PO creation time" }
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "Cut Material Costs by 30%",
      description: "Track spending patterns, compare vendor prices, eliminate duplicate orders with construction purchase order software."
    },
    {
      icon: Clock,
      title: "Instant PO Creation",
      description: "Create purchase orders in 15 seconds. Pre-filled vendor info, automatic calculations, mobile-friendly."
    },
    {
      icon: Shield,
      title: "Prevent Cost Overruns",
      description: "Set budget limits, require approvals for large orders, get alerts before exceeding project budgets."
    },
    {
      icon: Package,
      title: "Track Every Delivery",
      description: "Know what's ordered, shipped, and received. Photo verification, delivery confirmations, shortage tracking."
    }
  ];

  const features = [
    {
      category: "PO Creation & Management",
      items: [
        "15-second PO creation with templates",
        "Bulk ordering from multiple vendors",
        "Automatic tax & shipping calculations",
        "Cost coding by project/phase",
        "Change order tracking",
        "PO duplication for repeat orders"
      ]
    },
    {
      category: "Vendor & Cost Control",
      items: [
        "Vendor price comparison dashboard",
        "Preferred vendor lists by trade",
        "Spending analytics by vendor",
        "Payment terms management",
        "Credit limit tracking",
        "Vendor performance scoring"
      ]
    },
    {
      category: "Approvals & Compliance",
      items: [
        "Multi-level approval workflows",
        "Budget threshold alerts",
        "Mobile approval notifications",
        "Audit trail for all changes",
        "Lien waiver tracking",
        "Insurance certificate management"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Cut our material costs by 35% in 6 months. The vendor comparison alone paid for the software 10x over.",
      author: "Tom Rodriguez",
      company: "Rodriguez General Contracting",
      rating: 5
    },
    {
      quote: "No more lost POs or duplicate orders. Everything tracked, approved, and organized. Saved us $50K last quarter.",
      author: "Jennifer Park",
      company: "Park Home Builders",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How quickly can I create a purchase order?",
      answer: "Most POs take 15-30 seconds using templates. Complex multi-vendor orders take 1-2 minutes. Import from estimates instantly."
    },
    {
      question: "Can I set approval limits for my team?",
      answer: "Yes! Set approval thresholds by role, project, or amount. Automatic routing to the right approver, mobile notifications included."
    },
    {
      question: "Does it integrate with my accounting software?",
      answer: "Yes, we sync with QuickBooks, Xero, Sage, and 20+ accounting platforms. Real-time export of POs, invoices, and payments."
    },
    {
      question: "Can I track deliveries and receipts?",
      answer: "Absolutely! Photo verification, partial deliveries, shortage tracking, and automatic vendor notifications for discrepancies."
    },
    {
      question: "How does vendor management work?",
      answer: "Store unlimited vendors with contact info, payment terms, pricing history. Compare prices, track performance, manage documents."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary" variant="outline">
              <ShoppingCart className="mr-1 h-3 w-3" />
              Construction Purchase Order Software
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              Purchase Order Software That Controls Costs
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Save 30% on materials with smart purchase order management. 
              Track every dollar, approve instantly, eliminate waste.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/auth/signup">
                  Start Free Trial - No Card Required
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#demo">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  See Cost Savings Calculator
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Join 5,000+ contractors saving millions on materials
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Stop Bleeding Money on Materials
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Construction companies lose 8-12% to poor purchasing practices. 
              Our PO software plugs the leaks instantly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border/50 bg-card/50 p-6 backdrop-blur">
                <benefit.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Complete Purchase Order Management System
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Everything you need to control costs, manage vendors, and track materials 
              from order to delivery.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((category, index) => (
              <Card key={index} className="border-border/50 bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <FileCheck className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Contractors Save Millions With Our PO Software
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/50 p-8">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Purchase Order Software FAQs
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border/50 bg-card p-6">
                  <h3 className="mb-3 font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Start Saving 30% on Materials Today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of contractors using smart purchase order management 
            to control costs and boost profits.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/auth/signup">
                Start Free Trial Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                See ROI Calculator
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card • 5-minute setup • Instant cost savings
          </p>
        </div>
      </section>
    </div>
  );
}