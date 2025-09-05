import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, X } from "lucide-react";

interface InvoiceAdjustmentsBannerProps {
  adjustments: any[];
  onApprove: (adjustmentId: string) => void;
  onReject: (adjustmentId: string) => void;
}

export function InvoiceAdjustmentsBanner({ 
  adjustments, 
  onApprove, 
  onReject 
}: InvoiceAdjustmentsBannerProps) {
  if (!adjustments || adjustments.length === 0) return null;

  const draftAdjustment = adjustments.find(a => a.status === 'draft');
  if (!draftAdjustment) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950" data-testid="invoice-adjustments-banner">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-900 dark:text-yellow-100">
        Field Report Submitted
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex items-center justify-between">
          <span className="text-yellow-800 dark:text-yellow-200">
            A field report has been submitted with adjustments to this invoice. Review and approve or reject the changes.
          </span>
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="default"
              onClick={() => onApprove(draftAdjustment.id)}
              data-testid="btn-approve-adjustments"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(draftAdjustment.id)}
              data-testid="btn-reject-adjustments"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}