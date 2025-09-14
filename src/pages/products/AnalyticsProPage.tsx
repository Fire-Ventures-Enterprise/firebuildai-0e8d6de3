import { ProductLandingPage } from "@/components/marketing/ProductLandingPage";
import { BarChart3, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

// Advanced Analytics Product
export function AnalyticsProPage() {
  return (
    <MarketingLayout>
      <ProductLandingPage
        productName="FireBuild Analytics Pro"
        productTagline="Data-Driven Insights for Smarter Business Decisions"
        productDescription="Enterprise-grade analytics platform that transforms your contracting data into actionable insights. Track profitability, predict trends, and optimize operations."
        features={[
          "Real-time profitability dashboards by job, client, and service",
          "Predictive revenue forecasting with seasonal adjustments",
          "Crew performance analytics and efficiency metrics",
          "Material cost trending and supplier comparison",
          "Customer lifetime value analysis",
          "Job completion time predictions",
          "Custom report builder with export capabilities",
          "Automated weekly and monthly business intelligence reports"
        ]}
        subdomain="analytics"
        icon={BarChart3}
        betaFeatures={[
          "AI-powered business recommendations",
          "Competitor benchmarking analysis",
          "Market demand forecasting by service type",
          "Automated anomaly detection for unusual costs"
        ]}
      />
    </MarketingLayout>
  );
}