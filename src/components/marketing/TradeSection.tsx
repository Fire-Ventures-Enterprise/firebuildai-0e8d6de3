import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Smartphone, 
  Workflow, 
  FileSpreadsheet 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";

const features = [
  {
    title: "Professional Estimates",
    description: "Create detailed, branded estimates in minutes. Convert them to jobs with one click.",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/features/professional-estimates"
  },
  {
    title: "Invoice & Get Paid",
    description: "Send professional invoices and accept payments online. Get paid 2x faster.",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    href: "/features/invoice-payments"
  },
  {
    title: "Job Scheduling",
    description: "Visual calendar to schedule jobs, assign crews, and track project timelines.",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/features/job-scheduling"
  },
  {
    title: "Crew Management",
    description: "Track time, manage subcontractors, and coordinate your entire team in one place.",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/features/crew-management"
  },
  {
    title: "Real-Time Analytics",
    description: "Track revenue, job costs, and profitability with powerful reporting tools.",
    icon: BarChart3,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/features/analytics"
  },
  {
    title: "Mobile App",
    description: "Access everything from the field. Works on any device, anywhere.",
    icon: Smartphone,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/features/mobile-app"
  },
  {
    title: "Workflow Automation",
    description: "Automate follow-ups, approvals, and repetitive tasks to save hours weekly.",
    icon: Workflow,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/features/workflow-automation"
  },
  {
    title: "Xactimate Integration",
    description: "Import and manage Xactimate estimates for restoration contractors.",
    icon: FileSpreadsheet,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/features/xactimate"
  }
];

export function TradeSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/10 to-background" id="trades">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Run Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trade Business
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From first contact to final payment, manage every aspect of your contracting business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.href}
                className="group block"
              >
                <div className="h-full bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={R.signup}>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              Start Your Free 30-Day Trial
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Setup in minutes • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}