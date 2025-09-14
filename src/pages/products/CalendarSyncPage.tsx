import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Repeat, 
  Users, 
  Bell, 
  Clock, 
  Smartphone,
  Map,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Cloud,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export function CalendarSyncPage() {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Construction Scheduling Software | Google Calendar Sync - FireBuildAI";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Project scheduling software for contractors with Google Calendar sync. Schedule crews, track jobs, prevent conflicts. Two-way sync. Try free.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Project scheduling software for contractors with Google Calendar sync. Schedule crews, track jobs, prevent conflicts. Two-way sync. Try free.';
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Construction Scheduling Software with Calendar Sync | FireBuildAI' },
      { property: 'og:description', content: 'Never double-book crews. Two-way Google Calendar sync, drag-and-drop scheduling, automatic conflict detection.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://firebuild.ai/products/calendar-sync' }
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
      "name": "FireBuildAI Calendar & Scheduling",
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
        "reviewCount": "2156"
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
    { value: "Zero", label: "Double bookings" },
    { value: "85%", label: "Less scheduling time" },
    { value: "2-way", label: "Google Calendar sync" },
    { value: "99.9%", label: "Uptime reliability" }
  ];

  const benefits = [
    {
      icon: Repeat,
      title: "Two-Way Google Sync",
      description: "Changes in FireBuild appear in Google Calendar instantly. Edit in Google, updates in FireBuild. Perfect sync, always."
    },
    {
      icon: AlertTriangle,
      title: "Never Double-Book Again",
      description: "Automatic conflict detection across all crews. See availability instantly. Smart suggestions for optimal scheduling."
    },
    {
      icon: Map,
      title: "Route Optimization",
      description: "Schedule jobs by location to minimize drive time. Group nearby jobs automatically. Save 2+ hours daily per crew."
    },
    {
      icon: Bell,
      title: "Automatic Reminders",
      description: "Crews get notifications the night before. Customers receive appointment reminders. Never miss or forget a job."
    }
  ];

  const features = [
    {
      category: "Calendar Integration",
      items: [
        "Two-way Google Calendar sync",
        "Outlook Calendar integration",
        "Apple Calendar support",
        "Shared team calendars",
        "Color-coded job types",
        "Recurring job templates"
      ]
    },
    {
      category: "Smart Scheduling",
      items: [
        "Drag-and-drop job scheduling",
        "Crew availability tracking",
        "Automatic conflict detection",
        "Weather-aware scheduling",
        "Travel time calculation",
        "Buffer time management"
      ]
    },
    {
      category: "Crew Management",
      items: [
        "Individual crew calendars",
        "Skill-based assignment",
        "Workload balancing",
        "Time-off management",
        "Overtime tracking",
        "Performance analytics"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Eliminated double-bookings completely. The Google Calendar sync means everyone's always on the same page.",
      author: "David Martinez",
      company: "Martinez Roofing Solutions",
      rating: 5
    },
    {
      quote: "Cut scheduling time from 2 hours to 15 minutes daily. The drag-and-drop is intuitive, conflict detection is brilliant.",
      author: "Lisa Thompson",
      company: "Thompson HVAC Services",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does Google Calendar sync work?",
      answer: "It's true two-way sync. Add a job in FireBuild, it appears in Google Calendar within seconds. Edit in Google, FireBuild updates automatically. All crew members see updates in real-time."
    },
    {
      question: "Can I see all crew schedules at once?",
      answer: "Yes! View individual, team, or company-wide calendars. Filter by crew, job type, or location. See who's available instantly for emergency jobs."
    },
    {
      question: "Does it prevent double-booking?",
      answer: "Absolutely! The system checks for conflicts automatically. It won't let you schedule overlapping jobs and suggests alternative times or crews."
    },
    {
      question: "Can customers see their appointments?",
      answer: "Yes, customers receive appointment confirmations with calendar invites. They get automatic reminders and can request rescheduling through a portal."
    },
    {
      question: "Does it work offline?",
      answer: "The mobile app stores schedules offline. View and edit without internet - everything syncs when you reconnect. Perfect for job sites."
    }
  ];

  const integrations = [
    { name: "Google Calendar", icon: "📅" },
    { name: "Outlook", icon: "📧" },
    { name: "Apple Calendar", icon: "🍎" },
    { name: "Teams", icon: "👥" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary" variant="outline">
              <Calendar className="mr-1 h-3 w-3" />
              Project Scheduling Software for Contractors
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              Construction Scheduling with Perfect Calendar Sync
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Never double-book crews again. Two-way Google Calendar sync, 
              drag-and-drop scheduling, automatic conflict detection.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link to="/auth/signup">
                  Start Free Trial - Sync in 60 Seconds
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#demo">
                  <Cloud className="mr-2 h-4 w-4" />
                  See Calendar Sync Demo
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Works with Google, Outlook, Apple Calendar
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

      {/* Integration Logos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Seamlessly integrates with your existing calendar
          </p>
          <div className="flex justify-center gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-2xl">{integration.icon}</span>
                <span className="font-medium text-foreground">{integration.name}</span>
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
              Schedule Like a Pro, Sync Like Magic
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Stop wasting hours on scheduling conflicts and miscommunication. 
              Our contractor scheduling software keeps everyone in sync.
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
              Complete Scheduling & Calendar Management
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Everything you need to schedule jobs, manage crews, and keep 
              everyone synchronized across all devices.
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

      {/* Visual Schedule Demo */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Visual Scheduling That Makes Sense
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Drag, drop, done. See your entire operation at a glance.
            </p>
          </div>

          <Card className="mx-auto max-w-5xl border-border/50 bg-card/50 p-8">
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-medium">Crew A - Available</span>
                </div>
                <span className="text-sm text-muted-foreground">Kitchen Remodel - 123 Main St</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="font-medium">Crew B - On Site</span>
                </div>
                <span className="text-sm text-muted-foreground">Bathroom Renovation - 456 Oak Ave</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="font-medium">Crew C - In Transit</span>
                </div>
                <span className="text-sm text-muted-foreground">Plumbing Repair - 789 Pine Rd</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/20 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Contractors Save Hours Daily on Scheduling
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
              Scheduling Software FAQs
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
            Never Double-Book a Crew Again
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of contractors using smart scheduling to maximize 
            crew productivity and eliminate conflicts.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link to="/auth/signup">
                Sync Your Calendar Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features/job-scheduling">
                <BarChart3 className="mr-2 h-4 w-4" />
                See Scheduling Features
              </Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            60-second setup • Works with all calendars • Free 30-day trial
          </p>
        </div>
      </section>
    </div>
  );
}