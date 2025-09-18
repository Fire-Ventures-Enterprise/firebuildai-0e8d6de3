import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Edit, Printer, FileText, DollarSign, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import EstimatePreview from '@/components/estimates/EstimatePreview';
import { useAuth } from '@/contexts/AuthContext';

export const EstimateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchEstimate();
    }
  }, [id, user]);

  const fetchEstimate = async () => {
    try {
      setLoading(true);
      
      // Fetch estimate
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (estimateError) throw estimateError;

      // Fetch customer
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', estimateData.customer_id)
        .single();

      // Fetch items
      const { data: itemsData } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_id', estimateData.id)
        .order('sort_order');

      // Fetch payment stages
      const { data: paymentStagesData } = await supabase
        .from('payment_stages')
        .select('*')
        .eq('estimate_id', estimateData.id)
        .order('stage_number');

      setEstimate({
        ...estimateData,
        customer: customerData,
        items: itemsData || [],
        payment_stages: paymentStagesData || []
      });
    } catch (error) {
      console.error('Error fetching estimate:', error);
      toast({
        title: "Error",
        description: "Failed to load estimate details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEstimate = async () => {
    try {
      // Update status to sent
      await supabase
        .from('estimates')
        .update({ status: 'sent' })
        .eq('id', estimate.id);
      
      // Send email via edge function
      const { error } = await supabase.functions.invoke('send-estimate-email', {
        body: { estimateId: estimate.id, action: 'created' }
      });
      
      if (error) {
        console.error('Error sending email:', error);
        toast({
          title: "Estimate Updated",
          description: "Status updated but email failed to send. Check your email configuration.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Estimate Sent",
          description: `Estimate #${estimate.estimate_number} has been sent to the customer`,
        });
      }
      
      fetchEstimate();
    } catch (error) {
      console.error('Error sending estimate:', error);
      toast({
        title: "Error",
        description: "Failed to send estimate",
        variant: "destructive"
      });
    }
  };

  const handleConvertToInvoice = async () => {
    try {
      const { data, error } = await supabase.rpc('convert_estimate_to_invoice', {
        p_estimate_id: estimate.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Estimate converted to invoice successfully",
      });

      navigate(`/app/invoices/${data}`);
    } catch (error) {
      console.error('Error converting to invoice:', error);
      toast({
        title: "Error",
        description: "Failed to convert estimate to invoice",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading estimate...</div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-muted-foreground">Estimate not found</p>
        <Button onClick={() => navigate('/app/estimates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Estimates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/estimates')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Estimate #{estimate.estimate_number}</h1>
            <p className="text-muted-foreground">
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
        <div className="flex items-center gap-2">
          {estimate.status === 'draft' && (
            <Button
              variant="outline"
              onClick={handleSendEstimate}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          )}
          {estimate.status === 'accepted' && !estimate.converted_to_invoice && (
            <Button
              onClick={handleConvertToInvoice}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Convert to Invoice
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/app/estimates?edit=${estimate.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issue Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Date(estimate.issue_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiration Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {estimate.expiration_date 
                ? new Date(estimate.expiration_date).toLocaleDateString()
                : 'No expiration'
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(estimate.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deposit Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {estimate.deposit_amount 
                ? formatCurrency(estimate.deposit_amount)
                : 'No deposit'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estimate Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Estimate Details</CardTitle>
          <CardDescription>Full estimate breakdown and line items</CardDescription>
        </CardHeader>
        <CardContent>
          <EstimatePreview estimate={estimate} onClose={() => {}} />
        </CardContent>
      </Card>

      {/* Payment Stages */}
      {estimate.payment_stages && estimate.payment_stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
            <CardDescription>Staged payment milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estimate.payment_stages.map((stage: any) => (
                <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Stage {stage.stage_number}: {stage.name}</p>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(stage.amount)}</p>
                    <p className="text-sm text-muted-foreground">{stage.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};