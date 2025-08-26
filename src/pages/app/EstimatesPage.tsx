import { useState, useEffect } from 'react';
import { Plus, FileText, DollarSign, Clock, Send, CheckCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import EstimateForm from '@/components/estimates/EstimateForm';
import EstimatePreview from '@/components/estimates/EstimatePreview';
import { formatCurrency } from '@/lib/utils';

interface Estimate {
  id: string;
  estimate_number: string;
  customer_id: string;
  customer?: any;
  status: string;
  issue_date: string;
  expiration_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  deposit_amount?: number;
  deposit_percentage?: number;
  signed_at?: string;
  converted_to_invoice: boolean;
  invoice_id?: string;
  items?: any[];
  payment_stages?: any[];
}

export const EstimatesPage = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEstimates();
    }
  }, [user]);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('estimates')
        .select(`
          *,
          customer:customers(*),
          items:estimate_items(*),
          payment_stages(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstimates(data || []);
    } catch (error) {
      console.error('Error fetching estimates:', error);
      toast({
        title: "Error",
        description: "Failed to load estimates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEstimate = async (estimate: Estimate) => {
    try {
      // Here we would integrate with email service
      toast({
        title: "Estimate Sent",
        description: `Estimate #${estimate.estimate_number} has been sent to the customer`,
      });
      
      // Update status
      await supabase
        .from('estimates')
        .update({ status: 'sent' })
        .eq('id', estimate.id);
      
      fetchEstimates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send estimate",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEstimate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return;
    
    try {
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
      
      fetchEstimates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete estimate",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      draft: "secondary",
      sent: "default",
      viewed: "warning",
      accepted: "success",
      declined: "destructive",
      expired: "destructive"
    };
    
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const stats = {
    total: estimates.length,
    pending: estimates.filter(e => ['draft', 'sent', 'viewed'].includes(e.status)).length,
    accepted: estimates.filter(e => e.status === 'accepted').length,
    totalValue: estimates.reduce((sum, e) => sum + e.total, 0)
  };

  const filteredEstimates = estimates.filter(estimate => 
    estimate.estimate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estimates</h1>
          <p className="text-muted-foreground mt-1">Create and manage project estimates</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Estimate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Estimates</p>
              <p className="text-2xl font-semibold">{estimates.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold">$0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Estimates List */}
      {estimates.length > 0 ? (
        <Card className="p-6">
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <div key={estimate.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{estimate.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{estimate.projectDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${estimate.total}</p>
                    <p className="text-sm text-muted-foreground">{estimate.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No estimates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first estimate to get started</p>
            <Button onClick={() => setShowBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Estimate
            </Button>
          </div>
        </Card>
      )}

      {/* Estimate Builder Modal */}
      {showBuilder && (
        <EstimateBuilder
          open={showBuilder}
          onOpenChange={setShowBuilder}
          mode="create"
          onSave={handleSaveEstimate}
        />
      )}
    </div>
  );
};