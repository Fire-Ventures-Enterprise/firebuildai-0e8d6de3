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
import { Loader2, DollarSign } from 'lucide-react';

interface Payment {
  id: string;
  subscriber_id: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
  description: string | null;
  subscriber?: {
    email: string;
    profile?: {
      full_name: string | null;
      company_name: string | null;
    };
  };
}

export const AdminPaymentsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Fetch payments
      const { data: paymentsData, error: payError } = await supabase
        .from('payment_history')
        .select('*')
        .order('payment_date', { ascending: false });

      if (payError) throw payError;

      // Fetch subscriber details for each payment
      const paymentsWithDetails = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: subData } = await supabase
            .from('subscribers')
            .select('email, user_id')
            .eq('id', payment.subscriber_id)
            .maybeSingle();

          let profile = null;
          if (subData?.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, company_name')
              .eq('id', subData.user_id)
              .maybeSingle();
            profile = profileData;
          }

          return {
            ...payment,
            subscriber: subData ? {
              email: subData.email,
              profile
            } : undefined
          };
        })
      );

      setPayments(paymentsWithDetails);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invoice ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <span className="text-sm">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {payment.subscriber?.profile?.full_name || 'No name'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payment.subscriber?.email || 'Unknown'}
                  </div>
                  {payment.subscriber?.profile?.company_name && (
                    <div className="text-sm text-muted-foreground">
                      {payment.subscriber.profile.company_name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {payment.description || 'Subscription payment'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(payment.status)}
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground font-mono">
                  {payment.stripe_invoice_id ? 
                    payment.stripe_invoice_id.slice(-8) : 
                    '-'
                  }
                </span>
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};