import { Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const contractors = [
  {
    id: 1,
    name: "Mike Johnson",
    initials: "MJ",
    revenue: "$13.5k this month",
    performance: "Top Performer",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Davis", 
    initials: "SD",
    revenue: "$9.2k this month",
    performance: "Active",
    status: "active",
  },
  {
    id: 3,
    name: "Robert Chen",
    initials: "RC", 
    revenue: "$7.8k this month",
    performance: "Available",
    status: "available",
  },
];

export const TeamPerformanceCard = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team Performance
          </CardTitle>
          <p className="text-sm text-muted-foreground">Contractor productivity overview</p>
        </div>
        <Button variant="outline" size="sm">
          Manage Contractors
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {contractors.map((contractor) => (
          <div key={contractor.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors group">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                {contractor.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-foreground">{contractor.name}</h4>
                {contractor.performance === "Top Performer" && (
                  <Badge variant="default" className="text-xs bg-gradient-primary">
                    <Award className="w-3 h-3 mr-1" />
                    Top Performer
                  </Badge>
                )}
                {contractor.performance === "Active" && (
                  <Badge variant="default" className="text-xs bg-success text-success-foreground">
                    Active
                  </Badge>
                )}
                {contractor.performance === "Available" && (
                  <Badge variant="secondary" className="text-xs">
                    Available
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1 text-success" />
                {contractor.revenue}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};