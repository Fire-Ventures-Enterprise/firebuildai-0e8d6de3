import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Check, 
  TrendingUp, 
  PieChart, 
  Activity, 
  DollarSign, 
  Users, 
  FileText, 
  ArrowRight,
  Calendar,
  Target,
  Zap,
  LineChart
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const AnalyticsPage = () => {
  useEffect(() => {
    document.title = "Construction Analytics & Reporting Software | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Real-time construction analytics software. Track revenue, job costs, profitability, and KPIs with powerful reporting tools for contractors.');
    }
  }, []);

  const benefits = [
    "Real-time revenue and expense tracking",
    "Job profitability analysis by project and client",
    "Crew productivity and performance metrics",
    "Material cost tracking and supplier comparison",
    "Cash flow forecasting and projections",
    "Custom KPI dashboards and reports",
    "Automated weekly business intelligence reports",
    "Benchmark against industry standards"
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Track revenue trends, identify seasonal patterns, and forecast future earnings with AI-powered predictions."
    },
    {
      icon: PieChart,
      title: "Cost Breakdown",
      description: "Analyze costs by category, job, or time period. Identify areas to reduce expenses and improve margins."
    },
    {
      icon: Users,
      title: "Team Performance",
      description: "Monitor crew productivity, track billable hours, and identify your top performers with detailed metrics."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and monitor business goals. Get alerts when you're off track and suggestions to improve performance."
    }
  ];

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Real-Time Analytics</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Data-Driven{" "}
                  <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                    Business Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  Track revenue, costs, and profitability in real-time. Make informed decisions with 
                  powerful analytics and reporting tools built for contractors.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View Pricing
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center gap-6 pt-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">28%</p>
                    <p className="text-sm text-muted-foreground">Profit Increase</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">3hrs</p>
                    <p className="text-sm text-muted-foreground">Saved Weekly</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">100%</p>
                    <p className="text-sm text-muted-foreground">Real-Time</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Card className="p-6 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 border-indigo-500/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Revenue Dashboard</h3>
                      <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Live</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                        <span className="font-semibold">$124,580</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Profit Margin</span>
                        <span className="font-semibold text-green-600">32.4%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Jobs Completed</span>
                        <span className="font-semibold">47 / 52</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-indigo-600">▲ 15%</p>
                        <p className="text-xs text-muted-foreground">vs Last Month</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">$2.8M</p>
                        <p className="text-xs text-muted-foreground">YTD Revenue</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">4.8</p>
                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="absolute -top-4 -right-4 bg-indigo-500 text-white p-3 rounded-full">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Contractors Choose Our Analytics Platform
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Powerful Analytics Tools
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your data into actionable insights that drive business growth.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Track What Matters Most
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor KPIs, conversion rates, and business health scores
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-lg font-semibold mb-2">Financial Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Cash flow, profit margins, and revenue forecasting
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-lg font-semibold mb-2">Trend Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Seasonal patterns, growth trends, and predictive insights
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Make Data-Driven Decisions Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join contractors who increased profits by 28% using our analytics platform.
              Start your 30-day free trial with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="min-w-[200px] bg-indigo-600 hover:bg-indigo-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Back to Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
};