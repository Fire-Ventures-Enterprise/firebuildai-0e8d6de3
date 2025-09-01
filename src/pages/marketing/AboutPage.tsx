import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">About FireBuild.ai</h1>
        
        <div className="prose prose-lg max-w-4xl">
          <p className="text-lg text-muted-foreground mb-6">
            FireBuild.ai is the leading contractor management platform designed to streamline 
            your construction business operations.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            To empower contractors with intelligent tools that simplify project management, 
            enhance team collaboration, and drive business growth.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose FireBuild?</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
            <li>Comprehensive job tracking and management</li>
            <li>Real-time team collaboration</li>
            <li>Automated invoicing and estimates</li>
            <li>GPS fleet tracking</li>
            <li>Financial analytics and reporting</li>
          </ul>
        </div>
        
        <div className="mt-12">
          <Button asChild size="lg">
            <Link to={R.signup}>Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}