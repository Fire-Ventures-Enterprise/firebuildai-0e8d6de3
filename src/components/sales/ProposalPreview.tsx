import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Mail, 
  Phone,
  MapPin,
  User,
  Clock,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface ProposalPreviewProps {
  estimate: any;
  items?: any[];
  paymentStages?: any[];
  contractText?: string;
  onApprove?: () => void;
  onEdit?: () => void;
}

export function ProposalPreview({ 
  estimate, 
  items = [], 
  paymentStages = [],
  contractText,
  onApprove,
  onEdit 
}: ProposalPreviewProps) {
  const { settings: companySettings } = useCompanySettings();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = subtotal * (estimate?.tax_rate || 0) / 100;
  const total = subtotal + taxAmount;
  const depositAmount = estimate?.deposit_amount || (total * (estimate?.deposit_percentage || 30) / 100);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-8 space-y-8">
            {/* Header with Company Info */}
            <div className="flex justify-between items-start border-b pb-6">
              <div className="space-y-2">
                {companySettings?.logo_url ? (
                  <img 
                    src={companySettings.logo_url} 
                    alt={companySettings.company_name || "Company Logo"}
                    className="h-16 object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    {companySettings?.company_name || "Your Company Name"}
                  </div>
                )}
                <div className="text-sm text-muted-foreground space-y-1">
                  {companySettings?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {companySettings.address}
                    </div>
                  )}
                  {companySettings?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {companySettings.phone}
                    </div>
                  )}
                  {companySettings?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {companySettings.email}
                    </div>
                  )}
                  {(companySettings as any)?.license_number && (
                    <div className="text-xs">
                      License #: {(companySettings as any).license_number}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right space-y-2">
                <h1 className="text-3xl font-bold text-primary">PROPOSAL</h1>
                <div className="text-sm space-y-1">
                  <div className="font-semibold">#{estimate?.estimate_number || "EST-0001"}</div>
                  <Badge variant="outline" className="text-xs">
                    {estimate?.status || "DRAFT"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Client Info and Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PREPARED FOR</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{estimate?.customer_name || "Client Name"}</span>
                  </div>
                  {estimate?.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{estimate.customer_email}</span>
                    </div>
                  )}
                  {estimate?.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{estimate.customer_phone}</span>
                    </div>
                  )}
                  {estimate?.service_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{estimate.service_address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PROPOSAL DETAILS</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Issue Date: {estimate?.issue_date ? format(new Date(estimate.issue_date), "MMM dd, yyyy") : "Today"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Valid Until: {estimate?.expiration_date ? format(new Date(estimate.expiration_date), "MMM dd, yyyy") : "30 days"}
                    </span>
                  </div>
                  {estimate?.project_start_date && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Project Start: {format(new Date(estimate.project_start_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            {estimate?.scope_of_work && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">SCOPE OF WORK</div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{estimate.scope_of_work}</p>
                </div>
              </div>
            )}

            {/* Line Items */}
            <div className="space-y-3">
              <div className="font-semibold text-sm text-muted-foreground">DETAILED BREAKDOWN</div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Description</th>
                      <th className="text-right p-3 text-sm font-medium">Qty</th>
                      <th className="text-right p-3 text-sm font-medium">Rate</th>
                      <th className="text-right p-3 text-sm font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id || index} className="border-t">
                        <td className="p-3 text-sm">
                          <div>{item.description}</div>
                          {item.notes && (
                            <div className="text-xs text-muted-foreground mt-1">{item.notes}</div>
                          )}
                        </td>
                        <td className="text-right p-3 text-sm">{item.quantity || 1}</td>
                        <td className="text-right p-3 text-sm">${(item.rate || 0).toFixed(2)}</td>
                        <td className="text-right p-3 text-sm font-medium">${(item.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan={3} className="text-right p-3 text-sm">Subtotal</td>
                      <td className="text-right p-3 text-sm font-medium">${subtotal.toFixed(2)}</td>
                    </tr>
                    {taxAmount > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right p-3 text-sm">
                          Tax ({estimate?.tax_rate || 0}%)
                        </td>
                        <td className="text-right p-3 text-sm font-medium">${taxAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="border-t bg-muted/50">
                      <td colSpan={3} className="text-right p-3 font-semibold">Total</td>
                      <td className="text-right p-3 text-lg font-bold text-primary">
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Schedule */}
            {(paymentStages.length > 0 || estimate?.deposit_amount > 0) && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">PAYMENT SCHEDULE</div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                  {estimate?.deposit_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Deposit Required</div>
                        <div className="text-sm text-muted-foreground">Due upon acceptance</div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        ${depositAmount.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {paymentStages.map((stage, index) => (
                    <div key={index} className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <div className="font-medium">{stage.description}</div>
                        <div className="text-sm text-muted-foreground">{stage.milestone}</div>
                      </div>
                      <div className="text-lg font-bold">
                        ${(stage.amount || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {(contractText || estimate?.terms_conditions) && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">TERMS & CONDITIONS</div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {contractText || estimate.terms_conditions}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {estimate?.notes && (
              <div className="space-y-3">
                <div className="font-semibold text-sm text-muted-foreground">ADDITIONAL NOTES</div>
                <div className="text-sm whitespace-pre-wrap">{estimate.notes}</div>
              </div>
            )}

            <Separator />

            {/* Footer */}
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Thank you for considering our proposal. We look forward to working with you!
              </div>
              <div className="text-xs text-muted-foreground">
                This proposal is valid until {estimate?.expiration_date ? format(new Date(estimate.expiration_date), "MMMM dd, yyyy") : "30 days from issue date"}.
                All prices are subject to change after this date.
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <FileText className="h-4 w-4 mr-2" />
            Edit Proposal
          </Button>
        )}
        {onApprove && (
          <Button size="lg" onClick={onApprove} className="ml-auto">
            Proceed to Customer Approval
          </Button>
        )}
      </div>
    </div>
  );
}