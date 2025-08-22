import { DollarSign, FileText, Users, Briefcase, TrendingUp, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Sidebar } from "@/components/Sidebar";
import { MetricsCard } from "@/components/MetricsCard";
import { EstimateCard } from "@/components/EstimateCard";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import heroImage from "@/assets/hero-construction.jpg";

// Mock data
const metrics = [
  {
    title: "Monthly Revenue",
    value: "$87,420",
    change: 12.5,
    icon: <DollarSign className="w-5 h-5" />,
    description: "Pending: $23,100"
  },
  {
    title: "Active Estimates",
    value: "24",
    change: 8.2,
    icon: <FileText className="w-5 h-5" />,
    description: "6 awaiting approval"
  },
  {
    title: "Total Clients",
    value: "156",
    change: 15.3,
    icon: <Users className="w-5 h-5" />,
    description: "12 new this month"
  },
  {
    title: "Active Jobs",
    value: "18",
    change: -2.1,
    icon: <Briefcase className="w-5 h-5" />,
    description: "3 finishing this week"
  }
];

const recentEstimates = [
  {
    id: "EST-001",
    title: "Kitchen Renovation",
    client: "Sarah Johnson",
    location: "Downtown District",
    amount: 25400,
    status: "pending" as const,
    date: "Mar 15, 2024",
    category: "Residential"
  },
  {
    id: "EST-002", 
    title: "Office Build-out",
    client: "TechCorp Inc.",
    location: "Business Park",
    amount: 89750,
    status: "approved" as const,
    date: "Mar 18, 2024",
    category: "Commercial"
  },
  {
    id: "EST-003",
    title: "Bathroom Remodel",
    client: "Mike Chen",
    location: "Suburbs",
    amount: 15200,
    status: "sent" as const,
    date: "Mar 20, 2024",
    category: "Residential"
  }
];

const activeJobs = [
  {
    id: "JOB-001",
    title: "Downtown Office Complex",
    client: "Metro Development",
    location: "123 Main Street",
    progress: 75,
    priority: "high" as const,
    assignedTo: [
      { name: "John Doe", initials: "JD" },
      { name: "Jane Smith", initials: "JS" },
      { name: "Bob Wilson", initials: "BW" }
    ],
    dueDate: "Apr 15, 2024",
    status: "in-progress" as const
  },
  {
    id: "JOB-002",
    title: "Residential Addition",
    client: "The Andersons",
    location: "456 Oak Avenue",
    progress: 30,
    priority: "medium" as const,
    assignedTo: [
      { name: "Alice Johnson", initials: "AJ" },
      { name: "Tom Brown", initials: "TB" }
    ],
    dueDate: "May 8, 2024",
    status: "planning" as const
  }
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card className="bg-gradient-hero shadow-elegant overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20" />
                <img 
                  src={heroImage} 
                  alt="Construction Management" 
                  className="w-full h-48 object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="p-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Welcome to FireBuild.ai
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      Comprehensive contractor management for modern construction
                    </p>
                    <Button variant="hero" size="lg">
                      Create New Estimate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Estimates */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Recent Estimates
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEstimates.map((estimate) => (
                    <EstimateCard key={estimate.id} {...estimate} />
                  ))}
                </CardContent>
              </Card>

              {/* Active Jobs */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Active Jobs
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    Manage All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="w-5 h-5 mb-2" />
                    New Estimate
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Users className="w-5 h-5 mb-2" />
                    Add Client
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Briefcase className="w-5 h-5 mb-2" />
                    Create Job
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Calendar className="w-5 h-5 mb-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};