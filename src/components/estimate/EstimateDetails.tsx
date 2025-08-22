import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EstimateDetailsProps {
  estimateNumber: string;
  date: Date;
  expirationDate: Date;
  poNumber: string;
  onUpdate: (field: string, value: string | Date) => void;
}

export const EstimateDetails = ({
  estimateNumber,
  date,
  expirationDate,
  poNumber,
  onUpdate
}: EstimateDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-gray-500 mb-1 block">Estimate #</Label>
        <Input
          value={estimateNumber}
          onChange={(e) => onUpdate('estimateNumber', e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-500 mb-1 block">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-8 justify-start text-left font-normal text-sm"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {date && !isNaN(date.getTime()) 
                ? format(date, "dd-MM-yyyy") 
                : "Select date"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date && !isNaN(date.getTime()) ? date : undefined}
              onSelect={(selectedDate) => onUpdate('date', selectedDate || new Date())}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="text-xs text-gray-500 mb-1 block">Expiration Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-8 justify-start text-left font-normal text-sm"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {expirationDate && !isNaN(expirationDate.getTime()) 
                ? format(expirationDate, "dd-MM-yyyy") 
                : "Select date"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={expirationDate && !isNaN(expirationDate.getTime()) ? expirationDate : undefined}
              onSelect={(selectedDate) => onUpdate('expirationDate', selectedDate || new Date())}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="text-xs text-orange-600 mb-4">
        Clients will have 5 day(s) to approve this estimate if sent today
      </div>

      <div>
        <Label className="text-xs text-gray-500 mb-1 block">PO Number</Label>
        <Input
          placeholder="Enter PO number"
          value={poNumber}
          onChange={(e) => onUpdate('poNumber', e.target.value)}
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
};