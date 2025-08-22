import { MapPin, Calendar, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface JobCardProps {
  id: string;
  title: string;
  client: string;
  location: string;
  progress: number;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: { name: string; initials: string }[];
  dueDate: string;
  status: "planning" | "in-progress" | "review" | "completed";
}

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const, color: "text-muted-foreground" },
  medium: { label: "Medium", variant: "outline" as const, color: "text-primary" },
  high: { label: "High", variant: "default" as const, color: "text-warning" },
  urgent: { label: "Urgent", variant: "destructive" as const, color: "text-destructive" },
};

export const JobCard = ({ 
  id, 
  title, 
  client, 
  location, 
  progress, 
  priority, 
  assignedTo, 
  dueDate, 
  status 
}: JobCardProps) => {
  const priorityInfo = priorityConfig[priority];
  
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
          <Badge variant={priorityInfo.variant}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {priorityInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          {location}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Due {dueDate}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <div className="flex -space-x-2">
              {assignedTo.slice(0, 3).map((person, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                    {person.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignedTo.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+{assignedTo.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="outline" className="text-xs capitalize">
            {status.replace("-", " ")}
          </Badge>
          <span className="text-xs text-muted-foreground">#{id}</span>
        </div>
      </CardContent>
    </Card>
  );
};