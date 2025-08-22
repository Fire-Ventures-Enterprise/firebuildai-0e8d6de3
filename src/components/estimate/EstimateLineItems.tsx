import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
              <div className="space-y-3">
                <Input
                  placeholder="Item description (e.g., Bathroom)"
                  value={description}
                  onChange={(e) => onUpdate('description', e.target.value)}
                  className="border-0 p-0 font-medium text-base bg-transparent"
                />
                
                {/* Item List Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded"></div>
                    <span className="font-medium text-green-600">Item List</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Description Area */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter work scope and description..."
                    value={workScope}
                    onChange={(e) => onUpdate('workScope', e.target.value)}
                    rows={3}
                    className="border border-gray-200 p-2 resize-none text-sm rounded-md"
                  />
                  
                  <Textarea
                    placeholder="Enter materials and installation details..."
                    value={materials}
                    onChange={(e) => onUpdate('materials', e.target.value)}
                    rows={3}
                    className="border border-gray-200 p-2 resize-none text-sm rounded-md"
                  />
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