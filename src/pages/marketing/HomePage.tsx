import { MarketingLayout } from "@/layouts/MarketingLayout";
import { HeroSection } from "@/components/marketing/HeroSection";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { MobileAppSection } from "@/components/marketing/MobileAppSection";
import { ComingSoonSection } from "@/components/marketing/ComingSoonSection";
import { TradeSection } from "@/components/marketing/TradeSection";
import { SEOHead } from "@/components/seo/SEOHead";

export const HomePage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How fast can I create an estimate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most contractors create and send their first professional estimate in under 5 minutes using FireBuild.AI's smart templates and AI-powered suggestions."
        }
      },
      {
        "@type": "Question",
        "name": "Do work orders hide pricing from crew?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Work orders are no-price by default and include QR crew links for mobile reporting, keeping your margins confidential."
        }
      },
      {
        "@type": "Question",
        "name": "Does FireBuild sync with Google Calendar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Jobs scheduled from an invoice appear on your Google Calendar automatically with two-way sync for real-time updates."
        }
      },
      {
        "@type": "Question",
        "name": "Is LiDAR estimating available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LiDAR scanning for instant measurements is coming Q1 2025. Join the waitlist on our LiDAR page to get early access and special pricing."
        }
      }
    ]
  };

  return (
    <MarketingLayout>
      <SEOHead 
        title="FireBuild.AI - Contractor Estimating Software | Job Management"
        description="Professional contractor software for estimates, invoices & job management. Create estimates in 5 min. Start free 30-day trial."
        keywords="contractor estimating software, contractor invoice software, contractor job management software, construction management platform"
        canonicalUrl="https://firebuild.ai"
        jsonLd={faqSchema}
      />
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Badges */}
      <TrustBadges />
      
      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>
      
      {/* Trade Specific Section */}
      <div id="trades">
        <TradeSection />
      </div>
      
      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      
      {/* Pricing */}
      <div id="pricing">
        <PricingSection />
      </div>
      
      {/* Mobile App Download */}
      <div id="mobile-app">
        <MobileAppSection />
      </div>
      
      {/* Coming Soon Products */}
      <div id="coming-soon">
        <ComingSoonSection />
      </div>
      
      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};