import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  selectedCount?: number;
  onClearSelection?: () => void;
  left?: ReactNode;   // e.g., filters
  right?: ReactNode;  // e.g., "New Vendor"
  bulkActions?: ReactNode; // e.g., Delete, Export…
  placeholder?: string;
};

export function TableToolbar({
  query, onQueryChange, selectedCount = 0, onClearSelection,
  left, right, bulkActions, placeholder = "Search…",
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Input
          className="w-64"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {left}
      </div>
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <>
            <span className="text-sm opacity-70">{selectedCount} selected</span>
            {bulkActions}
            {onClearSelection && (
              <Button variant="ghost" size="sm" onClick={onClearSelection}>Clear</Button>
            )}
          </>
        )}
        {right}
      </div>
    </div>
  );
}