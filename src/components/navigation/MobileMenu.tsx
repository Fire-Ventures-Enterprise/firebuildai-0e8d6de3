import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Menu, X, Home, FileText, Users, Briefcase, DollarSign, Settings, Building2, TrendingUp, ClipboardList, Zap, CalendarRange, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { R } from "@/routes/routeMap";
import { Logo } from "@/components/Logo";

interface MobileMenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const menuItems: MobileMenuItem[] = [
  { label: "Dashboard", path: R.dashboard, icon: Home },
  { label: "Jobs", path: R.jobs, icon: Briefcase },
  { label: "Work Orders", path: R.workOrders, icon: ClipboardList },
  { label: "Scheduling", path: R.scheduling, icon: CalendarRange },
  { label: "AI Scheduler", path: "/products/ai-scheduling", icon: BrainCircuit },
  { label: "AI Sequencing", path: "/app/workflow-sequencing", icon: Zap },
  { label: "Estimates", path: R.estimates, icon: FileText },
  { label: "Invoices", path: R.invoices, icon: FileText },
  { label: "Purchase Orders", path: R.purchaseOrders, icon: FileText },
  { label: "Expenses", path: R.expenses, icon: DollarSign },
  { label: "Vendors", path: R.vendors, icon: Building2 },
  { label: "Clients", path: R.clients, icon: Users },
  { label: "Analytics", path: R.analyticsHub, icon: TrendingUp },
  { label: "Settings", path: R.settings, icon: Settings },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      // Focus trap - keep focus within the menu
      const sheet = document.querySelector('[role="dialog"]') as HTMLElement;
      if (sheet) {
        const focusableElements = sheet.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>
            <Logo className="h-8 w-auto" />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground font-medium"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
