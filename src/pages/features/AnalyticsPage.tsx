import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Check, TrendingUp, PieChart, Activity, DollarSign, Users, FileText, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export const AnalyticsPage = () => {
  useEffect(() => {
    document.title = "Construction Analytics & Reporting Software | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Real-time construction analytics software. Track revenue, job costs, profitability, and KPIs with powerful reporting tools for contractors.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">Real-Time Analytics</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Data-Driven <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">Business Intelligence</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track revenue, costs, and profitability in real-time. Make informed decisions with powerful analytics and reporting tools built for contractors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
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