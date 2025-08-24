import { HeroSection } from "@/components/marketing/HeroSection";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { TradeSpecificSection } from "@/components/marketing/TradeSpecificSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
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
                <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/app/dashboard">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link to="/app/dashboard">
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
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms & Privacy</a></li>
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