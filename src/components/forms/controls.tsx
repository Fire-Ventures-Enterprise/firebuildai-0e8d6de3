import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function get(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

type BaseProps = {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  desc?: string;
  className?: string;
};

export function TextField({ form, name, label, placeholder, className }: BaseProps) {
  const err = get(form.formState.errors, name)?.message as string | undefined;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} {...form.register(name)} />
      {err && <p className="text-destructive text-sm mt-1">{err}</p>}
    </div>
  );
}

export function TextAreaField({ form, name, label, placeholder, className }: BaseProps) {
  const err = get(form.formState.errors, name)?.message as string | undefined;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Textarea placeholder={placeholder} {...form.register(name)} />
      {err && <p className="text-destructive text-sm mt-1">{err}</p>}
    </div>
  );
}

export function NumberField({
  form,
  name,
  label,
  placeholder,
  className,
  step = "0.01",
}: BaseProps & { step?: string }) {
  const err = get(form.formState.errors, name)?.message as string | undefined;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input type="number" step={step} {...form.register(name, { valueAsNumber: true })} placeholder={placeholder} />
      {err && <p className="text-destructive text-sm mt-1">{err}</p>}
    </div>
  );
}

export function DateField({ form, name, label, className }: BaseProps) {
  const err = get(form.formState.errors, name)?.message as string | undefined;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input type="date" {...form.register(name)} />
      {err && <p className="text-destructive text-sm mt-1">{err}</p>}
    </div>
  );
}

export function SelectField({
  form, name, label, placeholder, className, options,
}: BaseProps & { options: { label: string; value: string }[] }) {
  const err = get(form.formState.errors, name)?.message as string | undefined;
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent>
              {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      />
      {err && <p className="text-destructive text-sm mt-1">{err}</p>}
    </div>
  );
}