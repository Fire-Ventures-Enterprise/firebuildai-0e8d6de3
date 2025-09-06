import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sort_order?: number;
}

interface Props {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  onItemUpdate: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

interface SortableItemProps {
  id: string;
  index: number;
  item: InvoiceItem;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  isDragging?: boolean;
  canRemove: boolean;
}

function SortableItem({ id, index, item, onUpdate, onRemove, isDragging, canRemove }: SortableItemProps) {
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
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-t transition-all",
        isSortableDragging && "opacity-50 bg-primary/5",
        isDragging && "invisible"
      )}
    >
      <td className="p-2 w-10">
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
      </td>
      <td className="p-3">
        <Input
          placeholder="Item description"
          value={item.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          className="border-0 p-0 h-auto focus-visible:ring-0"
          required
        />
      </td>
      <td className="p-3 w-24">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdate('quantity', parseFloat(e.target.value) || 0)}
          className="text-center"
          required
        />
      </td>
      <td className="p-3 w-32">
        <Input
          type="number"
          step="0.01"
          value={item.rate}
          onChange={(e) => onUpdate('rate', parseFloat(e.target.value) || 0)}
          className="text-center"
          required
        />
      </td>
      <td className="p-3 text-right font-medium w-32">
        ${item.amount.toFixed(2)}
      </td>
      <td className="p-3 w-10">
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
}

function DragOverlayItem({ item }: { item: InvoiceItem }) {
  return (
    <table className="w-full">
      <tbody>
        <tr className="bg-background border-2 border-primary rounded-lg shadow-xl opacity-90">
          <td className="p-2 w-10">
            <GripVertical className="h-4 w-4 text-primary" />
          </td>
          <td className="p-3">
            <div className="bg-muted rounded px-2 py-1">
              {item.description || "Item"}
            </div>
          </td>
          <td className="p-3 w-24">
            <div className="bg-muted rounded px-2 py-1 text-center">
              {item.quantity}
            </div>
          </td>
          <td className="p-3 w-32">
            <div className="bg-muted rounded px-2 py-1 text-center">
              ${item.rate.toFixed(2)}
            </div>
          </td>
          <td className="p-3 text-right font-medium w-32">
            ${item.amount.toFixed(2)}
          </td>
          <td className="p-3 w-10" />
        </tr>
      </tbody>
    </table>
  );
}

export function DraggableInvoiceItems({ items, onItemsChange, onItemUpdate, onAddItem, onRemoveItem }: Props) {
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
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="w-10"></th>
            <th className="text-left p-3 font-medium">Description</th>
            <th className="text-center p-3 font-medium w-24">Quantity</th>
            <th className="text-center p-3 font-medium w-32">Rate</th>
            <th className="text-right p-3 font-medium w-32">Amount</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
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
              {itemsWithIds.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id!}
                  index={index}
                  item={item}
                  onUpdate={(field, value) => onItemUpdate(index, field, value)}
                  onRemove={() => onRemoveItem(index)}
                  isDragging={activeId === item.id}
                  canRemove={items.length > 1}
                />
              ))}
            </SortableContext>
            
            <DragOverlay>
              {activeItem ? <DragOverlayItem item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        </tbody>
      </table>
      <div className="p-3 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Line Item
        </Button>
      </div>
    </div>
  );
}