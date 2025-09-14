import { ProductLandingPage } from "@/components/marketing/ProductLandingPage";
import { 
  Zap, 
  Shield, 
  Target, 
  Database, 
  LineChart, 
  Workflow,
  BrainCircuit,
  FileSearch,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

// AI-Powered Scheduling Product
export function AISchedulingPage() {
  return (
    <MarketingLayout>
      <ProductLandingPage
        productName="FireBuild AI Scheduler"
        productTagline="Intelligent Scheduling That Learns Your Business"
        productDescription="Revolutionary AI-powered scheduling that optimizes crew assignments, predicts job durations, and automatically adjusts for weather and resource availability."
        features={[
          "Smart crew-to-job matching based on skills and location",
          "Weather-aware scheduling with automatic rescheduling",
          "Predictive job duration estimates based on historical data",
          "Conflict detection and resolution in real-time",
          "Multi-project resource optimization",
          "Automated customer notifications for schedule changes",
          "Integration with Google Calendar and Outlook",
          "Mobile-first crew dispatch system"
        ]}
        subdomain="scheduler"
        icon={BrainCircuit}
        betaFeatures={[
          "AI learns from your completed jobs to improve estimates",
          "Voice-activated scheduling via mobile app",
          "Predictive maintenance scheduling for equipment",
          "Smart route optimization for multiple job sites"
        ]}
      />
    </MarketingLayout>
  );
}