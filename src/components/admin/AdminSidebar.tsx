import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Users,
  CreditCard,
  Building2,
  Activity,
  MessageSquare,
  AlertCircle,
  Settings,
  FileText,
  TrendingUp,
  Database,
  Mail,
  Shield,
  Globe,
  Zap,
  Package,
  Calendar,
} from 'lucide-react';

const menuItems = [
  {
    group: 'Overview',
    items: [
      { 
        title: 'Dashboard', 
        url: '/secure-admin-2024-fb-portal', 
        icon: BarChart3,
        description: 'Key metrics and real-time analytics'
      },
      { 
        title: 'Analytics', 
        url: '/secure-admin-2024-fb-portal/analytics',
        icon: TrendingUp,
        description: 'Usage patterns, conversion funnels, user behavior'
      },
    ],
  },
  {
    group: 'User Management',
    items: [
      { 
        title: 'Subscribers', 
        url: '/secure-admin-2024-fb-portal/subscribers', 
        icon: Users,
        description: 'Active users, trials, subscription management'
      },
      { 
        title: 'Companies', 
        url: '/secure-admin-2024-fb-portal/companies', 
        icon: Building2,
        description: 'Client organizations and team usage'
      },
      { 
        title: 'Payments', 
        url: '/secure-admin-2024-fb-portal/payments', 
        icon: CreditCard,
        description: 'Billing history, failed payments, refunds'
      },
    ],
  },
  {
    group: 'Support & Engagement',
    items: [
      { 
        title: 'Consultations', 
        url: '/secure-admin-2024-fb-portal/consultations', 
        icon: Calendar,
        description: 'Manage consultation bookings and availability'
      },
      { 
        title: 'Support Tickets', 
        url: '/secure-admin-2024-fb-portal/support', 
        icon: MessageSquare,
        description: 'Customer issues, feature requests, feedback'
      },
      { 
        title: 'Email Campaigns', 
        url: '/secure-admin-2024-fb-portal/emails', 
        icon: Mail,
        description: 'Marketing emails, system notifications'
      },
      { 
        title: 'Announcements', 
        url: '/secure-admin-2024-fb-portal/announcements', 
        icon: Globe,
        description: 'In-app messages, product updates'
      },
    ],
  },
  {
    group: 'System Health',
    items: [
      { 
        title: 'Monitoring', 
        url: '/secure-admin-2024-fb-portal/monitoring', 
        icon: Activity,
        description: 'Server health, uptime, performance metrics'
      },
      { 
        title: 'Error Logs', 
        url: '/secure-admin-2024-fb-portal/errors', 
        icon: AlertCircle,
        description: 'System errors, crash reports, debugging'
      },
      { 
        title: 'Database', 
        url: '/secure-admin-2024-fb-portal/database', 
        icon: Database,
        description: 'Storage usage, query performance, backups'
      },
      { 
        title: 'API Usage', 
        url: '/secure-admin-2024-fb-portal/api', 
        icon: Zap,
        description: 'API calls, rate limits, endpoint performance'
      },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { 
        title: 'Feature Flags', 
        url: '/secure-admin-2024-fb-portal/features', 
        icon: Package,
        description: 'Enable/disable features, A/B testing'
      },
      { 
        title: 'Pricing Plans', 
        url: '/secure-admin-2024-fb-portal/pricing', 
        icon: FileText,
        description: 'Subscription tiers, pricing configuration'
      },
      { 
        title: 'Security', 
        url: '/secure-admin-2024-fb-portal/security', 
        icon: Shield,
        description: 'Access controls, audit logs, compliance'
      },
      { 
        title: 'Settings', 
        url: '/secure-admin-2024-fb-portal/settings', 
        icon: Settings,
        description: 'Platform configuration, integrations'
      },
    ],
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/secure-admin-2024-fb-portal' && currentPath === '/secure-admin-2024-fb-portal') return true;
    if (path !== '/secure-admin-2024-fb-portal' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.group}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
                {section.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <NavLink to={item.url}>
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && (
                            <div className="flex-1">
                              <div className="text-sm font-medium">{item.title}</div>
                              {!active && (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};