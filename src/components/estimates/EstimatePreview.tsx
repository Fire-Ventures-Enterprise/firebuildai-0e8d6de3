import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { PortalLinkActions } from '@/components/admin/PortalLinkActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EstimatePreviewProps {
  estimate: any;
  onClose: () => void;
}

export default function EstimatePreview({ estimate, onClose }: EstimatePreviewProps) {
  const isPortal = window.location.pathname.startsWith('/portal/');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Estimate #{estimate.estimate_number}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={estimate.status === 'accepted' ? 'default' : 'secondary'}>
              {estimate.status}
            </Badge>
            {estimate.signed_at && (
              <Badge variant="default">Signed</Badge>
            )}
            {estimate.sent_at && (
              <Badge variant="outline">Sent {format(new Date(estimate.sent_at), 'MMM d, yyyy')}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Admin Portal Actions */}
      {!isPortal && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Customer Actions</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>Customer acceptance and deposit payments are only available via the client portal.</p>
            <p className="text-sm">Send this estimate to the customer to enable acceptance & deposit payment.</p>
            <div className="mt-4">
              <PortalLinkActions
                kind="estimate"
                token={estimate.public_token}
                toEmail={estimate.customer?.email}
                number={estimate.estimate_number}
                recordId={estimate.id}
              />
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Company & Customer Info */}
      <div className="grid grid-cols-3 gap-6">
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
          <h3 className="font-semibold mb-2">Bill To</h3>
          <p className="text-sm text-muted-foreground">
            {estimate.customer?.company_name || `${estimate.customer?.first_name} ${estimate.customer?.last_name}`}<br />
            {estimate.customer?.address}<br />
            {estimate.customer?.city}, {estimate.customer?.province} {estimate.customer?.postal_code}<br />
            {estimate.customer?.phone}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Service Address</h3>
          <p className="text-sm text-muted-foreground">
            {estimate.service_address || estimate.service_city ? (
              <>
                {estimate.service_address}<br />
                {estimate.service_city && (
                  <>{estimate.service_city}, {estimate.service_province} {estimate.service_postal_code}</>
                )}
              </>
            ) : (
              <span className="italic">Same as billing address</span>
            )}
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

      {/* Already Signed Status */}
      {estimate.signed_at && (
        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge variant="default" className="mb-2">Signed & Accepted</Badge>
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