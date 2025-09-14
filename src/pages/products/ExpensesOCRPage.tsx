import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  Camera, 
  Zap, 
  DollarSign, 
  PieChart, 
  FileText,
  Smartphone,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export function ExpensesOCRPage() {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Expense Tracking Software for Contractors | OCR Receipt Scanner - FireBuildAI";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Construction expense tracking software with OCR receipt scanning. Track job costs, scan receipts instantly, maximize tax deductions. Try free.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Construction expense tracking software with OCR receipt scanning. Track job costs, scan receipts instantly, maximize tax deductions. Try free.';
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Contractor Expense Tracking with OCR | FireBuildAI' },
      { property: 'og:description', content: 'Snap photo, done. OCR extracts all receipt data instantly. Track every expense, maximize deductions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://firebuild.ai/products/expenses-ocr' }
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
      "name": "FireBuildAI Expense Tracking & OCR",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3421"
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
    { value: "3 sec", label: "Receipt scan time" },
    { value: "$18K", label: "Average tax savings" },
    { value: "99.8%", label: "OCR accuracy" },
    { value: "50%", label: "Less bookkeeping time" }
  ];

  const benefits = [
    {
      icon: Camera,
      title: "Snap Photo, Done",
      description: "Take a photo of any receipt. OCR extracts vendor, amount, date, items instantly. No manual entry ever."
    },
    {
      icon: DollarSign,
      title: "Maximize Tax Deductions",
      description: "Never miss a deduction. Track mileage, materials, tools, meals. IRS-compliant reports ready for your accountant."
    },
    {
      icon: PieChart,
      title: "Real-Time Job Costing",
      description: "See actual vs. estimated costs per job instantly. Know your profit margins before the job ends."
    },
    {
      icon: AlertCircle,
      title: "Expense Policy Enforcement",
      description: "Set spending limits, require approvals, flag unusual expenses. Keep your team accountable automatically."
    }
  ];

  const features = [
    {
      category: "OCR & Capture",
      items: [
        "99.8% accurate OCR scanning",
        "Bulk receipt upload",
        "Email receipt forwarding",
        "Credit card integration",
        "Mileage GPS tracking",
        "Voice expense entry"
      ]
    },
    {
      category: "Expense Management",
      items: [
        "Automatic categorization",
        "Job/project allocation",
        "Recurring expense templates",
        "Split expenses across jobs",
        "Reimbursement tracking",
        "Approval workflows"
      ]
    },
    {
      category: "Reporting & Compliance",
      items: [
        "IRS-ready tax reports",
        "Profit & loss by job",
        "Budget vs. actual tracking",
        "QuickBooks integration",
        "Audit trail maintenance",
        "Receipt image storage (7 years)"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Saved $22K in missed deductions last year. The OCR is magic - just snap and forget. My accountant loves me now.",
      author: "Robert Chen",
      company: "Chen Electric & Solar",
      rating: 5
    },
    {
      quote: "Cut bookkeeping time by 75%. Every receipt scanned on-site, automatically coded to the right job. Game changer.",
      author: "Maria Gonzalez",
      company: "Gonzalez Custom Homes",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How accurate is the OCR receipt scanning?",
      answer: "Our OCR technology has 99.8% accuracy. It reads vendor names, amounts, dates, and line items perfectly. For the rare error, you can edit with one tap."
    },
    {
      question: "Can I track mileage automatically?",
      answer: "Yes! Turn on GPS tracking and it logs every trip automatically. Swipe to categorize as business/personal. IRS-compliant mileage logs generated monthly."
    },
    {
      question: "Does it integrate with my accounting software?",
      answer: "Yes, we sync with QuickBooks, Xero, FreshBooks, and 15+ accounting platforms. Expenses flow automatically with proper categorization."
    },
    {
      question: "How long are receipts stored?",
      answer: "All receipt images are stored securely for 7 years (IRS requirement). Searchable, downloadable, and audit-ready anytime."
    },
    {
      question: "Can my crew submit expenses?",
      answer: "Absolutely! Each crew member gets the mobile app. They snap receipts, you approve, everything tracked by job and person."
    }
  ];

  const ocrDemo = [
    { label: "Vendor", value: "Home Depot", extracted: true },
    { label: "Amount", value: "$247.83", extracted: true },
    { label: "Date", value: "Dec 15, 2024", extracted: true },
    { label: "Category", value: "Materials", extracted: true },
    { label: "Tax", value: "$19.83", extracted: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary" variant="outline">
              <Receipt className="mr-1 h-3 w-3" />
              Construction Expense Tracking Software
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              Expense Tracking with Magic OCR Receipt Scanning
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Snap a photo, OCR extracts everything. Track every expense, 
              maximize tax deductions, know job profits instantly.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/auth/signup">
                  Start Free Trial - Scan Receipts Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#ocr-demo">
                  <Camera className="mr-2 h-4 w-4" />
                  See OCR in Action
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Save $18K average in tax deductions • 3-second scanning
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

      {/* OCR Demo Section */}
      <section className="py-24" id="ocr-demo">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Watch OCR Extract Data in 3 Seconds
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Point, shoot, done. Our AI reads receipts better than humans.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="border-border/50 bg-card/50 p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-semibold text-foreground">📸 Original Receipt</h3>
                  <div className="rounded-lg bg-muted/50 p-6">
                    <div className="space-y-2 font-mono text-sm text-muted-foreground">
                      <div>HOME DEPOT #2674</div>
                      <div>1234 CONTRACTOR WAY</div>
                      <div>-------------------</div>
                      <div>2X4 LUMBER    $89.97</div>
                      <div>DRYWALL       $124.50</div>
                      <div>SCREWS        $13.53</div>
                      <div>-------------------</div>
                      <div>SUBTOTAL     $228.00</div>
                      <div>TAX           $19.83</div>
                      <div>TOTAL        $247.83</div>
                      <div>12/15/2024 3:47 PM</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold text-foreground">✨ Extracted Data</h3>
                  <div className="space-y-3">
                    {ocrDemo.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.value}</span>
                          {item.extracted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" size="sm">
                      Assign to Job: Kitchen Remodel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Stop Losing Money to Poor Expense Tracking
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              The average contractor misses $18,000 in tax deductions yearly. 
              Our expense software captures every penny automatically.
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Complete Expense Management Platform
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              From receipt capture to tax reports, everything you need 
              to track expenses and maximize profitability.
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
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Contractors Save Thousands With Smart Expense Tracking
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Expense Tracking FAQs
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
            Start Tracking Every Expense in 3 Seconds
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join 10,000+ contractors saving thousands in taxes with 
            smart expense tracking and OCR receipt scanning.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/auth/signup">
                Start Scanning Receipts Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Calculate Your Tax Savings
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            30-day free trial • No credit card • 3-minute setup
          </p>
        </div>
      </section>
    </div>
  );
}