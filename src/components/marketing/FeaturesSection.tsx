import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Smartphone,
  Workflow,
  FileSearch
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Professional Estimates",
    description: "Create detailed, branded estimates in minutes. Convert them to jobs with one click.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/features/estimates",
  },
  {
    icon: DollarSign,
    title: "Invoice & Get Paid",
    description: "Send professional invoices and accept payments online. Get paid 2x faster.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    href: "/features/invoicing",
  },
  {
    icon: Calendar,
    title: "Job Scheduling",
    description: "Visual calendar to schedule jobs, assign crews, and track project timelines.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/features/scheduling",
  },
  {
    icon: Users,
    title: "Crew Management",
    description: "Track time, manage subcontractors, and coordinate your entire team in one place.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/features/crew",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track revenue, job costs, and profitability with powerful reporting tools.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/features/analytics",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Access everything from the field. Works on any device, anywhere.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/features/mobile",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate follow-ups, approvals, and repetitive tasks to save hours weekly.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    href: "/features/workflow",
  },
  {
    icon: FileSearch,
    title: "Xactimate Integration",
    description: "Import and manage Xactimate estimates for restoration contractors.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/features/xactimate",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Everything You Need to Run Your Trade Business
          </h2>
          <p className="text-xl text-muted-foreground">
            From first contact to final payment, manage every aspect of your contracting business.
          </p>
        </div>

        {/* Main Features Grid - All 8 Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.href}>
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-gradient-card border-border/50 cursor-pointer h-full">
                <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};