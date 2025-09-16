import { AlertTriangle, Plus, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface MissingItem {
  description: string;
  critical: boolean;
  suggestedPrice?: number;
}

interface MissingItemsWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missingItems: MissingItem[];
  projectType: string;
  onAddItems: (items: MissingItem[]) => void;
  onProceedWithout: () => void;
}

export function MissingItemsWarningModal({
  open,
  onOpenChange,
  missingItems,
  projectType,
  onAddItems,
  onProceedWithout,
}: MissingItemsWarningModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const criticalItems = missingItems.filter(item => item.critical);
  const optionalItems = missingItems.filter(item => !item.critical);

  const handleSelectAll = () => {
    if (selectedItems.size === missingItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(missingItems.map((_, index) => index)));
    }
  };

  const handleToggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleAddSelected = () => {
    const itemsToAdd = missingItems.filter((_, index) => selectedItems.has(index));
    onAddItems(itemsToAdd);
    setSelectedItems(new Set());
  };

  const formatProjectType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <DialogTitle className="text-xl">
              Missing Items Detected
            </DialogTitle>
          </div>
          <DialogDescription className="mt-2">
            We've detected that your <strong>{formatProjectType(projectType)}</strong> estimate 
            may be missing important items. Review and add them to ensure a complete estimate.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {criticalItems.length > 0 && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>{criticalItems.length} critical items</strong> are missing. 
                These are typically required for {formatProjectType(projectType)} projects.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <span className="text-sm font-medium">
                Select items to add to your estimate
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems.size === missingItems.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {criticalItems.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Critical Items
                </h4>
                {criticalItems.map((item, idx) => {
                  const globalIndex = missingItems.indexOf(item);
                  return (
                    <div
                      key={`critical-${idx}`}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`item-${globalIndex}`}
                        checked={selectedItems.has(globalIndex)}
                        onCheckedChange={() => handleToggleItem(globalIndex)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`item-${globalIndex}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">
                          {item.description.replace('⚠️ ', '')}
                        </div>
                        {item.suggestedPrice && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Estimated: ${item.suggestedPrice.toLocaleString()}
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {optionalItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Optional Items
                </h4>
                {optionalItems.map((item, idx) => {
                  const globalIndex = missingItems.indexOf(item);
                  return (
                    <div
                      key={`optional-${idx}`}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`item-${globalIndex}`}
                        checked={selectedItems.has(globalIndex)}
                        onCheckedChange={() => handleToggleItem(globalIndex)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`item-${globalIndex}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="text-sm">
                          {item.description}
                        </div>
                        {item.suggestedPrice && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Estimated: ${item.suggestedPrice.toLocaleString()}
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onProceedWithout}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Proceed Without Adding
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedItems.size === 0}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add {selectedItems.size} Selected Item{selectedItems.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}