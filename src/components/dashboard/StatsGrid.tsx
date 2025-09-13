import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error';
}

interface StatsGridProps {
  stats: StatCard[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'error':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
      className
    )}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
              {stat.trend && (
                <p className={cn(
                  "text-xs mt-2",
                  stat.trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                </p>
              )}
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              getColorClasses(stat.color)
            )}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}