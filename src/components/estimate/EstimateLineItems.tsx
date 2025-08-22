import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EstimateLineItemsProps {
  description: string;
  workScope: string;
  materials: string;
  amount: string;
  onUpdate: (field: string, value: string) => void;
}

export const EstimateLineItems = ({
  description,
  workScope,
  materials,
  amount,
  onUpdate
}: EstimateLineItemsProps) => {
  return (
    <div className="border-t border-gray-300 mt-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left p-3 font-medium text-gray-700">Description</th>
            <th className="text-center p-3 font-medium text-gray-700 w-24">Rate</th>
            <th className="text-center p-3 font-medium text-gray-700 w-20">Markup</th>
            <th className="text-center p-3 font-medium text-gray-700 w-20">Quantity</th>
            <th className="text-center p-3 font-medium text-gray-700 w-16">Tax</th>
            <th className="text-right p-3 font-medium text-gray-700 w-24">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="p-3 align-top">
              <div className="space-y-4">
                <Input
                  placeholder="Item description (e.g., Bathroom)"
                  value={description}
                  onChange={(e) => onUpdate('description', e.target.value)}
                  className="border-0 p-0 font-medium text-base bg-transparent"
                />
                
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-600 rounded"></div>
                    <span className="font-medium text-green-600">Item List</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-medium mb-2">{description} Renovation Scope of Work</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium mb-2">Demolition:</div>
                      <Textarea
                        placeholder="Remove and dispose of the following items from the property..."
                        value={workScope}
                        onChange={(e) => onUpdate('workScope', e.target.value)}
                        rows={6}
                        className="border-0 p-0 resize-none text-sm bg-transparent"
                      />
                    </div>
                    
                    <div>
                      <div className="font-medium mb-2">Supply and Installation:</div>
                      <Textarea
                        placeholder="List all materials and installation work..."
                        value={materials}
                        onChange={(e) => onUpdate('materials', e.target.value)}
                        rows={6}
                        className="border-0 p-0 resize-none text-sm bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td className="p-3 text-center align-top">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => onUpdate('amount', e.target.value)}
                className="text-center border-0 p-0 w-20 bg-transparent"
              />
            </td>
            <td className="p-3 text-center align-top">
              <span className="text-sm text-gray-400">Markup</span>
            </td>
            <td className="p-3 text-center align-top">
              <Input
                type="number"
                defaultValue="1"
                className="text-center border-0 p-0 w-12 bg-transparent"
              />
            </td>
            <td className="p-3 text-center align-top">
              <span className="text-sm text-gray-400">Tax</span>
            </td>
            <td className="p-3 text-right font-medium align-top">
              ${Number(amount || 0).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};