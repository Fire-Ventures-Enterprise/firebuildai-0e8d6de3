import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, FileText, Users, Briefcase, DollarSign, BarChart3, Settings,
  Truck, Receipt, ShoppingCart, TrendingUp, Building2, UserCheck,
  FileBarChart, HelpCircle, ChevronDown, ClipboardList, CalendarRange
} from "lucide-react";
import { cn } from "@/lib/utils";
import { R } from "@/routes/routeMap";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "./SidebarNavItem";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  testId?: string;
}

interface NavigationGroup {
  id: string;
  title: string;
  icon: React.ElementType;
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
      { id: "work-orders", label: "Work Orders", icon: ClipboardList, path: R.workOrders, testId: "nav-work-orders", badge: "NEW" },
      { id: "xactimate", label: "Xactimate", icon: FileText, path: "/app/xactimate", testId: "nav-xactimate", badge: "NEW" },
      { id: "scheduling", label: "Scheduling", icon: FileText, path: R.scheduling, testId: "nav-scheduling" },
      { id: "workflow", label: "Workflow Calendar", icon: CalendarRange, path: R.workflow, testId: "nav-workflow" },
      { id: "workflow-sequencing", label: "AI Sequencing", icon: CalendarRange, path: "/app/workflow-sequencing", testId: "nav-workflow-sequencing", badge: "AI" },
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
      { id: "banking", label: "Banking", icon: DollarSign, path: "/app/banking-settings", testId: "nav-banking" },
      { id: "contractor-settings", label: "Contractor Settings", icon: Building2, path: "/app/contractors/settings", testId: "nav-contractor-settings" },
      { id: "settings", label: "Settings", icon: Settings, path: R.settings, testId: "nav-settings" },
    ],
  },
];

export function DesktopSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Determine which groups should be open based on current path
  const getOpenGroups = () => {
    const currentPath = location.pathname;
    const defaultOpen = ['operations', 'finance']; // Always show Operations and Finance by default
    const activeGroups = navigationGroups
      .filter(group => group.items.some(item => currentPath.startsWith(item.path)))
      .map(group => group.id);
    return [...new Set([...defaultOpen, ...activeGroups])];
  };

  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const groups = getOpenGroups();
    // Ensure operations and finance are always in the open groups
    if (!groups.includes('operations')) groups.push('operations');
    if (!groups.includes('finance')) groups.push('finance');
    return groups;
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {navigationGroups.map((group) => {
          const isGroupActive = group.items.some(item => location.pathname.startsWith(item.path));
          const isOpen = openGroups.includes(group.id);
          
          return (
            <SidebarGroup key={group.id}>
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleGroup(group.id)}
                defaultOpen={isGroupActive}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel 
                    className={cn(
                      "cursor-pointer hover:bg-accent/50 px-3 py-2 rounded-md transition-colors",
                      isGroupActive && "bg-accent/30"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          group.color.replace('text-', 'bg-').replace('600', '100')
                        )}>
                          <group.icon className={cn("h-4 w-4", group.color)} />
                        </div>
                        {!collapsed && <span>{group.title}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarNavItem
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            testId={item.testId}
                            collapsed={collapsed}
                            badge={item.badge}
                          />
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to={R.help}
                className={({ isActive }) => cn(
                  "flex items-center gap-2",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <HelpCircle className="h-4 w-4" />
                {!collapsed && <span>Help & Support</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}