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
  GripVertical,
  Truck,
  Package,
  Wrench,
  HelpCircle,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

const defaultNavigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  { id: "estimates", label: "Estimates", icon: FileText, path: "/estimates" },
  { id: "invoices", label: "Invoices", icon: Receipt, path: "/invoices" },
  { id: "scheduling", label: "Scheduling", icon: Calendar, path: "/scheduling" },
  { id: "fleet", label: "Fleet", icon: Truck, path: "/fleet" },
  { id: "teams", label: "Teams", icon: Users, path: "/teams" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
  { id: "tools", label: "Tools", icon: Wrench, path: "/tools" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { id: "help", label: "Help", icon: HelpCircle, path: "/help" },
];

interface SortableItemProps {
  item: NavigationItem;
  activeTab: string;
  onClick: () => void;
  collapsed: boolean;
}

function SortableItem({ item, activeTab, onClick, collapsed }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = item.icon;
  const isActive = activeTab === item.id;

  return (
    <div ref={setNodeRef} style={style} className={cn("group", isDragging && "opacity-50")}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-10 transition-all duration-200 relative",
          collapsed ? "px-2" : "px-3",
          isActive && "bg-gradient-primary shadow-elegant"
        )}
        onClick={onClick}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "absolute left-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity",
            collapsed && "hidden"
          )}
        >
          <GripVertical className="w-3 h-3" />
        </div>
        <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3 ml-4")} />
        {!collapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
      </Button>
    </div>
  );
}

export const DraggableSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [navigationItems, setNavigationItems] = useState(defaultNavigationItems);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setNavigationItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleNavigation = (item: NavigationItem) => {
    onTabChange(item.id);
    navigate(item.path);
  };

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={navigationItems} strategy={verticalListSortingStrategy}>
              {navigationItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  activeTab={activeTab}
                  onClick={() => handleNavigation(item)}
                  collapsed={collapsed}
                />
              ))}
            </SortableContext>
          </DndContext>
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