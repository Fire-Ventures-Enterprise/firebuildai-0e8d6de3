import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, CreditCard, Calendar } from 'lucide-react';

export const AdminMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalSubscribers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    trialUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch subscribers
      const { data: subscribers } = await supabase
        .from('subscribers')
        .select('*');

      // Fetch recent payments
      const { data: payments } = await supabase
        .from('payment_history')
        .select('amount')
        .gte('payment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch trial users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('trial_status')
        .eq('trial_status', 'active');

      const activeCount = subscribers?.filter(s => s.subscribed).length || 0;
      const monthlyRev = payments?.reduce((sum, p) => sum + (p.amount / 100), 0) || 0;

      setMetrics({
        totalSubscribers: subscribers?.length || 0,
        activeSubscriptions: activeCount,
        monthlyRevenue: monthlyRev,
        trialUsers: profiles?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Subscribers',
      value: metrics.totalSubscribers,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Active Subscriptions',
      value: metrics.activeSubscriptions,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Monthly Revenue',
      value: `$${metrics.monthlyRevenue.toFixed(2)}`,
      icon: CreditCard,
      color: 'text-purple-500',
    },
    {
      title: 'Trial Users',
      value: metrics.trialUsers,
      icon: Calendar,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metricCards.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`w-4 h-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};