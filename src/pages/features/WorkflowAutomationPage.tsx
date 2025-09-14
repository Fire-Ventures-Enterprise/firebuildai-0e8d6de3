import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Workflow, 
  Check, 
  GitBranch, 
  Layers, 
  Zap, 
  ArrowRight,
  Settings,
  Play,
  Repeat,
  Target,
  Clock,
  Bell
} from "lucide-react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export const WorkflowAutomationPage = () => {
  useEffect(() => {
    document.title = "Construction Workflow Automation Software | FireBuild.ai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Automate repetitive construction business tasks with workflow automation. Save hours weekly with automated follow-ups, approvals, and document generation for contractors.');
    }
  }, []);

  const benefits = [
    "Automated estimate and invoice follow-ups",
    "Smart document generation and distribution",
    "Multi-step approval processes",
    "Conditional logic and branching workflows",
    "Integration with email, SMS, and WhatsApp",
    "Performance tracking for each workflow",
    "Pre-built templates for common contractor workflows",
    "Custom trigger events and actions"
  ];

  const features = [
    {
      icon: GitBranch,
      title: "Visual Workflow Builder",
      description: "Drag-and-drop interface to build complex workflows without coding. See your automation logic visually."
    },
    {
      icon: Zap,
      title: "Smart Triggers",
      description: "Set up workflows triggered by events like new leads, unpaid invoices, or job completions."
    },
    {
      icon: Repeat,
      title: "Automated Follow-ups",
      description: "Never chase payments again. Automatic reminders for estimates, invoices, and appointments."
    },
    {
      icon: Target,
      title: "Conditional Logic",
      description: "Create smart workflows that adapt based on customer responses, payment status, or job progress."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 rounded-full">
                <Workflow className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-medium">Workflow Automation</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Automate Your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                  Business Operations
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Build custom workflows that automate repetitive tasks, from estimate follow-ups to 
                invoice collections. Save hours every week with intelligent automation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
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
                  <p className="text-2xl font-bold text-foreground">5hrs</p>
                  <p className="text-sm text-muted-foreground">Saved Weekly</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-sm text-muted-foreground">Faster Follow-ups</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">100+</p>
                  <p className="text-sm text-muted-foreground">Templates</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-teal-500/5 to-teal-600/5 border-teal-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Workflows</h3>
                    <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded">Running</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Estimate Follow-up</span>
                        <Play className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Sends 3 reminders over 7 days</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs bg-teal-500/10 text-teal-600 px-2 py-1 rounded">42 Active</div>
                        <div className="text-xs text-muted-foreground">85% conversion</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Payment Collection</span>
                        <Play className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Auto-reminder for overdue invoices</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs bg-teal-500/10 text-teal-600 px-2 py-1 rounded">18 Active</div>
                        <div className="text-xs text-muted-foreground">73% collected</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Review Request</span>
                        <Play className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground">Post-job completion review request</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs bg-teal-500/10 text-teal-600 px-2 py-1 rounded">28 Active</div>
                        <div className="text-xs text-muted-foreground">4.8★ avg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="absolute -top-4 -right-4 bg-teal-500 text-white p-3 rounded-full">
                <Workflow className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Contractors Love Our Workflow Automation
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
              Powerful Automation Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate your business processes and save hours every week.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-teal-500" />
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

      {/* Workflow Types */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pre-Built Workflow Templates
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-teal-500" />
              <h3 className="text-lg font-semibold mb-2">Sales Automation</h3>
              <p className="text-sm text-muted-foreground">
                Follow up on estimates, nurture leads, and close more deals
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-teal-500" />
              <h3 className="text-lg font-semibold mb-2">Customer Communication</h3>
              <p className="text-sm text-muted-foreground">
                Appointment reminders, job updates, and review requests
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-teal-500" />
              <h3 className="text-lg font-semibold mb-2">Operations</h3>
              <p className="text-sm text-muted-foreground">
                Material ordering, crew assignments, and quality checks
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Automating Your Business Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join contractors who save 5+ hours weekly with intelligent workflow automation.
            Start your 30-day free trial with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="min-w-[200px] bg-teal-600 hover:bg-teal-700">
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