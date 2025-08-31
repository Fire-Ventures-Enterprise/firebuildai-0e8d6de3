import { DollarSign, Briefcase, Users, Star, MapPin, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DraggableSidebar } from "@/components/DraggableSidebar";
import { MetricsCard } from "@/components/MetricsCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { TeamPerformanceCard } from "@/components/TeamPerformanceCard";
import { FleetStatusCard } from "@/components/FleetStatusCard";
import { ReviewsCard } from "@/components/ReviewsCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EstimateBuilder } from "@/components/estimates/EstimateBuilder";
import { InvoiceForm } from "@/components/invoicing/InvoiceForm";

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

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header Section with Primary CTAs */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your business at a glance</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="default" 
                  size="default"
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={() => setActiveTab("jobs")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  New Job
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  className="border-primary/50 hover:bg-primary/10"
                  onClick={() => setActiveTab("purchase-orders")}
                >
                  <Building className="w-4 h-4 mr-2" />
                  New PO
                </Button>
              </div>
            </div>

            {/* KPI Metrics with Visual Distinction */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className={`
                  ${index === 0 ? "border-blue-200 bg-blue-50/50" : ""}
                  ${index === 1 ? "border-green-200 bg-green-50/50" : ""}
                  ${index === 2 ? "border-purple-200 bg-purple-50/50" : ""}
                  ${index === 3 ? "border-yellow-200 bg-yellow-50/50" : ""}
                  transition-all duration-200 hover:shadow-lg
                `}>
                  <MetricsCard {...metric} />
                </div>
              ))}
            </div>

            {/* Quick Actions - Moved Up for Better Visibility */}
            <div className="bg-accent/30 p-4 rounded-lg border border-accent">
              <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <QuickActionsCard />
            </div>

            {/* Main Content Grid with Better Organization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Operations */}
              <div className="space-y-6">
                <div className="bg-card p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-blue-600 mb-3">OPERATIONS</h3>
                  <RecentActivityCard />
                </div>
              </div>
              
              {/* Middle Column - Team & Fleet */}
              <div className="space-y-6">
                <div className="bg-card p-4 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-sm font-medium text-purple-600 mb-3">TEAM & FLEET</h3>
                  <TeamPerformanceCard />
                  <div className="mt-4">
                    <FleetStatusCard />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Client Feedback (Lower Priority) */}
              <div className="space-y-6">
                <div className="bg-card p-4 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-sm font-medium text-orange-600 mb-3">CLIENT FEEDBACK</h3>
                  <ReviewsCard />
                </div>
              </div>
            </div>
          </div>
        );
      
      case "estimates":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Estimates</h2>
            <EstimateBuilder 
              open={true} 
              onOpenChange={() => setActiveTab("dashboard")}
              mode="create"
              onSave={(data) => {
                console.log("Estimate created:", data);
                setActiveTab("dashboard");
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
              </h3>
              <p className="text-muted-foreground">
                This section is under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <DashboardHeader />
      <div className="flex">
        <DraggableSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};