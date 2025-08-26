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
} from 'lucide-react';

const menuItems = [
  {
    group: 'Overview',
    items: [
      { 
        title: 'Dashboard', 
        url: '/admin', 
        icon: BarChart3,
        description: 'Key metrics and real-time analytics'
      },
      { 
        title: 'Analytics', 
        url: '/admin/analytics', 
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
        url: '/admin/subscribers', 
        icon: Users,
        description: 'Active users, trials, subscription management'
      },
      { 
        title: 'Companies', 
        url: '/admin/companies', 
        icon: Building2,
        description: 'Client organizations and team usage'
      },
      { 
        title: 'Payments', 
        url: '/admin/payments', 
        icon: CreditCard,
        description: 'Billing history, failed payments, refunds'
      },
    ],
  },
  {
    group: 'Support & Engagement',
    items: [
      { 
        title: 'Support Tickets', 
        url: '/admin/support', 
        icon: MessageSquare,
        description: 'Customer issues, feature requests, feedback'
      },
      { 
        title: 'Email Campaigns', 
        url: '/admin/emails', 
        icon: Mail,
        description: 'Marketing emails, system notifications'
      },
      { 
        title: 'Announcements', 
        url: '/admin/announcements', 
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
        url: '/admin/monitoring', 
        icon: Activity,
        description: 'Server health, uptime, performance metrics'
      },
      { 
        title: 'Error Logs', 
        url: '/admin/errors', 
        icon: AlertCircle,
        description: 'System errors, crash reports, debugging'
      },
      { 
        title: 'Database', 
        url: '/admin/database', 
        icon: Database,
        description: 'Storage usage, query performance, backups'
      },
      { 
        title: 'API Usage', 
        url: '/admin/api', 
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
        url: '/admin/features', 
        icon: Package,
        description: 'Enable/disable features, A/B testing'
      },
      { 
        title: 'Pricing Plans', 
        url: '/admin/pricing', 
        icon: FileText,
        description: 'Subscription tiers, pricing configuration'
      },
      { 
        title: 'Security', 
        url: '/admin/security', 
        icon: Shield,
        description: 'Access controls, audit logs, compliance'
      },
      { 
        title: 'Settings', 
        url: '/admin/settings', 
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
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
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