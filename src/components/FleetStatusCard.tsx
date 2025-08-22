import { Truck, Wrench, CheckCircle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const FleetStatusCard = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Fleet Status
          </CardTitle>
          <p className="text-sm text-muted-foreground">Vehicle tracking and maintenance</p>
        </div>
        <Button variant="outline" size="sm">
          Manage Fleet
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">12</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-xs text-muted-foreground">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fleet Utilization</span>
            <span className="font-medium text-foreground">80%</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-3 h-3 text-success" />
            <span className="text-muted-foreground">12 Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Wrench className="w-3 h-3 text-warning" />
            <span className="text-muted-foreground">2 Maintenance</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <BarChart3 className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">1 Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};