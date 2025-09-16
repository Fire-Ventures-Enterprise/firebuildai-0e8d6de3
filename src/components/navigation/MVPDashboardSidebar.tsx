import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderOpen,
  Calculator,
  FileText,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
  Building2,
  ClipboardList,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderOpen,
  },
  {
    title: 'Estimates',
    href: '/dashboard/estimates',
    icon: Calculator,
  },
  {
    title: 'Proposals',
    href: '/dashboard/proposals',
    icon: FileText,
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
    icon: CreditCard,
  },
  {
    title: 'Work Orders',
    href: '/dashboard/work-orders',
    icon: ClipboardList,
  },
  {
    title: 'Contractors',
    href: '/dashboard/contractors',
    icon: Users,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function MVPDashboardSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
      <SidebarHeader className="border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <Building2 className="h-8 w-8 text-primary shrink-0" />
          ) : (
            <div>
              <Logo width={150} height={40} />
              <p className="text-xs text-muted-foreground mt-1">Contractor Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}