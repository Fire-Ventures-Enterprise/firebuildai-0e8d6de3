import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  testId?: string;
  collapsed?: boolean;
  badge?: string;
}

export function SidebarNavItem({ to, icon: Icon, label, testId, collapsed, badge }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      data-testid={testId}
      className={({ isActive }) => cn(
        "w-full",
        isActive && "font-medium"
      )}
    >
      {({ isActive }) => (
        <SidebarMenuButton 
          asChild
          className={cn(
            "w-full transition-all h-11 px-3",
            isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <span className="flex items-center justify-between w-full">
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{label}</span>}
            </span>
            {badge && !collapsed && (
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                {badge}
              </span>
            )}
          </span>
        </SidebarMenuButton>
      )}
    </NavLink>
  );
}