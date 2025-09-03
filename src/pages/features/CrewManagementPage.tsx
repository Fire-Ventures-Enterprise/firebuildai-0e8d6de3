import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Check, Clock, MapPin, Shield, TrendingUp, UserCheck, Calendar, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const CrewManagementPage = () => {
  useEffect(() => {
    document.title = "Crew Management Software for Construction | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage construction crews, track time, coordinate subcontractors, and monitor productivity. Complete crew management software for contractors.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Crew Management</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Complete <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Crew Management</span> Solution
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track time, manage subcontractors, and coordinate your entire team efficiently. Real-time visibility into crew productivity and project progress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};