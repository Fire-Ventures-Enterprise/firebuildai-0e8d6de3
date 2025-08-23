import { Award, Shield, TrendingUp, Users } from "lucide-react";

const badges = [
  {
    icon: Users,
    metric: "5,000+",
    label: "Active Contractors",
  },
  {
    icon: TrendingUp,
    metric: "$2.5B",
    label: "Projects Managed",
  },
  {
    icon: Award,
    metric: "4.9/5",
    label: "Customer Rating",
  },
  {
    icon: Shield,
    metric: "99.9%",
    label: "Uptime Guaranteed",
  },
];

export const TrustBadges = () => {
  return (
    <section className="py-16 border-y border-border bg-gradient-to-r from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-2 group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{badge.metric}</p>
                <p className="text-sm text-muted-foreground">{badge.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};