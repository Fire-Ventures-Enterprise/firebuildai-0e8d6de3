import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Check, 
  Users, 
  MapPin,
  Clock,
  Repeat,
  Bell,
  BarChart,
  ArrowRight,
  Brain,
  Cloud,
  BarChart3,
  Star
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const JobSchedulingPage = () => {
  useEffect(() => {
    document.title = "Construction Job Scheduling Software | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Visual job scheduling software for contractors. Schedule crews, track project timelines, manage resources, and never double-book again with drag-and-drop calendar scheduling.');
    }
  }, []);

  const benefits = [
    "Visual calendar view of all jobs and crews",
    "Drag-and-drop scheduling interface",
    "Automatic conflict detection prevents double-booking",
    "Real-time crew availability tracking",
    "Weather integration for smart scheduling",
    "Customer notifications for schedule changes",
    "Recurring job templates save time",
    "Mobile app for field schedule access"
  ];

  const features = [
    {
      icon: Users,
      title: "Crew Management",
      description: "Assign the right crew to each job based on skills, availability, and location. Track crew utilization rates."
    },
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "Optimize daily routes to minimize travel time and fuel costs. Group nearby jobs automatically."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automatic notifications to crews and customers about schedule changes, delays, or confirmations."
    },
    {
      icon: Repeat,
      title: "Recurring Jobs",
      description: "Set up templates for recurring maintenance jobs. Schedule automatically with one click."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Job Scheduling</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Smart{" "}
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Job Scheduling
                </span>{" "}
                for Busy Contractors
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Visual scheduling software that helps contractors manage jobs, crews, and timelines efficiently. 
                Never double-book or miss a job with intelligent calendar management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
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
                  <p className="text-2xl font-bold text-foreground">50%</p>
                  <p className="text-sm text-muted-foreground">Less Scheduling Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Zero</p>
                  <p className="text-sm text-muted-foreground">Double Bookings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">30%</p>
                  <p className="text-sm text-muted-foreground">More Jobs Completed</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Today's Schedule
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">Kitchen Renovation</p>
                          <p className="text-xs text-muted-foreground">8:00 AM - 12:00 PM</p>
                          <p className="text-xs text-muted-foreground mt-1">Team A • 123 Main St</p>
                        </div>
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">On Track</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">Bathroom Install</p>
                          <p className="text-xs text-muted-foreground">1:00 PM - 5:00 PM</p>
                          <p className="text-xs text-muted-foreground mt-1">Team B • 456 Oak Ave</p>
                        </div>
                        <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">In Progress</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">Deck Construction</p>
                          <p className="text-xs text-muted-foreground">2:00 PM - 6:00 PM</p>
                          <p className="text-xs text-muted-foreground mt-1">Team C • 789 Pine Rd</p>
                        </div>
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">Scheduled</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Jobs Today</span>
                      <span className="font-semibold">6 Jobs</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Crews Working</span>
                      <span className="font-semibold">3 Teams</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Scheduling Features Built for Contractors
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
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
              Intelligent Scheduling Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced features that help you schedule smarter, reduce conflicts, and maximize crew productivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-purple-500" />
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

      {/* AI-Powered Scheduling Assistant Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              AI-Powered Scheduling Assistant
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Let artificial intelligence optimize your schedule, coordinate your team, and keep clients happy with smart automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg w-fit">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Auto-Schedule Week</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes jobs, team availability, and travel time to create perfect weekly schedules
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg w-fit">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Weather-Smart Rescheduling</h3>
              <p className="text-sm text-muted-foreground">
                Automatically reschedule outdoor work when bad weather is forecast
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg w-fit">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Route Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Minimize travel time between jobs with intelligent routing
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg w-fit">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Predictive Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Predict job durations based on historical data and buffer for delays
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Automated Client Communication Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Automated Client Communication
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep clients informed every step of the way with intelligent notifications
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full">
                  <Calendar className="h-10 w-10 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Confirmations</h3>
              <p className="text-sm text-muted-foreground">
                Automatic appointment confirmations with job details and arrival windows
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full">
                  <MapPin className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">En Route Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Clients get notified when you're on your way with real-time ETA
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full">
                  <Bell className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Updates</h3>
              <p className="text-sm text-muted-foreground">
                Automated progress photos and milestone updates
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Team Coordination Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Advanced Team Coordination
                </h2>
                <p className="text-lg text-muted-foreground">
                  Efficiently manage multiple crews across different job sites with smart coordination tools
                </p>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Multi-Crew Scheduling</p>
                    <p className="text-sm text-muted-foreground">Coordinate multiple teams across different job sites</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Skill-Based Assignment</p>
                    <p className="text-sm text-muted-foreground">Match jobs to crew members based on expertise</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Real-Time Availability</p>
                    <p className="text-sm text-muted-foreground">Track who's available, on vacation, or assigned</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-8 rounded-lg">
              <h3 className="text-lg font-semibold mb-6">Team Dashboard</h3>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">JM</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">John Martinez</p>
                      <p className="text-sm text-muted-foreground">Plumbing Specialist</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full">
                      Available
                    </span>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">SW</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Sarah Wilson</p>
                      <p className="text-sm text-muted-foreground">Electrical Lead</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-sm rounded-full">
                      On Site
                    </span>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">MR</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Mike Rodriguez</p>
                      <p className="text-sm text-muted-foreground">General Contractor</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-500/10 text-gray-600 text-sm rounded-full">
                      Off Today
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Analytics & Insights Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <BarChart3 className="h-16 w-16 text-white/80" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Smart Analytics & Insights
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Make data-driven decisions with powerful analytics that help you optimize operations and maximize profits
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-4xl font-bold mb-2">94%</p>
              <p className="text-sm text-white/80">Schedule Efficiency</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-4xl font-bold mb-2">$127</p>
              <p className="text-sm text-white/80">Avg Profit/Hour</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-4xl font-bold">4.8</span>
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-white/80">Client Satisfaction</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-4xl font-bold mb-2">23%</p>
              <p className="text-sm text-white/80">Time Saved</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Visual Calendar Interface
          </h2>
          
          <Card className="p-8">
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-sm font-medium text-muted-foreground pb-2">
                  {day}
                </div>
              ))}
              {Array.from({length: 35}, (_, i) => {
                const hasJob = [3, 5, 8, 12, 15, 18, 22, 25, 28, 31].includes(i);
                return (
                  <div key={i} className={`p-2 border rounded ${hasJob ? 'bg-purple-50 border-purple-200' : ''}`}>
                    <span className="text-sm">{(i % 31) + 1}</span>
                    {hasJob && (
                      <div className="mt-1">
                        <div className="h-1 bg-purple-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Scheduling with AI-Powered Intelligence
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stop juggling spreadsheets and whiteboards. Let AI optimize your schedule, coordinate your teams, 
            and keep clients informed automatically. Experience the future of construction scheduling with 
            FireBuild - try it free for 30 days, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-purple-600 hover:bg-purple-700">
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