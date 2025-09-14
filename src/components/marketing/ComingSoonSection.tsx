import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, FileSearch, BarChart3, Workflow, ArrowRight, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ComingSoonSection() {
  const navigate = useNavigate();

  const upcomingProducts = [
    {
      name: "AI Scheduler",
      description: "Intelligent scheduling that learns from your business patterns",
      icon: BrainCircuit,
      path: "/products/ai-scheduling",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      name: "Xactimate Plus",
      description: "Seamless integration with insurance restoration workflows",
      icon: FileSearch,
      path: "/products/xactimate-plus",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      name: "Analytics Pro",
      description: "Enterprise-grade insights and predictive analytics",
      icon: BarChart3,
      path: "/products/analytics-pro",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      name: "Workflow Engine",
      description: "Automate your entire business operations",
      icon: Workflow,
      path: "/products/workflow-automation",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      name: "LiDAR Scanning",
      description: "Instant room measurements with centimeter-level accuracy",
      icon: Scan,
      path: "/lidar-estimating-software",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Next-Generation Features in Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our beta program and be the first to experience revolutionary tools 
            that will transform how you run your contracting business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {upcomingProducts.map((product) => (
            <Card 
              key={product.name}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/30"
              onClick={() => navigate(product.path)}
            >
              <CardHeader>
                <div className={`p-3 rounded-lg ${product.bgColor} w-fit mb-3`}>
                  <product.icon className={`h-6 w-6 ${product.color}`} />
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="ghost" 
                  className="group-hover:translate-x-1 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(product.path);
                  }}
                >
                  Join Beta Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-3">
                Be Part of the Future
              </h3>
              <p className="text-muted-foreground mb-6">
                Our beta testers get free access during development, direct input on features, 
                and lifetime discounts when products launch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate("/products/ai-scheduling")}
                >
                  Explore Beta Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/contact")}
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}