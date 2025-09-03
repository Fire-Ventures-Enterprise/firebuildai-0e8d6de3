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
  ArrowRight
} from "lucide-react";
import { useEffect } from "react";

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
                <Link to="/auth/signup">
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

      {/* Visual Demo Section */}
      <section className="py-16 px-4 bg-muted/30">
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
            Take Control of Your Schedule
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stop juggling spreadsheets and whiteboards. Start scheduling jobs efficiently with FireBuild.
            Try it free for 30 days - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
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
  );
};