import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo/SEOHead";
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Calculator,
  PenTool,
  Send,
  Shield,
  Smartphone,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export function EstimatesInvoicesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How quickly can I create a professional estimate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Create and send professional estimates in under 60 seconds using our AI-powered templates and smart pricing suggestions."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert estimates to invoices automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, approved estimates convert to invoices with one click. Track payments, send reminders, and get paid 2x faster."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, create estimates and invoices from any device. Our mobile app lets you work from job sites with offline mode."
        }
      }
    ]
  };

  const stats = [
    { value: "60 sec", label: "Average estimate time" },
    { value: "3x faster", label: "Payment collection" },
    { value: "47%", label: "More jobs won" },
    { value: "$2.3M+", label: "Invoices processed daily" }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save 10+ Hours Weekly",
      description: "Stop wasting nights on paperwork. Our contractor estimate app creates professional quotes instantly."
    },
    {
      icon: TrendingUp,
      title: "Win 47% More Jobs",
      description: "Professional estimates that impress clients. Stand out from competitors using basic contractor invoicing software."
    },
    {
      icon: DollarSign,
      title: "Get Paid 3x Faster",
      description: "Instant invoice conversion, automated payment reminders, and integrated Stripe payments."
    },
    {
      icon: Smartphone,
      title: "Estimate From Job Sites",
      description: "Mobile-first construction estimating software. Create estimates on-site, get signatures instantly."
    }
  ];

  const features = [
    {
      category: "Estimating Power",
      items: [
        "AI-powered line item suggestions",
        "Drag-and-drop estimate builder",
        "Custom pricing templates by trade",
        "Material cost database (updated daily)",
        "Profit margin calculator",
        "Photo attachments for clarity"
      ]
    },
    {
      category: "Invoice Automation",
      items: [
        "One-click estimate to invoice conversion",
        "Automated payment reminders",
        "Partial payment tracking",
        "Late fee automation",
        "Recurring invoice scheduling",
        "Multi-currency support"
      ]
    },
    {
      category: "Payment Collection",
      items: [
        "Integrated Stripe & Square payments",
        "ACH bank transfers",
        "Credit card processing (2.9% flat)",
        "Payment plans & deposits",
        "QR code instant payments",
        "Customer payment portal"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Switched from QuickBooks. FireBuildAI's contractor estimate app is 10x faster. Won 3 big jobs this month alone.",
      author: "Mike Peterson",
      company: "Peterson Electric",
      rating: 5
    },
    {
      quote: "Best estimating software for contractors, period. My close rate jumped 40% with professional estimates.",
      author: "Sarah Chen",
      company: "Chen Construction Group",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How fast can I create professional estimates?",
      answer: "Most contractors create detailed estimates in under 60 seconds using our templates and AI suggestions. Complex multi-phase estimates take 2-3 minutes."
    },
    {
      question: "Can I convert estimates to invoices automatically?",
      answer: "Yes! One-click conversion from estimate to invoice. All line items, taxes, and customer info transfer instantly."
    },
    {
      question: "What payment methods can my clients use?",
      answer: "Accept credit cards, ACH transfers, cash, checks, and digital wallets. We integrate with Stripe for 2.9% flat-rate processing."
    },
    {
      question: "Does it work offline at job sites?",
      answer: "Yes, our mobile app works offline. Create estimates without internet, and they'll sync when you reconnect."
    },
    {
      question: "Can I import my existing estimates?",
      answer: "Yes! Import from QuickBooks, Xactimate, Excel, or PDF. Our AI extracts and formats everything automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contractor Estimating Software | Invoice App - FireBuild.AI"
        description="Best estimating software for contractors. Create estimates in 60 seconds, get paid 3x faster. Free 30-day trial."
        keywords="contractor estimating software, estimate and invoice app for contractors, construction estimating software, contractor invoice software"
        canonicalUrl="https://firebuild.ai/products/estimates-invoices"
        jsonLd={faqSchema}
      />
      {/* Hero Section - H1 for SEO */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary" variant="outline">
              <Zap className="mr-1 h-3 w-3" />
              #1 Contractor Estimating Software
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              Construction Estimating Software That Wins Jobs
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Create professional estimates in 60 seconds. Convert to invoices instantly. 
              Get paid 3x faster with the best contractor invoice and estimate app.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/auth/signup">
                  Start Free 30-Day Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#demo">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Watch 90-Second Demo
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • 5-minute setup • Cancel anytime
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

      {/* Benefits Section - H2 for SEO */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Why 10,000+ Contractors Choose FireBuildAI
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Stop losing money to slow paperwork. Our contractor invoicing software 
              helps you win more jobs and get paid faster.
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

      {/* Features Grid - H2 for SEO */}
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Complete Estimating & Invoicing Platform
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Everything you need to estimate jobs, invoice clients, and get paid faster 
              than any other construction estimating software.
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
                      <CheckCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
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
            Contractors Love Our Estimate Software
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

      {/* FAQ Section - H2 for SEO */}
      <section className="border-t bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Frequently Asked Questions
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
            Start Creating Professional Estimates Today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join 10,000+ contractors using the best estimating software for contractors.
            Win more jobs, get paid faster.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/auth/signup">
                Start Free 30-Day Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Free forever for 1 user • No credit card required • 5-minute setup
          </p>
        </div>
      </section>
    </div>
  );
}