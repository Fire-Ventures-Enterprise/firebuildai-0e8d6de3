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
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      draft: "secondary",
      sent: "default",
      viewed: "outline",
      accepted: "default",
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <Input
            id="search"
            placeholder="Search estimates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estimates List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Estimates</CardTitle>
          <CardDescription>Manage your estimates and quotes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading estimates...</div>
          ) : filteredEstimates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No estimates found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                Create Your First Estimate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEstimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold">#{estimate.estimate_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`}
                        </p>
                      </div>
                      {getStatusBadge(estimate.status)}
                      {estimate.signed_at && (
                        <Badge variant="secondary">Signed</Badge>
                      )}
                      {estimate.converted_to_invoice && (
                        <Badge variant="outline">Converted to Invoice</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Issued: {new Date(estimate.issue_date).toLocaleDateString()}</span>
                      {estimate.expiration_date && (
                        <span>Expires: {new Date(estimate.expiration_date).toLocaleDateString()}</span>
                      )}
                      <span className="font-semibold text-foreground">{formatCurrency(estimate.total)}</span>
                      {estimate.deposit_amount && (
                        <span>Deposit: {formatCurrency(estimate.deposit_amount)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEstimate(estimate);
                        setShowPreview(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendEstimate(estimate)}
                      disabled={estimate.status !== 'draft'}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEstimate(estimate);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEstimate(estimate.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estimate Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEstimate ? 'Edit Estimate' : 'New Estimate'}
            </DialogTitle>
          </DialogHeader>
          <EstimateForm
            estimate={selectedEstimate}
            onSave={(data) => {
              fetchEstimates();
              setShowForm(false);
              setSelectedEstimate(null);
              toast({
                title: "Success",
                description: selectedEstimate ? "Estimate updated" : "Estimate created",
              });
            }}
            onCancel={() => {
              setShowForm(false);
              setSelectedEstimate(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Estimate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Estimate Preview</DialogTitle>
          </DialogHeader>
          {selectedEstimate && (
            <EstimatePreview
              estimate={selectedEstimate}
              onClose={() => {
                setShowPreview(false);
                setSelectedEstimate(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};