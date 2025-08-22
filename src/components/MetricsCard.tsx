import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  description?: string;
}

export const MetricsCard = ({ title, value, change, icon, description }: MetricsCardProps) => {
  const isPositive = change > 0;
  
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        <div className="flex items-center text-xs">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-success mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive mr-1" />
          )}
          <span className={cn(
            "font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? "+" : ""}{change}%
          </span>
          <span className="text-muted-foreground ml-1">
            from last month
          </span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};