import { NavLink, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Users, CheckSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/mvp/dashboard', icon: Home, label: 'Home' },
    { path: '/mvp/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/mvp/contractors', icon: Users, label: 'Contractors' },
    { path: '/mvp/work-items', icon: CheckSquare, label: 'Tasks' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              "transition-colors duration-200",
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Floating Action Button */}
        <div className="flex items-center justify-center">
          <Button
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => {
              // This will be connected to quick actions modal
              console.log('Quick action button clicked');
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}