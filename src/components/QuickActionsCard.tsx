import { ChevronRight, Plus, ShoppingCart, Users, DollarSign, MessageSquare, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { R } from "@/routes/routeMap";

const quickActions = [
  {
    id: "create-job",
    title: "Create Job",
    description: "Start a new project",
    icon: <Plus className="w-5 h-5" />,
    path: R.jobNew,
    testId: "qa-create-job",
  },
  {
    id: "new-purchase-order", 
    title: "New Purchase Order",
    description: "Create PO for contractors",
    icon: <ShoppingCart className="w-5 h-5" />,
    path: R.purchaseOrderNew,
    testId: "qa-new-po",
  },
  {
    id: "track-contractors",
    title: "Track Contractors", 
    description: "View live GPS locations",
    icon: <Users className="w-5 h-5" />,
    path: R.contractorTracking,
    testId: "qa-track-contractors",
  },
  {
    id: "manage-expenses",
    title: "Manage Expenses",
    description: "Upload and categorize",
    icon: <DollarSign className="w-5 h-5" />,
    path: R.expenses,
    testId: "qa-manage-expenses",
  },
  {
    id: "client-messages",
    title: "Client Messages",
    description: "Respond to clients",
    icon: <MessageSquare className="w-5 h-5" />,
    path: R.clientMessages,
    testId: "qa-client-messages",
  },
  {
    id: "fleet-management",
    title: "Fleet Management", 
    description: "Monitor vehicles",
    icon: <Truck className="w-5 h-5" />,
    path: R.fleet,
    testId: "qa-fleet-management",
  },
];

export const QuickActionsCard = () => {
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            data-testid={action.testId}
            className="w-full justify-between h-auto p-3 hover:bg-accent/50 transition-colors group"
            onClick={() => handleAction(action.path)}
          >
            <div className="flex items-center gap-3">
              <div className="text-primary group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};