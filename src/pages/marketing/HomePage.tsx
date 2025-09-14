import { useEffect } from "react";
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

export const HomePage = () => {
  useEffect(() => {
    // SEO meta tags
    document.title = "FireBuild.ai - #1 Construction Management Software for Contractors";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional construction management software with estimates, invoices, work orders, and scheduling. Trusted by 5,000+ contractors. Start your 30-day free trial.');
    }
  }, []);

  return (
    <MarketingLayout>
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