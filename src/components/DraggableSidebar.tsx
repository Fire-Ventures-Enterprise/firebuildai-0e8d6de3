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
  ChevronRight,
  ChevronDown,
  GripVertical,
  Truck,
  Package,
  Wrench,
  HelpCircle,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Building2,
  UserCheck,
  FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { R } from "@/routes/routeMap";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: string;
  testId?: string;
}

interface NavigationGroup {
  id: string;
  title: string;
  icon: any;
  color: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Home,
    color: "text-blue-600",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: R.dashboard, testId: "nav-dashboard" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    icon: DollarSign,
    color: "text-green-600",
    items: [
      { id: "estimates", label: "Estimates", icon: FileText, path: R.estimates, testId: "nav-estimates" },
      { id: "invoices", label: "Invoices", icon: Receipt, path: R.invoices, testId: "nav-invoices" },
      { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart, path: R.purchaseOrders, testId: "nav-purchase-orders" },
      { id: "expenses", label: "Expenses", icon: DollarSign, path: R.expenses, testId: "nav-expenses" },
      { id: "vendors", label: "Vendors", icon: Building2, path: R.vendors, testId: "nav-vendors" },
      { id: "financial-analytics", label: "Financial Analytics", icon: TrendingUp, path: R.financialAnalytics, testId: "nav-financial-analytics" },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    icon: Briefcase,
    color: "text-purple-600",
    items: [
      { id: "jobs", label: "Jobs", icon: Briefcase, path: R.jobs, testId: "nav-jobs" },
      { id: "scheduling", label: "Scheduling", icon: Calendar, path: R.scheduling, testId: "nav-scheduling" },
      { id: "fleet", label: "Fleet", icon: Truck, path: R.fleet, testId: "nav-fleet" },
      { id: "teams", label: "Teams", icon: UserCheck, path: R.teams, testId: "nav-teams" },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    icon: Users,
    color: "text-orange-600",
    items: [
      { id: "client-portal", label: "Client Portal", icon: Users, path: R.clients, testId: "nav-clients" },
      { id: "client-reports", label: "Client Reports", icon: FileBarChart, path: R.clientReports, testId: "nav-client-reports" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics Hub",
    icon: BarChart3,
    color: "text-indigo-600",
    items: [
      { id: "analytics", label: "Overview", icon: BarChart3, path: R.analyticsHub, testId: "nav-analytics" },
      { id: "job-performance", label: "Job Performance", icon: FileBarChart, path: R.jobPerformance, testId: "nav-job-performance" },
      { id: "team-performance", label: "Team Performance", icon: UserCheck, path: R.teamPerformance, testId: "nav-team-performance" },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    icon: Settings,
    color: "text-gray-600",
    items: [
      { id: "company", label: "Company", icon: Building2, path: R.company, testId: "nav-company" },
      { id: "settings", label: "Settings", icon: Settings, path: R.settings, testId: "nav-settings" },
    ],
  },
];

export const DraggableSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-open groups that contain the current path
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const currentPath = location.pathname;
    return navigationGroups
      .filter(group => group.items.some(item => item.path === currentPath))
      .map(group => group.id);
  });

  const handleNavigation = (item: NavigationItem) => {
    onTabChange(item.id);
    navigate(item.path);
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className={cn(
      "bg-card border-r border-border shadow-card transition-all duration-300 flex flex-col h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
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
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {navigationGroups.map((group) => {
            const GroupIcon = group.icon;
            const isGroupActive = group.items.some(item => location.pathname === item.path);
            
            if (collapsed) {
              // In collapsed mode, show only icons
              return (
                <div key={group.id} className="space-y-1 py-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        size="icon"
                        data-testid={item.testId}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                          "w-full h-10",
                          isActive && "bg-gradient-primary shadow-elegant"
                        )}
                        title={item.label}
                      >
                        <Icon className="w-5 h-5" />
                      </Button>
                    );
                  })}
                </div>
              );
            }
            
            return (
              <Collapsible
                key={group.id}
                open={openGroups.includes(group.id)}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between hover:bg-accent/50 group px-3 h-10",
                      isGroupActive && "bg-accent/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        group.color.replace('text-', 'bg-').replace('600', '100')
                      )}>
                        <GroupIcon className={cn("h-4 w-4", group.color)} />
                      </div>
                      <span className="text-sm font-medium">{group.title}</span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      openGroups.includes(group.id) ? "rotate-180" : ""
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 mt-1 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        data-testid={item.testId}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                          "w-full justify-start gap-2 h-9 transition-all",
                          isActive 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Help Section */}
      <div className="p-4 border-t border-border">
        {!collapsed ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-9"
              onClick={() => navigate(R.help)}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help & Support</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(R.help)}
            title="Help & Support"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};