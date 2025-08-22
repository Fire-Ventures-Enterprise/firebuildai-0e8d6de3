import { Button } from "@/components/ui/button";

interface EstimateHeaderProps {
  estimateNumber: string;
  onCancel: () => void;
  onSave: (e?: React.FormEvent) => void;
}

export const EstimateHeader = ({ estimateNumber, onCancel, onSave }: EstimateHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
      <h1 className="text-xl font-semibold text-gray-900">
        Estimate #{estimateNumber || 'New'}
      </h1>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          CANCEL
        </Button>
        <Button 
          type="submit" 
          form="estimate-form" 
          className="bg-green-600 hover:bg-green-700"
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};