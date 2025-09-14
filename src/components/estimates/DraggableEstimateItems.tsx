import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Trash2, Plus } from "lucide-react";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EstimateItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sort_order?: number;
}

interface Props {
  items: EstimateItem[];
  onItemsChange: (items: EstimateItem[]) => void;
  onItemUpdate: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

interface SortableItemProps {
  id: string;
  index: number;
  item: EstimateItem;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  isDragging?: boolean;
}

function SortableItem({ id, index, item, onUpdate, onRemove, isDragging }: SortableItemProps) {
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
        "grid grid-cols-12 gap-3 items-start p-3 bg-background border border-border rounded-lg transition-all",
        isSortableDragging && "opacity-50 shadow-lg ring-2 ring-primary/20",
        isDragging && "invisible"
      )}
    >
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
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="col-span-6">
        <Textarea
          placeholder="Enter item description..."
          value={item.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          className="min-h-[60px] resize-none"
          rows={2}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          placeholder="0"
          value={item.quantity}
          onChange={(e) => onUpdate('quantity', parseFloat(e.target.value) || 0)}
          className="h-12 text-center"
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          placeholder="0.00"
          value={item.rate}
          onChange={(e) => onUpdate('rate', parseFloat(e.target.value) || 0)}
          className="h-12"
        />
      </div>
      <div className="col-span-1 flex items-center justify-center pt-2">
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

function DragOverlayItem({ item }: { item: EstimateItem }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 bg-background border-2 border-primary rounded-lg shadow-xl opacity-90">
      <div className="col-span-1 flex items-center justify-center">
        <GripVertical className="h-4 w-4 text-primary" />
      </div>
      <div className="col-span-5">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          {item.description || "Item"}
        </div>
      </div>
      <div className="col-span-2">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          {item.quantity}
        </div>
      </div>
      <div className="col-span-3">
        <div className="h-9 bg-muted rounded px-3 flex items-center">
          ${item.rate.toFixed(2)}
        </div>
      </div>
      <div className="col-span-1" />
    </div>
  );
}

export function DraggableEstimateItems({ items, onItemsChange, onItemUpdate, onAddItem, onRemoveItem }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Ensure all items have unique IDs for drag and drop
  const itemsWithIds = items.map((item, index) => ({
    ...item,
    id: item.id || `item-${index}`,
  }));

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
      const oldIndex = itemsWithIds.findIndex((item) => item.id === active.id);
      const newIndex = itemsWithIds.findIndex((item) => item.id === over.id);
      
      const reorderedItems = arrayMove(itemsWithIds, oldIndex, newIndex);
      
      // Update sort_order values
      const itemsWithSortOrder = reorderedItems.map((item, index) => ({
        ...item,
        sort_order: index + 1
      }));
      
      onItemsChange(itemsWithSortOrder);
    }
    
    setActiveId(null);
  };

  const activeItem = activeId ? itemsWithIds.find((item) => item.id === activeId) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Line Items</span>
          <Button type="button" size="sm" onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itemsWithIds.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground">No items added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onAddItem}
            >
              Add First Item
            </Button>
          </div>
        ) : (
          <>
            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-3 pb-2 mb-3 border-b border-border">
              <div className="col-span-1"></div>
              <div className="col-span-6 text-sm font-medium text-muted-foreground">Description</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground text-center">Quantity</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Rate ($)</div>
              <div className="col-span-1"></div>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={itemsWithIds.map((item) => item.id!)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {itemsWithIds.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    id={item.id!}
                    index={index}
                    item={item}
                    onUpdate={(field, value) => onItemUpdate(index, field, value)}
                    onRemove={() => onRemoveItem(index)}
                    isDragging={activeId === item.id}
                  />
                  ))}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {activeItem ? <DragOverlayItem item={activeItem} /> : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </CardContent>
    </Card>
  );
}