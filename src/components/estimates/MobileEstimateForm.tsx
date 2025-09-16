import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EstimateForm from "./EstimateForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileEstimateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function MobileEstimateForm({
  open,
  onOpenChange,
  estimate,
  onSave,
  onCancel
}: MobileEstimateFormProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[95vh] p-0 overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>
            {estimate ? 'Edit Estimate' : 'New Estimate'}
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto flex-1 px-6 pb-6 -webkit-overflow-scrolling-touch">
          <EstimateForm
            estimate={estimate}
            onSave={(data) => {
              onSave(data);
              onOpenChange(false);
            }}
            onCancel={() => {
              onCancel();
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}