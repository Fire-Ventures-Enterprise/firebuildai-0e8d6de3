import { Calendar, DollarSign, MapPin, Clock, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EstimateCardProps {
  id: string;
  title: string;
  client: string;
  location: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "sent";
  date: string;
  category: string;
}

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, color: "text-warning" },
  approved: { label: "Approved", variant: "default" as const, color: "text-success" },
  rejected: { label: "Rejected", variant: "destructive" as const, color: "text-destructive" },
  sent: { label: "Sent", variant: "outline" as const, color: "text-primary" },
};

export const EstimateCard = ({ 
  id, 
  title, 
  client, 
  location, 
  amount, 
  status, 
  date, 
  category 
}: EstimateCardProps) => {
  const statusInfo = statusConfig[status];
  
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 group animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{client}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant} className="text-xs">
              {statusInfo.label}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          {location}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {date}
          </div>
          <div className="flex items-center text-lg font-bold text-foreground">
            <DollarSign className="w-4 h-4 mr-1 text-primary" />
            {amount.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            #{id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};