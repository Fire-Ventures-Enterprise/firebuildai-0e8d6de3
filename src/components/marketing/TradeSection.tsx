import { HardHat, Zap, Droplets, Home, Paintbrush, Trees, Hammer, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const trades = [
  { 
    id: "general-contractors", 
    name: "General Contractors", 
    icon: HardHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Manage multiple subs, track progress, and deliver projects on time and budget."
  },
  { 
    id: "electricians", 
    name: "Electricians", 
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    description: "Streamline electrical installations with permit tracking and safety compliance tools."
  },
  { 
    id: "plumbers", 
    name: "Plumbers", 
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Manage service calls, installations, and maintenance with plumbing-specific features."
  },
  { 
    id: "roofers", 
    name: "Roofers", 
    icon: Home,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "Handle roofing projects with weather tracking and material management."
  },
  { 
    id: "painters", 
    name: "Painters", 
    icon: Paintbrush,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Estimate paint quantities, track phases, and manage color specifications."
  },
  { 
    id: "landscapers", 
    name: "Landscapers", 
    icon: Trees,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Design, schedule, and maintain landscaping projects with seasonal planning."
  },
  { 
    id: "carpenters", 
    name: "Carpenters", 
    icon: Hammer,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
    description: "Manage custom builds and renovations with material optimization tools."
  },
  { 
    id: "hvac", 
    name: "HVAC", 
    icon: Wind,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    description: "Schedule maintenance, track equipment, and manage service agreements."
  }
];

export function TradeSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
              Built for Every Trade
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a GC managing multiple subs or a specialty contractor, FireBuild 
            adapts to your workflow with trade-specific features and tools.
          </p>
        </div>

        {/* Trade Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {trades.map((trade) => {
            const Icon = trade.icon;
            return (
              <Link
                key={trade.id}
                to={`/trades/${trade.id}`}
                className="block group"
              >
                <div className={cn(
                  "relative h-full p-6 rounded-lg border bg-card/50 backdrop-blur",
                  "transition-all duration-300",
                  "hover:shadow-xl hover:scale-[1.02] hover:bg-card",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center mb-4",
                    trade.bgColor
                  )}>
                    <Icon className={cn("h-6 w-6", trade.color)} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {trade.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {trade.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-all duration-300",
                    "scale-x-0 group-hover:scale-x-100",
                    trade.color.replace('text-', 'bg-')
                  )} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Start managing your trade business more efficiently today
          </p>
          <Link to="/signup">
            <button className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Start Free 14-Day Trial
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}