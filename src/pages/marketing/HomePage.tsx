import { HeroSection } from "@/components/marketing/HeroSection";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { TradeSpecificSection } from "@/components/marketing/TradeSpecificSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { EmailCapturePopup } from "@/components/marketing/EmailCapturePopup";
import { NotificationPreferencesPopup } from "@/components/marketing/NotificationPreferencesPopup";
import { MobileAppSection } from "@/components/marketing/MobileAppSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { R } from "@/routes/routeMap";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <EmailCapturePopup />
      <NotificationPreferencesPopup />
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg" />
                <span className="text-xl font-bold">FireBuild</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#trades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Industries
                </a>
                <Link to="/tutorials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Tutorials
                </Link>
                <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to={R.login}>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link to={R.signup}>
                <Button>
                  Get Started Free
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
        <TradeSpecificSection />
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
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg" />
                <span className="text-xl font-bold">FireBuild</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The all-in-one platform for modern contractors.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li><Link to={R.tutorials} className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link to={R.download} className="hover:text-foreground transition-colors">Download</Link></li>
                <li><Link to={R.api} className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to={R.about} className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to={R.blog} className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to={R.careers} className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link to={R.contact} className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to={R.helpCenter} className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to={R.documentation} className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link to={R.status} className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link to={R.terms} className="hover:text-foreground transition-colors">Terms & Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 FireBuild. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};