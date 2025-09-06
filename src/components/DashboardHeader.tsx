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

  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/a384a2f8-9029-4efd-b9db-d6facfe2369c.png" 
            alt="FireBuildAI"
            className="w-14 h-14 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">FireBuildAI</h1>
            <p className="text-xs text-muted-foreground">Build Better Business</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients, jobs, estimates..." 
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to={R.admin}>
              <Button variant="ghost" size="sm" className="gap-2 text-destructive">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}
          
          <Link to={R.home}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Button>
          </Link>
          
          {/* Theme Toggle */}
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>
          
          <Link to={R.settings}>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full overflow-hidden">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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