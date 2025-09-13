import { 
  Home, 
  FileText, 
  Users, 
  Briefcase, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface MVPSidebarProps {
  className?: string;
}

const coreFeatures = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/app" },
  { id: "estimates", label: "Estimates", icon: FileText, path: "/app/estimates" },
  { id: "invoices", label: "Invoices", icon: FileText, path: "/app/invoices" },
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "/app/jobs" },
  { id: "clients", label: "Clients", icon: Users, path: "/app/clients" },
];

const advancedFeatures = [
  { id: "purchase-orders", label: "Purchase Orders", icon: FileText, path: "/app/purchase-orders" },
  { id: "work-orders", label: "Work Orders", icon: FileText, path: "/app/work-orders" },
  { id: "expenses", label: "Expenses", icon: FileText, path: "/app/expenses" },
  { id: "contractors", label: "Contractors", icon: Users, path: "/app/contractors" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/app/financial-analytics" },
  { id: "fleet", label: "Fleet", icon: Zap, path: "/app/fleet" },
  { id: "xactimate", label: "Xactimate", icon: Zap, path: "/app/xactimate" },
  { id: "workflow", label: "Workflow", icon: Zap, path: "/app/workflow" },
  { id: "banking", label: "Banking", icon: Zap, path: "/app/banking" },
  { id: "communication", label: "Communication", icon: Zap, path: "/app/communication" },
];

export const MVPSidebar = ({ className }: MVPSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={cn(
      "bg-card border-r border-border shadow-card transition-all duration-300 h-screen flex flex-col",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-foreground">FireBuild.ai</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Core Features */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {!collapsed && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Core Features
          </div>
        )}
        {coreFeatures.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-10 transition-all duration-200",
                collapsed ? "px-2" : "px-3",
                isActive && "bg-gradient-primary shadow-elegant"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}

        {/* Advanced Features Toggle */}
        {!collapsed && (
          <>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="w-full justify-between h-10 px-3"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Advanced Features
              </span>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                showAdvanced && "rotate-90"
              )} />
            </Button>
          </>
        )}

        {/* Advanced Features */}
        {showAdvanced && !collapsed && (
          <div className="space-y-1 mt-2">
            {advancedFeatures.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-9 text-sm px-3",
                    isActive && "bg-muted"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={() => navigate("/app/settings")}
        >
          <Settings className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Button>
      </div>
    </div>
  );
};