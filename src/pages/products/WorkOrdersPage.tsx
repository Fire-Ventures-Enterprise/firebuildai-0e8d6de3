import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo/SEOHead";
import { 
  ClipboardList, 
  Users, 
  MapPin, 
  CheckSquare, 
  Clock, 
  Smartphone,
  Camera,
  MessageSquare,
  Shield,
  TrendingUp,
  Truck,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export function WorkOrdersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do work orders hide pricing from crew?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, work orders are no-price by default. Crew members see tasks and materials but never see your margins or customer pricing."
        }
      },
      {
        "@type": "Question",
        "name": "Can crew members update work orders from phones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, crew members scan QR codes to access mobile work orders. They can update progress, upload photos, and add notes in real-time."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track crew locations and time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "GPS tracking shows crew locations in real-time. Automatic time tracking starts when crew arrives at job site via geofencing."
        }
      }
    ]
  };

  useEffect(() => {

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Digital Work Order Management | FireBuildAI' },
      { property: 'og:description', content: 'Dispatch crews instantly. Track job progress in real-time. Complete 40% more jobs.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://firebuild.ai/products/work-orders' }
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
      "name": "FireBuildAI Work Order Management",
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
        "reviewCount": "3241"
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
    { value: "40%", label: "More jobs completed" },
    { value: "3 hours", label: "Saved daily per crew" },
    { value: "98%", label: "First-time completion rate" },
    { value: "2 min", label: "Average dispatch time" }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Dispatch Crews Instantly",
      description: "Send digital work orders to crews in seconds. No more phone tag, lost paperwork, or confusion about job details."
    },
    {
      icon: MapPin,
      title: "GPS Job Tracking",
      description: "Know where every crew is, what they're working on, and when they'll finish. Real-time location updates."
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Crews upload before/after photos, document issues, and verify completion. All stored and organized automatically."
    },
    {
      icon: TrendingUp,
      title: "Complete 40% More Jobs",
      description: "Eliminate drive time to the office, reduce paperwork, and dispatch the next job before crews leave the site."
    }
  ];

  const features = [
    {
      category: "Work Order Creation",
      items: [
        "Convert estimates to work orders instantly",
        "Drag-and-drop scheduling calendar",
        "Bulk work order generation",
        "Custom work order templates by trade",
        "Material lists and job instructions",
        "Customer info and site details"
      ]
    },
    {
      category: "Field Management",
      items: [
        "Mobile app for iOS and Android",
        "Offline mode for remote sites",
        "Digital signatures and approvals",
        "Time tracking and GPS check-in",
        "Photo and video attachments",
        "Voice notes and annotations"
      ]
    },
    {
      category: "Real-Time Tracking",
      items: [
        "Live crew location tracking",
        "Job status updates (started, paused, complete)",
        "Material usage reporting",
        "Issue escalation and alerts",
        "Customer notifications",
        "Completion verification"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "We went from 3-4 jobs per crew daily to 5-6. The digital work orders eliminated all the back-and-forth.",
      author: "Marcus Williams",
      company: "Williams Electrical Services",
      rating: 5
    },
    {
      quote: "No more lost work orders or missed details. Everything documented, tracked, and billable. Game changer.",
      author: "Amanda Foster",
      company: "Foster Plumbing & HVAC",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How do crews access work orders in the field?",
      answer: "Through our mobile app (iOS/Android). Works offline too - crews can view orders, update status, and upload photos without internet. Everything syncs when reconnected."
    },
    {
      question: "Can I convert estimates directly to work orders?",
      answer: "Yes! One-click conversion from estimate to work order. All details, materials, and instructions transfer automatically. Dispatch immediately or schedule for later."
    },
    {
      question: "How does GPS tracking work?",
      answer: "Crews check in/out with GPS verification. See real-time locations on a map, track drive time, and verify they reached the job site. Privacy controls included."
    },
    {
      question: "Can customers see work order progress?",
      answer: "Yes! Send automatic updates when crews are on the way, arrive, and complete work. Customers can view progress, photos, and sign off digitally."
    },
    {
      question: "Does it integrate with invoicing?",
      answer: "Absolutely! Completed work orders convert to invoices instantly. All labor, materials, and photos included. Bill immediately upon completion."
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Create Work Order",
      description: "Convert estimate or create new. Add instructions, materials, crew."
    },
    {
      step: "2",
      title: "Dispatch to Crew",
      description: "Send instantly to mobile devices. Crew gets notification immediately."
    },
    {
      step: "3",
      title: "Track Progress",
      description: "Real-time updates, photos, and GPS location from the field."
    },
    {
      step: "4",
      title: "Complete & Invoice",
      description: "Digital sign-off, instant invoice generation, and payment collection."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Digital Work Orders (No Pricing) | Contractor Software"
        description="Digital work order software for contractors. Dispatch crews, track progress. No pricing shown to crew. Free trial."
        canonicalUrl="https://firebuild.ai/products/work-orders"
        jsonLd={faqSchema}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary" variant="outline">
              <ClipboardList className="mr-1 h-3 w-3" />
              #1 Digital Work Order Software
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              Work Order Management That Drives Productivity
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Dispatch crews instantly. Track jobs in real-time. Complete 40% more work 
              with digital work order software built for contractors.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/auth/signup">
                  Start Free 30-Day Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#workflow">
                  <Smartphone className="mr-2 h-4 w-4" />
                  See Mobile App Demo
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Used by 10,000+ contractors • No training required
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

      {/* Workflow Steps */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              From Dispatch to Payment in 4 Simple Steps
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Streamline your entire field operation with digital work orders
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((item, index) => (
              <Card key={index} className="relative border-border/50 bg-card/50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Why Contractors Love Our Work Order Software
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Stop losing money to inefficient dispatching and poor communication. 
              Get your crews working smarter, not harder.
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
              Everything You Need for Digital Work Orders
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Complete work order management from creation to completion, 
              with powerful tools for office and field.
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
                      <CheckSquare className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
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
            Trusted by Thousands of Contractors
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
              Work Order Software FAQs
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
            Start Completing 40% More Jobs Today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join 10,000+ contractors using digital work orders to transform 
            their field operations.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/auth/signup">
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:1-800-FIREBUILD">
                <MessageSquare className="mr-2 h-4 w-4" />
                Talk to Sales
              </a>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            30-day free trial • No credit card • 5-minute setup
          </p>
        </div>
      </section>
    </div>
  );
}