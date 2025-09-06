import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Item = { 
  id?: string; 
  description: string; 
  qty: number; 
  unit_price: number; 
  tax_rate?: number | null;
  sort_order?: number;
};

type Props = {
  form: UseFormReturn<any>;
  fa: UseFieldArrayReturn<any, "items", "id">;
  title?: string;
  onReorder?: (items: Item[]) => void;
};

interface SortableItemProps {
  id: string;
  index: number;
  item: any;
  form: UseFormReturn<any>;
  onRemove: () => void;
  isDragging?: boolean;
}

function SortableItem({ id, index, item, form, onRemove, isDragging }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid grid-cols-12 gap-2 items-start bg-background border border-border rounded-lg p-3 transition-all",
        isSortableDragging && "opacity-50 shadow-lg ring-2 ring-primary/20",
        isDragging && "invisible"
      )}
    >
      {/* Drag Handle */}
      <div className="col-span-1 flex items-center justify-center pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="cursor-grab hover:bg-muted p-1 rounded touch-none"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Description */}
      <div className="col-span-4">
        <Label className="text-xs text-muted-foreground mb-1">Description</Label>
        <Input 
          {...form.register(`items.${index}.description` as const)} 
          placeholder="Item description"
          className="h-9"
        />
      </div>

      {/* Quantity */}
      <div className="col-span-2">
        <Label className="text-xs text-muted-foreground mb-1">Qty</Label>
        <Input 
          type="number" 
          step="0.001" 
          {...form.register(`items.${index}.qty` as const, { valueAsNumber: true })} 
          placeholder="1"
          className="h-9"
        />
      </div>

      {/* Unit Price */}
      <div className="col-span-2">
        <Label className="text-xs text-muted-foreground mb-1">Unit Price</Label>
        <Input 
          type="number" 
          step="0.01" 
          {...form.register(`items.${index}.unit_price` as const, { valueAsNumber: true })} 
          placeholder="0.00"
          className="h-9"
        />
      </div>

      {/* Tax % */}
      <div className="col-span-2">
        <Label className="text-xs text-muted-foreground mb-1">Tax %</Label>
        <Input 
          type="number" 
          step="0.001" 
          {...form.register(`items.${index}.tax_rate` as const, { valueAsNumber: true })} 
          placeholder="13"
          className="h-9"
        />
      </div>

      {/* Remove Button */}
      <div className="col-span-1 flex items-center justify-center pt-6">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onRemove}
          className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DragOverlayItem({ item }: { item: any }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-start bg-background border-2 border-primary rounded-lg p-3 shadow-xl opacity-90">
      <div className="col-span-1 flex items-center justify-center pt-2">
        <GripVertical className="h-5 w-5 text-primary" />
      </div>
      <div className="col-span-4">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          {item.description || "Item"}
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          {item.qty || 1}
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          ${(item.unit_price || 0).toFixed(2)}
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          {item.tax_rate || 13}%
        </div>
      </div>
      <div className="col-span-1" />
    </div>
  );
}

export function DraggableLineItems({ form, fa, title = "Line Items", onReorder }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const fields = fa.fields;
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      const reorderedItems = arrayMove(fields, oldIndex, newIndex);
      fa.replace(reorderedItems);
      
      // Update sort_order values
      const itemsWithSortOrder = reorderedItems.map((item: any, index) => ({
        ...item,
        sort_order: index + 1
      })) as Item[];
      
      if (onReorder) {
        onReorder(itemsWithSortOrder);
      }
    }
    
    setActiveId(null);
  };

  const activeItem = activeId ? fields.find((field) => field.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-lg">{title}</h4>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          onClick={() => fa.append({ 
            description: "", 
            qty: 1, 
            unit_price: 0, 
            tax_rate: 13,
            sort_order: fields.length + 1 
          } as Item)}
        >
          Add Item
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground">No items added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fa.append({ 
              description: "", 
              qty: 1, 
              unit_price: 0, 
              tax_rate: 13,
              sort_order: 1 
            } as Item)}
          >
            Add First Item
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fields.map((field, index) => (
                <SortableItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  item={field}
                  form={form}
                  onRemove={() => fa.remove(index)}
                  isDragging={activeId === field.id}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeItem ? <DragOverlayItem item={activeItem} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Error message */}
      <p className="text-destructive text-sm">
        {(form.formState.errors as any)?.items?.message}
      </p>
    </div>
  );
}