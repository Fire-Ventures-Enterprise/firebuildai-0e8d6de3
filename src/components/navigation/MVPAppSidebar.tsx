import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ShoppingCart,
  ClipboardList,
  MessageSquare,
  Zap,
  BrainCircuit,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const coreNavItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    href: '/app/clients',
    icon: Users,
  },
  {
    title: 'Jobs',
    href: '/app/jobs',
    icon: FileText,
  },
  {
    title: 'Estimates / Invoices',
    href: '/app/estimates',
    icon: DollarSign,
  },
  {
    title: 'Work Orders',
    href: '/app/work-orders',
    icon: ClipboardList,
  },
  {
    title: 'Purchase Orders',
    href: '/app/purchase-orders',
    icon: ShoppingCart,
  },
  {
    title: 'Calendar',
    href: '/app/scheduling',
    icon: Calendar,
  },
];

const aiNavItems = [
  {
    title: 'AI Scheduler',
    href: '/products/ai-scheduling',
    icon: BrainCircuit,
    badge: 'AI',
  },
  {
    title: 'AI Sequencing',
    href: '/app/workflow-sequencing',
    icon: Zap,
    badge: 'AI',
  },
  {
    title: 'Workflow Calendar',
    href: '/app/workflow',
    icon: Calendar,
  },
  {
    title: 'Xactimate',
    href: '/app/xactimate',
    icon: FileText,
    badge: 'NEW',
  },
  {
    title: 'Communication Hub',
    href: '/app/communication',
    icon: MessageSquare,
    badge: 'NEW',
  },
];

const adminNavItems = [
  {
    title: 'Vendors',
    href: '/app/vendors',
    icon: Building2,
  },
  {
    title: 'Contractors',
    href: '/app/contractors',
    icon: Users,
  },
  {
    title: 'Banking',
    href: '/app/banking-settings',
    icon: DollarSign,
  },
  {
    title: 'Settings',
    href: '/app/settings-mvp',
    icon: Settings,
  },
];

export function MVPAppSidebar() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiSectionOpen, setAiSectionOpen] = useState(true);
  const [adminSectionOpen, setAdminSectionOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-xl font-bold">🔥 FireBuild.ai</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-4 px-3 py-4">
            {/* Core Features */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core</p>
              {coreNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </div>

            {/* AI Features */}
            <div className="space-y-1">
              <button
                onClick={() => setAiSectionOpen(!aiSectionOpen)}
                className="flex items-center justify-between w-full px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
              >
                <span>AI & Automation</span>
                {aiSectionOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              {aiSectionOpen && aiNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      item.badge === 'AI' ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Admin Features */}
            <div className="space-y-1">
              <button
                onClick={() => setAdminSectionOpen(!adminSectionOpen)}
                className="flex items-center justify-between w-full px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
              >
                <span>Admin</span>
                {adminSectionOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              {adminSectionOpen && adminNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}