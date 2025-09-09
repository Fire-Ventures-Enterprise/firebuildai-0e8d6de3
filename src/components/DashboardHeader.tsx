import { Bell, Search, User, Settings, HardHat, ExternalLink, Shield, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { R } from "@/routes/routeMap";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { Logo } from "@/components/Logo";

export const DashboardHeader = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.rpc('is_admin', { check_user_id: user.id });
      setIsAdmin(data === true);
    }
  };

  console.log('DashboardHeader rendering - this should only appear once per page load');

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card" data-header="main-dashboard-header">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4">
        {/* Logo and Brand - Mobile Optimized */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Menu - Only visible on mobile */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
          {/* Desktop Sidebar Toggle - Only visible on desktop */}
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <Logo className="h-8 w-auto" />
        </div>

        {/* Search Bar - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients, jobs, estimates..." 
              className="pl-10 bg-background w-full"
            />
          </div>
        </div>

        {/* Actions - Mobile Optimized */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {isAdmin && (
            <Link to={R.admin} className="hidden lg:block">
              <Button variant="ghost" size="sm" className="gap-2 text-destructive">
                <Shield className="w-4 h-4" />
                <span className="hidden xl:inline">Admin</span>
              </Button>
            </Link>
          )}
          
          <Link to={R.home} className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden lg:inline">View Site</span>
            </Button>
          </Link>
          
          {/* Theme Toggle */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="h-9 w-9 md:h-10 md:w-10"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center p-0 text-[10px] md:text-xs"
            >
              3
            </Badge>
          </Button>
          
          <Link to={R.settings} className="hidden sm:block">
            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
          
          {/* User Profile Dropdown - Mobile Optimized */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 md:w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate(R.admin)} className="lg:hidden">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate(R.settings)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(R.dashboard)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={signOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};