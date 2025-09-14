import { useState, useEffect } from "react";
import { HardHat, Zap, Droplets, Home, Paintbrush, Trees, Hammer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { cn } from "@/lib/utils";

const trades = [
  { 
    id: "general-contractors", 
    name: "General Contractors", 
    icon: HardHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    title: "Complete Project Management for GCs",
    description: "Manage multiple subs, track progress, and deliver projects on time and budget.",
    features: [
      "Project timeline management",
      "Subcontractor coordination tools", 
      "Progress tracking & reporting",
      "Budget monitoring dashboard",
      "Document management system",
      "Change order tracking"
    ]
  },
  { 
    id: "electricians", 
    name: "Electricians", 
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    title: "Electrical Project Excellence",
    description: "Streamline electrical installations with specialized tools for permits, inspections, and safety compliance.",
    features: [
      "Permit tracking system",
      "Code compliance checklists",
      "Load calculation tools",
      "Safety inspection reports",
      "Material estimation",
      "Circuit mapping tools"
    ]
  },
  { 
    id: "plumbers", 
    name: "Plumbers", 
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    title: "Plumbing Business Management",
    description: "Manage service calls, installations, and maintenance with plumbing-specific features.",
    features: [
      "Service call scheduling",
      "Pipe sizing calculators",
      "Inventory management",
      "Warranty tracking",
      "Emergency dispatch",
      "Fixture installation logs"
    ]
  },
  { 
    id: "roofers", 
    name: "Roofers", 
    icon: Home,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    title: "Roofing Project Control",
    description: "Handle roofing projects from inspection to completion with weather tracking and material management.",
    features: [
      "Weather monitoring",
      "Aerial measurement tools",
      "Material waste tracking",
      "Warranty management",
      "Safety compliance",
      "Progress photo logs"
    ]
  },
  { 
    id: "painters", 
    name: "Painters", 
    icon: Paintbrush,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    title: "Painting Business Solutions",
    description: "Estimate paint quantities, track project phases, and manage color specifications.",
    features: [
      "Paint quantity calculator",
      "Color specification logs",
      "Surface prep checklists",
      "Spray equipment tracking",
      "Touch-up scheduling",
      "Quality control reports"
    ]
  },
  { 
    id: "landscapers", 
    name: "Landscapers", 
    icon: Trees,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    title: "Landscape Management Suite",
    description: "Design, schedule, and maintain landscaping projects with seasonal planning tools.",
    features: [
      "Seasonal scheduling",
      "Plant inventory tracking",
      "Irrigation management",
      "Equipment maintenance logs",
      "Design proposal tools",
      "Maintenance contracts"
    ]
  },
  { 
    id: "carpenters", 
    name: "Carpenters", 
    icon: Hammer,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
    title: "Carpentry Project Tools",
    description: "Manage custom builds, renovations, and installations with material optimization.",
    features: [
      "Cut list optimization",
      "Material takeoff tools",
      "Custom millwork tracking",
      "Installation scheduling",
      "Quality checkpoints",
      "Tool inventory management"
    ]
  },
  { 
    id: "hvac", 
    name: "HVAC", 
    icon: Wind,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    title: "HVAC Service Management",
    description: "Schedule maintenance, track equipment, and manage service agreements efficiently.",
    features: [
      "Preventive maintenance scheduling",
      "Equipment lifecycle tracking",
      "Load calculation tools",
      "Service agreement management",
      "Parts inventory system",
      "Efficiency reporting"
    ]
  }
];

export function TradeSection() {
  const [selectedTrade, setSelectedTrade] = useState(trades[0]);

  useEffect(() => {
    // Update meta keywords based on selected trade
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      const baseKeywords = "construction management, contractor software";
      const tradeKeywords = `${selectedTrade.name.toLowerCase()}, ${selectedTrade.id.replace('-', ' ')}`;
      metaKeywords.setAttribute('content', `${baseKeywords}, ${tradeKeywords}`);
    }
  }, [selectedTrade]);

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

        {/* Trade Icons Row */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {trades.map((trade) => {
            const Icon = trade.icon;
            const isSelected = selectedTrade.id === trade.id;
            return (
              <button
                key={trade.id}
                onClick={() => setSelectedTrade(trade)}
                className={cn(
                  "flex flex-col items-center gap-2 group transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                )}
              >
                <div className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  "bg-card hover:shadow-lg",
                  isSelected ? [
                    trade.borderColor,
                    trade.bgColor,
                    "shadow-lg"
                  ] : [
                    "border-border",
                    "hover:border-primary/50"
                  ]
                )}>
                  <Icon className={cn("h-8 w-8", trade.color)} />
                </div>
                <span className={cn(
                  "text-xs text-center transition-colors",
                  isSelected ? "text-foreground font-semibold" : "text-muted-foreground"
                )}>
                  {trade.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Trade Detail */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("p-3 rounded-lg", selectedTrade.bgColor)}>
                <selectedTrade.icon className={cn("h-8 w-8", selectedTrade.color)} />
              </div>
              <h3 className="text-3xl font-bold">{selectedTrade.title}</h3>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              {selectedTrade.description}
            </p>

            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-lg mb-4">Key Features for {selectedTrade.name}</h4>
              {selectedTrade.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                    selectedTrade.color.replace('text-', 'bg-')
                  )} />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Link to={R.signup}>
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Start Free Trial
                </Button>
              </Link>
              <Link to={`/trades/${selectedTrade.id}`}>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Dashboard Mock */}
          <div className="bg-card/50 backdrop-blur rounded-lg border border-border p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Active Jobs</div>
                  <div className={cn("text-3xl font-bold", selectedTrade.color)}>24</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">This Week's Revenue</div>
                  <div className="text-3xl font-bold text-green-500">$18,450</div>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Completed Tasks</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
                <div className="text-3xl font-bold text-blue-500">142</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-2">Efficiency Score</div>
                <div className={cn("text-3xl font-bold mb-2", selectedTrade.color)}>98%</div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn("h-2 rounded-full transition-all duration-500", 
                      selectedTrade.color.replace('text-', 'bg-')
                    )} 
                    style={{ width: '98%' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}