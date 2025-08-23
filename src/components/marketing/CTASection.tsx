import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Transform Your Contracting Business?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 5,000+ contractors who are building better businesses with FireBuild. 
            Start your free trial today - no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/app/dashboard">
              <Button size="lg" className="group text-lg px-8 py-6 shadow-xl hover:shadow-2xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};