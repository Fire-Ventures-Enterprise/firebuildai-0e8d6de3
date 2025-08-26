import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Send, FileText } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';
import SignaturePad from '@/components/estimates/SignaturePad';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EstimatePreviewProps {
  estimate: any;
  onClose: () => void;
}

export default function EstimatePreview({ estimate, onClose }: EstimatePreviewProps) {
  const { toast } = useToast();
  const signaturePadRef = useRef<any>(null);

  const handleSendEstimate = async () => {
    try {
      // Here we would send the estimate via email
      // For now, just update the status
      await supabase
        .from('estimates')
        .update({ status: 'sent' })
        .eq('id', estimate.id);
      
      toast({
        title: "Estimate Sent",
        description: "The estimate has been sent to the customer",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send estimate",
        variant: "destructive"
      });
    }
  };

  const handleProcessDeposit = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('process-deposit', {
        body: {
          estimateId: estimate.id,
          customerId: estimate.customer_id,
          depositAmount: estimate.deposit_amount,
          customerEmail: estimate.customer?.email,
          estimateNumber: estimate.estimate_number
        }
      });

      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: "Error",
        description: "Failed to process deposit payment",
        variant: "destructive"
      });
    }
  };

  const handleSignatureSubmit = async (signatureData: string) => {
    try {
      await supabase
        .from('estimates')
        .update({
          signature_data: signatureData,
          signed_at: new Date().toISOString(),
          signed_by_name: estimate.customer?.first_name + ' ' + estimate.customer?.last_name,
          signed_by_email: estimate.customer?.email,
          status: 'accepted'
        })
        .eq('id', estimate.id);
      
      toast({
        title: "Success",
        description: "Estimate has been signed successfully",
      });
      
      // Process deposit if required
      if (estimate.deposit_amount > 0) {
        handleProcessDeposit();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save signature",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Estimate #{estimate.estimate_number}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={estimate.status === 'accepted' ? 'success' : 'default'}>
              {estimate.status}
            </Badge>
            {estimate.signed_at && (
              <Badge variant="success">Signed</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm" onClick={handleSendEstimate}>
            <Send className="h-4 w-4 mr-2" />
            Send to Customer
          </Button>
        </div>
      </div>

      <Separator />

      {/* Company & Customer Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">From</h3>
          <p className="text-sm text-muted-foreground">
            Your Company Name<br />
            123 Business St<br />
            Toronto, ON M1M 1M1<br />
            (416) 555-0123
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">To</h3>
          <p className="text-sm text-muted-foreground">
            {estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`}<br />
            {estimate.customer?.address}<br />
            {estimate.customer?.city}, {estimate.customer?.province} {estimate.customer?.postal_code}<br />
            {estimate.customer?.phone}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Issue Date</p>
          <p className="font-medium">{format(new Date(estimate.issue_date), 'PPP')}</p>
        </div>
        {estimate.expiration_date && (
          <div>
            <p className="text-sm text-muted-foreground">Expiration Date</p>
            <p className="font-medium">{format(new Date(estimate.expiration_date), 'PPP')}</p>
          </div>
        )}
      </div>

      {/* Scope of Work */}
      {estimate.scope_of_work && (
        <Card>
          <CardHeader>
            <CardTitle>Scope of Work</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{estimate.scope_of_work}</p>
          </CardContent>
        </Card>
      )}

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">Qty</th>
                <th className="text-right pb-2">Rate</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items?.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                  <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right pt-4">Subtotal:</td>
                <td className="text-right pt-4">{formatCurrency(estimate.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right">Tax ({estimate.tax_rate}%):</td>
                <td className="text-right">{formatCurrency(estimate.tax_amount)}</td>
              </tr>
              <tr className="font-bold text-lg">
                <td colSpan={3} className="text-right pt-2">Total:</td>
                <td className="text-right pt-2">{formatCurrency(estimate.total)}</td>
              </tr>
              {estimate.deposit_amount > 0 && (
                <tr className="text-primary">
                  <td colSpan={3} className="text-right pt-2">Deposit Required:</td>
                  <td className="text-right pt-2 font-semibold">{formatCurrency(estimate.deposit_amount)}</td>
                </tr>
              )}
            </tfoot>
          </table>
        </CardContent>
      </Card>

      {/* Payment Stages */}
      {estimate.payment_stages?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estimate.payment_stages.map((stage: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">Stage {stage.stage_number}: {stage.description}</p>
                    {stage.milestone && (
                      <p className="text-sm text-muted-foreground">Milestone: {stage.milestone}</p>
                    )}
                    {stage.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Due: {format(new Date(stage.due_date), 'PPP')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(stage.amount)}</p>
                    {stage.percentage && (
                      <p className="text-sm text-muted-foreground">{stage.percentage}%</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms & Conditions */}
      {(estimate.notes || estimate.terms_conditions) && (
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {estimate.notes && (
              <div>
                <h4 className="font-medium mb-1">Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{estimate.notes}</p>
              </div>
            )}
            {estimate.terms_conditions && (
              <div>
                <h4 className="font-medium mb-1">Terms</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{estimate.terms_conditions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contract Notice */}
      {estimate.contract_attached && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ontario Construction Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              By accepting this estimate, you agree to the attached Ontario Construction Service Agreement
              which includes payment terms, warranties, and legal protections under Ontario law.
            </p>
            <Button variant="link" className="p-0 h-auto mt-2">
              View Full Contract →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Signature Section */}
      {!estimate.signed_at && estimate.status !== 'draft' && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Acceptance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignaturePad
              ref={signaturePadRef}
              onSave={handleSignatureSubmit}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                By signing, you accept the estimate and agree to the terms
              </div>
              {estimate.deposit_amount > 0 && (
                <Button onClick={handleProcessDeposit}>
                  Pay Deposit ({formatCurrency(estimate.deposit_amount)})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already Signed */}
      {estimate.signed_at && (
        <Card className="border-success">
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge variant="success" className="mb-2">Signed & Accepted</Badge>
              <p className="text-sm text-muted-foreground">
                Signed by {estimate.signed_by_name} on {format(new Date(estimate.signed_at), 'PPP')}
              </p>
              {estimate.signature_data && (
                <img 
                  src={estimate.signature_data} 
                  alt="Signature" 
                  className="mx-auto mt-4 border rounded p-2"
                  style={{ maxHeight: '100px' }}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}