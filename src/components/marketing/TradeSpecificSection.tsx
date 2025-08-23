import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Zap, 
  Droplets, 
  Home, 
  Paintbrush, 
  Trees,
  HardHat,
  Hammer
} from "lucide-react";

const trades = [
  {
    icon: HardHat,
    name: "General Contractors",
    features: ["Project management", "Subcontractor coordination", "Progress tracking"],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Zap,
    name: "Electricians",
    features: ["Service calls", "Panel schedules", "Material tracking"],
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Droplets,
    name: "Plumbers",
    features: ["Emergency dispatch", "Fixture inventory", "Service agreements"],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Home,
    name: "Roofers",
    features: ["Material calculators", "Weather tracking", "Warranty management"],
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Paintbrush,
    name: "Painters",
    features: ["Color management", "Surface tracking", "Spray schedules"],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Trees,
    name: "Landscapers",
    features: ["Seasonal scheduling", "Route optimization", "Equipment tracking"],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Hammer,
    name: "Carpenters",
    features: ["Cut lists", "Material ordering", "Custom millwork"],
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
  },
  {
    icon: Wrench,
    name: "HVAC",
    features: ["Service contracts", "Equipment database", "Maintenance schedules"],
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export const TradeSpecificSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="mb-4">
            Industry Specific
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Built for Every Trade
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're a GC managing multiple subs or a specialty contractor, 
            FireBuild adapts to your workflow.
          </p>
        </div>

        {/* Trades Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trades.map((trade, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-gradient-card"
            >
              <div className={`inline-flex p-3 rounded-lg ${trade.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                <trade.icon className={`h-6 w-6 ${trade.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {trade.name}
              </h3>
              <ul className="space-y-2">
                {trade.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Don't see your trade? No problem! FireBuild is fully customizable for any construction business.
          </p>
        </div>
      </div>
    </section>
  );
};