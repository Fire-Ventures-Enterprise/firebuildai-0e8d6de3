import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, Wrench, ExternalLink, QrCode, Printer, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { R } from "@/routes/routeMap";
import { CreateCrewLinkButton } from "@/components/workorders/CreateCrewLinkButton";
import { toast } from "sonner";

interface InvoiceWorkOrderActionsProps {
  invoice: any;
  workOrder: any;
  hasSchedule: boolean;
  onGenerateWorkOrder: () => void;
  onRefresh?: () => void;
}

export function InvoiceWorkOrderActions({ 
  invoice, 
  workOrder, 
  hasSchedule,
  onGenerateWorkOrder,
  onRefresh
}: InvoiceWorkOrderActionsProps) {
  const navigate = useNavigate();
  const [showCrewLinkModal, setShowCrewLinkModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const getStatusBadge = () => {
    if (!workOrder) return null;
    
    const statusConfig = {
      issued: { variant: "secondary", label: "WO: Open" },
      in_progress: { variant: "default", label: "WO: In Progress" },
      completed: { variant: "success", label: "WO: Complete" },
      cancelled: { variant: "destructive", label: "WO: Cancelled" }
    };
    
    const config = statusConfig[workOrder.status as keyof typeof statusConfig];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const handleOpenWorkOrder = () => {
    if (workOrder) {
      navigate(R.workOrderDetail(workOrder.id));
    }
  };

  const handlePrintWorkOrder = () => {
    if (workOrder) {
      // Open work order detail page in print mode
      const printWindow = window.open(R.workOrderDetail(workOrder.id) + '?print=true', '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          setTimeout(() => {
            printWindow.print();
          }, 100);
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Work Order Status Chip */}
      {workOrder && getStatusBadge()}

      {/* Main Action Button */}
      {!workOrder ? (
        <Button 
          onClick={onGenerateWorkOrder}
          disabled={!hasSchedule}
          data-testid="btn-generate-work-order"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Work Order
        </Button>
      ) : (
        <Button 
          onClick={handleOpenWorkOrder}
          data-testid="btn-open-work-order"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Work Order
        </Button>
      )}

      {/* Dropdown Menu for Additional Actions */}
      {workOrder && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" data-testid="btn-wo-actions">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenWorkOrder}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Work Order
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowCrewLinkModal(true)}>
              <QrCode className="w-4 h-4 mr-2" />
              Crew Link / QR
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrintWorkOrder}>
              <Printer className="w-4 h-4 mr-2" />
              Print Work Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Crew Link Modal */}
      {showCrewLinkModal && workOrder && (
        <CreateCrewLinkButton 
          workOrderId={workOrder.id}
          trigger={showCrewLinkModal}
          onClose={() => {
            setShowCrewLinkModal(false);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}