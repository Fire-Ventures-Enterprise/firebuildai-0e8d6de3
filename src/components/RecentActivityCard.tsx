import { DollarSign, Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "payment",
    title: "Payment Received",
    description: "Invoice INV-2024-0837 - $2,650",
    time: "2 min ago",
    icon: <DollarSign className="w-4 h-4" />,
    color: "text-success",
  },
  {
    id: 2,
    type: "review",
    title: "Auto Review Request Sent",
    description: "SMS sent to client with Google & Facebook review links",
    time: "5 min ago", 
    icon: <Star className="w-4 h-4" />,
    color: "text-warning",
  },
  {
    id: 3,
    type: "gps",
    title: "GPS Update",
    description: "Mike Johnson checked-in at job site",
    time: "12 min ago",
    icon: <MapPin className="w-4 h-4" />,
    color: "text-primary",
  },
];

export const RecentActivityCard = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <p className="text-sm text-muted-foreground">Latest updates and notifications</p>
        </div>
        <Button variant="outline" size="sm">
          View All Activity
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors group">
            <div className={`${activity.color} mt-0.5 group-hover:scale-110 transition-transform`}>
              {activity.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{activity.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};