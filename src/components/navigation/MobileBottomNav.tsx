import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, DollarSign, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/app/dashboard', icon: Home, label: 'Home' },
    { path: '/app/jobs', icon: FileText, label: 'Jobs' },
    { path: '/app/estimates', icon: DollarSign, label: 'Invoices' },
    { path: '/app/scheduling', icon: Calendar, label: 'Calendar' },
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
        
        {/* Floating Action Button with Quick Actions */}
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mb-2">
              <DropdownMenuItem onClick={() => navigate('/app/estimates/new')}>
                New Estimate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/invoices/new')}>
                New Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/jobs/new')}>
                New Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/clients')}>
                New Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}