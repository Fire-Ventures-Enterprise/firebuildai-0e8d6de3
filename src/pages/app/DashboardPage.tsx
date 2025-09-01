// Dashboard Page - Main dashboard view for the app
import { DollarSign, Briefcase, Users, Star } from "lucide-react";
import { MetricsCard } from "@/components/MetricsCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { TeamPerformanceCard } from "@/components/TeamPerformanceCard";
import { FleetStatusCard } from "@/components/FleetStatusCard";
import { ReviewsCard } from "@/components/ReviewsCard";
import { Button } from "@/components/ui/button";
import { TrialBanner } from "@/components/app/TrialBanner";
import { useNavigate } from "react-router-dom";
import { R } from "@/routes/routeMap";

// Mock data matching the reference dashboard
const metrics = [
  {
    title: "Active Jobs",
    value: "0",
    change: 0,
    icon: <Briefcase className="w-5 h-5" />,
    description: "+3 new this week"
  },
  {
    title: "Revenue (MTD)",
    value: "$0",
    change: 18,
    icon: <DollarSign className="w-5 h-5" />,
    description: "+18% vs last month"
  },
  {
    title: "Contractors Online",
    value: "0",
    change: 0,
    icon: <Users className="w-5 h-5" />,
    description: "Live GPS tracking"
  },
  {
    title: "Review Score",
    value: "4.9",
    change: 5.2,
    icon: <Star className="w-5 h-5" />,
    description: "★★★★★ 127 reviews"
  }
];

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <TrialBanner />
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your contractor management platform</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate(R.jobNew)}
            data-testid="dashboard-new-job"
          >
            + New Job
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(R.purchaseOrderNew)}
            data-testid="dashboard-new-po"
          >
            New PO
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <QuickActionsCard />
          <ReviewsCard />
        </div>
        
        {/* Middle Column */}
        <div className="space-y-6">
          <RecentActivityCard />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <TeamPerformanceCard />
          <FleetStatusCard />
        </div>
      </div>
    </div>
  );
};