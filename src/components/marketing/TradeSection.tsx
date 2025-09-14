import { HardHat, Zap, Droplets, Home, Paintbrush, Trees, Hammer, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { R } from "@/routes/routeMap";

const trades = [
  { 
    id: "general-contractors", 
    name: "General Contractors", 
    icon: HardHat,
    color: "text-orange-500"
  },
  { 
    id: "electricians", 
    name: "Electricians", 
    icon: Zap,
    color: "text-yellow-500"
  },
  { 
    id: "plumbers", 
    name: "Plumbers", 
    icon: Droplets,
    color: "text-blue-500"
  },
  { 
    id: "roofers", 
    name: "Roofers", 
    icon: Home,
    color: "text-red-500"
  },
  { 
    id: "painters", 
    name: "Painters", 
    icon: Paintbrush,
    color: "text-purple-500"
  },
  { 
    id: "landscapers", 
    name: "Landscapers", 
    icon: Trees,
    color: "text-green-500"
  },
  { 
    id: "carpenters", 
    name: "Carpenters", 
    icon: Hammer,
    color: "text-amber-600"
  },
  { 
    id: "hvac", 
    name: "HVAC", 
    icon: Wind,
    color: "text-cyan-500"
  }
];

const features = [
  "Project timeline management",
  "Subcontractor coordination tools",
  "Progress tracking & reporting",
  "Budget monitoring dashboard",
  "Document management system",
  "Change order tracking"
];

export function TradeSection() {
  return (
    <section className="py-24 bg-background">
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
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-20">
          {trades.map((trade) => {
            const Icon = trade.icon;
            return (
              <div key={trade.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
                  <Icon className={`h-8 w-8 ${trade.color}`} />
                </div>
                <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {trade.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* GC Detail Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <HardHat className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">Complete Project Management for GCs</h3>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              Manage multiple subs, track progress, and deliver projects on time and budget.
            </p>

            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-lg mb-4">Key Features for General Contractors</h4>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                  </div>
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
              <Link to="/trades/general-contractors">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Dashboard Mock */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Active Jobs</div>
                  <div className="text-3xl font-bold text-orange-500">24</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">This Week's Revenue</div>
                  <div className="text-3xl font-bold text-green-500">$18,450</div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Completed Tasks</div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-blue-500">142</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Efficiency Score</div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-orange-500">98%</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}