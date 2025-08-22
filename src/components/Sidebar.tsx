import { 
  Home, 
  FileText, 
  Users, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Settings,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "purchase-orders", label: "Purchase Orders", icon: FileText },
  { id: "quotes", label: "Quotes", icon: DollarSign },
  { id: "client-portal", label: "Client Portal", icon: Users },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "estimates", label: "Estimates", icon: FileText },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "gps-tracking", label: "GPS Tracking", icon: MapPin },
  { id: "contractors", label: "Contractors", icon: Users },
  { id: "expenses", label: "Expenses", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: Calendar },
  { id: "fleet", label: "Fleet", icon: MapPin },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border shadow-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 transition-all duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive && "bg-gradient-primary shadow-elegant"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Settings className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};