import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Home,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Briefcase,
  ClipboardList,
  ShoppingCart,
  Building2,
  CalendarRange,
  MessageSquare,
  MapPin,
  Building,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { R } from "@/routes/routeMap";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  testId?: string;
  badge?: string;
}

interface NavigationGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  items: NavigationItem[];
}

const defaultNavigationGroups: NavigationGroup[] = [
  {
    id: "overview",
    title: "Overview",
    icon: Home,
    color: "text-blue-500",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: R.dashboard, testId: "nav-dashboard" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    icon: DollarSign,
    color: "text-green-500",
    items: [
      { id: "estimates", label: "Estimates", icon: FileText, path: R.estimates, testId: "nav-estimates" },
      { id: "invoices", label: "Invoices", icon: FileText, path: R.invoices, testId: "nav-invoices" },
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
    color: "text-purple-500",
    items: [
      { id: "jobs", label: "Jobs", icon: Briefcase, path: R.jobs, testId: "nav-jobs" },
      { id: "work-orders", label: "Work Orders", icon: ClipboardList, path: R.workOrders, testId: "nav-work-orders", badge: "NEW" },
      { id: "xactimate", label: "Xactimate", icon: FileText, path: "/app/xactimate", testId: "nav-xactimate", badge: "NEW" },
      { id: "scheduling", label: "Scheduling", icon: FileText, path: R.scheduling, testId: "nav-scheduling" },
      { id: "workflow", label: "Workflow Calendar", icon: CalendarRange, path: R.workflow, testId: "nav-workflow" },
      { id: "workflow-sequencing", label: "AI Sequencing", icon: CalendarRange, path: "/app/workflow-sequencing", testId: "nav-workflow-sequencing", badge: "AI" },
      { id: "communication-hub", label: "Communication Hub", icon: MessageSquare, path: "/app/communication", testId: "nav-communication", badge: "NEW" },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    icon: Users,
    color: "text-orange-500",
    items: [
      { id: "client-portal", label: "Client Portal", icon: Users, path: R.clients, testId: "nav-client-portal" },
      { id: "contractor-tracking", label: "Contractor Tracking", icon: MapPin, path: R.contractorTracking, testId: "nav-contractor-tracking" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics Hub",
    icon: BarChart3,
    color: "text-indigo-500",
    items: [
      { id: "analytics", label: "Business Analytics", icon: BarChart3, path: R.analyticsHub, testId: "nav-analytics" },
      { id: "team-performance", label: "Team Performance", icon: Users, path: R.teamPerformance, testId: "nav-team-performance" },
      { id: "job-performance", label: "Job Performance", icon: Briefcase, path: R.jobPerformance, testId: "nav-job-performance" },
      { id: "client-reports", label: "Client Reports", icon: FileText, path: R.clientReports, testId: "nav-client-reports" },
      { id: "fleet", label: "Fleet Management", icon: MapPin, path: R.fleet, testId: "nav-fleet" },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    icon: ShieldCheck,
    color: "text-red-500",
    items: [
      { id: "company", label: "Company Settings", icon: Building, path: R.company, testId: "nav-company" },
      { id: "banking-settings", label: "Banking", icon: DollarSign, path: "/app/banking-settings", testId: "nav-banking" },
      { id: "contractor-settings", label: "Contractor Settings", icon: Users, path: "/app/contractor-settings", testId: "nav-contractor-settings" },
    ],
  },
];

interface SortableNavItemProps {
  item: NavigationItem;
  isDragging?: boolean;
}

function SortableNavItem({ item, isDragging }: SortableNavItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex-1 pl-5">
          <SidebarNavItem
            to={item.path}
            icon={item.icon}
            label={item.label}
            testId={item.testId}
            badge={item.badge}
          />
        </div>
      </div>
    </div>
  );
}

function DragOverlayItem({ item }: { item: NavigationItem }) {
  return (
    <div className="bg-background border border-border rounded-md shadow-lg p-2 opacity-90">
      <div className="flex items-center gap-2">
        <item.icon className="h-4 w-4" />
        <span className="text-sm">{item.label}</span>
      </div>
    </div>
  );
}

export function DraggableSidebar() {
  const location = useLocation();
  const [navigationGroups, setNavigationGroups] = useState<NavigationGroup[]>(() => {
    const saved = localStorage.getItem("sidebarOrder");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultNavigationGroups;
      }
    }
    return defaultNavigationGroups;
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Determine which groups should be open based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const groupsToOpen = navigationGroups
      .filter(group => 
        group.items.some(item => currentPath.startsWith(item.path))
      )
      .map(group => group.id);
    
    if (groupsToOpen.length > 0) {
      setOpenGroups(prev => [...new Set([...prev, ...groupsToOpen])]);
    }
  }, [location.pathname, navigationGroups]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find which group this item belongs to
    const group = navigationGroups.find(g => 
      g.items.some(item => item.id === active.id)
    );
    if (group) {
      setActiveGroupId(group.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !activeGroupId) {
      setActiveId(null);
      setActiveGroupId(null);
      return;
    }

    if (active.id !== over.id) {
      setNavigationGroups(prevGroups => {
        const newGroups = [...prevGroups];
        const groupIndex = newGroups.findIndex(g => g.id === activeGroupId);
        
        if (groupIndex !== -1) {
          const group = newGroups[groupIndex];
          const oldIndex = group.items.findIndex(item => item.id === active.id);
          const newIndex = group.items.findIndex(item => item.id === over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            newGroups[groupIndex] = {
              ...group,
              items: arrayMove(group.items, oldIndex, newIndex),
            };
            
            // Save to localStorage
            localStorage.setItem("sidebarOrder", JSON.stringify(newGroups));
          }
        }
        
        return newGroups;
      });
    }
    
    setActiveId(null);
    setActiveGroupId(null);
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const resetOrder = () => {
    setNavigationGroups(defaultNavigationGroups);
    localStorage.removeItem("sidebarOrder");
  };

  const activeItem = activeId 
    ? navigationGroups
        .flatMap(g => g.items)
        .find(item => item.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Sidebar className="bg-background border-r border-border">
        <SidebarContent>
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.id}>
              <Collapsible
                open={openGroups.includes(group.id)}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <group.icon className={cn("h-4 w-4", group.color)} />
                      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openGroups.includes(group.id) && "rotate-90"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SortableContext
                        items={group.items.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            <SortableNavItem 
                              item={item} 
                              isDragging={activeId === item.id}
                            />
                          </SidebarMenuItem>
                        ))}
                      </SortableContext>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          ))}
        </SidebarContent>
        
        <SidebarFooter className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetOrder}
            className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
          >
            Reset to default order
          </Button>
          <SidebarNavItem
            to="/help"
            icon={FileText}
            label="Help & Support"
            testId="nav-help"
          />
        </SidebarFooter>
      </Sidebar>
      
      <DragOverlay>
        {activeItem && <DragOverlayItem item={activeItem} />}
      </DragOverlay>
    </DndContext>
  );
}