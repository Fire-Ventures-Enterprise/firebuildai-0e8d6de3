import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = { id?: string; description: string; qty: number; unit_price: number; tax_rate?: number | null };
type Props = {
  form: UseFormReturn<any>;
  fa: UseFieldArrayReturn<any, "items", "id">;
  title?: string;
};

export function LineItemsArray({ form, fa, title = "Line Items" }: Props) {
  const fields = fa.fields;

  return (
    <div className="border border-border rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="secondary" onClick={() => fa.append({ description: "", qty: 1, unit_price: 0, tax_rate: 0 } as Item)}>
          Add Item
        </Button>
      </div>

      {fields.map((f, idx) => (
        <div key={f.id} className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-5">
            <Label>Description</Label>
            <Input {...form.register(`items.${idx}.description` as const)} />
          </div>
          <div className="col-span-2">
            <Label>Qty</Label>
            <Input type="number" step="0.001" {...form.register(`items.${idx}.qty` as const, { valueAsNumber: true })} />
          </div>
          <div className="col-span-2">
            <Label>Unit Price</Label>
            <Input type="number" step="0.01" {...form.register(`items.${idx}.unit_price` as const, { valueAsNumber: true })} />
          </div>
          <div className="col-span-2">
            <Label>Tax %</Label>
            <Input type="number" step="0.001" {...form.register(`items.${idx}.tax_rate` as const, { valueAsNumber: true })} />
          </div>
          <div className="col-span-1 text-right">
            <Button type="button" variant="ghost" onClick={() => fa.remove(idx)}>Remove</Button>
          </div>
        </div>
      ))}

      <p className="text-destructive text-sm">
        {/* overall array error if any */}
        {(form.formState.errors as any)?.items?.message}
      </p>
    </div>
  );
}