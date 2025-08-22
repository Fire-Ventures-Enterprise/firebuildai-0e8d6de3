import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, DollarSign, FileText, Users, Wrench } from "lucide-react";

interface EstimateViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: any;
  onEdit?: () => void;
}

export const EstimateViewDialog = ({ open, onOpenChange, estimate, onEdit }: EstimateViewDialogProps) => {
  if (!estimate) return null;

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      DECLINED: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.PENDING}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Estimate {estimate.estimateNumber}
            </DialogTitle>
            <StatusBadge status={estimate.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client Name</p>
                <p className="font-medium">{estimate.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{estimate.phone}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>{estimate.address}, {estimate.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estimate Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estimate Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{estimate.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-2xl font-bold text-primary">
                    ${estimate.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Scope */}
          {estimate.workScope && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Scope
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{estimate.workScope}</p>
              </div>
            </div>
          )}

          {/* Materials and Labor */}
          <div className="grid grid-cols-2 gap-6">
            {estimate.materials && (
              <div>
                <h4 className="font-semibold mb-2">Materials</h4>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{estimate.materials}</p>
                </div>
              </div>
            )}
            {estimate.labor && (
              <div>
                <h4 className="font-semibold mb-2">Labor</h4>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{estimate.labor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {estimate.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{estimate.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={onEdit}>
                Edit Estimate
              </Button>
            )}
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};