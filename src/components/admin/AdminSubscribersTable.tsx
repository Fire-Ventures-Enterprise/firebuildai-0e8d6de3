import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, ExternalLink } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  user_id: string;
  stripe_customer_id: string | null;
  subscribed: boolean;
  subscription_type: string | null;
  subscription_tier: string | null;
  subscription_end: string | null;
  status: string;
  company_count: number;
  created_at: string;
  profile?: {
    full_name: string | null;
    company_name: string | null;
  };
}

export const AdminSubscribersTable = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      // First fetch subscribers
      const { data: subscribersData, error: subError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (subError) throw subError;

      // Then fetch profiles for each subscriber
      const subscribersWithProfiles = await Promise.all(
        (subscribersData || []).map(async (sub) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', sub.user_id)
            .maybeSingle();

          return {
            ...sub,
            profile: profileData ? {
              full_name: profileData.full_name,
              company_name: profileData.company_name
            } : undefined
          };
        })
      );

      setSubscribers(subscribersWithProfiles);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profile?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, subscribed: boolean) => {
    if (!subscribed) return <Badge variant="secondary">Inactive</Badge>;
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Trial</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTierBadge = (type: string | null, tier: string | null) => {
    if (type === 'whitelabel') {
      return <Badge variant="default">White Label</Badge>;
    }
    if (tier) {
      const tierNum = tier.replace('tier', '');
      return <Badge variant="outline">Tier {tierNum}</Badge>;
    }
    return <span className="text-muted-foreground">-</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Companies</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {subscriber.profile?.full_name || 'No name'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subscriber.email}
                    </div>
                    {subscriber.profile?.company_name && (
                      <div className="text-sm text-muted-foreground">
                        {subscriber.profile.company_name}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getTierBadge(subscriber.subscription_type, subscriber.subscription_tier)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(subscriber.status, subscriber.subscribed)}
                </TableCell>
                <TableCell>
                  {subscriber.subscription_type === 'whitelabel' ? (
                    <Badge variant="secondary">{subscriber.company_count || 0}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subscriber.subscription_end ? (
                    <span className="text-sm">
                      {new Date(subscriber.subscription_end).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {subscriber.stripe_customer_id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://dashboard.stripe.com/test/customers/${subscriber.stripe_customer_id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};