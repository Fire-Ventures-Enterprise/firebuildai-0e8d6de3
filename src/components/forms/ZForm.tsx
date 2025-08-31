import { z, ZodTypeAny } from "zod";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type ZInfer<T extends ZodTypeAny> = z.infer<T>;

type ZFormProps<TSchema extends ZodTypeAny> = {
  schema: TSchema;
  defaultValues: Partial<ZInfer<TSchema>>;
  onSubmit: (values: ZInfer<TSchema>, form: UseFormReturn<ZInfer<TSchema>>) => void | Promise<void>;
  children: (form: UseFormReturn<ZInfer<TSchema>>) => React.ReactNode;
  mode?: "onSubmit" | "onChange" | "onBlur" | "all";
};

export function ZForm<TSchema extends ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  children,
  mode = "onChange",
}: ZFormProps<TSchema>) {
  const form = useForm<ZInfer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode,
  });

  return (
    <form onSubmit={form.handleSubmit((v) => onSubmit(v, form))}>
      {children(form)}
    </form>
  );
}