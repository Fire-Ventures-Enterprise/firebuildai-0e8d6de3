import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HardHat, 
  Zap, 
  Droplets, 
  Home, 
  Paintbrush, 
  Trees, 
  Hammer, 
  Wind,
  CheckCircle
} from "lucide-react";

const trades = [
  {
    id: "general-contractors",
    name: "General Contractors",
    icon: HardHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    title: "Complete Project Management for GCs",
    description: "Manage multiple subs, track progress, and deliver projects on time and budget.",
    features: [
      "Project timeline management",
      "Subcontractor coordination tools",
      "Progress tracking & reporting",
      "Budget monitoring dashboard",
      "Document management system",
      "Change order tracking"
    ],
    metaKeywords: "general contractor software, GC project management, construction management software"
  },
  {
    id: "electricians",
    name: "Electricians",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    title: "Electrical Service Management Simplified",
    description: "From service calls to panel upgrades, manage your electrical business efficiently.",
    features: [
      "Service call scheduling",
      "Panel schedule templates",
      "Material tracking & ordering",
      "Code compliance checklists",
      "Load calculation tools",
      "Permit tracking system"
    ],
    metaKeywords: "electrician software, electrical contractor app, service call management"
  },
  {
    id: "plumbers",
    name: "Plumbers",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    title: "Plumbing Business Management Suite",
    description: "Handle emergency calls, track fixtures, and manage service agreements with ease.",
    features: [
      "Emergency dispatch system",
      "Fixture inventory tracking",
      "Service agreement management",
      "Route optimization",
      "Water heater maintenance logs",
      "Leak detection reports"
    ],
    metaKeywords: "plumber software, plumbing contractor app, emergency dispatch software"
  },
  {
    id: "roofers",
    name: "Roofers",
    icon: Home,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    title: "Roofing Project Excellence",
    description: "Calculate materials, track weather, and manage warranties all in one place.",
    features: [
      "Material calculators",
      "Weather tracking integration",
      "Warranty management",
      "Drone inspection notes",
      "Insurance claim assistance",
      "Safety compliance tracking"
    ],
    metaKeywords: "roofing software, roofer app, roofing contractor management"
  },
  {
    id: "painters",
    name: "Painters",
    icon: Paintbrush,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    title: "Painting Business Automation",
    description: "Manage color selections, track surfaces, and schedule spray days efficiently.",
    features: [
      "Color management system",
      "Surface tracking tools",
      "Spray schedule optimizer",
      "Paint inventory tracking",
      "Job costing calculator",
      "Customer approval workflow"
    ],
    metaKeywords: "painting contractor software, painter app, paint business management"
  },
  {
    id: "landscapers",
    name: "Landscapers",
    icon: Trees,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    title: "Landscaping Business Growth Tools",
    description: "Plan seasonal work, optimize routes, and track equipment maintenance.",
    features: [
      "Seasonal scheduling",
      "Route optimization",
      "Equipment tracking",
      "Plant inventory management",
      "Irrigation system logs",
      "Maintenance contracts"
    ],
    metaKeywords: "landscaping software, landscaper app, lawn care business software"
  },
  {
    id: "carpenters",
    name: "Carpenters",
    icon: Hammer,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    title: "Carpentry Project Management",
    description: "Track cut lists, manage materials, and deliver custom millwork on schedule.",
    features: [
      "Cut list generator",
      "Material ordering system",
      "Custom millwork tracking",
      "Blueprint management",
      "Tool inventory tracking",
      "Shop drawings organizer"
    ],
    metaKeywords: "carpenter software, carpentry app, woodworking business management"
  },
  {
    id: "hvac",
    name: "HVAC",
    icon: Wind,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    title: "HVAC Service Excellence Platform",
    description: "Manage service contracts, track equipment, and schedule maintenance efficiently.",
    features: [
      "Service contract management",
      "Equipment database",
      "Maintenance scheduling",
      "Refrigerant tracking",
      "Energy efficiency reports",
      "Warranty tracking system"
    ],
    metaKeywords: "HVAC software, HVAC contractor app, heating cooling business software"
  }
];

export function TabbedTradeSection() {
  const [selectedTrade, setSelectedTrade] = useState("general-contractors");

  useEffect(() => {
    // Update meta description based on selected trade
    const trade = trades.find(t => t.id === selectedTrade);
    if (trade) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = trade.metaKeywords;
        document.head.appendChild(meta);
      } else {
        metaKeywords.setAttribute('content', trade.metaKeywords);
      }
    }
  }, [selectedTrade]);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20" id="trades">
      <div className="container mx-auto px-4">
        {/* SEO-optimized heading structure */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Built for Every Trade
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a GC managing multiple subs or a specialty contractor, 
            FireBuild adapts to your workflow with trade-specific features and tools.
          </p>
        </div>

        <Tabs value={selectedTrade} onValueChange={setSelectedTrade} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/50">
            {trades.map((trade) => (
              <TabsTrigger
                key={trade.id}
                value={trade.id}
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <trade.icon className={`h-5 w-5 ${trade.color}`} />
                <span className="text-xs font-medium">{trade.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {trades.map((trade) => (
            <TabsContent key={trade.id} value={trade.id} className="mt-8">
              <Card className="border-2 border-border/50 shadow-lg">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left side - Description and main features */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${trade.bgColor}`}>
                          <trade.icon className={`h-8 w-8 ${trade.color}`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{trade.title}</h3>
                          <p className="text-muted-foreground">{trade.description}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-4 text-lg">Key Features for {trade.name}</h4>
                        <div className="space-y-3">
                          {trade.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <CheckCircle className={`h-5 w-5 ${trade.color} flex-shrink-0`} />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Visual representation */}
                    <div className="flex items-center justify-center">
                      <div className={`relative w-full max-w-md p-8 rounded-2xl ${trade.bgColor}`}>
                        <div className="bg-background/95 backdrop-blur rounded-xl p-6 shadow-xl">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active Jobs</span>
                              <span className={`text-2xl font-bold ${trade.color}`}>24</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">This Week's Revenue</span>
                              <span className="text-2xl font-bold text-green-500">$18,450</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Completed Tasks</span>
                              <span className="text-2xl font-bold text-blue-500">142</span>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Efficiency Score</span>
                              <span className={`font-bold ${trade.color}`}>98%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-lg mb-4 text-muted-foreground">
                      Join thousands of {trade.name.toLowerCase()} already using FireBuild
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/auth/signup" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Start 30-Day Free Trial
                      </a>
                      <a 
                        href={`/trades/${trade.id}`}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        Learn More About {trade.name} Features
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}